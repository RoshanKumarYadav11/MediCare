import express from "express"
import { getAllUsers, getUserById, updateUser, deleteUser, changePassword } from "../controllers/user.controller.js"
import { verifyToken, verifyAdmin, verifyOwnerOrAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()

// User routes
router.get("/", verifyToken, verifyAdmin, getAllUsers)
router.get("/:id", verifyToken, getUserById)
router.put("/:id", verifyToken, verifyOwnerOrAdmin, updateUser)
router.delete("/:id", verifyToken, verifyOwnerOrAdmin, deleteUser)
router.post("/:id/change-password", verifyToken, verifyOwnerOrAdmin, changePassword)

export default router

