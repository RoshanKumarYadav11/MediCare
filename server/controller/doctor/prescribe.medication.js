import Prescription from "../../models/Prescription.js";
import { createPrescriptionNotification } from "../../utils/notificationService.js";

const prescribeMedication = async (req, res) => {
  try {
    const { patientId, medication, dosage, frequency, tilldate } = req.body;
    const doctorId = req.user.id; // Assuming the doctor is making the request

    console.log("Request body:", req.body);
    console.log("Doctor ID:", doctorId);

    const prescription = new Prescription({
      patientId,
      doctorId,
      medication,
      dosage,
      frequency,
      tilldate,
    });

    const savedPrescription = await prescription.save();
    console.log("Saved prescription:", savedPrescription);

    await createPrescriptionNotification(savedPrescription);

    res.status(201).json({
      message: "Medication prescribed successfully",
      prescription: savedPrescription,
    });
  } catch (error) {
    console.error("Error prescribing medication:", error);
    res.status(500).send({ error: "Server error" });
  }
};

export default prescribeMedication;
