import Prescription from "../../models/Prescription.js";

const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctorId: req.user.id,
      patientId: req.params.patientId,
    });
    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getPrescriptionsByPatientId;
