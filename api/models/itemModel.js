const db = require("../config/db");

const ItemModel = {
  create: async (data) => {
    const { image, title, description, order, title_json, description_json } =
      data;

    const sql = `
      INSERT INTO items 
      (image, title, description, \`order\`, title_json, description_json) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.query(sql, [
        image || null,
        title || null,
        description || null,
        order || null,
        JSON.stringify(title_json || {}),
        JSON.stringify(description_json || {}),
      ]);

      // For mysql2 promise, result[0] is the actual result
      const insertId = Array.isArray(result)
        ? result[0].insertId
        : result.insertId;

      return { id: insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create item: " + err.message);
    }
  },

  getAll: async () => {
    try {
      const result = await db.query("SELECT * FROM items ORDER BY `order` ASC");
      const rows = Array.isArray(result) ? result[0] : result;

      return rows.map((row) => ({
        ...row,
        title_json: safeParse(row.title_json, {}),
        description_json: safeParse(row.description_json, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch items: " + err.message);
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid item ID");

    try {
      const result = await db.query("SELECT * FROM items WHERE id = ?", [id]);
      const rows = Array.isArray(result) ? result[0] : result;

      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        title_json: safeParse(row.title_json, {}),
        description_json: safeParse(row.description_json, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch item: " + err.message);
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid item ID");

    const { image, title, description, order, title_json, description_json } =
      data;

    const sql = `
      UPDATE items 
      SET 
        image = ?, 
        title = ?, 
        description = ?, 
        \`order\` = ?, 
        title_json = ?, 
        description_json = ?
      WHERE id = ?
    `;

    try {
      const result = await db.query(sql, [
        image || null,
        title || null,
        description || null,
        order || null,
        JSON.stringify(title_json || {}),
        JSON.stringify(description_json || {}),
        id,
      ]);

      const affectedRows = Array.isArray(result)
        ? result[0].affectedRows
        : result.affectedRows;

      if (affectedRows === 0) {
        throw new Error("No changes made or item not found");
      }

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update item: " + err.message);
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid item ID");

    try {
      const result = await db.query("DELETE FROM items WHERE id = ?", [id]);
      const affectedRows = Array.isArray(result)
        ? result[0].affectedRows
        : result.affectedRows;

      if (affectedRows === 0) {
        throw new Error("Item not found");
      }

      return { message: "Item deleted successfully" };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete item: " + err.message);
    }
  },
};

// Helper function for MySQL 5.7 compatibility
function safeParse(data, defaultValue) {
  if (!data) return defaultValue;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (err) {
    return defaultValue;
  }
}

module.exports = ItemModel;
