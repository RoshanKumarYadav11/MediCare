import Notification from "../../models/Notification.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "firstName lastName")
      .populate("relatedId");

    const total = await Notification.countDocuments({ recipient: userId });

    res.json({
      notifications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default getNotifications;
