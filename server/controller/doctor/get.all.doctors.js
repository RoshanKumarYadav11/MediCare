import Doctor from "../../models/Doctor.js";

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("firstName lastName specialty appointmentFee");
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getAllDoctors;
