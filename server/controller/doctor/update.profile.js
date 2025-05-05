import Doctor from "../../models/Doctor.js";
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      specialty,
      licenseNumber,
      phoneNumber,
      appointmentFee
    } = req.body;
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found" });
    }
    doctor.firstName = firstName;
    doctor.lastName = lastName;
    doctor.email = email;
    doctor.specialty = specialty;
    doctor.licenseNumber = licenseNumber;
    doctor.phoneNumber = phoneNumber;
    doctor.appointmentFee = appointmentFee;
    await doctor.save();
    const doctorWithoutPassword = doctor.toObject();
    delete doctorWithoutPassword.password;
    res.json(doctorWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};
export default updateDoctorProfile;
