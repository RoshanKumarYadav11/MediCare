import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.js"

// Get all notifications for the current user
export const getNotifications = async (req, res, next) => {
  try {
    const { isRead, type, page = 1, limit = 10 } = req.query

    // Build query
    const query = { recipient: req.user._id }

    // Filter by read status if provided
    if (isRead !== undefined) {
      query.isRead = isRead === "true"
    }

    // Filter by type if provided
    if (type) {
      query.type = type
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    // Get total count for pagination
    const totalNotifications = await Notification.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: totalNotifications,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalNotifications / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return next(createError(404, "Notification not found"))
    }

    // Check if user is authorized to mark this notification as read
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return next(createError(403, "You are not authorized to mark this notification as read"))
    }

    // Update notification
    notification.isRead = true
    notification.readAt = new Date()
    await notification.save()

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    })
  } catch (error) {
    next(error)
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    )

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    next(error)
  }
}

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return next(createError(404, "Notification not found"))
    }

    // Check if user is authorized to delete this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return next(createError(403, "You are not authorized to delete this notification"))
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Get unread notification count
export const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
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

