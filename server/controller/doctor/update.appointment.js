import Appointment from "../../models/Appointment.js";
import { createAppointmentStatusNotification } from "../../utils/notificationService.js";

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId, status } = req.params;

    // Validate status
    const validStatuses = ["scheduled", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const doctorId = req.user.id; // Ensure the doctor owns the appointment

    // Find and update the appointment
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctorId },
      { status },
      { new: true }
    ).populate("patientId", "firstName lastName");

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found or unauthorized" });
    }

    if (status === "completed" || status === "cancelled") {
      await createAppointmentStatusNotification(updatedAppointment, status);
    }

    res.json({
      message: "Appointment status updated",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export default updateAppointment;
