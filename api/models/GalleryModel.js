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

const GalleryModel = {
  create: async (data) => {
    const {
      title = {},
      description = {},
      images = [],
      order = 0,
      category = "general"
    } = data;

    // Validation
    if (!title || typeof title !== "object" || !title.en) {
      throw new Error(
        "Title is required and must be an object with at least English translation"
      );
    }

    const sql = `
      INSERT INTO galleries (
        title, description, images, \`order\`, category
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        JSON.stringify(title),
        JSON.stringify(description),
        JSON.stringify(images),
        order,
        category
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create gallery item");
    }
  },

  getAll: async (category = null) => {
    try {
      let query = "SELECT * FROM galleries";
      const params = [];

      if (category) {
        query += " WHERE category = ?";
        params.push(category);
      }

      query += " ORDER BY `order` ASC, id DESC";

      const [rows] = await db.query(query, params);

      return rows.map((row) => ({
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        images: safeParse(row.images, [])
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch gallery items");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid gallery item ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM galleries WHERE id = ?", [id]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        images: safeParse(row.images, [])
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch gallery item");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid gallery item ID");
    }

    const { title, description, images, order, category } = data;

    try {
      const sql = `
        UPDATE galleries
        SET 
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          images = COALESCE(?, images),
          \`order\` = COALESCE(?, \`order\`),
          category = COALESCE(?, category),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        title ? JSON.stringify(title) : null,
        description ? JSON.stringify(description) : null,
        images ? JSON.stringify(images) : null,
        order,
        category,
        id
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Gallery item not found or no changes made");
      }

      return await GalleryModel.getById(id);
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update gallery item");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid gallery item ID");
    }

    try {
      const [result] = await db.query("DELETE FROM galleries WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error("Gallery item not found");
      }
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete gallery item");
    }
  }
};

module.exports = GalleryModel;
