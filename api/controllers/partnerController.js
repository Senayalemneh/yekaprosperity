const Partner = require("../models/PartnerModel");

exports.createPartner = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.name.en) {
      return res.status(400).json({
        success: false,
        error: "Name is required with at least English translation",
      });
    }
    if (!req.body.description || !req.body.description.en) {
      return res.status(400).json({
        success: false,
        error: "Description is required with at least English translation",
      });
    }

    // Logo path should come from the frontend after upload
    if (!req.body.logo) {
      return res.status(400).json({
        success: false,
        error: "Logo is required",
      });
    }

    const data = {
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo, // Path from the upload
      website: req.body.website || null,
      status: req.body.status || "published",
      featured: req.body.featured || false,
    };

    const result = await Partner.create(data);
    res.status(201).json({
      success: true,
      message: "Partner created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating partner:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getAllPartners = async (req, res) => {
  try {
    const status = req.query.status || null;
    const featured =
      req.query.featured !== undefined ? req.query.featured === "true" : null;

    const partners = await Partner.getAll(status, featured);
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (err) {
    console.error("Error fetching partners:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getFeaturedPartners = async (req, res) => {
  try {
    const partners = await Partner.getFeatured();
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (err) {
    console.error("Error fetching featured partners:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.getById(req.params.id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: "Partner not found",
      });
    }
    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch (err) {
    console.error("Error fetching partner:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided for update",
      });
    }

    const existing = await Partner.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Partner not found",
      });
    }

    // FIX: Properly handle logo path from frontend
    // Priority: 1. New uploaded file (req.file), 2. Logo from body (req.body.logo), 3. Existing logo
    let logoPath;
    if (req.file) {
      // If using multer file upload
      logoPath = req.file.path;
    } else if (req.body.logo) {
      // If frontend sends the path directly (your current approach)
      logoPath = req.body.logo;
    } else {
      // Keep existing logo
      logoPath = existing.logo;
    }

    // Parse the name and description if they're strings (for safety)
    const name =
      typeof req.body.name === "string"
        ? JSON.parse(req.body.name)
        : req.body.name || existing.name;
    const description =
      typeof req.body.description === "string"
        ? JSON.parse(req.body.description)
        : req.body.description || existing.description;

    const data = {
      name: name,
      description: description,
      logo: logoPath, // Use the properly determined logo path
      website:
        req.body.website !== undefined ? req.body.website : existing.website,
      status: req.body.status || existing.status,
      featured:
        req.body.featured !== undefined ? req.body.featured : existing.featured,
    };

    console.log("🔄 UPDATING PARTNER WITH DATA:", data); // Add logging

    const result = await Partner.updateById(req.params.id, data);
    res.status(200).json({
      success: true,
      message: "Partner updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating partner:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    await Partner.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting partner:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};
