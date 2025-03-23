import express from "express"
import {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  addDoctorReview,
  getDoctorSpecializations,
} from "../controllers/doctor.controller.js"
import { verifyToken, verifyDoctor } from "../middleware/auth.middleware.js"

const router = express.Router()

// Doctor routes
router.post("/", verifyToken, verifyDoctor, createDoctorProfile)
router.get("/", getAllDoctors)
router.get("/specializations", getDoctorSpecializations)
router.get("/:id", getDoctorById)
router.put("/:id", verifyToken, updateDoctorProfile)
router.post("/:id/reviews", verifyToken, addDoctorReview)

export default router

