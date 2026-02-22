const db = require("../config/db");

// Helper function to safely parse JSON
const safeParse = (data, defaultValue) => {
  if (typeof data === "object") return data;
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const QuickMessageModel = {
  create: async (data) => {
    const { title = {}, content, status = "active" } = data;

    // Validate fields
    if (!title || typeof title !== "object" || !title.en)
      throw new Error("Title is required and must include English translation");
    if (!content) throw new Error("Content is required");
    if (!["active", "inactive"].includes(status))
      throw new Error("Invalid status");

    const sql = `
      INSERT INTO quick_messages (title, content, status)
      VALUES (?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        JSON.stringify(title),
        content,
        status,
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create quick message");
    }
  },

  getAll: async (status = "active") => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM quick_messages WHERE status = ? ORDER BY created_at DESC",
        [status]
      );
      return rows.map((row) => ({
        ...row,
        title: safeParse(row.title, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch quick messages");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid quick message ID");

    try {
      const [rows] = await db.query(
        "SELECT * FROM quick_messages WHERE id = ?",
        [id]
      );
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        title: safeParse(row.title, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch quick message");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid quick message ID");

    const { title, content, status } = data;

    const sql = `
      UPDATE quick_messages
      SET 
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    try {
      const [result] = await db.query(sql, [
        title ? JSON.stringify(title) : null,
        content || null,
        status || null,
        id,
      ]);

      if (result.affectedRows === 0)
        throw new Error("Quick message not found or no changes made");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update quick message");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid quick message ID");

    try {
      const [result] = await db.query(
        "DELETE FROM quick_messages WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) throw new Error("Quick message not found");
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete quick message");
    }
  },
};

module.exports = QuickMessageModel;
