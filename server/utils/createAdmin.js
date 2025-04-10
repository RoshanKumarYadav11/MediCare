import Admin from "../models/Admin.js";

async function createAdmin() {
  const adminExist = await Admin.findOne({ email: "admin@gmail.com" });
  if (adminExist) return;

  const admin = new Admin({
    firstName: "Admin",
    lastName: "admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  });

  try {
    await admin.save();
    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}
export default createAdmin;
