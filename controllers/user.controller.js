import User from "../models/user.model.js"
import { createError } from "../utils/error.js"

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query

    // Build query
    const query = {}

    // Filter by role if provided
    if (role) {
      query.role = role
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: totalUsers,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalUsers / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

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

// Update user
export const updateUser = async (req, res, next) => {
  try {
    // Prevent updating role unless admin
    if (req.body.role && req.user.role !== "admin") {
      return next(createError(403, "You are not authorized to change roles"))
    }

    // Prevent updating password through this endpoint
    if (req.body.password) {
      delete req.body.password
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedUser) {
      return next(createError(404, "User not found"))
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    // Only admin can delete other users
    if (req.params.id !== req.user._id.toString() && req.user.role !== "admin") {
      return next(createError(403, "You are not authorized to delete this user"))
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if (!deletedUser) {
      return next(createError(404, "User not found"))
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Find user with password
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword)

    if (!isPasswordCorrect) {
      return next(createError(400, "Current password is incorrect"))
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    next(error)
  }
}

