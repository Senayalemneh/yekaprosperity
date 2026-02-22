const FavoriteModel = require("../models/FavoriteModel");
const ActivityModel = require("../models/ActivityModel");

exports.addFavorite = async (req, res) => {
  try {
    const { resource_type, resource_id } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (!resource_type || !resource_id) {
      return res.status(400).json({ success: false, error: "Resource type and ID are required" });
    }

    if (!['file', 'folder'].includes(resource_type)) {
      return res.status(400).json({ success: false, error: "Resource type must be 'file' or 'folder'" });
    }

    const favoriteId = await FavoriteModel.add(user_id, resource_type, resource_id);

    // Log activity
    await ActivityModel.log({
      user_id: user_id,
      action: 'favorite_add',
      resource_type: resource_type,
      resource_id: resource_id,
      details: `Added to favorites`,
      ip_address: req.ip
    });

    res.status(201).json({ success: true, message: "Added to favorites" });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { resource_type, resource_id } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (!resource_type || !resource_id) {
      return res.status(400).json({ success: false, error: "Resource type and ID are required" });
    }

    const removed = await FavoriteModel.remove(user_id, resource_type, resource_id);

    if (!removed) {
      return res.status(404).json({ success: false, error: "Favorite not found" });
    }

    // Log activity
    await ActivityModel.log({
      user_id: user_id,
      action: 'favorite_remove',
      resource_type: resource_type,
      resource_id: resource_id,
      details: `Removed from favorites`,
      ip_address: req.ip
    });

    res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const { resource_type } = req.query;
    const user_id = req.user ? req.user.id : null;

    const favorites = await FavoriteModel.getByUser(user_id, resource_type);
    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { resource_type, resource_id } = req.query;
    const user_id = req.user ? req.user.id : null;

    if (!resource_type || !resource_id) {
      return res.status(400).json({ success: false, error: "Resource type and ID are required" });
    }

    const isFavorited = await FavoriteModel.isFavorited(user_id, resource_type, resource_id);
    res.status(200).json({ success: true, data: { is_favorited: isFavorited } });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};