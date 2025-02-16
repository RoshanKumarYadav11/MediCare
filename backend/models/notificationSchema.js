import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["doctor", "patient"], required: true },
    type: { type: String, enum: ["appointment", "medication"], required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});


export default mongoose.model("Notification", notificationSchema);
