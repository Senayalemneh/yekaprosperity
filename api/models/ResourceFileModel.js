const db = require("../config/db");

// Safe JSON parsing helper
const safeParse = (data, defaultValue) => {
  if (typeof data === "object" && data !== null) return data;
  if (!data) return defaultValue;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("JSON parse error:", err);
    return defaultValue;
  }
};

const ResourceFileModel = {
  // Create a new resource file record
  create: async (data) => {
    const {
      title = {},
      description = {},
      coverImage,
      file,
      category = {},
      status = "active",
    } = data;

    if (!title || typeof title !== "object" || !title.en) {
      throw new Error(
        "Title is required and must include at least an English translation"
      );
    }
    if (!description || typeof description !== "object" || !description.en) {
      throw new Error(
        "Description is required and must include at least an English translation"
      );
    }
    if (!file) {
      throw new Error("File is required");
    }
    if (!["active", "archived"].includes(status)) {
      throw new Error("Status must be either 'active' or 'archived'");
    }

    const sql = `
      INSERT INTO resource_files (
        title, description, cover_image, file, category, status
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.query(sql, [
        JSON.stringify(title),
        JSON.stringify(description),
        coverImage || null,
        file,
        JSON.stringify(category),
        status,
      ]);

      const insertId =
        result.insertId || (Array.isArray(result) ? result[0].insertId : null);

      return { id: insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create resource file");
    }
  },

  // Get all resource files by status
  getAll: async (status = "active") => {
    try {
      const rows = await db.query(
        "SELECT * FROM resource_files WHERE status = ? ORDER BY created_at DESC",
        [status]
      );

      const result = Array.isArray(rows) ? rows[0] || rows : rows;

      return result.map((row) => ({
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch resource files");
    }
  },

  // Get single resource file by ID
  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid resource file ID");

    try {
      const rows = await db.query("SELECT * FROM resource_files WHERE id = ?", [
        id,
      ]);
      const result = Array.isArray(rows) ? rows[0] || rows : rows;

      if (!result.length) return null;
      const row = result[0];

      return {
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch resource file");
    }
  },

  // Update resource file by ID
  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid resource file ID");

    const { title, description, coverImage, file, category, status } = data;

    const sql = `
      UPDATE resource_files
      SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        cover_image = COALESCE(?, cover_image),
        file = COALESCE(?, file),
        category = COALESCE(?, category),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const result = await db.query(sql, [
        title ? JSON.stringify(title) : null,
        description ? JSON.stringify(description) : null,
        coverImage || null,
        file || null,
        category ? JSON.stringify(category) : null,
        status || null,
        id,
      ]);

      const affected =
        result.affectedRows ||
        (Array.isArray(result) && result[0].affectedRows);

      if (!affected) {
        throw new Error("Resource file not found or no changes made");
      }

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update resource file");
    }
  },

  // Delete resource file by ID
  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid resource file ID");

    try {
      const result = await db.query("DELETE FROM resource_files WHERE id = ?", [
        id,
      ]);
      const affected =
        result.affectedRows ||
        (Array.isArray(result) && result[0].affectedRows);

      if (!affected) {
        throw new Error("Resource file not found");
      }

      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete resource file");
    }
  },
};

module.exports = ResourceFileModel;
