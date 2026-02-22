const ActivityModel = require("../models/ActivityModel");

exports.getActivities = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const user_id = req.user ? req.user.id : null;

    const activities = await ActivityModel.getActivities(parseInt(limit), parseInt(offset));
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const user_id = req.user ? req.user.id : null;

    const activities = await ActivityModel.getActivitiesByUser(user_id, parseInt(limit));
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Get user activities error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};