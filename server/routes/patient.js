import express from "express";
import dotenv from "dotenv";
import auth from "../middlewares/auth.js";

// Patient routes
import getProfile from "../controller/patient/get.profile.js";
import updateProfile from "../controller/patient/update.profile.js";
import bookAppointment from "../controller/patient/book.appointment.js";
import getAvailableSlots from "../controller/patient/get.available.slots.js";
import getAppointments from "../controller/patient/get.appointments.js";
import careTeam from "../controller/patient/care.team.js";
import getPrescriptions from "../controller/patient/get.prescriptions.js";
import getAppointmentStatus from "../controller/patient/get.appointment.status.js";

dotenv.config();

const router = express.Router();
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/book-appointment", auth, bookAppointment);
router.get("/available-slots", auth, getAvailableSlots);
router.get("/appointments", auth, getAppointments);
router.get("/care-team", auth, careTeam);
router.get("/prescriptions", auth, getPrescriptions);
router.get("/appointment/completed-cancelled", auth, getAppointmentStatus);

export default router;
