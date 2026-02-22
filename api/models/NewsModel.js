const db = require("../config/db");

// Helper function to safely parse JSON strings
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

// Simple UUID generator (compatible with MySQL 5.7)
const generateId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const NewsModel = {
  create: async (data) => {
    const {
      coverImage,
      additionalImages = [],
      postedBy,
      status = "published",
      title = {},
      description = {},
      category = {},
      publishedDate = new Date()
    } = data;

    if (!title || typeof title !== "object" || !title.en) {
      throw new Error("Title is required with at least English translation");
    }

    const sql = `
      INSERT INTO news (
        id, cover_image, additional_images, posted_by, status,
        title, description, category, published_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const id = generateId();
      const [result] = await db.query(sql, [
        id,
        coverImage,
        JSON.stringify(additionalImages),
        postedBy,
        status,
        JSON.stringify(title),
        JSON.stringify(description),
        JSON.stringify(category),
        publishedDate
      ]);

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create news");
    }
  },

  getAll: async (status = null) => {
    try {
      let query = `
        SELECT id, cover_image, additional_images, posted_by,
               status, title, description, category, published_date,
               created_at, updated_at
        FROM news
      `;
      const params = [];

      if (status) {
        query += " WHERE status = ? ";
        params.push(status);
      }

      query += " ORDER BY published_date DESC";

      const [rows] = await db.query(query, params);

      return rows.map((row) => ({
        ...row,
        additionalImages: safeParse(row.additional_images, []),
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {})
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch news");
    }
  },

  getById: async (id) => {
    if (!id) throw new Error("Invalid news ID");

    try {
      const [rows] = await db.query(
        `
        SELECT id, cover_image, additional_images, posted_by,
               status, title, description, category, published_date,
               created_at, updated_at
        FROM news WHERE id = ?
        `,
        [id]
      );

      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        additionalImages: safeParse(row.additional_images, []),
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {})
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch news");
    }
  },

  updateById: async (id, data) => {
    if (!id) throw new Error("Invalid news ID");

    const {
      coverImage,
      additionalImages,
      postedBy,
      status,
      title,
      description,
      category,
      publishedDate
    } = data;

    try {
      const sql = `
        UPDATE news
        SET 
          cover_image = COALESCE(?, cover_image),
          additional_images = COALESCE(?, additional_images),
          posted_by = COALESCE(?, posted_by),
          status = COALESCE(?, status),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          published_date = COALESCE(?, published_date),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        coverImage,
        additionalImages ? JSON.stringify(additionalImages) : null,
        postedBy,
        status,
        title ? JSON.stringify(title) : null,
        description ? JSON.stringify(description) : null,
        category ? JSON.stringify(category) : null,
        publishedDate,
        id
      ]);

      if (result.affectedRows === 0) {
        throw new Error("News not found or no changes made");
      }

      return await NewsModel.getById(id);
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update news");
    }
  },

  updateStatus: async (id, status) => {
    if (!id || !["published", "unpublished"].includes(status)) {
      throw new Error("Invalid parameters");
    }

    try {
      const [result] = await db.query(
        "UPDATE news SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error("News not found");
      }

      return await NewsModel.getById(id);
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update news status");
    }
  },

  deleteById: async (id) => {
    if (!id) throw new Error("Invalid news ID");

    try {
      const newsItem = await NewsModel.getById(id);
      if (!newsItem) {
        throw new Error("News not found");
      }

      const [result] = await db.query("DELETE FROM news WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        throw new Error("News not found");
      }

      return newsItem;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete news");
    }
  },

  getByCategory: async (category, status = "published") => {
    if (!category) {
      throw new Error("Category is required");
    }

    try {
      const [rows] = await db.query(
        `
        SELECT id, cover_image, additional_images, posted_by,
               status, title, description, category, published_date,
               created_at, updated_at
        FROM news
        WHERE status = ? AND category LIKE ?
        ORDER BY published_date DESC
        `,
        [status, `%${category}%`]
      );

      return rows.map((row) => ({
        ...row,
        additionalImages: safeParse(row.additional_images, []),
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {})
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch news by category");
    }
  }
};

module.exports = NewsModel;
