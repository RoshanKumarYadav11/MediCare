import Notification from "../models/notificationSchema.js";

// ✅ Get all notifications for a specific user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ date: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// ✅ Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
};

// ✅ Send a new notification
export const sendNotification = async (req, res) => {
    try {
        const { userId, role, type, message } = req.body;

        // Check if all required fields are provided
        if (!userId || !role || !type || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new notification
        const newNotification = new Notification({ userId, role, type, message });
        await newNotification.save();

        // Emit the notification via WebSocket (if using Socket.io)
        if (req.io) {
          
            req.io.to(userId.toString()).emit("newNotification", newNotification);
        }

        res.status(201).json({ message: "Notification sent successfully", notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification", error });
    }
};
