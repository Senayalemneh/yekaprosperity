const db = require("../config/db");

// JS-based UUID generator
const generateId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

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

const ResourceModel = {
  create: async (data) => {
    const {
      name = {},
      description = {},
      owner,
      resourcefile,
      coverpage,
      category = {}
    } = data;

    // Validate required fields
    if (!name || typeof name !== "object" || !name.en) {
      throw new Error("Name is required with at least English translation");
    }
    if (!resourcefile) {
      throw new Error("Resource file is required");
    }

    const id = generateId();
    const sql = `
      INSERT INTO resourcefiles (
        id, name, description, owner, resourcefile, coverpage, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await db.query(sql, [
        id,
        JSON.stringify(name),
        JSON.stringify(description),
        owner,
        resourcefile,
        coverpage,
        JSON.stringify(category)
      ]);

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create resource");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT id, name, description, owner, resourcefile, coverpage, category, created_at, updated_at
        FROM resourcefiles
        ORDER BY created_at DESC
      `);

      return rows.map((row) => ({
        ...row,
        name: safeParse(row.name, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch resources");
    }
  },

  getById: async (id) => {
    if (!id) throw new Error("Invalid resource ID");

    try {
      const [rows] = await db.query(
        `SELECT id, name, description, owner, resourcefile, coverpage, category, created_at, updated_at
         FROM resourcefiles
         WHERE id = ?`,
        [id]
      );

      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        name: safeParse(row.name, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch resource");
    }
  },

  updateById: async (id, data) => {
    if (!id) throw new Error("Invalid resource ID");

    const { name, description, owner, resourcefile, coverpage, category } = data;

    try {
      const sql = `
        UPDATE resourcefiles
        SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          owner = COALESCE(?, owner),
          resourcefile = COALESCE(?, resourcefile),
          coverpage = COALESCE(?, coverpage),
          category = COALESCE(?, category)
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        name ? JSON.stringify(name) : null,
        description ? JSON.stringify(description) : null,
        owner,
        resourcefile,
        coverpage,
        category ? JSON.stringify(category) : null,
        id
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Resource not found or no changes made");
      }

      return await ResourceModel.getById(id);
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update resource");
    }
  },

  deleteById: async (id) => {
    if (!id) throw new Error("Invalid resource ID");

    try {
      const resource = await ResourceModel.getById(id);
      if (!resource) throw new Error("Resource not found");

      const [result] = await db.query("DELETE FROM resourcefiles WHERE id = ?", [id]);
      if (result.affectedRows === 0) throw new Error("Resource not found");

      return resource;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete resource");
    }
  },

  getByCategory: async (category) => {
    if (!category) throw new Error("Category is required");

    try {
      // MySQL 5.7: use LIKE on JSON text
      const [rows] = await db.query(
        `SELECT id, name, description, owner, resourcefile, coverpage, category, created_at, updated_at
         FROM resourcefiles
         WHERE category LIKE ?
         ORDER BY created_at DESC`,
        [`%${category}%`]
      );

      return rows.map((row) => ({
        ...row,
        name: safeParse(row.name, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch resources by category");
    }
  }
};

module.exports = ResourceModel;
