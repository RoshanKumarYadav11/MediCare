import Doctor from "../../models/Doctor.js";

const getTotalDoctors = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    res.json({ totalDoctors });
  } catch (error) {
    console.error("Error fetching total doctors:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getTotalDoctors;
