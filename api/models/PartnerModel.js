const db = require("../config/db");

// Safe JSON parser for MySQL 5.7 text fields
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

const PartnerModel = {
  // Create a new partner
  create: async (data) => {
    const {
      name = {},
      description = {},
      logo,
      website,
      status = "published",
      featured = false,
    } = data;

    if (!name || typeof name !== "object" || !name.en) {
      throw new Error(
        "Name is required and must include at least an English translation"
      );
    }
    if (!description || typeof description !== "object" || !description.en) {
      throw new Error(
        "Description is required and must include at least an English translation"
      );
    }
    if (!logo) {
      throw new Error("Logo is required");
    }
    if (!["published", "unpublished"].includes(status)) {
      throw new Error("Status must be either 'published' or 'unpublished'");
    }
    if (typeof featured !== "boolean") {
      throw new Error("Featured must be a boolean");
    }

    const sql = `
      INSERT INTO partners (
        name, description, logo, website, status, featured
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.query(sql, [
        JSON.stringify(name),
        JSON.stringify(description),
        logo,
        website || null,
        status,
        featured ? 1 : 0,
      ]);

      const insertId =
        result.insertId || (Array.isArray(result) ? result[0].insertId : null);

      return { id: insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create partner");
    }
  },

  // Fetch all partners (optional filters)
  getAll: async (status = null, featured = null) => {
    try {
      let sql = "SELECT * FROM partners";
      const params = [];
      const conditions = [];

      if (status) {
        conditions.push("status = ?");
        params.push(status);
      }

      if (featured !== null) {
        conditions.push("featured = ?");
        params.push(featured ? 1 : 0);
      }

      if (conditions.length) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      }

      sql += " ORDER BY created_at DESC";

      const rows = await db.query(sql, params);
      const result = Array.isArray(rows) ? rows[0] || rows : rows;

      return result.map((row) => ({
        ...row,
        name: safeParse(row.name, {}),
        description: safeParse(row.description, {}),
        featured: Boolean(row.featured),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch partners");
    }
  },

  // Fetch partner by ID
  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid partner ID");

    try {
      const rows = await db.query("SELECT * FROM partners WHERE id = ?", [id]);
      const result = Array.isArray(rows) ? rows[0] || rows : rows;

      if (!result.length) return null;
      const row = result[0];

      return {
        ...row,
        name: safeParse(row.name, {}),
        description: safeParse(row.description, {}),
        featured: Boolean(row.featured),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch partner");
    }
  },

  // Update partner by ID
  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid partner ID");

    const { name, description, logo, website, status, featured } = data;

    const sql = `
      UPDATE partners
      SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        logo = COALESCE(?, logo),
        website = COALESCE(?, website),
        status = COALESCE(?, status),
        featured = COALESCE(?, featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const result = await db.query(sql, [
        name ? JSON.stringify(name) : null,
        description ? JSON.stringify(description) : null,
        logo || null,
        website || null,
        status || null,
        featured !== undefined ? (featured ? 1 : 0) : null,
        id,
      ]);

      const affected =
        result.affectedRows ||
        (Array.isArray(result) && result[0].affectedRows);

      if (!affected) throw new Error("Partner not found or no changes made");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update partner");
    }
  },

  // Delete partner by ID
  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid partner ID");

    try {
      const result = await db.query("DELETE FROM partners WHERE id = ?", [id]);
      const affected =
        result.affectedRows ||
        (Array.isArray(result) && result[0].affectedRows);

      if (!affected) throw new Error("Partner not found");

      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete partner");
    }
  },

  // Get only featured and published partners
  getFeatured: async () => {
    try {
      const rows = await db.query(
        "SELECT * FROM partners WHERE featured = 1 AND status = 'published' ORDER BY created_at DESC"
      );

      const result = Array.isArray(rows) ? rows[0] || rows : rows;

      return result.map((row) => ({
        ...row,
        name: safeParse(row.name, {}),
        description: safeParse(row.description, {}),
        featured: Boolean(row.featured),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch featured partners");
    }
  },
};

module.exports = PartnerModel;
