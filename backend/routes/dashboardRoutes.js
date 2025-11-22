import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", auth, getDashboardStats);

export default router;