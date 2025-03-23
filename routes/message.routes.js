import express from "express"
import {
  sendMessage,
  getConversations,
  getMessages,
  deleteMessage,
  getUnreadCount,
} from "../controllers/message.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Message routes
router.post("/", verifyToken, sendMessage)
router.get("/conversations", verifyToken, getConversations)
router.get("/unread", verifyToken, getUnreadCount)
router.get("/:userId", verifyToken, getMessages)
router.delete("/:id", verifyToken, deleteMessage)

export default router

