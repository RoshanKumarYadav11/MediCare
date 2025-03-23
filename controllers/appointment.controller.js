import Appointment from "../models/appointment.model.js"
import Doctor from "../models/doctor.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.js"

// Create a new appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, type, reason } = req.body

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return next(createError(404, "Doctor not found"))
    }

    // Check if doctor is available at the requested time
    // This would involve checking the doctor's availability and existing appointments
    // For simplicity, we'll skip this check for now

    // Create new appointment
    const newAppointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      type,
      reason,
      status: "pending",
    })

    // Save appointment
    const savedAppointment = await newAppointment.save()

    // Create notification for doctor
    const doctorUser = await User.findById(doctor.user)
    if (doctorUser) {
      const notification = new Notification({
        recipient: doctorUser._id,
        title: "New Appointment Request",
        message: `You have a new appointment request from ${req.user.firstName} ${req.user.lastName} on ${new Date(date).toLocaleDateString()} at ${time}.`,
        type: "appointment",
        action: {
          text: "View Appointment",
          link: `/dashboard/appointments/${savedAppointment._id}`,
        },
      })

      await notification.save()
    }

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment,
    })
  } catch (error) {
    next(error)
  }
}

// Get all appointments (filtered by user role)
export const getAppointments = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query

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

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.date = { $gte: startDate, $lte: endDate }
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const appointments = await Appointment.find(query)
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
      .sort({ date: 1, time: 1 })

    // Get total count for pagination
    const totalAppointments = await Appointment.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          total: totalAppointments,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalAppointments / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get appointment by ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "firstName lastName email profileImage")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstName lastName email profileImage",
        },
      })

    if (!appointment) {
      return next(createError(404, "Appointment not found"))
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.role !== "admin" &&
      appointment.patient._id.toString() !== req.user._id.toString() &&
      !(req.user.role === "doctor" && appointment.doctor.user._id.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to view this appointment"))
    }

    res.status(200).json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

// Update appointment
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return next(createError(404, "Appointment not found"))
    }

    // Check if user is authorized to update this appointment
    if (
      req.user.role !== "admin" &&
      appointment.patient.toString() !== req.user._id.toString() &&
      !(req.user.role === "doctor" && appointment.doctor.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to update this appointment"))
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
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

    // Create notification for the other party
    let recipientId
    let notificationTitle
    let notificationMessage

    if (req.user.role === "patient") {
      // Notify doctor
      const doctor = await Doctor.findById(appointment.doctor)
      recipientId = doctor.user
      notificationTitle = "Appointment Updated"
      notificationMessage = `${req.user.firstName} ${req.user.lastName} has updated their appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`
    } else {
      // Notify patient
      recipientId = appointment.patient
      notificationTitle = "Appointment Updated"
      notificationMessage = `Dr. ${req.user.firstName} ${req.user.lastName} has updated your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`
    }

    const notification = new Notification({
      recipient: recipientId,
      title: notificationTitle,
      message: notificationMessage,
      type: "appointment",
      action: {
        text: "View Appointment",
        link: `/dashboard/appointments/${appointment._id}`,
      },
    })

    await notification.save()

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    })
  } catch (error) {
    next(error)
  }
}

// Cancel appointment
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return next(createError(404, "Appointment not found"))
    }

    // Check if user is authorized to cancel this appointment
    if (
      req.user.role !== "admin" &&
      appointment.patient.toString() !== req.user._id.toString() &&
      !(req.user.role === "doctor" && appointment.doctor.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to cancel this appointment"))
    }

    // Update appointment status to cancelled
    appointment.status = "cancelled"
    await appointment.save()

    // Create notification for the other party
    let recipientId
    let notificationMessage

    if (req.user.role === "patient") {
      // Notify doctor
      const doctor = await Doctor.findById(appointment.doctor)
      recipientId = doctor.user
      notificationMessage = `${req.user.firstName} ${req.user.lastName} has cancelled their appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`
    } else {
      // Notify patient
      recipientId = appointment.patient
      notificationMessage = `Dr. ${req.user.firstName} ${req.user.lastName} has cancelled your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`
    }

    const notification = new Notification({
      recipient: recipientId,
      title: "Appointment Cancelled",
      message: notificationMessage,
      type: "appointment",
    })

    await notification.save()

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

// Get doctor's availability
export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query

    if (!doctorId || !date) {
      return next(createError(400, "Doctor ID and date are required"))
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
      return next(createError(404, "Doctor not found"))
    }

    // Get day of week from date
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "lowercase" })

    // Get doctor's availability for that day
    const availability = doctor.availability[dayOfWeek] || []

    // Find existing appointments for that doctor on that date
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startDate, $lte: endDate },
      status: { $ne: "cancelled" },
    })

    // Get booked time slots
    const bookedTimeSlots = appointments.map((appointment) => appointment.time)

    // Filter out booked time slots from availability
    const availableTimeSlots = availability.filter((slot) => !bookedTimeSlots.includes(slot.start))

    res.status(200).json({
      success: true,
      data: {
        date,
        availableTimeSlots,
      },
    })
  } catch (error) {
    next(error)
  }
}

