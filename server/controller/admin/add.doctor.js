import Doctor from "../../models/Doctor.js";

const addDoctor = async (req, res) => {
  // Check authorization
  if (!isAdminAuthorized(req.user)) {
    return res.status(403).json({
      success: false,
      error: "Not authorized to add doctors",
    });
  }

  const {
    firstName,
    lastName,
    email,
    specialty,
    licenseNumber,
    phoneNumber,
    password,
    appointmentFee,
  } = req.body;

  // Validate input
  if (
    !validateInput({
      firstName,
      lastName,
      email,
      specialty,
      licenseNumber,
      phoneNumber,
      password,
    })
  ) {
    return res.status(400).json({
      success: false,
      error:
        "All fields (firstName, lastName, email, specialty, licenseNumber, phoneNumber, password, appintmentFee) are required",
    });
  }

  try {
    // Create and save new doctor
    const doctor = await createDoctor({
      firstName,
      lastName,
      email,
      specialty,
      licenseNumber,
      phoneNumber,
      password,
      appointmentFee,
    });
    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: { id: doctor._id, email: doctor.email },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const isAdminAuthorized = (user) => {
  return user?.role === "admin";
};

const validateInput = ({
  firstName,
  lastName,
  email,
  specialty,
  licenseNumber,
  phoneNumber,
  password,
  // appointmentFee
}) => {
  return (
    firstName?.trim() &&
    lastName?.trim() &&
    email?.trim() &&
    specialty?.trim() &&
    licenseNumber?.trim() &&
    phoneNumber?.trim() &&
    password?.trim()
  );
};

const createDoctor = async ({
  firstName,
  lastName,
  email,
  specialty,
  licenseNumber,
  phoneNumber,
  password,
  appointmentFee,
}) => {
  const doctor = new Doctor({
    firstName,
    lastName,
    email,
    specialty,
    licenseNumber,
    phoneNumber,
    password,
    appointmentFee,
  });
  return await doctor.save();
};

const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Email or license number already exists",
    });
  }
  return res.status(400).json({
    success: false,
    error: error.message || "An error occurred while adding the doctor",
  });
};

export default addDoctor;
