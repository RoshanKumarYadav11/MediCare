import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: ["User", "Doctor", "Admin"],
      default: "User",
    },
    type: {
      type: String,
      enum: ["appointment", "prescription", "system", "message"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    relatedModel: {
      type: String,
      enum: ["Appointment", "Prescription", "Message"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
