import Admin from "../../models/Admin.js";

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.email = email;
    await admin.save();
    const adminWithoutPassword = admin.toObject();
    delete adminWithoutPassword.password;
    res.json({
      message: "Profile updated successfully",
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};
export default updateProfile;
