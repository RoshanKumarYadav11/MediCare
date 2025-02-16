import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Doctor } from "../models/doctorSchema.js";

export const getAllAvailability = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id;

  // Find doctor by ID
  const doctor = await Doctor.findById(doctorId).select("availability");
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Respond with availability data
  res.status(200).json({
    success: true,
    availability: doctor.availability,
  });
});

export const addAvailability = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id; 
  const { date, timeSlots } = req.body;

  // Validate input
  if (!date || !timeSlots || timeSlots.length === 0) {
    return next(new ErrorHandler("Date and time slots are required!", 400));
  }

  // Find doctor by ID
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Add availability to the doctor
  doctor.availability.push({ date, timeSlots });

  // Save updated doctor
  await doctor.save();

  // Send success response
  res.status(200).json({
    success: true,
    message: "Availability added successfully!",
    doctorName: doctor.fullName, 
    availability: doctor.availability,
  });
});

export const editAvailability = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id;
  const { availabilityId, date, timeSlots } = req.body;

  // Validate input
  if (!availabilityId || !date || !timeSlots || timeSlots.length === 0) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  // Find doctor by ID
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Find the availability by ID
  const availability = doctor.availability.id(availabilityId);
  if (!availability) {
    return next(new ErrorHandler("Availability Not Found", 404));
  }

  // Update the availability
  availability.date = date;
  availability.timeSlots = timeSlots;

  // Save updated doctor
  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Availability updated successfully!",
    availability: doctor.availability,
  });
});

export const deleteAvailability = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id; // doctorId from the URL parameter
  const availabilityId = req.params.availabilityId; // availabilityId from the URL parameter

  // Validate if availabilityId is provided
  if (!availabilityId) {
    return next(new ErrorHandler("Availability ID is required!", 400));
  }

  // Find doctor by ID
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Check if the availability exists
  const availabilityExists = doctor.availability.some(
    (a) => a._id.toString() === availabilityId
  );

  if (!availabilityExists) {
    return next(new ErrorHandler("Availability Not Found!", 404));
  }

  // Remove the availability from the doctor’s availability array
  doctor.availability = doctor.availability.filter(
    (a) => a._id.toString() !== availabilityId
  );

  // Save the updated doctor document
  await doctor.save();

  // Send the response back
  res.status(200).json({
    success: true,
    message: "Availability deleted successfully!",
    availability: doctor.availability,
  });
});




