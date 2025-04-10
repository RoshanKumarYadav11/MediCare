import Appointment from "../../models/Appointment.js";
const scheduleAppointment = async (req, res) => {
  try {
    const { patientId, date, time, reason } = req.body;
    const doctorId = req.user.id; // Assuming the doctor is making the request

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      reason,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment scheduled successfully", appointment });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default scheduleAppointment;
