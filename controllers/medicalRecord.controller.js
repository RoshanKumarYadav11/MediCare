import MedicalRecord from "../models/medicalRecord.model.js"
import Doctor from "../models/doctor.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.js"

// Create a new medical record
export const createMedicalRecord = async (req, res, next) => {
  try {
    // Only doctors and admins can create medical records
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return next(createError(403, "Only doctors can create medical records"))
    }

    const { patientId, title, type, description } = req.body

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

    // Create new medical record
    const newMedicalRecord = new MedicalRecord({
      patient: patientId,
      doctor: doctorId,
      title,
      type,
      description,
      ...req.body,
    })

    // Save medical record
    const savedRecord = await newMedicalRecord.save()

    // Create notification for patient
    const notification = new Notification({
      recipient: patientId,
      title: "New Medical Record",
      message: `Dr. ${req.user.firstName} ${req.user.lastName} has added a new ${type} to your medical records.`,
      type: "record",
      action: {
        text: "View Record",
        link: `/dashboard/records/${savedRecord._id}`,
      },
    })

    await notification.save()

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: savedRecord,
    })
  } catch (error) {
    next(error)
  }
}

// Get all medical records (filtered by user role)
export const getMedicalRecords = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query

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

    // Filter by type if provided
    if (type) {
      query.type = type
    }

    // Search by title or description
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const records = await MedicalRecord.find(query)
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
    const totalRecords = await MedicalRecord.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          total: totalRecords,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalRecords / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get medical record by ID
export const getMedicalRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate("patient", "firstName lastName email profileImage")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstName lastName email profileImage",
        },
      })

    if (!record) {
      return next(createError(404, "Medical record not found"))
    }

    // Check if user is authorized to view this record
    if (
      req.user.role !== "admin" &&
      record.patient._id.toString() !== req.user._id.toString() &&
      !(req.user.role === "doctor" && record.doctor.user._id.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to view this record"))
    }

    res.status(200).json({
      success: true,
      data: record,
    })
  } catch (error) {
    next(error)
  }
}

// Update medical record
export const updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)

    if (!record) {
      return next(createError(404, "Medical record not found"))
    }

    // Only doctors who created the record or admins can update it
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "doctor" && record.doctor.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to update this record"))
    }

    // Update record
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
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
      recipient: record.patient,
      title: "Medical Record Updated",
      message: `Dr. ${req.user.firstName} ${req.user.lastName} has updated your ${record.type} medical record.`,
      type: "record",
      action: {
        text: "View Record",
        link: `/dashboard/records/${record._id}`,
      },
    })

    await notification.save()

    res.status(200).json({
      success: true,
      message: "Medical record updated successfully",
      data: updatedRecord,
    })
  } catch (error) {
    next(error)
  }
}

// Delete medical record
export const deleteMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)

    if (!record) {
      return next(createError(404, "Medical record not found"))
    }

    // Only doctors who created the record or admins can delete it
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "doctor" && record.doctor.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to delete this record"))
    }

    await MedicalRecord.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Medical record deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Get record types
export const getRecordTypes = async (req, res, next) => {
  try {
    const types = ["Lab Result", "Prescription", "Imaging", "Medical Report", "Other"]

    res.status(200).json({
      success: true,
      data: types,
    })
  } catch (error) {
    next(error)
  }
}

