import express from "express"
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  processPayment,
  getBillingStats,
} from "../controllers/billing.controller.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()

// Billing routes
router.post("/", verifyToken, createBill)
router.get("/", verifyToken, getBills)
router.get("/stats", verifyToken, verifyAdmin, getBillingStats)
router.get("/:id", verifyToken, getBillById)
router.put("/:id", verifyToken, verifyAdmin, updateBill)
router.post("/:id/payment", verifyToken, processPayment)

export default router

