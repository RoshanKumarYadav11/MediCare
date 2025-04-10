import Notification from "../../models/Notification.js";

const getAllNotifications = async (req, res) => {
  try {
    // Ensure the requester is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get all notifications, sorted by creation date (newest first)
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("recipient", "firstName lastName role")
      .populate("sender", "firstName lastName")
      .populate("relatedId");

    // Get total count for pagination
    const total = await Notification.countDocuments({});

    // Enhance notifications with user role information
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const notificationObj = notification.toObject();

        // Add recipient role information if available
        if (notificationObj.recipient) {
          notificationObj.recipientRole = notificationObj.recipient.role;
        }

        return notificationObj;
      })
    );

    res.json({
      notifications: enhancedNotifications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default getAllNotifications;
