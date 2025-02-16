import mongoose from "mongoose";
const patientReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patientReports: [
    {
      url: {
        type: String,
        required: true,
      },
      altText: {
        type: String,
      },
    },
  ],
});

export const PatientReport = mongoose.model(
  "PatientReport",
  patientReportSchema
);
