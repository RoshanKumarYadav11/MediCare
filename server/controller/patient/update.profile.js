import User from "../../models/User.js";

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const patient = await User.findById(req.user.id);
    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }
    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.email = email;
    await patient.save();
    const patientWithoutPassword = patient.toObject();
    delete patientWithoutPassword.password;
    res.json(patientWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};
export default updateProfile;
