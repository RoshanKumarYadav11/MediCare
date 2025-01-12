import { User } from "../models/userSchema.js";

// Login User

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare entered password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = user.generateJsonWebToken();

    // Log role for debugging purposes
    console.log("User Role:", user.role);  // This will help us confirm the role in the backend

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Register User
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone,address, password, role, dob, gender } = req.body;

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

    // Hash the password before saving
    await newUser.save();

    // Generate JWT token after registration
    const token = newUser.generateJsonWebToken();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};