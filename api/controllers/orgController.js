const Org = require("../models/OrgModel");

exports.createNode = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      position: req.body.position,
      parent_id: req.body.parent_id || null,
      image: req.body.image || ""
    };

    const result = await Org.create(data);
    res.status(201).json({ success: true, message: "Node created", data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllNodes = async (req, res) => {
  try {
    const result = await Org.getAll();
    res.status(200).json({ success: true, count: result.length, data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getNodeById = async (req, res) => {
  try {
    const node = await Org.getById(req.params.id);

    if (!node) {
      return res.status(404).json({ success: false, error: "Node not found" });
    }

    res.status(200).json({ success: true, data: node });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateNode = async (req, res) => {
  try {
    const existing = await Org.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Node not found" });
    }

    const data = {
      name: req.body.name || existing.name,
      position: req.body.position || existing.position,
      parent_id: req.body.parent_id !== undefined ? req.body.parent_id : existing.parent_id,
      image: req.body.image || existing.image
    };

    const updated = await Org.updateById(req.params.id, data);
    res.status(200).json({ success: true, message: "Node updated", data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteNode = async (req, res) => {
  try {
    await Org.deleteById(req.params.id);
    res.status(200).json({ success: true, message: "Node removed" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
