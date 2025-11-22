import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  validateDelivery,
  cancelDelivery,
  deleteDelivery,
  getDeliveryStatistics
} from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/", auth, getAllDeliveries);
router.get("/statistics", auth, getDeliveryStatistics); // ⚠️ MUST BE BEFORE /:id
router.get("/:id", auth, getDeliveryById);
router.post("/", auth, createDelivery);
router.put("/:id", auth, updateDelivery);
router.post("/:id/validate", auth, validateDelivery);
router.post("/:id/cancel", auth, cancelDelivery);
router.delete("/:id", auth, deleteDelivery);

export default router;