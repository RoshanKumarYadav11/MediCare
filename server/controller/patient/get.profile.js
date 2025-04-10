import User from "../../models/User.js";
const getProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.user.id).select("-password");
    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

export default getProfile;
