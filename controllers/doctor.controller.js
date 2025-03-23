import Doctor from "../models/doctor.model.js"
import User from "../models/user.model.js"
import { createError } from "../utils/error.js"

// Create doctor profile
export const createDoctorProfile = async (req, res, next) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return next(createError(403, "Only doctors can create doctor profiles"))
    }

    // Check if doctor profile already exists
    const existingProfile = await Doctor.findOne({ user: req.user._id })

    if (existingProfile) {
      return next(createError(400, "Doctor profile already exists"))
    }

    // Create new doctor profile
    const newDoctorProfile = new Doctor({
      user: req.user._id,
      ...req.body,
    })

    // Save doctor profile
    const savedProfile = await newDoctorProfile.save()

    // Populate user data
    await savedProfile.populate("user", "firstName lastName email profileImage")

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: savedProfile,
    })
  } catch (error) {
    next(error)
  }
}

// Get all doctors
export const getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query

    // Build query
    const query = {}

    // Filter by specialization if provided
    if (specialization) {
      query.specialization = specialization
    }

    // Search by name
    if (search) {
      // Find user IDs matching the search criteria
      const users = await User.find({
        $or: [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }],
        role: "doctor",
      }).select("_id")

      const userIds = users.map((user) => user._id)

      // Add user IDs to query
      query.user = { $in: userIds }
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const doctors = await Doctor.find(query)
      .populate("user", "firstName lastName email profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ "rating.average": -1 })

    // Get total count for pagination
    const totalDoctors = await Doctor.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        doctors,
        pagination: {
          total: totalDoctors,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalDoctors / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get doctor by ID
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "firstName lastName email profileImage")

    if (!doctor) {
      return next(createError(404, "Doctor not found"))
    }

    res.status(200).json({
      success: true,
      data: doctor,
    })
  } catch (error) {
    next(error)
  }
}

// Update doctor profile
export const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)

    if (!doctor) {
      return next(createError(404, "Doctor not found"))
    }

    // Check if user is authorized to update this profile
    if (req.user.role !== "admin" && doctor.user.toString() !== req.user._id.toString()) {
      return next(createError(403, "You are not authorized to update this profile"))
    }

    // Update doctor profile
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).populate("user", "firstName lastName email profileImage")

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: updatedDoctor,
    })
  } catch (error) {
    next(error)
  }
}

// Add doctor review
export const addDoctorReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body

    if (!rating) {
      return next(createError(400, "Rating is required"))
    }

    const doctor = await Doctor.findById(req.params.id)

    if (!doctor) {
      return next(createError(404, "Doctor not found"))
    }

    // Check if user has already reviewed this doctor
    const existingReview = doctor.reviews.find((review) => review.patient.toString() === req.user._id.toString())

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating
      existingReview.comment = comment
      existingReview.date = Date.now()
    } else {
      // Add new review
      doctor.reviews.push({
        patient: req.user._id,
        rating,
        comment,
        date: Date.now(),
      })
    }

    // Calculate new average rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0)
    doctor.rating.average = totalRating / doctor.reviews.length
    doctor.rating.count = doctor.reviews.length

    // Save doctor with updated reviews
    await doctor.save()

    // Populate user data for reviews
    await doctor.populate({
      path: "reviews.patient",
      select: "firstName lastName profileImage",
    })

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: doctor,
    })
  } catch (error) {
    next(error)
  }
}

// Get doctor specializations
export const getDoctorSpecializations = async (req, res, next) => {
  try {
    // Get distinct specializations
    const specializations = await Doctor.distinct("specialization")

    res.status(200).json({
      success: true,
      data: specializations,
    })
  } catch (error) {
    next(error)
  }
}

