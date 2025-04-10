import express from "express";
import auth from "../middlewares/auth.js";
import getNotifications from "../controller/notification/get.notifications.js";
import markAsRead from "../controller/notification/mark.as.read.js";
import deleteNotification from "../controller/notification/delete.notification.js";
import getUnreadCount from "../controller/notification/get.unread.count.js";

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", auth, getNotifications);

// Mark a notification as read
router.patch("/:id/read", auth, markAsRead);

// Delete a notification
router.delete("/:id", auth, deleteNotification);

// Get unread notification count
router.get("/unread-count", auth, getUnreadCount);

export default router;
