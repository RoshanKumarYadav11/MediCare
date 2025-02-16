import express from "express";
import { createPrescription, getPatientsByDoctor } from "../controller/prescriptionController.js";
const router = express.Router();

router.post("/create",createPrescription)
router.get("/patients/:doctorId", getPatientsByDoctor);

export default router;