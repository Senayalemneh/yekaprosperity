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

const VacancyModel = {
  create: async (data) => {
    const {
      title = {},
      description = {},
      order,
      coverimage,
      file,
      category = {},
      status = "open",
    } = data;

    // Validate required fields
    if (!title || typeof title !== "object" || !title.en) {
      throw new Error(
        "Title is required and must be an object with at least English translation"
      );
    }
    if (!description || typeof description !== "object" || !description.en) {
      throw new Error(
        "Description is required and must be an object with at least English translation"
      );
    }
    if (!category || typeof category !== "object" || !category.en) {
      throw new Error(
        "Category is required and must be an object with at least English translation"
      );
    }
    if (!["open", "closed"].includes(status)) {
      throw new Error("Status must be either 'open' or 'closed'");
    }

    const sql = `
      INSERT INTO vacancies (
        title, description, \`order\`, coverimage, file, category, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        JSON.stringify(title),
        JSON.stringify(description),
        order,
        coverimage,
        file,
        JSON.stringify(category),
        status,
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create vacancy");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM vacancies ORDER BY `order` ASC"
      );
      return rows.map((row) => ({
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch vacancies");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid vacancy ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM vacancies WHERE id = ?", [
        id,
      ]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch vacancy");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid vacancy ID");
    }

    const { title, description, order, coverimage, file, category, status } =
      data;

    try {
      const sql = `
        UPDATE vacancies
        SET 
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          \`order\` = COALESCE(?, \`order\`),
          coverimage = COALESCE(?, coverimage),
          file = COALESCE(?, file),
          category = COALESCE(?, category),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        title ? JSON.stringify(title) : null,
        description ? JSON.stringify(description) : null,
        order,
        coverimage,
        file,
        category ? JSON.stringify(category) : null,
        status,
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Vacancy not found or no changes made");
      }

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update vacancy");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid vacancy ID");
    }

    try {
      const [result] = await db.query("DELETE FROM vacancies WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error("Vacancy not found");
      }
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete vacancy");
    }
  },
};

module.exports = VacancyModel;
