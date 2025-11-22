import mongoose from "mongoose";
import dotenv from "dotenv";
import Delivery from "./models/Delivery.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedDeliveries = async () => {
  try {
    const products = await Product.find();
    const user = await User.findOne();
    
    if (!products.length || !user) {
      console.log("❌ Need products and user first.");
      process.exit(1);
    }
    
    await Delivery.deleteMany();
    
    const deliveries = [
      // DONE - Already delivered
      {
        reference: "WH/OUT/0001",
        customer: "Azure Interior",
        items: [
          { product: products[0]._id, quantityOrdered: 20, quantityDelivered: 20 }
        ],
        fromLocation: "WH/Stock1",
        toLocation: "Customer",
        deliveryAddress: "123 Main St, Mumbai, MH 400001",
        responsible: "Rahul Sharma",
        operationType: "DELIVERY",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-18T14:30:00"),
        createdAt: new Date("2025-11-17T10:00:00")
      },
      {
        reference: "WH/OUT/0002",
        customer: "Tech Solutions Ltd",
        items: [
          { product: products[3]._id, quantityOrdered: 30, quantityDelivered: 30 },
          { product: products[4]._id, quantityOrdered: 5, quantityDelivered: 5 }
        ],
        fromLocation: "WH/Stock1",
        toLocation: "Customer",
        deliveryAddress: "456 Park Ave, Delhi, DL 110001",
        responsible: "Priya Patel",
        operationType: "DELIVERY",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-19T16:00:00"),
        createdAt: new Date("2025-11-18T09:00:00")
      },
      
      // READY - Picked and packed, ready to ship
      {
        reference: "WH/OUT/0003",
        customer: "Global Enterprises",
        items: [
          { product: products[5]._id, quantityOrdered: 50, quantityDelivered: 0 },
          { product: products[6]._id, quantityOrdered: 10, quantityDelivered: 0 }
        ],
        fromLocation: "WH/Stock1",
        toLocation: "Customer",
        deliveryAddress: "789 Business District, Bangalore, KA 560001",
        responsible: "Amit Kumar",
        operationType: "DELIVERY",
        status: "READY",
        scheduleDate: new Date("2025-11-23T10:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-21T11:00:00"),
        note: "Package ready at loading dock"
      },
      
      // WAITING - Scheduled for pickup
      {
        reference: "WH/OUT/0004",
        customer: "Retail Chain Co",
        items: [
          { product: products[10]._id, quantityOrdered: 200, quantityDelivered: 0 }
        ],
        fromLocation: "WH/Stock1",
        toLocation: "Customer",
        deliveryAddress: "321 Shopping Complex, Pune, MH 411001",
        responsible: "Neha Desai",
        operationType: "DELIVERY",
        status: "WAITING",
        scheduleDate: new Date("2025-11-25T14:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-22T08:00:00"),
        note: "Bulk order - arrange large vehicle"
      },
      
      // DRAFT - Pending approval
      {
        reference: "WH/OUT/0005",
        customer: "Construction Corp",
        items: [
          { product: products[11]._id, quantityOrdered: 15, quantityDelivered: 0 },
          { product: products[13]._id, quantityOrdered: 10, quantityDelivered: 0 }
        ],
        fromLocation: "WH/Stock1",
        toLocation: "Customer",
        deliveryAddress: "555 Industrial Area, Chennai, TN 600001",
        responsible: "Vikram Singh",
        operationType: "DELIVERY",
        status: "DRAFT",
        scheduleDate: new Date("2025-11-27T09:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-22T10:00:00"),
        note: "Awaiting manager approval"
      }
    ];
    
    const inserted = await Delivery.insertMany(deliveries);
    console.log(`✅ Successfully imported ${inserted.length} delivery orders!`);
    
    const summary = await Delivery.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    console.log("\n📊 Delivery Status Summary:");
    summary.forEach(s => {
      console.log(`   ${s._id}: ${s.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding deliveries:", error);
    process.exit(1);
  }
};

mongoose.connection.once('open', () => {
  console.log("✅ MongoDB Connected");
  seedDeliveries();
});