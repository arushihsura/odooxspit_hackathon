import Delivery from "../models/Delivery.js";
import Product from "../models/Product.js";
import MoveHistory from "../models/MoveHistory.js";

// GET all deliveries
export const getAllDeliveries = async (req, res) => {
  try {
    const { status, customer, search } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = { $regex: customer, $options: 'i' };
    if (search) {
      filter.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { customer: { $regex: search, $options: 'i' } },
        { fromLocation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const deliveries = await Delivery.find(filter)
      .populate('items.product', 'name sku unit')
      .populate('createdBy', 'name email')
      .populate('validatedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('items.product', 'name sku unit costPerUnit')
      .populate('createdBy', 'name email')
      .populate('validatedBy', 'name email');
    
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE new delivery
export const createDelivery = async (req, res) => {
  try {
    const { customer, items, fromLocation, deliveryAddress, scheduleDate, responsible, operationType, note } = req.body;
    
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: "Customer and items are required" });
    }
    
    // Validate all products exist and have enough stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
      if (product.freeToUse < item.quantityOrdered) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.freeToUse}, Ordered: ${item.quantityOrdered}` 
        });
      }
    }
    
    // Generate reference number
    const count = await Delivery.countDocuments();
    const reference = `WH/OUT/${String(count + 1).padStart(4, '0')}`;
    
    const delivery = await Delivery.create({
      reference,
      customer,
      items,
      fromLocation: fromLocation || "WH/Stock1",
      toLocation: "Customer",
      deliveryAddress,
      scheduleDate,
      responsible,
      operationType: operationType || "DELIVERY",
      note,
      status: "DRAFT",
      createdBy: req.userId
    });
    
    await delivery.populate('items.product', 'name sku unit');
    await delivery.populate('createdBy', 'name email');
    
    res.status(201).json({ message: "Delivery order created", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE delivery
export const updateDelivery = async (req, res) => {
  try {
    const { customer, items, fromLocation, deliveryAddress, scheduleDate, responsible, operationType, note, status } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    
    // Only drafts and waiting can be fully edited
    if (delivery.status === "DONE" || delivery.status === "CANCELLED") {
      return res.status(400).json({ error: "Cannot edit completed or cancelled deliveries" });
    }
    
    if (customer) delivery.customer = customer;
    if (items) delivery.items = items;
    if (fromLocation) delivery.fromLocation = fromLocation;
    if (deliveryAddress !== undefined) delivery.deliveryAddress = deliveryAddress;
    if (scheduleDate !== undefined) delivery.scheduleDate = scheduleDate;
    if (responsible !== undefined) delivery.responsible = responsible;
    if (operationType) delivery.operationType = operationType;
    if (note !== undefined) delivery.note = note;
    if (status) delivery.status = status;
    
    await delivery.save();
    await delivery.populate('items.product', 'name sku unit');
    
    res.json({ message: "Delivery updated", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VALIDATE delivery (mark as DONE and update stock)
export const validateDelivery = async (req, res) => {
  try {
    const { deliveredQuantities } = req.body; // Optional: { productId: quantity }
    const delivery = await Delivery.findById(req.params.id)
      .populate('items.product');
    
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    
    if (delivery.status === "DONE") {
      return res.status(400).json({ error: "Delivery already validated" });
    }
    
    if (delivery.status === "CANCELLED") {
      return res.status(400).json({ error: "Cannot validate cancelled delivery" });
    }
    
    // Update delivered quantities
    if (deliveredQuantities) {
      for (const item of delivery.items) {
        const productId = item.product._id.toString();
        if (deliveredQuantities[productId] !== undefined) {
          item.quantityDelivered = deliveredQuantities[productId];
        } else {
          item.quantityDelivered = item.quantityOrdered;
        }
      }
    } else {
      // Default: mark all as delivered with ordered quantity
      delivery.items.forEach(item => {
        item.quantityDelivered = item.quantityOrdered;
      });
    }
    
    // Update stock for each item (DECREASE)
    for (const item of delivery.items) {
      if (item.quantityDelivered > 0) {
        const product = await Product.findById(item.product._id);
        
        // Check if enough stock
        if (product.onHand < item.quantityDelivered) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${product.name}. Available: ${product.onHand}` 
          });
        }
        
        product.onHand -= item.quantityDelivered;
        product.freeToUse -= item.quantityDelivered;
        await product.save();
        
        // Log in move history
        await MoveHistory.create({
          product: item.product._id,
          type: "DELIVERY",
          quantity: item.quantityDelivered,
          fromLocation: delivery.fromLocation,
          toLocation: delivery.toLocation,
          reference: delivery.reference,
          contact: delivery.customer,
          status: "DONE",
          user: req.userId
        });
      }
    }
    
    delivery.status = "DONE";
    delivery.validatedBy = req.userId;
    delivery.validatedAt = new Date();
    await delivery.save();
    
    await delivery.populate('createdBy', 'name email');
    await delivery.populate('validatedBy', 'name email');
    
    res.json({ message: "Delivery validated and stock updated", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANCEL delivery
export const cancelDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    
    if (delivery.status === "DONE") {
      return res.status(400).json({ error: "Cannot cancel validated deliveries" });
    }
    
    delivery.status = "CANCELLED";
    await delivery.save();
    
    res.json({ message: "Delivery cancelled", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE delivery
export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    
    if (delivery.status === "DONE") {
      return res.status(400).json({ error: "Cannot delete validated deliveries" });
    }
    
    await delivery.deleteOne();
    res.json({ message: "Delivery deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET delivery statistics
export const getDeliveryStatistics = async (req, res) => {
  try {
    const total = await Delivery.countDocuments();
    const pending = await Delivery.countDocuments({ 
      status: { $in: ["DRAFT", "WAITING", "READY"] } 
    });
    const done = await Delivery.countDocuments({ status: "DONE" });
    
    res.json({ total, pending, done });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};