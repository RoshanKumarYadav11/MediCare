import Prescription from "../../models/Prescription.js";

const getPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;
    const prescriptions = await Prescription.find({ patientId }).populate(
      "doctorId",
      "firstName lastName"
    );
    console.log("prescription: ", prescriptions);
    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).send({ error: "Server error" });
  }
};

export default getPrescriptions;
