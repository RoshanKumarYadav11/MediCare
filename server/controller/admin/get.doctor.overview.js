import Doctor from "../../models/Doctor.js";
import Appointment from "../../models/Appointment.js";
const getDoctorOverview = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("firstName lastName specialty");
    const doctorOverview = await Promise.all(
      doctors.map(async (doctor) => {
        const uniquePatients = await Appointment.distinct("patientId", {
          doctorId: doctor._id,
        });
        return {
          name: `${doctor.firstName} ${doctor.lastName}`,
          specialty: doctor.specialty,
          patients: uniquePatients.length,
        };
      })
    );
    res.json(doctorOverview);
  } catch (error) {
    console.error("Error fetching doctor overview:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getDoctorOverview;
