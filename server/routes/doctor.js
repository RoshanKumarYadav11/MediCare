import express from "express";
import dotenv from "dotenv";
import auth from "../middlewares/auth.js";
dotenv.config();
const router = express.Router();

// Doctor controllers imports

import getDoctorProfile from "../controller/doctor/get.profile.js";
import updateDoctorProfile from "../controller/doctor/update.profile.js";
import getAllDoctors from "../controller/doctor/get.all.doctors.js";
import getPatientWithAppointments from "../controller/doctor/get.patient.with.appointment.js";
import getAvailableSlots from "../controller/doctor/get.available.slots.js";
import scheduleAppointment from "../controller/doctor/schedule.appointment.js";
import prescribeMedication from "../controller/doctor/prescribe.medication.js";
import getAllPrescriptions from "../controller/doctor/get.all.prescriptions.js";
import updatePrescriptions from "../controller/doctor/update.prescription.js";
import deletePrescription from "../controller/doctor/delete.prescription.js";
import getPrescriptionsByPatientId from "../controller/doctor/get.prescriptions.by.patient.id.js";
import getAppointments from "../controller/doctor/get.appointments.js";
import updateAppointment from "../controller/doctor/update.appointment.js";
import getCompletedAppointment from "../controller/doctor/get.completed.appointment.js";
import getUpcommingAppointments from "../controller/admin/get.upcomming.appointments.js";

// Doctor routes
router.get("/profile", auth, getDoctorProfile);
router.put("/profile", auth, updateDoctorProfile);
router.get("/all", getAllDoctors);
router.get("/patients-with-appointments", auth, getPatientWithAppointments);
router.get("/available-slots", auth, getAvailableSlots);
router.post("/schedule-appointment", auth, scheduleAppointment);
router.post("/prescribe-medication", auth, prescribeMedication);

// Get all prescriptions
router.get("/prescriptions", auth, getAllPrescriptions);

// Update a prescription
router.put("/prescriptions/:id", auth, updatePrescriptions);

// Delete a prescription
router.delete("/prescriptions/:id", auth, deletePrescription);

// Get all prescriptions by patient ID
router.get("/prescriptions/:patientId", auth, getPrescriptionsByPatientId);

router.get("/appointments", auth, getAppointments);

router.patch("/appointment/:appointmentId/:status", auth, updateAppointment);

router.get("/appointment/completed", auth, getCompletedAppointment);

router.get("/appointments/upcoming", auth, getUpcommingAppointments);

export default router;
