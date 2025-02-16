import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Doctor } from "../models/doctorSchema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtToken.js";

// Login User

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is set by authentication middleware

    // Find user in both User and Doctor collections
    let user = await User.findById(userId);
    if (!user) {
      user = await Doctor.findById(userId);
    }

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email in both User and Doctor collections
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      user = await Doctor.findOne({ email }).select("+password"); // Check in Doctor schema
    }

    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Compare entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }
    // Check if the user's role is "Patient" or "Doctor"
    if (user.role !== "Patient" && user.role !== "Doctor") {
      return next(
        new ErrorHandler("Access denied. Patients and Doctors only.", 403)
      );
    }
    // Generate JWT token and set it in a cookie
    generateToken(user, "Login successful", 200, res);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//admin login
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email in User collection
    let user = await User.findOne({ email }).select("+password");
     if (!user) {
      user = await Doctor.findOne({ email }).select("+password"); // Check in Doctor schema
    }

    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Check if the user's role is "admin"
    if (user.role !== "Admin") {
      return next(new ErrorHandler("Access denied. Admins only.", 403));
    }

    // Compare entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Generate JWT token and set it in a cookie
    generateToken(user, "Admin login successful", 200, res);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Register User
export const registerUser = catchAsyncErrors(async (req, res) => {
  try {
    const { fullName, email, phone, address, password, role, dob, gender } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phone,
      address,
      password,
      role,
      dob,
      gender,
    });

    await newUser.save();

    // Generate JWT token and set it in a cookie
    generateToken(newUser, "User registered successfully", 201, res);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const getAllPatient = catchAsyncErrors(async (req, res, next) => {
  // Retrieve all patients from the database
  const patients = await User.find({ role: "Patient" });

  if (!patients || patients.length === 0) {
    return next(new ErrorHandler("No Patient Found", 404));
  }

  // Send the patient data in the response
  res.status(200).json({
    success: true,
    patients,
  });
});
