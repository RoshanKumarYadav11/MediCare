import { Chat } from "../models/chatSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { User } from "../models/userSchema.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { doctorId, patientId, message } = req.body;

    // Validation
    if (!doctorId || !patientId || !message) {
      return res
        .status(400)
        .json({ error: "Doctor ID, Patient ID, and message are required." });
    }

    // Validate doctor existence
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Validate patient existence
    const patient = await User.findById(patientId); // Assuming a Patient model exists
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Check if a chat exists
    let chat = await Chat.findOne({ doctorId, patientId });
    if (!chat) {
      // If no chat exists, create a new one
      chat = new Chat({
        doctorId,
        patientId,
        messages: [],
      });
    }

    // Add message to chat
    chat.messages.push({
      content: message,
      sender: req.user._id, // The sender's ID
      senderModel: req.user.role === "Doctor" ? "Doctor" : "Patient", // Dynamically set sender model
      createdAt: new Date(),
    });

    // Save the chat
    const savedChat = await chat.save();

    // Emit the message to the receiver (Doctor/Patient) using Socket.IO
    // Emit the message to the respective users: patient and doctor
    req.io.to(patientId).emit("new_message", savedChat);
    req.io.to(doctorId).emit("new_message", savedChat);

    res
      .status(201)
      .json({ message: "Message sent successfully.", chat: savedChat });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while sending the message." });
  }
};
// Fetch chat messages
export const getMessages = async (req, res) => {
  try {
    const { patientId, doctorId } = req.params;
    // Validation
    if (!patientId || !doctorId) {
      return res
        .status(400)
        .json({ error: "Patient ID and Doctor ID are required." });
    }

    // Fetch the chat between the patient and doctor
    const chat = await Chat.findOne({ patientId, doctorId }).populate({
      path: "messages.sender",
      select: "name",  // Select only the name field from the sender
      match: { "messages.senderModel": { $in: ["Doctor", "Patient"] } },  // Ensure sender is either Doctor or Patient
    });
    if (!chat || chat.messages.length === 0) {
      return res.status(404).json({ message: "No chat messages found." });
    }

    res.status(200).json(chat.messages); // Return only the messages array
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};

