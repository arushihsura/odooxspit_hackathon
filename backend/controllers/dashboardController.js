import Product from "../models/Product.js";
import Receipt from "../models/Receipt.js";
import Delivery from "../models/Delivery.js";
import MoveHistory from "../models/MoveHistory.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Product stats
    const products = await Product.find();
    const lowStockProducts = products.filter(p => p.freeToUse < p.minQuantity);
    const totalValue = products.reduce((sum, p) => sum + (p.onHand * p.costPerUnit), 0);

    // Receipt stats
    const totalReceipts = await Receipt.countDocuments();
    const pendingReceipts = await Receipt.countDocuments({ 
      status: { $in: ["DRAFT", "WAITING", "READY"] } 
    });
    const doneReceipts = await Receipt.countDocuments({ status: "DONE" });

    // Delivery stats
    const totalDeliveries = await Delivery.countDocuments();
    const pendingDeliveries = await Delivery.countDocuments({ 
      status: { $in: ["DRAFT", "WAITING", "READY"] } 
    });
    const doneDeliveries = await Delivery.countDocuments({ status: "DONE" });

    // Recent moves
    const recentMoves = await MoveHistory.find()
      .populate('product', 'name sku')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      products: {
        total: products.length,
        lowStock: lowStockProducts.length,
        totalValue
      },
      receipts: {
        total: totalReceipts,
        pending: pendingReceipts,
        done: doneReceipts
      },
      deliveries: {
        total: totalDeliveries,
        pending: pendingDeliveries,
        done: doneDeliveries
      },
      recentMoves
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};