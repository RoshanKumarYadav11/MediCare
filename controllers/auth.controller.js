import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { createError } from "../utils/error.js"
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.js"
import crypto from "crypto"

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { email } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(createError(400, "User with this email already exists"))
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Create new user
    const newUser = new User({
      ...req.body,
      verificationToken,
    })

    // Save user to database
    await newUser.save()

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationToken)

    // Return success response without sending password
    const { password, ...userWithoutPassword } = newUser._doc

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      data: userWithoutPassword,
    })
  } catch (error) {
    next(error)
  }
}

// Verify user email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    // Find user with the verification token
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return next(createError(400, "Invalid or expired verification token"))
    }

    // Update user verification status
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    })
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Check if user is verified
    if (!user.isVerified) {
      return next(createError(403, "Please verify your email before logging in"))
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return next(createError(400, "Invalid credentials"))
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = user._doc

    // Set cookie and send response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          ...userWithoutPassword,
          token,
        },
      })
  } catch (error) {
    next(error)
  }
}

// Logout user
export const logout = (req, res) => {
  res.clearCookie("access_token").status(200).json({
    success: true,
    message: "Logout successful",
  })
}

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Set token and expiry
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

    await user.save()

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken)

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    })
  } catch (error) {
    next(error)
  }
}

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Find user with the reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(createError(400, "Invalid or expired reset token"))
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    })
  } catch (error) {
    next(error)
  }
}

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return next(createError(404, "User not found"))
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

