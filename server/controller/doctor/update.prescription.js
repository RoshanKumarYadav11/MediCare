import Prescription from "../../models/Prescription.js";
const updatePrescriptions = async (req, res) => {
  try {
    const { medication, dosage, frequency, tilldate } = req.body;
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id },
      { medication, dosage, frequency, tilldate },
      { new: true }
    );
    if (!prescription) {
      return res.status(404).send({ error: "Prescription not found" });
    }
    res.json(prescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default updatePrescriptions;
