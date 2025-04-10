import Appointment from "../../models/Appointment.js";
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const bookedAppointments = await Appointment.find({ doctorId, date });
    const bookedTimes = bookedAppointments.map((app) => app.time);
    const allTimeSlots = [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ];
    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );
    res.json(availableSlots);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

export default getAvailableSlots;
