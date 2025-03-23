import Prescription from "../models/prescription.model.js"
import Doctor from "../models/doctor.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.js"

// Create a new prescription
export const createPrescription = async (req, res, next) => {
  try {
    // Only doctors and admins can create prescriptions
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return next(createError(403, "Only doctors can create prescriptions"))
    }

    const { patientId, medications, diagnosis, notes } = req.body

    // Check if patient exists
    const patient = await User.findById(patientId)
    if (!patient) {
      return next(createError(404, "Patient not found"))
    }

    // Find doctor profile
    let doctorId
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id })
      if (!doctor) {
        return next(createError(404, "Doctor profile not found"))
      }
      doctorId = doctor._id
    } else {
      // For admin, doctor ID should be provided
      if (!req.body.doctorId) {
        return next(createError(400, "Doctor ID is required"))
      }
      doctorId = req.body.doctorId
    }

    // Create new prescription
    const newPrescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      medications,
      diagnosis,
      notes,
      status: "active",
    })

    // Set expiry date if not provided (default to 30 days from now)
    if (!newPrescription.expiryDate) {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)
      newPrescription.expiryDate = expiryDate
    }

    // Save prescription
    const savedPrescription = await newPrescription.save()

    // Create notification for patient
    const notification = new Notification({
      recipient: patientId,
      title: "New Prescription",
      message: `Dr. ${req.user.firstName} ${req.user.lastName} has prescribed you new medication.`,
      type: "prescription",
      action: {
        text: "View Prescription",
        link: `/dashboard/prescriptions/${savedPrescription._id}`,
      },
    })

    await notification.save()

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: savedPrescription,
    })
  } catch (error) {
    next(error)
  }
}

// Get all prescriptions (filtered by user role)
export const getPrescriptions = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query

    // Build query based on user role
    const query = {}

    if (req.user.role === "patient") {
      query.patient = req.user._id
    } else if (req.user.role === "doctor") {
      // Find the doctor document associated with this user
      const doctor = await Doctor.findOne({ user: req.user._id })
      if (!doctor) {
        return next(createError(404, "Doctor profile not found"))
      }
      query.doctor = doctor._id
    }

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Search by diagnosis or notes
    if (search) {
      query.$or = [
        { diagnosis: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { "medications.name": { $regex: search, $options: "i" } },
      ]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const prescriptions = await Prescription.find(query)
      .populate("patient", "firstName lastName email profileImage")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstName lastName email profileImage",
        },
      })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ date: -1 })

    // Get total count for pagination
    const totalPrescriptions = await Prescription.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          total: totalPrescriptions,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalPrescriptions / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get prescription by ID
export const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "firstName lastName email profileImage")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstName lastName email profileImage",
        },
      })

    if (!prescription) {
      return next(createError(404, "Prescription not found"))
    }

    // Check if user is authorized to view this prescription
    if (
      req.user.role !== "admin" &&
      prescription.patient._id.toString() !== req.user._id.toString() &&
      !(req.user.role === "doctor" && prescription.doctor.user._id.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to view this prescription"))
    }

    res.status(200).json({
      success: true,
      data: prescription,
    })
  } catch (error) {
    next(error)
  }
}

// Update prescription
export const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)

    if (!prescription) {
      return next(createError(404, "Prescription not found"))
    }

    // Only doctors who created the prescription or admins can update it
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "doctor" && prescription.doctor.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to update this prescription"))
    }

    // Update prescription
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    )
      .populate("patient", "firstName lastName email profileImage")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstName lastName email profileImage",
        },
      })

    // Create notification for patient
    const notification = new Notification({
      recipient: prescription.patient,
      title: "Prescription Updated",
      message: `Dr. ${req.user.firstName} ${req.user.lastName} has updated your prescription.`,
      type: "prescription",
      action: {
        text: "View Prescription",
        link: `/dashboard/prescriptions/${prescription._id}`,
      },
    })

    await notification.save()

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: updatedPrescription,
    })
  } catch (error) {
    next(error)
  }
}

// Cancel prescription
export const cancelPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)

    if (!prescription) {
      return next(createError(404, "Prescription not found"))
    }

    // Only doctors who created the prescription or admins can cancel it
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "doctor" && prescription.doctor.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to cancel this prescription"))
    }

    // Update prescription status to cancelled
    prescription.status = "cancelled"
    await prescription.save()

    // Create notification for patient
    const notification = new Notification({
      recipient: prescription.patient,
      title: "Prescription Cancelled",
      message: `Dr. ${req.user.firstName} ${req.user.lastName} has cancelled your prescription.`,
      type: "prescription",
    })

    await notification.save()

    res.status(200).json({
      success: true,
      message: "Prescription cancelled successfully",
      data: prescription,
    })
  } catch (error) {
    next(error)
  }
}

