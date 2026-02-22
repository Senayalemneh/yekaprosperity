const db = require("../config/db");

// Helper function to safely parse JSON fields
const safeParse = (data, defaultValue) => {
  if (typeof data === "object") return data;
  if (!data) return defaultValue;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("JSON parse error:", err);
    return defaultValue;
  }
};

const DirectorMessageModel = {
  create: async (data) => {
    const {
      image,
      name = {},
      position = {},
      title = {},
      message = {}
    } = data;

    // Validate required fields
    if (!name || typeof name !== "object" || !name.en) {
      throw new Error("Name is required and must be an object with at least English translation");
    }

    const sql = `
      INSERT INTO director_messages (
        image, name, position, title, message
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        image,
        JSON.stringify(name),
        JSON.stringify(position),
        JSON.stringify(title),
        JSON.stringify(message)
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create director message");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM director_messages ORDER BY id DESC"
      );
      return rows.map((row) => ({
        ...row,
        name: safeParse(row.name, {}),
        position: safeParse(row.position, {}),
        title: safeParse(row.title, {}),
        message: safeParse(row.message, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch director messages");
    }
  },

  getById: async (id) => {
    // Parse and validate ID
    const messageId = parseInt(id);
    if (!messageId || isNaN(messageId)) {
      throw new Error("Invalid director message ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM director_messages WHERE id = ?", [messageId]);
      
      if (!rows || rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        ...row,
        name: safeParse(row.name, {}),
        position: safeParse(row.position, {}),
        title: safeParse(row.title, {}),
        message: safeParse(row.message, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch director message");
    }
  },

  updateById: async (id, data) => {
    // Parse and validate ID
    const messageId = parseInt(id);
    if (!messageId || isNaN(messageId)) {
      throw new Error("Invalid director message ID");
    }

    const {
      image,
      name = {},
      position = {},
      title = {},
      message = {}
    } = data;

    try {
      // First check if the record exists
      const [existingRows] = await db.query("SELECT id FROM director_messages WHERE id = ?", [messageId]);
      
      if (!existingRows || existingRows.length === 0) {
        throw new Error("Director message not found");
      }

      const sql = `
        UPDATE director_messages 
        SET image = ?, name = ?, position = ?, title = ?, message = ?
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        image,
        JSON.stringify(name),
        JSON.stringify(position),
        JSON.stringify(title),
        JSON.stringify(message),
        messageId
      ]);

      return { id: messageId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update director message");
    }
  },

  deleteById: async (id) => {
    // Parse and validate ID
    const messageId = parseInt(id);
    if (!messageId || isNaN(messageId)) {
      throw new Error("Invalid director message ID");
    }

    try {
      const [result] = await db.query("DELETE FROM director_messages WHERE id = ?", [messageId]);
      
      if (result.affectedRows === 0) {
        throw new Error("Director message not found");
      }
      
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete director message");
    }
  },
};

module.exports = DirectorMessageModel;