import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name Is Required!"],
    minLength: [3, "Full Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true, // Ensure unique email for login
    validate: [validator.isEmail, "Please provide a valid email address!"], // Validate email format
  },
  phone: {
    type: String,
    required: [true, "Phone Number Is Required!"],
    minLength: [10, "Phone Number Must Contain At Least 11 Digits!"],
    maxLength: [10, "Phone Number Must Contain At Most 11 Digits!"],
  },
  address: {
    type: String,
    required: [true, "Address Is Required!"],
    minLength: [3, "Address Must Contain At Least 3 Characters!"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    select: false, // Do not select password field by default
  },
  role: {
    type: String,
    required: [true, "User role is required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String, // Only for Doctor role
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  patientReports: [
    {
      url: String,
    },
  ],
});

// Hash the password before saving to database (for registration)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare entered password with the hashed password stored in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a JWT token after successful login
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "1h", // Set token expiry time from env or default to 1 hour
  });
};

export const User = mongoose.model("User", userSchema);