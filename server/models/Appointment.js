import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "pending_payment"],
      default: "scheduled",
    },
    paymentDetails: {
      transactionId: { type: String },
      amount: { type: Number },
      status: { type: String },
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
