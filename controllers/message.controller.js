import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import Doctor from "../models/doctor.model.js"
import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.js"

// Send a message
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, attachments } = req.body

    // Check if receiver exists
    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return next(createError(404, "Receiver not found"))
    }

    // Create new message
    const newMessage = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      attachments: attachments || [],
    })

    // Save message
    const savedMessage = await newMessage.save()

    // Create notification for receiver
    const notification = new Notification({
      recipient: receiverId,
      title: "New Message",
      message: `You have a new message from ${req.user.firstName} ${req.user.lastName}.`,
      type: "message",
      action: {
        text: "View Message",
        link: `/dashboard/messages?contact=${req.user._id}`,
      },
    })

    await notification.save()

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    })
  } catch (error) {
    next(error)
  }
}

// Get conversations
export const getConversations = async (req, res, next) => {
  try {
    // Find all users that the current user has exchanged messages with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$receiver", req.user._id] }, { $eq: ["$isRead", false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          unreadCount: 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.email": 1,
          "user.profileImage": 1,
          "user.role": 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ])

    // For doctors, also include their specialization
    if (conversations.length > 0) {
      for (const conversation of conversations) {
        if (conversation.user.role === "doctor") {
          const doctor = await Doctor.findOne({ user: conversation._id })
          if (doctor) {
            conversation.user.specialization = doctor.specialization
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: conversations,
    })
  } catch (error) {
    next(error)
  }
}

// Get messages between two users
export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 })

    // Mark unread messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      },
    )

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

// Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return next(createError(404, "Message not found"))
    }

    // Check if user is authorized to delete this message
    if (message.sender.toString() !== req.user._id.toString()) {
      return next(createError(403, "You are not authorized to delete this message"))
    }

    await Message.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Get unread message count
export const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    })

    res.status(200).json({
      success: true,
      data: { unreadCount },
    })
  } catch (error) {
    next(error)
  }
}

