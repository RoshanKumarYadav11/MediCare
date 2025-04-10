import Admin from "../../models/Admin.js";

const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};
export default getProfile;
