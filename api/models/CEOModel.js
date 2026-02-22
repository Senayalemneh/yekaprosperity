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

const CEOModel = {
  create: async (data) => {
    const {
      image,
      fullName = {},
      position = {},
      socialMediaLinks = [],
      order,
      message = {},
      workExperience = {},
      educationalQualification = {}
    } = data;

    if (!fullName || typeof fullName !== "object" || !fullName.en) {
      throw new Error("Full name is required and must be an object with at least English translation");
    }

    const sql = `
      INSERT INTO ceos (
        image, full_name, position, social_media_links, \`order\`, message, 
        work_experience, educational_qualification
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        image,
        JSON.stringify(fullName),
        JSON.stringify(position),
        JSON.stringify(socialMediaLinks),
        order || 0,
        JSON.stringify(message),
        JSON.stringify(workExperience),
        JSON.stringify(educationalQualification)
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create CEO");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM ceos ORDER BY `order` ASC, id DESC"
      );
      return rows.map((row) => ({
        ...row,
        fullName: safeParse(row.full_name, {}),
        position: safeParse(row.position, {}),
        socialMediaLinks: safeParse(row.social_media_links, []),
        message: safeParse(row.message, {}),
        workExperience: safeParse(row.work_experience, {}),
        educationalQualification: safeParse(row.educational_qualification, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch CEOs");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid CEO ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM ceos WHERE id = ?", [id]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        fullName: safeParse(row.full_name, {}),
        position: safeParse(row.position, {}),
        socialMediaLinks: safeParse(row.social_media_links, []),
        message: safeParse(row.message, {}),
        workExperience: safeParse(row.work_experience, {}),
        educationalQualification: safeParse(row.educational_qualification, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch CEO");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid CEO ID");
    }

    const {
      image,
      fullName = {},
      position = {},
      socialMediaLinks = [],
      order,
      message = {},
      workExperience = {},
      educationalQualification = {}
    } = data;

    try {
      const sql = `
        UPDATE ceos
        SET 
          image = COALESCE(?, image),
          full_name = COALESCE(?, full_name),
          position = COALESCE(?, position),
          social_media_links = COALESCE(?, social_media_links),
          \`order\` = COALESCE(?, \`order\`),
          message = COALESCE(?, message),
          work_experience = COALESCE(?, work_experience),
          educational_qualification = COALESCE(?, educational_qualification)
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        image,
        JSON.stringify(fullName),
        JSON.stringify(position),
        JSON.stringify(socialMediaLinks),
        order,
        JSON.stringify(message),
        JSON.stringify(workExperience),
        JSON.stringify(educationalQualification),
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("CEO not found or no changes made");
      }

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update CEO");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid CEO ID");
    }

    try {
      const [result] = await db.query("DELETE FROM ceos WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error("CEO not found");
      }
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete CEO");
    }
  },
};

module.exports = CEOModel;
