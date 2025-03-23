import express from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Notification routes
router.get("/", verifyToken, getNotifications)
router.get("/unread", verifyToken, getUnreadCount)
router.patch("/mark-all-read", verifyToken, markAllAsRead)
router.patch("/:id/read", verifyToken, markAsRead)
router.delete("/:id", verifyToken, deleteNotification)

export default router

