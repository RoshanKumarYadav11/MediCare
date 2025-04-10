import Appointment from "../../models/Appointment.js";

const getAppointmentStatus = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: { $in: ["completed", "cancelled"] },
    })
      .populate("doctorId", "firstName lastName")
      .populate("patientId", "firstName lastName")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching completed/cancelled appointments:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getAppointmentStatus;
