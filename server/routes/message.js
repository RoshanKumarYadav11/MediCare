import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import auth from "../middlewares/auth.js"
import Message from "../models/Message.js"
import Conversation from "../models/Conversation.js"
import { markMessagesAsRead } from "../utils/messageService.js"
import User from "../models/User.js"
import Doctor from "../models/Doctor.js"
import Admin from "../models/Admin.js"
import { getOrCreateConversation } from "../utils/conversationService.js"
import { getUserById } from "../utils/userService.js"
import { createNotification } from "../utils/notificationService.js"

const router = express.Router()

// Set up file storage for PDF uploads
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  },
})

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Only PDF files are allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Helper function to get model name from role
const getModelFromRole = (role) => {
  switch (role) {
    case "doctor":
      return "Doctor"
    case "admin":
      return "Admin"
    case "patient":
    default:
      return "User"
  }
}

// Helper function to get user details by ID and model
const getUserDetails = async (id, model) => {
  let user
  switch (model) {
    case "Doctor":
      user = await Doctor.findById(id).select("firstName lastName role")
      break
    case "Admin":
      user = await Admin.findById(id).select("firstName lastName role")
      break
    case "User":
    default:
      user = await User.findById(id).select("firstName lastName role")
      break
  }
  return user
}

// Get all conversations for the current user
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const userModel = getModelFromRole(userRole)

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      "participants.id": userId,
      "participants.model": userModel,
    })
      .sort({ updatedAt: -1 })
      .populate("lastMessage")

    // Enhance conversations with participant details
    const enhancedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Get the other participant (not the current user)
        const otherParticipant = conversation.participants.find(
          (p) => p.id.toString() !== userId.toString() || p.model !== userModel,
        )

        if (!otherParticipant) {
          return null
        }

        // Get user details
        const user = await getUserDetails(otherParticipant.id, otherParticipant.model)
        if (!user) {
          return null
        }

        // Return enhanced conversation
        return {
          _id: conversation._id,
          participant: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || otherParticipant.model.toLowerCase(),
            model: otherParticipant.model,
          },
          lastMessage: conversation.lastMessage,
          unreadCount: conversation.unreadCount.get(userId.toString()) || 0,
          updatedAt: conversation.updatedAt,
        }
      }),
    )

    // Filter out null values (conversations where we couldn't find the other participant)
    const validConversations = enhancedConversations.filter(Boolean)

    res.json(validConversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get messages for a specific conversation
router.get("/conversations/:conversationId", auth, async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user.id
    const userRole = req.user.role
    const userModel = getModelFromRole(userRole)

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.id": userId,
      "participants.model": userModel,
    })

    if (!conversation) {
      return res.status(403).json({ error: "Not authorized to access this conversation" })
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName")
      .populate("recipient", "firstName lastName")

    // Mark messages as read
    await markMessagesAsRead(userId, conversationId)

    res.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Fix the message sending endpoint to properly handle FormData
// Send a new message
router.post("/", auth, upload.single("attachment"), async (req, res) => {
  try {
    const { recipientId, recipientRole, content } = req.body
    const senderId = req.user.id
    const senderRole = req.user.role
    const senderModel = getModelFromRole(senderRole)
    const recipientModel = getModelFromRole(recipientRole)

    console.log("Message request:", {
      senderId,
      senderRole,
      senderModel,
      recipientId,
      recipientRole,
      recipientModel,
      content,
      hasAttachment: !!req.file,
    })

    // Validate recipient exists
    let recipient
    switch (recipientModel) {
      case "Doctor":
        recipient = await Doctor.findById(recipientId)
        break
      case "Admin":
        recipient = await Admin.findById(recipientId)
        break
      case "User":
      default:
        recipient = await User.findById(recipientId)
        break
    }

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" })
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(senderId, senderModel, recipientId, recipientModel)

    // Prepare message data
    const messageData = {
      sender: senderId,
      senderModel,
      recipient: recipientId,
      recipientModel,
      content,
      conversationId: conversation._id,
    }

    // Add attachment if present
    if (req.file) {
      messageData.attachment = {
        filename: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      }
    }

    // Create the message
    const message = new Message(messageData)
    const savedMessage = await message.save()

    // Update conversation with last message and increment unread count
    conversation.lastMessage = savedMessage._id
    conversation.unreadCount.set(
      recipientId.toString(),
      (conversation.unreadCount.get(recipientId.toString()) || 0) + 1,
    )
    await conversation.save()

    // Get sender details for notification
    const senderUser = await getUserById(senderId, senderModel)
    const senderName = `${senderUser.firstName} ${senderUser.lastName}`

    // Create notification for recipient
    await createNotification({
      recipient: recipientId,
      sender: senderId,
      senderModel,
      type: "message",
      title: `New message from ${senderName}`,
      message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
      relatedId: savedMessage._id,
      relatedModel: "Message",
    })

    res.status(201).json(savedMessage)
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Download attachment
router.get("/attachments/:messageId", auth, async (req, res) => {
  try {
    const { messageId } = req.params
    const userId = req.user.id
    const userRole = req.user.role
    const userModel = getModelFromRole(userRole)

    // Find the message
    const message = await Message.findById(messageId)

    if (!message) {
      return res.status(404).json({ error: "Message not found" })
    }

    // Check if user is authorized (either sender or recipient)
    const isAuthorized =
      (message.sender.toString() === userId && message.senderModel === userModel) ||
      (message.recipient.toString() === userId && message.recipientModel === userModel)

    if (!isAuthorized) {
      return res.status(403).json({ error: "Not authorized to access this attachment" })
    }

    // Check if message has attachment
    if (!message.attachment || !message.attachment.path) {
      return res.status(404).json({ error: "No attachment found" })
    }

    // Send the file
    res.download(message.attachment.path, message.attachment.filename)
  } catch (error) {
    console.error("Error downloading attachment:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get users to message (for creating new conversations)
router.get("/users", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    // Get all users based on role
    let users = []

    // Admins can message anyone
    if (userRole === "admin") {
      const doctors = await Doctor.find().select("firstName lastName role")
      const patients = await User.find({ role: "patient" }).select("firstName lastName role")
      const admins = await Admin.find({ _id: { $ne: userId } }).select("firstName lastName role")

      users = [
        ...doctors.map((d) => ({ ...d.toObject(), model: "Doctor" })),
        ...patients.map((p) => ({ ...p.toObject(), model: "User" })),
        ...admins.map((a) => ({ ...a.toObject(), model: "Admin" })),
      ]
    }
    // Doctors can message patients and admins
    else if (userRole === "doctor") {
      const patients = await User.find({ role: "patient" }).select("firstName lastName role")
      const admins = await Admin.find().select("firstName lastName role")

      users = [
        ...patients.map((p) => ({ ...p.toObject(), model: "User" })),
        ...admins.map((a) => ({ ...a.toObject(), model: "Admin" })),
      ]
    }
    // Patients can message their doctors and admins
    else {
      // Get doctors who have appointments with this patient
      const admins = await Admin.find().select("firstName lastName role")

      // Find all doctors who have appointments with this patient
      const doctors = await Doctor.find().select("firstName lastName role")

      users = [
        ...doctors.map((d) => ({ ...d.toObject(), model: "Doctor" })),
        ...admins.map((a) => ({ ...a.toObject(), model: "Admin" })),
      ]
    }

    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
