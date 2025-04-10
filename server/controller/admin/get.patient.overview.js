import User from "../../models/User.js";
import Appointment from "../../models/Appointment.js";
const getPatientOverview = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select(
      "firstName lastName"
    );
    const patientOverview = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({
          patientId: patient._id,
        });
        return {
          name: `${patient.firstName} ${patient.lastName}`,
          appointments: appointmentCount,
        };
      })
    );
    res.json(patientOverview);
  } catch (error) {
    console.error("Error fetching patient overview:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getPatientOverview;
