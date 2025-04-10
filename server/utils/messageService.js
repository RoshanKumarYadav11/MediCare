import Message from "../models/Message.js"
import Conversation from "../models/Conversation.js"
import { createNotification } from "./notificationService.js"
import User from "../models/User.js"
import Doctor from "../models/Doctor.js"
import Admin from "../models/Admin.js"

// Helper function to get user model based on role
const getUserModelByRole = (role) => {
  switch (role) {
    case "patient":
      return "User"
    case "doctor":
      return "Doctor"
    case "admin":
      return "Admin"
    default:
      return "User"
  }
}

// Helper function to get user by ID and model
export const getUserById = async (id, model) => {
  try {
    switch (model) {
      case "User":
        return await User.findById(id)
      case "Doctor":
        return await Doctor.findById(id)
      case "Admin":
        return await Admin.findById(id)
      default:
        return null
    }
  } catch (error) {
    console.error(`Error getting user by ID (${id}) and model (${model}):`, error)
    return null
  }
}

// Generate a unique conversation ID between two users
export const generateConversationId = (user1, user1Model, user2, user2Model) => {
  // Sort by ID to ensure consistency
  const sortedPair = [
    { id: user1, model: user1Model },
    { id: user2, model: user2Model },
  ].sort((a, b) => a.id.toString().localeCompare(b.id.toString()))

  return `${sortedPair[0].model}_${sortedPair[0].id}_${sortedPair[1].model}_${sortedPair[1].id}`
}

// Create or get a conversation between two users
export const getOrCreateConversation = async (user1, user1Model, user2, user2Model) => {
  try {
    console.log("Getting or creating conversation between:", { user1, user1Model, user2, user2Model })

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      $and: [
        { "participants.id": user1, "participants.model": user1Model },
        { "participants.id": user2, "participants.model": user2Model },
      ],
    })

    // If not, create a new conversation
    if (!conversation) {
      console.log("Creating new conversation")
      conversation = new Conversation({
        participants: [
          { id: user1, model: user1Model },
          { id: user2, model: user2Model },
        ],
        unreadCount: {
          [user1]: 0,
          [user2]: 0,
        },
      })
      await conversation.save()
      console.log("New conversation created:", conversation._id)
    } else {
      console.log("Found existing conversation:", conversation._id)
    }

    return conversation
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error)
    throw error
  }
}

// Send a message and create notification
export const sendMessage = async (messageData) => {
  try {
    const { sender, senderModel, recipient, recipientModel, content, attachment, conversationId } = messageData

    // Get or create conversation if not provided
    const conversation = conversationId
      ? await Conversation.findById(conversationId)
      : await getOrCreateConversation(sender, senderModel, recipient, recipientModel)

    if (!conversation) {
      throw new Error("Conversation not found and could not be created")
    }

    // Create the message
    const message = new Message({
      sender,
      senderModel,
      recipient,
      recipientModel,
      content,
      attachment,
      conversationId: conversation._id,
    })

    // Save the message
    const savedMessage = await message.save()

    // Update conversation with last message and increment unread count
    conversation.lastMessage = savedMessage._id
    conversation.unreadCount.set(recipient.toString(), (conversation.unreadCount.get(recipient.toString()) || 0) + 1)
    await conversation.save()

    // Get sender details for notification
    const senderUser = await getUserById(sender, senderModel)
    const senderName = senderUser ? `${senderUser.firstName} ${senderUser.lastName}` : "Unknown User"
    const senderRole =
      (senderUser && senderUser.role) ||
      (senderModel === "Doctor" ? "doctor" : senderModel === "Admin" ? "admin" : "patient")

    // Create notification for recipient
    await createNotification({
      recipient,
      sender,
      senderModel,
      type: "message",
      title: `New message from ${senderName}`,
      message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
    })

    return savedMessage
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Mark messages as read
export const markMessagesAsRead = async (userId, conversationId) => {
  try {
    // Update all unread messages in the conversation where user is recipient
    const result = await Message.updateMany(
      {
        conversationId,
        recipient: userId,
        isRead: false,
      },
      { isRead: true },
    )

    // Reset unread count for this user in the conversation
    await Conversation.findByIdAndUpdate(conversationId, { $set: { [`unreadCount.${userId}`]: 0 } })

    return result.nModified || result.modifiedCount || 0
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}
