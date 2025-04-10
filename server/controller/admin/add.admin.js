import Admin from "../../models/Admin.js";

const addAdmin = async (req, res) => {
  // Check authorization
  if (!isAdminAuthorized(req.user)) {
    return res.status(403).json({
      success: false,
      error: "Not authorized to add admins",
    });
  }

  const { firstName, lastName, email, password } = req.body;

  // Validate input
  if (!validateInput({ firstName, lastName, email, password })) {
    return res.status(400).json({
      success: false,
      error: "All fields (firstName, lastName, email, password) are required",
    });
  }

  try {
    // Create and save new admin
    const admin = await createAdmin({ firstName, lastName, email, password });
    return res.status(201).json({
      success: true,
      message: "Admin added successfully",
      data: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const isAdminAuthorized = (user) => {
  return user?.role === "admin";
};

const validateInput = ({ firstName, lastName, email, password }) => {
  return (
    firstName?.trim() && lastName?.trim() && email?.trim() && password?.trim()
  );
};

const createAdmin = async ({ firstName, lastName, email, password }) => {
  const admin = new Admin({ firstName, lastName, email, password });
  return await admin.save();
};

const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }
  return res.status(400).json({
    success: false,
    error: error.message || "An error occurred while adding the admin",
  });
};

export default addAdmin;
