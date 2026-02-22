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

const AddCabinetModel = {
  create: async (data) => {
    const {
      coverImage,
      file,
      order,
      documentName = {},
      description = {},
      category = {}
    } = data;

    // Validate required fields
    if (!documentName || typeof documentName !== "object" || !documentName.en) {
      throw new Error("Document name is required and must be an object with at least English translation");
    }
    if (!file) {
      throw new Error("File is required");
    }

    const sql = `
      INSERT INTO add_cabinet (
        cover_image, file, \`order\`, document_name, description, category
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        coverImage,
        file,
        order,
        JSON.stringify(documentName),
        JSON.stringify(description),
        JSON.stringify(category)
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create cabinet document");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM add_cabinet ORDER BY `order` ASC"
      );
      return rows.map((row) => ({
        ...row,
        documentName: safeParse(row.document_name, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch cabinet documents");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid cabinet document ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM add_cabinet WHERE id = ?", [
        id,
      ]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        documentName: safeParse(row.document_name, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch cabinet document");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid cabinet document ID");
    }

    const {
      coverImage,
      file,
      order,
      documentName = {},
      description = {},
      category = {}
    } = data;

    try {
      const sql = `
        UPDATE add_cabinet
        SET 
          cover_image = COALESCE(?, cover_image),
          file = COALESCE(?, file),
          \`order\` = COALESCE(?, \`order\`),
          document_name = COALESCE(?, document_name),
          description = COALESCE(?, description),
          category = COALESCE(?, category)
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        coverImage,
        file,
        order,
        documentName ? JSON.stringify(documentName) : null,
        description ? JSON.stringify(description) : null,
        category ? JSON.stringify(category) : null,
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Cabinet document not found or no changes made");
      }

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update cabinet document");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid cabinet document ID");
    }

    try {
      const [result] = await db.query("DELETE FROM add_cabinet WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error("Cabinet document not found");
      }
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete cabinet document");
    }
  },
};

module.exports = AddCabinetModel;