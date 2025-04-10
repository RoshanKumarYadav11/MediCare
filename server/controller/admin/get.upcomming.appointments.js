import Appointment from "../../models/Appointment.js";

const getUpcommingAppointments = async (req, res) => {
  try {
    // Set end of today (i.e. start of tomorrow)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Only fetch scheduled appointments for dates after today (i.e. tomorrow and beyond)
    const upcomingAppointments = await Appointment.find({
      status: "scheduled",
      date: { $gte: today },
    })
      .populate("doctorId", "firstName lastName")
      .populate("patientId", "firstName lastName")
      .sort({ date: 1, time: 1 });

    res.json(upcomingAppointments);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export default getUpcommingAppointments;
