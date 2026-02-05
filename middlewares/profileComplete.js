const User = require("../models/userModel");

const requireWorkerProfileComplete = async (req, res, next) => {
  let worker;

  if (req.user.role === "user") {
    const workerId = req.body.workerId;
    worker = await User.findById(workerId);
    if (!worker) return res.status(404).json({ error: "Worker not found" });
  }
  else if (req.user.role === "worker") {
    worker = req.user;
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (worker.role !== "worker") {
    return res.status(400).json({ error: "Selected user is not a worker" });
  }

  if (!worker.isProfileComplete) {
    return res.status(403).json({
      error: "Worker must complete profile (daily rate & skills) before this action",
    });
  }
  next();
};

module.exports = { requireWorkerProfileComplete };
