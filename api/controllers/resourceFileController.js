const ResourceFile = require("../models/ResourceFileModel");

exports.createResourceFile = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.title.en) {
      return res.status(400).json({
        success: false,
        error: "Title is required with at least English translation",
      });
    }
    if (!req.body.description || !req.body.description.en) {
      return res.status(400).json({
        success: false,
        error: "Description is required with at least English translation",
      });
    }
    if (!req.body.file) {
      return res.status(400).json({
        success: false,
        error: "File is required",
      });
    }

    const data = {
      title: req.body.title,
      description: req.body.description,
      coverImage: req.body.coverImage || null,
      file: req.body.file,
      category: req.body.category || {
        en: "General",
        am: "አጠቃላይ",
        or: "Waliigalaa",
      },
      status: req.body.status || "active",
    };

    const result = await ResourceFile.create(data);
    res.status(201).json({
      success: true,
      message: "Resource file created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating resource file:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getAllResourceFiles = async (req, res) => {
  try {
    const status = req.query.status || "active";
    const resourceFiles = await ResourceFile.getAll(status);
    res.status(200).json({
      success: true,
      count: resourceFiles.length,
      data: resourceFiles,
    });
  } catch (err) {
    console.error("Error fetching resource files:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getResourceFileById = async (req, res) => {
  try {
    const resourceFile = await ResourceFile.getById(req.params.id);
    if (!resourceFile) {
      return res.status(404).json({
        success: false,
        error: "Resource file not found",
      });
    }
    res.status(200).json({
      success: true,
      data: resourceFile,
    });
  } catch (err) {
    console.error("Error fetching resource file:", err);
    if (err.message.includes("Invalid")) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.updateResourceFile = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided for update",
      });
    }

    // Get existing resource file to merge with updates
    const existing = await ResourceFile.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Resource file not found",
      });
    }

    const data = {
      title: req.body.title || existing.title,
      description: req.body.description || existing.description,
      coverImage: req.body.coverImage || existing.cover_image,
      file: req.body.file || existing.file,
      category: req.body.category || existing.category,
      status: req.body.status || existing.status,
    };

    const result = await ResourceFile.updateById(req.params.id, data);
    res.status(200).json({
      success: true,
      message: "Resource file updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating resource file:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.deleteResourceFile = async (req, res) => {
  try {
    await ResourceFile.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Resource file deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting resource file:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};
