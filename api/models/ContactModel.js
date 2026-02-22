const db = require("../config/db");

const ContactModel = {
  create: async (data) => {
    const { userName, contactInfo, message, evidence } = data;

    // Validate required fields
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      throw new Error("User name is required");
    }
    
    if (!contactInfo || typeof contactInfo !== 'string' || contactInfo.trim() === '') {
      throw new Error("Email or phone is required");
    }
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new Error("Message is required");
    }

    const sql = `
      INSERT INTO contacts (
        user_name, contact_info, message, evidence, status
      )
      VALUES (?, ?, ?, ?, 'unread')
    `;

    try {
      const [result] = await db.query(sql, [
        userName.trim(),
        contactInfo.trim(),
        message.trim(),
        evidence || null
      ]);

      return { id: result.insertId, ...data, status: 'unread' };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create contact submission");
    }
  },

  getAll: async (status) => {
    try {
      let query = "SELECT * FROM contacts";
      const params = [];
      
      if (status) {
        query += " WHERE status = ?";
        params.push(status);
      }
      
      query += " ORDER BY created_at DESC";
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch contact submissions");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid contact submission ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM contacts WHERE id = ?", [id]);
      if (!rows.length) return null;
      return rows[0];
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch contact submission");
    }
  },

  updateStatus: async (id, status) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid contact submission ID");
    }
    
    if (!['unread', 'read', 'archived'].includes(status)) {
      throw new Error("Invalid status value");
    }

    try {
      const [result] = await db.query(
        "UPDATE contacts SET status = ? WHERE id = ?",
        [status, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error("Contact submission not found");
      }
      
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update contact submission");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid contact submission ID");
    }

    try {
      const [result] = await db.query("DELETE FROM contacts WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error("Contact submission not found");
      }
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete contact submission");
    }
  },
};

module.exports = ContactModel;
