import mongoose from "mongoose"

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Record title is required"],
    },
    type: {
      type: String,
      enum: ["Lab Result", "Prescription", "Imaging", "Medical Report", "Other"],
      required: [true, "Record type is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // For Lab Results
    labResults: [
      {
        name: String,
        value: String,
        unit: String,
        normalRange: String,
        isAbnormal: Boolean,
      },
    ],
    // For Imaging
    imaging: {
      type: String,
      findings: String,
      imageUrl: String,
    },
    // For Medical Reports
    report: {
      summary: String,
      diagnosis: String,
      recommendations: [String],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, date: -1 })
medicalRecordSchema.index({ type: 1 })

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema)

export default MedicalRecord

