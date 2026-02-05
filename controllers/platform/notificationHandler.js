const Notification = require("../../models/notificationModel");

const sendNotification = async (userId, type, message, meta, req) => {
  const notification = await Notification.create({ user: userId, type, message, meta });


  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }

  return notification;
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("notifications");
    if (!user) {
      throw new ExpressError(404, "User not found");
    }

    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Failed to fetch notifications" });
  }
}

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new ExpressError(404, "User not found");
    }

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      throw new ExpressError(404, "Notification not found");
    }

    notification.read = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Failed to mark notification" });
  }
};


module.exports = { sendNotification, getNotifications, markAsRead };
