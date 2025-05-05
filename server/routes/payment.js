import express from "express"
import dotenv from "dotenv"
import axios from "axios"
import Appointment from "../models/Appointment.js"
import Doctor from "../models/Doctor.js"
import User from "../models/User.js"
import { createAppointmentNotifications } from "../utils/notificationService.js"
import auth from "../middlewares/auth.js"

dotenv.config()

const router = express.Router()

const KHALTI_API_URL = "https://dev.khalti.com/api/v2/epayment/"
const KHALTI_SECRET_KEY = process.env.LIVE_SECRET_KEY || "your_test_secret_key" // Replace with your Khalti secret key

// Initiate payment for appointment
router.post("/initiate-payment", auth, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body
    const patientId = req.user.id

    // Get doctor details to determine appointment fee
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" })
    }

    // Get patient details for payment
    const patient = await User.findById(patientId)
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" })
    }

    // Create a temporary appointment record with pending status
    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: "pending_payment", // Special status for appointments awaiting payment
    })

    const savedAppointment = await appointment.save()

    // Generate a unique purchase order ID
    const purchase_order_id = `APT-${savedAppointment._id}`
    const purchase_order_name = `Appointment with Dr. ${doctor.firstName} ${doctor.lastName}`

    // Amount in paisa (e.g., 100 NPR = 10000 paisa)
    const amount = doctor.appointmentFee * 100

    const payload = {
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-callback`, // Frontend callback URL
      website_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}`, // Your website URL
      amount,
      purchase_order_id,
      purchase_order_name,
      customer_info: {
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phone: patient.phoneNumber || "9800000001", // Fallback if phone not available
      },
      amount_breakdown: [
        {
          label: "Appointment Fee",
          amount,
        },
      ],
      product_details: [
        {
          identity: "appointment",
          name: purchase_order_name,
          total_price: amount,
          quantity: 1,
          unit_price: amount,
        },
      ],
    }

    console.log("Initiating payment with Khalti:", payload)

    const response = await axios.post(`${KHALTI_API_URL}initiate/`, payload, {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Khalti initiation response:", response.data)

    res.json({
      success: true,
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
      appointmentId: savedAppointment._id,
    })
  } catch (error) {
    console.error("Payment initiation error:", error.response?.data || error.message)
    res.status(500).json({ success: false, error: "Payment initiation failed" })
  }
})

// Verify Payment - This is the endpoint that should handle verification with Khalti
router.post("/verify-payment", async (req, res) => {
  try {
    const { pidx, appointmentId } = req.body

    console.log("Verifying payment with Khalti:", { pidx, appointmentId })

    if (!pidx || !appointmentId) {
      return res.status(400).json({
        success: false,
        error: "Missing pidx or appointmentId",
      })
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      console.error("Appointment not found:", appointmentId)
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    // If appointment is already scheduled, payment was successful
    if (appointment.status === "scheduled") {
      console.log("Appointment already confirmed:", appointmentId)

      // Return the populated appointment for display
      const populatedAppointment = await Appointment.findById(appointmentId)
        .populate("doctorId", "firstName lastName specialty appointmentFee")
        .populate("patientId", "firstName lastName email")

      return res.json({
        success: true,
        message: "Payment already verified and appointment confirmed",
        appointment: populatedAppointment,
      })
    }

    // Verify with Khalti API
    try {
      const khaltiResponse = await axios.post(
        `${KHALTI_API_URL}lookup/`,
        { pidx },
        {
          headers: {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Khalti verification response:", khaltiResponse.data)
      const { status, amount, transaction_id } = khaltiResponse.data

      if (status === "Completed") {
        // Get the doctor to determine the actual appointment fee
        const doctor = await Doctor.findById(appointment.doctorId)
        if (!doctor) {
          return res.status(404).json({
            success: false,
            error: "Doctor not found",
          })
        }

        // Use the doctor's appointment fee instead of relying on Khalti's amount
        const appointmentFee = doctor.appointmentFee

        // Update appointment status to scheduled
        appointment.status = "scheduled"
        appointment.paymentDetails = {
          transactionId: transaction_id,
          amount: appointmentFee, // Use the doctor's appointment fee
          status: "completed",
          paidAt: new Date(),
        }
        await appointment.save()

        // Create notifications for both patient and doctor
        await createAppointmentNotifications(appointment)

        console.log("Payment verified successfully for appointment:", appointmentId)

        // Return the populated appointment for display
        const populatedAppointment = await Appointment.findById(appointmentId)
          .populate("doctorId", "firstName lastName specialty appointmentFee")
          .populate("patientId", "firstName lastName email")

        return res.json({
          success: true,
          message: "Payment verified and appointment confirmed",
          transaction_id,
          appointment: populatedAppointment,
        })
      } else {
        console.log("Payment not completed:", status)
        return res.json({
          success: false,
          message: `Payment status: ${status}`,
          appointment: await Appointment.findById(appointmentId)
            .populate("doctorId", "firstName lastName specialty appointmentFee")
            .populate("patientId", "firstName lastName email"),
        })
      }
    } catch (khaltiError) {
      console.error("Error from Khalti API:", khaltiError.response?.data || khaltiError.message)

      // Even if Khalti API fails, we should check if the payment was actually successful
      // This can happen if our server already verified the payment but the response failed

      // Get the appointment status from our database
      const currentAppointment = await Appointment.findById(appointmentId)
        .populate("doctorId", "firstName lastName specialty appointmentFee")
        .populate("patientId", "firstName lastName email")

      if (currentAppointment.status === "scheduled") {
        // Payment was successful despite API error
        return res.json({
          success: true,
          message: "Payment verified and appointment confirmed",
          appointment: currentAppointment,
        })
      }

      // If we can't verify with Khalti and appointment is not confirmed, return error
      return res.json({
        success: false,
        message: "Could not verify payment with Khalti",
        error: khaltiError.message,
        appointment: currentAppointment,
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error.message)
    res.status(500).json({ success: false, error: "Payment verification failed" })
  }
})

// Get payment status for an appointment
router.get("/status/:appointmentId", auth, async (req, res) => {
  try {
    const { appointmentId } = req.params
    console.log("Checking payment status for appointment:", appointmentId)

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "firstName lastName specialty appointmentFee")
      .populate("patientId", "firstName lastName email")

    if (!appointment) {
      console.error("Appointment not found:", appointmentId)
      return res.status(404).json({ success: false, error: "Appointment not found" })
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.id !== appointment.patientId._id.toString() &&
      req.user.id !== appointment.doctorId._id.toString() &&
      req.user.role !== "admin"
    ) {
      console.error("User not authorized to view appointment:", req.user.id)
      return res.status(403).json({ success: false, error: "Not authorized" })
    }

    console.log("Returning appointment status:", appointment.status)
    res.json({
      success: true,
      appointment,
    })
  } catch (error) {
    console.error("Error fetching payment status:", error)
    res.status(500).json({ success: false, error: "Failed to fetch payment status" })
  }
})

export default router
