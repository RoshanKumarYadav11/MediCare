import mongoose from "mongoose"

const prescriptionSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      default: Date.now,
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: String,
        instructions: String,
        quantity: Number,
        refills: {
          type: Number,
          default: 0,
        },
      },
    ],
    diagnosis: String,
    notes: String,
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    expiryDate: Date,
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
prescriptionSchema.index({ patient: 1, date: -1 })
prescriptionSchema.index({ status: 1 })

const Prescription = mongoose.model("Prescription", prescriptionSchema)

export default Prescription

