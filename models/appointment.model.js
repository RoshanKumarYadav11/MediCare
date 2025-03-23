import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
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
      required: [true, "Appointment date is required"],
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
    },
    type: {
      type: String,
      enum: ["consultation", "follow-up", "specialist", "emergency"],
      required: [true, "Appointment type is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    reason: {
      type: String,
    },
    notes: {
      type: String,
    },
    location: {
      type: String,
      default: "Main Hospital",
    },
    duration: {
      type: Number,
      default: 30, // in minutes
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "sms", "push"],
        },
        sentAt: Date,
        status: {
          type: String,
          enum: ["pending", "sent", "failed"],
        },
      },
    ],
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
appointmentSchema.index({ patient: 1, date: 1 })
appointmentSchema.index({ doctor: 1, date: 1 })
appointmentSchema.index({ status: 1 })

const Appointment = mongoose.model("Appointment", appointmentSchema)

export default Appointment

