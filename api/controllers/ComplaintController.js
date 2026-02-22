const Complaint = require("../models/ComplaintModel");

exports.createComplaint = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "full_name",
      "gender",
      "submission_type",
      "city",
      "sub_city",
      "woreda",
      "phone_number",
      "institution_name",
      "complaint_content",
      "desired_solution",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          error: `${field.replace("_", " ")} is required`,
        });
      }
    }

    if (req.body.submission_type === "group" && !req.body.group_members) {
      return res.status(400).json({
        success: false,
        error: "Group members count is required for group submissions",
      });
    }

    const data = {
      full_name: req.body.full_name,
      age: req.body.age || null,
      gender: req.body.gender,
      submission_type: req.body.submission_type,
      group_members:
        req.body.submission_type === "group" ? req.body.group_members : null,
      city: req.body.city,
      sub_city: req.body.sub_city,
      woreda: req.body.woreda,
      house_number: req.body.house_number || null,
      phone_number: req.body.phone_number,
      email: req.body.email || null,
      physical_condition: req.body.physical_condition || null,
      institution_name: req.body.institution_name,
      complaint_content: req.body.complaint_content,
      desired_solution: req.body.desired_solution,
      evidence_files: req.files ? req.files.map((file) => file.path) : null,
      status: "pending",
    };

    const result = await Complaint.create(data);
    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: {
        ...result,
        tracking_id: result.tracking_id, // Include tracking ID in response
      },
    });
  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const status = req.query.status;
    const search = req.query.search || "";
    const complaints = await Complaint.getAll(status, search);
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.getById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }
    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    console.error("Error fetching complaint:", err);
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

exports.getComplaintByTrackingId = async (req, res) => {
  try {
    const complaint = await Complaint.getByTrackingId(req.params.trackingId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }
    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    console.error("Error fetching complaint by tracking ID:", err);
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

exports.updateComplaint = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided for update",
      });
    }

    // Get existing complaint to merge with updates
    const existing = await Complaint.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }

    const data = {
      full_name: req.body.full_name || existing.full_name,
      age: req.body.age || existing.age,
      gender: req.body.gender || existing.gender,
      submission_type: req.body.submission_type || existing.submission_type,
      group_members: req.body.group_members || existing.group_members,
      city: req.body.city || existing.city,
      sub_city: req.body.sub_city || existing.sub_city,
      woreda: req.body.woreda || existing.woreda,
      house_number: req.body.house_number || existing.house_number,
      phone_number: req.body.phone_number || existing.phone_number,
      email: req.body.email || existing.email,
      physical_condition:
        req.body.physical_condition || existing.physical_condition,
      institution_name: req.body.institution_name || existing.institution_name,
      complaint_content:
        req.body.complaint_content || existing.complaint_content,
      desired_solution: req.body.desired_solution || existing.desired_solution,
      evidence_files: req.files
        ? req.files.map((file) => file.path)
        : existing.evidence_files,
      status: req.body.status || existing.status,
      admin_response: req.body.admin_response || existing.admin_response,
    };

    const result = await Complaint.updateById(req.params.id, data);
    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating complaint:", err);
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

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const result = await Complaint.updateStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating complaint status:", err);
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

exports.updateAdminResponse = async (req, res) => {
  try {
    const { admin_response } = req.body;
    if (!admin_response) {
      return res.status(400).json({
        success: false,
        error: "Admin response is required",
      });
    }

    const result = await Complaint.updateAdminResponse(
      req.params.id,
      admin_response
    );
    res.status(200).json({
      success: true,
      message: "Admin response updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating admin response:", err);
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

exports.deleteComplaint = async (req, res) => {
  try {
    await Complaint.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting complaint:", err);
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

exports.getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Error fetching complaint stats:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};
