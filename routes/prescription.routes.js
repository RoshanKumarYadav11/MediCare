import express from "express"
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  cancelPrescription,
} from "../controllers/prescription.controller.js"
import { verifyToken, verifyDoctor } from "../middleware/auth.middleware.js"

const router = express.Router()

// Prescription routes
router.post("/", verifyToken, verifyDoctor, createPrescription)
router.get("/", verifyToken, getPrescriptions)
router.get("/:id", verifyToken, getPrescriptionById)
router.put("/:id", verifyToken, verifyDoctor, updatePrescription)
router.patch("/:id/cancel", verifyToken, verifyDoctor, cancelPrescription)

export default router

