import mongoose from "mongoose";

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    prescription: { type: String, default: "" },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: "senderModel", // Dynamically reference either "Doctor" or "Patient"
      required: true 
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // No individual `_id` for each message
);

// Chat Schema
const chatSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    messages: [messageSchema], // Array of message objects
  },
  { timestamps: true }
);

// You'd dynamically populate `senderModel` field based on the sender's role
export const Chat = mongoose.model("Chat", chatSchema);
