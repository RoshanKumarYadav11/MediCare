import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required!"],
      minlength: [3, "Full Name must contain at least 3 characters!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      validate: [validator.isEmail, "Please provide a valid email address!"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      validate: {
        validator: (value) => /^\d{10}$/.test(value),
        message: "Phone number must contain exactly 10 digits!",
      },
    },
    // address: {
    //   type: String,
    //   required: [true, "Address is required!"],
    //   minlength: [3, "Address must contain at least 3 characters!"],
    // },
    // dob: {
    //   type: Date,
    //   required: [true, "Date of Birth is required!"],
    // },
    // gender: {
    //   type: String,
    //   enum: ["Male", "Female", "Other"],
    //   required: [true, "Gender is required!"],
    // },
    doctorDepartment: {
      type: String,
      required: [true, "Department is required!"],
    },
    doctorName: {
      type: String,
      required: [true, "Doctor name is required!"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Doctor",
      required: [true, "Doctor ID is required!"],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required!"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required!"],
      validate: {
        validator: (value) => value > new Date().setHours(0, 0, 0, 0),
        message: "Appointment date must be in the future!",
      },
    },
     appointmentTime: {
      type: String,
      required: [true, "Appointment time is required!"],
    },
    message: {
      type: String,
      maxlength: [500, "Message must not exceed 500 characters!"],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
