import Doctor from "../../models/Doctor.js";
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getDoctorProfile;
