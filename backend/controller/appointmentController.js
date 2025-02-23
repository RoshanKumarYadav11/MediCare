import { Appointment } from "../models/appointmentSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import client from "../utils/onesignalClient.js";
// Controller to create a new appointment
export const createAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    fullName,
    email,
    phone,
    // dob,
    // gender,
    // address,
    appointmentDate,
    appointmentTime,
    doctorDepartment,
    doctorName,
    message,
    patientId,
    doctorId,
  } = req.body;

  // Validate required fields
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    // "dob",
    // "gender",
    // "address",
    "appointmentDate",
    "appointmentTime",
    "doctorDepartment",
    "doctorName",
    "patientId",
    "doctorId",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return next(
      new ErrorHandler(`Missing fields: ${missingFields.join(", ")}`, 400)
    );
  }

  // Check if the specified doctor exists in the department
  const doctor = await Doctor.findOne({
    fullName: doctorName,
    role: "Doctor",
    doctorDepartment,
  });

  if (!doctor) {
    return next(
      new ErrorHandler("Doctor not found for the specified department.", 404)
    );
  }

  // Prevent double booking for the doctor
  const isDoubleBooked = await Appointment.findOne({
    doctorId: doctor._id,
    appointmentDate,
  });
  if (isDoubleBooked) {
    return next(
      new ErrorHandler("The doctor is already booked for this date.", 400)
    );
  }

  // Create and save the appointment
  const appointment = await Appointment.create({
    fullName,
    email,
    phone,
    // dob,
    // gender,
    // address,
    appointmentDate,
    appointmentTime,
    doctorDepartment,
    doctorName,
    message,
    doctorId,
    patientId,
    // Ensure user is authenticated
  });

  res.status(201).json({
    success: true,
    message: "Appointment created successfully!",
    appointment,
  });
});

// Controller to get all appointments
export const getAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("doctorId", "fullName email")
    .populate("patientId", "fullName email");

  res.status(200).json({
    success: true,
    appointments,
  });
});

// Controller to get a single appointment by ID
export const getAppointmentById = catchAsyncErrors(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("doctorId", "fullName email")
    .populate("patientId", "fullName email");

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  res.status(200).json({
    success: true,
    appointment,
  });
});

// Controller to update an appointment
export const updateAppointment = catchAsyncErrors(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  // Notify the patient if the status changes to "Accepted"
  if (appointment.status === "Accepted") {
    console.log("sending notification...");
    try {
      await client.createNotification({
        headings: { en: "Appointment Accepted" },
        contents: {
          en: `Your appointment with Dr. ${appointment.doctorName} has been accepted!`,
        },
        include_external_user_ids: [appointment.patientId], // OneSignal external user ID for the patient
      });
      console.log("Notification sent to patient successfully!");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  res.status(200).json({
    success: true,
    message: "Appointment updated successfully!",
    appointment,
  });
});

// Controller to delete an appointment
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully!",
  });
});
