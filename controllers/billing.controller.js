import Billing from "../models/billing.model.js"
import User from "../models/user.model.js"
import Doctor from "../models/doctor.model.js"
import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.js"

// Create a new bill
export const createBill = async (req, res, next) => {
  try {
    // Only admins and doctors can create bills
    if (req.user.role !== "admin" && req.user.role !== "doctor") {
      return next(createError(403, "You are not authorized to create bills"))
    }

    const { patientId, service, amount, items } = req.body

    // Check if patient exists
    const patient = await User.findById(patientId)
    if (!patient) {
      return next(createError(404, "Patient not found"))
    }

    // Find doctor if applicable
    let doctorId
    if (req.body.doctorId) {
      doctorId = req.body.doctorId
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id })
      if (!doctor) {
        return next(createError(404, "Doctor profile not found"))
      }
      doctorId = doctor._id
    }

    // Calculate total amount if items are provided
    let totalAmount = amount
    if (items && items.length > 0) {
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
      totalAmount = subtotal + (req.body.tax || 0) - (req.body.discount || 0)
    }

    // Set due date if not provided (default to 14 days from now)
    let dueDate = req.body.dueDate
    if (!dueDate) {
      dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)
    }

    // Create new bill
    const newBill = new Billing({
      patient: patientId,
      doctor: doctorId,
      service,
      amount,
      totalAmount,
      dueDate,
      status: "pending",
      items: items || [],
      tax: req.body.tax || 0,
      discount: req.body.discount || 0,
    })

    // Save bill
    const savedBill = await newBill.save()

    // Create notification for patient
    const notification = new Notification({
      recipient: patientId,
      title: "New Bill",
      message: `You have a new bill of $${totalAmount.toFixed(2)} for ${service}.`,
      type: "billing",
      action: {
        text: "View Bill",
        link: `/dashboard/billing/${savedBill._id}`,
      },
    })

    await notification.save()

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: savedBill,
    })
  } catch (error) {
    next(error)
  }
}

// Get all bills (filtered by user role)
export const getBills = async (req, res, next) => {
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

    // Search by service or invoice number
    if (search) {
      query.$or = [{ service: { $regex: search, $options: "i" } }, { invoiceNumber: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Execute query with pagination
    const bills = await Billing.find(query)
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
    const totalBills = await Billing.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        bills,
        pagination: {
          total: totalBills,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(totalBills / Number.parseInt(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get bill by ID
export const getBillById = async (req, res, next) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate("patient", "firstName lastName email profileImage")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstName lastName email profileImage",
        },
      })

    if (!bill) {
      return next(createError(404, "Bill not found"))
    }

    // Check if user is authorized to view this bill
    if (
      req.user.role !== "admin" &&
      bill.patient._id.toString() !== req.user._id.toString() &&
      !(req.user.role === "doctor" && bill.doctor && bill.doctor.user._id.toString() === req.user._id.toString())
    ) {
      return next(createError(403, "You are not authorized to view this bill"))
    }

    res.status(200).json({
      success: true,
      data: bill,
    })
  } catch (error) {
    next(error)
  }
}

// Update bill
export const updateBill = async (req, res, next) => {
  try {
    // Only admins can update bills
    if (req.user.role !== "admin") {
      return next(createError(403, "You are not authorized to update bills"))
    }

    const bill = await Billing.findById(req.params.id)

    if (!bill) {
      return next(createError(404, "Bill not found"))
    }

    // Update bill
    const updatedBill = await Billing.findByIdAndUpdate(
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
      recipient: bill.patient,
      title: "Bill Updated",
      message: `Your bill for ${bill.service} has been updated.`,
      type: "billing",
      action: {
        text: "View Bill",
        link: `/dashboard/billing/${bill._id}`,
      },
    })

    await notification.save()

    res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      data: updatedBill,
    })
  } catch (error) {
    next(error)
  }
}

// Process payment
export const processPayment = async (req, res, next) => {
  try {
    const { paymentMethod, transactionId } = req.body

    const bill = await Billing.findById(req.params.id)

    if (!bill) {
      return next(createError(404, "Bill not found"))
    }

    // Check if bill is already paid
    if (bill.status === "paid") {
      return next(createError(400, "This bill has already been paid"))
    }

    // Check if user is authorized to pay this bill
    if (req.user.role !== "admin" && bill.patient.toString() !== req.user._id.toString()) {
      return next(createError(403, "You are not authorized to pay this bill"))
    }

    // Update bill status to paid
    bill.status = "paid"
    bill.paymentMethod = paymentMethod
    bill.paymentDate = new Date()
    bill.transactionId = transactionId

    await bill.save()

    // Create notification for admin
    const adminUsers = await User.find({ role: "admin" })

    for (const admin of adminUsers) {
      const notification = new Notification({
        recipient: admin._id,
        title: "Payment Received",
        message: `Payment of $${bill.totalAmount.toFixed(2)} has been received for invoice ${bill.invoiceNumber}.`,
        type: "billing",
      })

      await notification.save()
    }

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: bill,
    })
  } catch (error) {
    next(error)
  }
}

// Get billing statistics
export const getBillingStats = async (req, res, next) => {
  try {
    // Only admins can view billing statistics
    if (req.user.role !== "admin") {
      return next(createError(403, "You are not authorized to view billing statistics"))
    }

    // Get total revenue
    const totalRevenue = await Billing.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    // Get pending amount
    const pendingAmount = await Billing.aggregate([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    // Get overdue amount
    const overdueAmount = await Billing.aggregate([
      { $match: { status: "overdue" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    // Get monthly revenue for the current year
    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)

    const monthlyRevenue = await Billing.aggregate([
      {
        $match: {
          status: "paid",
          paymentDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Format monthly revenue
    const formattedMonthlyRevenue = Array(12).fill(0)
    monthlyRevenue.forEach((item) => {
      formattedMonthlyRevenue[item._id - 1] = item.total
    })

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        pendingAmount: pendingAmount.length > 0 ? pendingAmount[0].total : 0,
        overdueAmount: overdueAmount.length > 0 ? overdueAmount[0].total : 0,
        monthlyRevenue: formattedMonthlyRevenue,
      },
    })
  } catch (error) {
    next(error)
  }
}

