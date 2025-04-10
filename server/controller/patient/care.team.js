import Appointment from "../../models/Appointment.js";
import Doctor from "../../models/Doctor.js";
const careTeam = async (req, res) => {
  try {
    const patientId = req.user.id;
    const appointments = await Appointment.find({ patientId }).distinct(
      "doctorId"
    );
    const careTeam = await Doctor.find({ _id: { $in: appointments } }).select(
      "firstName lastName specialty"
    );
    res.json(careTeam);
  } catch (error) {
    console.error("Error fetching care team:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default careTeam;
