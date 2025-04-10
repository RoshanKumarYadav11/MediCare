import Appointment from "../../models/Appointment.js";
import { createAppointmentNotifications } from "../../utils/notificationService.js";

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason,
    });
    const savedAppointment = await appointment.save();

    // Create notifications for both patient and doctor

    await createAppointmentNotifications(savedAppointment);

    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

export default bookAppointment;
