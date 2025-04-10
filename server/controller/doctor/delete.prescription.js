import Prescription from "../../models/Prescription.js";

const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndDelete({
      _id: req.params.id,
      doctorId: req.user.id,
    });
    if (!prescription) {
      return res.status(404).send({ error: "Prescription not found" });
    }
    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    // res.status(500).send({ error: 'Server error', details: error.message });
  }
};

export default deletePrescription;
