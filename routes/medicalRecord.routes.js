import express from "express"
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getRecordTypes,
} from "../controllers/medicalRecord.controller.js"
import { verifyToken, verifyDoctor } from "../middleware/auth.middleware.js"

const router = express.Router()

// Medical Record routes
router.post("/", verifyToken, verifyDoctor, createMedicalRecord)
router.get("/", verifyToken, getMedicalRecords)
router.get("/types", verifyToken, getRecordTypes)
router.get("/:id", verifyToken, getMedicalRecordById)
router.put("/:id", verifyToken, verifyDoctor, updateMedicalRecord)
router.delete("/:id", verifyToken, verifyDoctor, deleteMedicalRecord)

export default router

