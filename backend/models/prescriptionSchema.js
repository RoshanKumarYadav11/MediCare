import mongoose from "mongoose";

// Define the medicine schema as a subdocument
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true },
  duration: { type: String, required: true },
  // instructions: { type: String },
});

// Define the prescription schema
const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
  medicines: [medicineSchema], // medicines field is an array of medicine subdocuments
});

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
