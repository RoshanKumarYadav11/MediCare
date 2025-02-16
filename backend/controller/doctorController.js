
import { Doctor } from "../models/doctorSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

// Get All Doctors
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  // Retrieve all doctors from the database
  const doctors = await Doctor.find({ role: 'Doctor' });

  if (!doctors || doctors.length === 0) {
    return next(new ErrorHandler("No Doctors Found", 404));
  }

  // Send the doctors data in the response
  res.status(200).json({
    success: true,
    doctors,
  });
});
// Get Doctor by ID
export const getDoctorById = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id; // Get doctor ID from URL params

  // Find doctor by ID
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Send the doctor's data in the response
  res.status(200).json({
    success: true,
    doctor,
  });
});
//AddDoctors
// export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
//   // const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

//   const {
//     fullName,
//     email,
//     phone,
//     dob,
//     gender,
//     password,
//     address,
//     doctorDepartment,
//   } = req.body;

//   // Validation for required fields
//   if (
//     !fullName ||
//     !email ||
//     !phone ||
//     !dob ||
//     !gender ||
//     !password ||
//     !address ||
//     !doctorDepartment
//   ) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }

//   // Phone number validation
//   if (phone.length > 11) {
//     return next(
//       new ErrorHandler("Phone Number Must Contain At Most 11 Digits!", 400)
//     );
//   }

//   // Check if doctor already exists
//   const isRegistered = await Doctor.findOne({ email });
//   if (isRegistered) {
//     return next(
//       new ErrorHandler("Doctor With This Email Already Exists!", 400)
//     );
//   }

//   // Upload avatar to Cloudinary (if required)
//   // Uncomment and configure file upload logic if docAvatar is required
//   /*
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return next(new ErrorHandler("Doctor Avatar Required!", 400));
//   }
//   const { docAvatar } = req.files;
//   if (!allowedFormats.includes(docAvatar.mimetype)) {
//     return next(new ErrorHandler("File Format Not Supported!", 400));
//   }
//   const cloudinaryResponse = await cloudinary.uploader.upload(
//     docAvatar.tempFilePath
//   );
//   if (!cloudinaryResponse || cloudinaryResponse.error) {
//     return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
//   }
//   */

//   // Create new doctor in the database
//   const doctor = await Doctor.create({
//     fullName,
//     email,
//     phone,
//     dob,
//     gender,
//     password, 
//     address,
//     role: "Doctor",
//     doctorDepartment,
//     // docAvatar: {
//     //   public_id: cloudinaryResponse.public_id,
//     //   url: cloudinaryResponse.secure_url,
//     // },
//   });

//   // Send success response
//   res.status(200).json({
//     success: true,
//     message: "New Doctor Registered",
//     doctor,
//   });
// });
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    password,
    address,
    doctorDepartment,
  } = req.body;
console.log(req.body)
  // Validate required fields
  if (
    !fullName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !password ||
    !address ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please fill in all required fields!", 400));
  }

  // Validate phone number length
  if (phone.length > 11) {
    return next(
      new ErrorHandler("Phone number must contain at most 11 digits!", 400)
    );
  }

  // Check if a doctor with the same email already exists
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    return next(
      new ErrorHandler("Doctor with this email already exists!", 400)
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Initialize avatar object (optional)
  let avatar = {};

  // If avatar is provided, upload to Cloudinary
  if (req.files && req.files.docAvatar) {
    const { docAvatar } = req.files;

    // Validate file type
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File format not supported!", 400));
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath,
      { folder: "doctor_avatars" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(
        new ErrorHandler("Failed to upload avatar to Cloudinary!", 500)
      );
    }

    // Save avatar details
    avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Create a new doctor in the database
  const doctor = await Doctor.create({
    fullName,
    email,
    phone,
    dob,
    gender,
    password: hashedPassword,
    address,
    role: "Doctor",
    doctorDepartment,
    avatar,
  });
  generateToken(doctor, "Doctor registered successfully", 201, res);
 
});
// Edit Doctor
export const editDoctor = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id; // Get doctor ID from URL params
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    password,
    address,
    doctorDepartment,
  } = req.body;

  // Find the doctor by ID
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Update doctor details
  doctor.fullName = fullName || doctor.fullName;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.dob = dob || doctor.dob;
  doctor.gender = gender || doctor.gender;
  doctor.password = password || doctor.password;
  doctor.address = address || doctor.address;
  doctor.doctorDepartment = doctorDepartment || doctor.doctorDepartment;

  // Save updated doctor
  await doctor.save();

  // Send success response
  res.status(200).json({
    success: true,
    message: "Doctor Details Updated",
    doctor,
  });
});
// Delete Doctor
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id; // Get doctor ID from URL params

  // Find the doctor by ID and remove it
  const doctor = await Doctor.findByIdAndDelete(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found", 404));
  }

  // Send success response
  res.status(200).json({
    success: true,
    message: "Doctor Deleted Successfully",
  });
});
