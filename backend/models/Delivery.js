import mongoose from "mongoose";

const deliveryItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantityOrdered: { 
    type: Number, 
    required: true,
    min: 0
  },
  quantityDelivered: { 
    type: Number, 
    default: 0,
    min: 0
  }
});

const deliverySchema = new mongoose.Schema({
  reference: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customer: { 
    type: String, 
    required: true 
  },
  items: [deliveryItemSchema],
  fromLocation: { 
    type: String, 
    required: true,
    default: "WH/Stock1"
  },
  toLocation: { 
    type: String, 
    default: "Customer" 
  },
  deliveryAddress: {
    type: String,
    default: null
  },
  scheduleDate: { 
    type: Date,
    default: null
  },
  responsible: {
    type: String,
    default: null
  },
  operationType: {
    type: String,
    enum: ["DELIVERY", "PICKUP", "RETURN"],
    default: "DELIVERY"
  },
  status: { 
    type: String, 
    enum: ["DRAFT", "WAITING", "READY", "DONE", "CANCELLED"],
    default: "DRAFT"
  },
  note: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  validatedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model("Delivery", deliverySchema);