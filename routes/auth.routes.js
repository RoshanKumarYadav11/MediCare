import express from "express"
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Auth routes
router.post("/register", register)
router.get("/verify/:token", verifyEmail)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.get("/me", verifyToken, getCurrentUser)

export default router

