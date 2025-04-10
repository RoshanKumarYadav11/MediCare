import express from "express";
import dotenv from "dotenv";
import auth from "../middlewares/auth.js";

const router = express.Router();
dotenv.config();
// Admin Controllers Imports
import addAdmin from "../controller/admin/add.admin.js";
import addDoctor from "../controller/admin/add.doctor.js";
import getProfile from "../controller/admin/get.profile.js";
import updateProfile from "../controller/admin/update.profile.js";
import getTotalDoctors from "../controller/admin/get.total.doctors.js";
import getTotalPatients from "../controller/admin/get.total.patients.js";
import getDoctorOverview from "../controller/admin/get.doctor.overview.js";
import getPatientOverview from "../controller/admin/get.patient.overview.js";
import getAppointmentStatus from "../controller/admin/get.appointment.status.js";
import getUpcommingAppointments from "../controller/admin/get.upcomming.appointments.js";
import getAllNotifications from "../controller/admin/get.all.notifications.js";

// Admin Routes
router.post("/add-admin", auth, addAdmin);
router.post("/add-doctor", auth, addDoctor);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.get("/total-doctors", auth, getTotalDoctors);
router.get("/total-patients", auth, getTotalPatients);
router.get("/doctor-overview", auth, getDoctorOverview);
router.get("/patient-overview", auth, getPatientOverview);
router.get("/appointment/completed-cancelled", getAppointmentStatus);
router.get("/appointments/upcoming", auth, getUpcommingAppointments);
router.get("/all-notifications", auth, getAllNotifications);

export default router;
