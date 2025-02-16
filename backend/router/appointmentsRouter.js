import express from "express";

import {
    createAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointments,
    updateAppointment,
} from "../controller/appointmentController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

//appointments
router.get("/appointments", getAppointments);
router.get("/appointments/:id",isAuthenticated,isAuthorized('Admin'), getAppointmentById);
router.post("/appointment", createAppointment);
router.patch("/appointment/:id", updateAppointment);
router.delete("/appointment/:id", deleteAppointment);

export default router;