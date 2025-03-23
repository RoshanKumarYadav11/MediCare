import express from "express"
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getDoctorAvailability,
} from "../controllers/appointment.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Appointment routes
router.post("/", verifyToken, createAppointment)
router.get("/", verifyToken, getAppointments)
router.get("/availability", verifyToken, getDoctorAvailability)
router.get("/:id", verifyToken, getAppointmentById)
router.put("/:id", verifyToken, updateAppointment)
router.patch("/:id/cancel", verifyToken, cancelAppointment)

export default router

