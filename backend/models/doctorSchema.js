import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    doctorDepartment: {
      type: String,
      required: [true, "Doctor's department is required"],
    },
    // avatar: {
    //   public_id: { type: String, default: null },
    //   url: { type: String, default: null },
    // },
    role: {
      type: String,
      default: "Doctor",
    },
   availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        timeSlots: [
          {
            startTime: { type: String, required: true }, // e.g., "10:00 AM"
            endTime: { type: String, required: true },   // e.g., "11:00 AM"
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
// Generate JWT token
doctorSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};


doctorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
