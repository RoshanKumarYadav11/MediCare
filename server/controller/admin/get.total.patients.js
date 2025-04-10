import User from "../../models/User.js";

const getTotalPatients = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    res.json({ totalPatients });
  } catch (error) {
    console.error("Error fetching total patients:", error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getTotalPatients;
