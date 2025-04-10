import Appointment from "../../models/Appointment.js";
const getAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const appointments = await Appointment.find({
      doctorId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // End of day
      },
      status: "scheduled",
    })
      .populate("patientId", "firstName lastName")
      .sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getAppointments;
