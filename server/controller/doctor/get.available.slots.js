import Appointment from "../../models/Appointment.js";

const getAvailableSlots = async (req, res) => {
  try {
    const { patientId, date } = req.query;
    const doctorId = req.user.id; // Assuming the doctor is making the request

    // Fetch booked appointments for the given doctor and date
    const bookedAppointments = await Appointment.find({ doctorId, date });
    const bookedTimes = bookedAppointments.map((app) => app.time);

    // Define all possible time slots
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

    // Filter out the booked time slots
    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    res.json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getAvailableSlots;
