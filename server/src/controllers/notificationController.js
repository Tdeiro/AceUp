const { Notification } = require("../models");

exports.getUserNotifications = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notifications", error });
  }
};
