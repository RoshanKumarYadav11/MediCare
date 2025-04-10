import Appointment from "../../models/Appointment.js";
import User from "../../models/User.js";
const getPatientWithAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId }).sort({ date: 1 });
    const patientIds = [
      ...new Set(appointments.map((app) => app.patientId.toString())),
    ];

    const patients = await User.find({
      _id: { $in: patientIds },
      role: "patient",
    });

    const patientsWithAppointments = patients.map((patient) => {
      const patientAppointments = appointments.filter(
        (app) => app.patientId.toString() === patient._id.toString()
      );
      const lastVisit = patientAppointments.find(
        (app) => new Date(app.date) < new Date()
      );
      const nextAppointment = patientAppointments.find(
        (app) => new Date(app.date) >= new Date()
      );

      return {
        ...patient.toObject(),
        lastVisit: lastVisit ? lastVisit.date : null,
        nextAppointment: nextAppointment ? nextAppointment.date : null,
      };
    });

    res.json(patientsWithAppointments);
  } catch (error) {
    console.error("Error fetching patients with appointments:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getPatientWithAppointments;
