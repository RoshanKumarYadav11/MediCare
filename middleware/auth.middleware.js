import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { createError } from "../utils/error.js"

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]

    if (!token) {
      return next(createError(401, "You are not authenticated"))
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token"))
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token has expired"))
    }
    next(error)
  }
}

// Middleware to check if user is admin
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return next(createError(403, "You are not authorized to perform this action"))
  }
}

// Middleware to check if user is doctor
export const verifyDoctor = (req, res, next) => {
  if (req.user && (req.user.role === "doctor" || req.user.role === "admin")) {
    next()
  } else {
    return next(createError(403, "You are not authorized to perform this action"))
  }
}

// Middleware to check if user is the owner or admin
export const verifyOwnerOrAdmin = (req, res, next) => {
  if (req.user && (req.user._id.toString() === req.params.id || req.user.role === "admin")) {
    next()
  } else {
    return next(createError(403, "You are not authorized to perform this action"))
  }
}

