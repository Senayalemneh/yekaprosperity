const Contact = require("../models/ContactModel");
const { sendContactConfirmation } = require("../services/emailService");

exports.createContact = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userName) {
      return res.status(400).json({
        success: false,
        error: "User name is required",
      });
    }
    
    if (!req.body.contactInfo) {
      return res.status(400).json({
        success: false,
        error: "Email or phone is required",
      });
    }
    
    if (!req.body.message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const data = {
      userName: req.body.userName,
      contactInfo: req.body.contactInfo,
      message: req.body.message,
      evidence: req.file ? req.file.path : null
    };

    const result = await Contact.create(data);
    
    // Send confirmation email if contactInfo is an email
    if (data.contactInfo.includes('@')) {
      await sendContactConfirmation(data.contactInfo, data.userName);
    }

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: result,
    });
  } catch (err) {
    console.error("Error creating contact submission:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const status = req.query.status; // optional filter
    const contacts = await Contact.getAll(status);
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    console.error("Error fetching contact submissions:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.getById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact submission not found",
      });
    }
    
    // Mark as read when fetched individually
    if (contact.status === 'unread') {
      await Contact.updateStatus(contact.id, 'read');
      contact.status = 'read';
    }
    
    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    console.error("Error fetching contact submission:", err);
    
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

exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }
    
    const result = await Contact.updateStatus(req.params.id, status);
    
    res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating contact status:", err);
    
    if (err.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    }
    
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

exports.deleteContact = async (req, res) => {
  try {
    await Contact.deleteById(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting contact submission:", err);
    
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