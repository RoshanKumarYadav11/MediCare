import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { PatientReport } from "../models/patientReportSchema.js";
import { User } from "../models/userSchema.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

//Upload Patient Report
export const uploadPatientReport = catchAsyncErrors(async (req, res) => {
  if (
    !req.files ||
    !req.files.patientReports ||
    req.files.patientReports.length === 0
  ) {
    return res.status(400).json({ msg: "File is required" });
  }

  const patientReportLocalPath = req.files.patientReports[0].path;
  const originalName = req.files.patientReports[0].originalname;

  // Upload file to Cloudinary
  const uploadedImage = await uploadOnCloudinary(patientReportLocalPath);
  if (!uploadedImage) {
    return res.status(500).json({ msg: "Failed to upload file to Cloudinary" });
  }

  let patientReport = await PatientReport.findOne({ patientId: req.user._id });

  if (patientReport) {
    // Append new report to existing record
    patientReport.patientReports.push({
      url: uploadedImage.url,
      altText: originalName,
    });
    await patientReport.save();
    return res.status(200).json(patientReport);
  }

  // Create new record
  const newPatientReport = new PatientReport({
    patientId: req.user._id,
    patientReports: [
      {
        url: uploadedImage.url,
        altText: originalName,
      },
    ],
  });

  const savedReport = await newPatientReport.save();
  res.status(201).json(savedReport);
});

//Get Reports for Logged-in Patient
export const getPatientReports = catchAsyncErrors(async (req, res) => {
  const patientReport = await PatientReport.findOne({
    patientId: req.user._id,
  });

  if (!patientReport) {
    return res.status(404).json({ msg: "No reports found" });
  }

  res.status(200).json(patientReport);
});

//Get Reports by `patientId` (For Admin & Doctor)
export const getReportsByPatientId = catchAsyncErrors(async (req, res) => {
  const { patientId } = req.params;
  const patientReport = await PatientReport.findOne({ patientId });

  if (!patientReport) {
    return res.status(404).json({ msg: "No reports found for this patient" });
  }

  res.status(200).json(patientReport);
});

//Delete a Specific Report
export const deletePatientReport = catchAsyncErrors(async (req, res) => {
  const { reportId } = req.params;
  const patientReport = await PatientReport.findOne({
    patientId: req.user._id,
  });

  if (!patientReport) {
    return res.status(404).json({ msg: "No reports found" });
  }

  // Filter out the report that needs to be deleted
  const updatedReports = patientReport.patientReports.filter(
    (report) => report._id.toString() !== reportId
  );

  if (updatedReports.length === patientReport.patientReports.length) {
    return res.status(404).json({ msg: "Report not found" });
  }

  patientReport.patientReports = updatedReports;
  await patientReport.save();

  res.status(200).json({ msg: "Report deleted successfully" });
});

//Delete All Reports for a Patient
export const deleteAllPatientReports = catchAsyncErrors(async (req, res) => {
  const patientReport = await PatientReport.findOneAndDelete({
    patientId: req.user._id,
  });

  if (!patientReport) {
    return res.status(404).json({ msg: "No reports found to delete" });
  }

  res.status(200).json({ msg: "All reports deleted successfully" });
});

//Upload Patient Report by Patient ID for admin and doctor
export const uploadPatientReportById = catchAsyncErrors(async (req, res) => {
  const checkId = req.params.id;
  if (
    !req.files ||
    !req.files.patientReports ||
    req.files.patientReports.length === 0
  ) {
    return res.status(400).json({ msg: "File is required" });
  }
  const patientReportLocalPath = req.files.patientReports[0].path;
  const originalName = req.files.patientReports[0].originalname;
  // Upload file to Cloudinary
  const uploadedImage = await uploadOnCloudinary(patientReportLocalPath);
  if (!uploadedImage) {
    return res.status(500).json({ msg: "Failed to upload file to Cloudinary" });
  }
  const patient = await User.findById(checkId);
  if (!patient) {
    return res.status(404).json({ msg: "Patient not found" });
  }

  let patientReport = await PatientReport.findOne({ patientId: patient._id });

  if (patientReport) {
    // Append new report to existing record
    patientReport.patientReports.push({
      url: uploadedImage.url,
      altText: originalName,
    });
    await patientReport.save();
    return res.status(200).json(patientReport);
  }
  // Create new record
  const newPatientReport = new PatientReport({
    patientId: patient._id,
    patientReports: [
      {
        url: uploadedImage.url,
        altText: originalName,
      },
    ],
  });
  const savedReport = await newPatientReport.save();
  res.status(201).json(savedReport);
});
