const db = require("../config/db");

// Safe JSON parse helper
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

const TenderModel = {
  create: async (data) => {
    const {
      title = {},
      description = {},
      referenceNumber,
      openingDate,
      closingDate,
      coverImage,
      tenderDocument,
      category = {},
      status = "active",
    } = data;

    // Validation
    if (!title?.en)
      throw new Error("Title must include at least English translation");
    if (!description?.en)
      throw new Error("Description must include at least English translation");
    if (!referenceNumber) throw new Error("Reference number is required");
    if (!openingDate || !closingDate)
      throw new Error("Opening and closing dates are required");
    if (!tenderDocument) throw new Error("Tender document is required");
    if (!["active", "closed", "cancelled"].includes(status)) {
      throw new Error("Status must be 'active', 'closed', or 'cancelled'");
    }

    const sql = `
      INSERT INTO tenders (
        title, description, reference_number, opening_date, closing_date, 
        cover_image, tender_document, category, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        JSON.stringify(title),
        JSON.stringify(description),
        referenceNumber,
        openingDate,
        closingDate,
        coverImage || null,
        tenderDocument,
        JSON.stringify(category),
        status,
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create tender");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM tenders ORDER BY closing_date ASC"
      );
      return rows.map((row) => ({
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch tenders");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid tender ID");

    try {
      const [rows] = await db.query("SELECT * FROM tenders WHERE id = ?", [id]);
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
      throw new Error("Failed to fetch tender");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid tender ID");

    const {
      title,
      description,
      referenceNumber,
      openingDate,
      closingDate,
      coverImage,
      tenderDocument,
      category,
      status,
    } = data;

    const sql = `
      UPDATE tenders SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        reference_number = COALESCE(?, reference_number),
        opening_date = COALESCE(?, opening_date),
        closing_date = COALESCE(?, closing_date),
        cover_image = COALESCE(?, cover_image),
        tender_document = COALESCE(?, tender_document),
        category = COALESCE(?, category),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    try {
      const [result] = await db.query(sql, [
        title ? JSON.stringify(title) : null,
        description ? JSON.stringify(description) : null,
        referenceNumber || null,
        openingDate || null,
        closingDate || null,
        coverImage || null,
        tenderDocument || null,
        category ? JSON.stringify(category) : null,
        status || null,
        id,
      ]);

      if (result.affectedRows === 0)
        throw new Error("Tender not found or no changes made");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update tender");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid tender ID");

    try {
      const [result] = await db.query("DELETE FROM tenders WHERE id = ?", [id]);
      if (result.affectedRows === 0) throw new Error("Tender not found");
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete tender");
    }
  },
};

module.exports = TenderModel;
