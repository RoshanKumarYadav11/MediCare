import express from "express";
import { adminLogin, getAllPatient, getUserProfile, loginUser, registerUser } from "../controller/userController.js";
import {
  addNewDoctor,
  deleteDoctor,
  editDoctor,
  getAllDoctors,
  getDoctorById,
} from "../controller/doctorController.js";
import {
  addAvailability,
  deleteAvailability,
  editAvailability,
  getAllAvailability,
} from "../controller/availabilityController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { deleteAllPatientReports, deletePatientReport, getPatientReports, getReportsByPatientId, uploadPatientReport, uploadPatientReportById } from "../controller/patientReportController.js";
import upload from "../middlewares/multer.js";
import { createPrescription, deleteMedicineFromPrescription, getPrescriptionsByDoctor, getPrescriptionsByPatient } from "../controller/prescriptionController.js";

const router = express.Router();

router.get("/me",isAuthenticated, getUserProfile);
router.post("/login", loginUser);
router.post("/adminlogin",  adminLogin);
router.post("/register", registerUser);

// patient
router.get("/patients",isAuthenticated, getAllPatient);

//doctors
router.get(
  "/doctors",
  isAuthenticated,
  isAuthorized("Admin", "Doctor", "Patient"),
  getAllDoctors
);
router.get("/doctor/:id", isAuthenticated, getDoctorById);
router.post("/adddoctor", addNewDoctor);
router.put("/doctor/:id", editDoctor);
router.delete("/doctor/:id", deleteDoctor);

//doctor availability
router.get("/doctor/:id/availability", getAllAvailability);
router.post("/doctor/:id/availability", isAuthenticated, addAvailability);
router.put("/doctor/:id/availability", editAvailability);
router.delete("/doctor/:id/availability/:availabilityId",  deleteAvailability);

//patient report
router.post(
  "/upload-report",
  upload.fields([
    {
      name: "patientReports",
      maxCount: 1,
    },
  ]),
  isAuthenticated,
  uploadPatientReport
);
router.post("/upload-report/:id",upload.fields([{name: "patientReports",maxCount: 1, },]),isAuthenticated,isAuthorized("Admin", "Doctor"),uploadPatientReportById);
router.get("/reports", isAuthenticated, getPatientReports);
router.get("/reports/:reportId", isAuthenticated, getReportsByPatientId);
router.delete("/reports/:reportId", isAuthenticated, deletePatientReport);
router.delete("/reports", isAuthenticated, deleteAllPatientReports);

//prescription
router.post("/addprescription", createPrescription);
router.get("/doctor/:id/prescription", getPrescriptionsByDoctor);
router.get("/patient/:id/prescription", getPrescriptionsByPatient);
router.delete("/:prescriptionId/prescription/:medicineId", deleteMedicineFromPrescription);

export default router;
