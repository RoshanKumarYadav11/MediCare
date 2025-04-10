import Appointment from "../../models/Appointment.js";

const getCompletedAppointment = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const completedAppointments = await Appointment.find({
      $or: [
        {
          doctorId,
          status: "completed",
        },
        {
          doctorId,
          status: "cancelled",
        },
      ],
    })
      .populate("patientId", "firstName lastName")
      .sort({ date: -1, time: 1 }); // most recent first

    res.json(completedAppointments);
  } catch (error) {
    console.error("Error fetching completed appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export default getCompletedAppointment;
