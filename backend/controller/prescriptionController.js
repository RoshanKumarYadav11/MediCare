import mongoose from "mongoose";
import { Prescription } from "../models/prescriptionSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const createPrescription = async (req, res) => {
  const { doctorId, patientId, medicines } = req.body;

  // Validate required fields
  if (!doctorId || !patientId || !medicines || medicines.length === 0) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }

  try {
    // Check if a prescription already exists for the doctor and patient
    let existingPrescription = await Prescription.findOne({
      doctorId,
      patientId,
    });

    if (existingPrescription) {
      // Append new medicines to the existing prescription
      existingPrescription.medicines.push(...medicines);
      await existingPrescription.save();
      return res.status(200).json({
        message: "Prescription updated successfully",
        prescription: existingPrescription,
      });
    } else {
      // Create a new prescription if none exists
      const newPrescription = new Prescription({
        doctorId,
        patientId,
        medicines,
        // instructions,
      });

      await newPrescription.save();
      return res.status(201).json({
        message: "Prescription created successfully",
        prescription: newPrescription,
      });
    }
  } catch (error) {
    console.error("Error creating prescription:", error);
    return res.status(500).json({
      message: "Error creating prescription",
      error: error.message || error,
    });
  }
};

// Get prescriptions by doctor ID
export const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Use `new mongoose.Types.ObjectId(id)`
    const prescriptions = await Prescription.find({
      doctorId: new mongoose.Types.ObjectId(id),
    }).populate("patientId"); // Optional: Populate patient details

    if (!prescriptions.length) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for this doctor." });
    }

    return res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error); // Logs error in the console
    return res.status(500).json({
      message: "Error fetching prescriptions",
      error: error.message || error,
    });
  }
};

// Get prescriptions by patient ID
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    // Fetch prescriptions for the given patient ID
    const prescriptions = await Prescription.find({
      patientId: new mongoose.Types.ObjectId(id),
    }).populate("doctorId"); // Optional: Populate doctor details

    if (!prescriptions.length) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for this patient." });
    }

    return res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return res.status(500).json({
      message: "Error fetching prescriptions",
      error: error.message || error,
    });
  }
};


export const deleteMedicineFromPrescription = async (req, res) => {
  const { prescriptionId, medicineId } = req.params;
  // Validate prescriptionId and medicineId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
    return res.status(400).json({ message: "Invalid prescription ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(medicineId)) {
    return res.status(400).json({ message: "Invalid medicine ID" });
  }

  try {
    // Find the prescription by its ID
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Filter out the medicine with the matching ID
    prescription.medicines = prescription.medicines.filter(
      (medicine) => medicine._id.toString() !== medicineId
    );

    // If no medicines left, delete the entire prescription
    if (prescription.medicines.length === 0) {
      await Prescription.findByIdAndDelete(prescriptionId);
      return res
        .status(200)
        .json({ message: "Prescription deleted successfully" });
    }

    // Save the updated prescription
    await prescription.save();

    return res.status(200).json({
      message: "Medicine deleted from prescription successfully",
      prescription,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting medicine", error });
  }
};

export const getPatientsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Fetch appointments for the given doctor ID
    const appointments = await Appointment.find({ doctorId }).populate("patientId");

    // Extract unique patient IDs from appointments
    const patientIds = [...new Set(appointments.map(app => app.patientId._id))];

    // Fetch patient details for the extracted patient IDs
    const patients = await User.find({ _id: { $in: patientIds } });

    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({
      message: "Error fetching patients",
      error: error.message || error,
    });
  }
};

