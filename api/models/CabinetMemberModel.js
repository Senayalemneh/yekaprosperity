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

const CabinetMemberModel = {
  create: async (data) => {
    const {
      image,
      fullName = {},
      position = {},
      positionLevel,
      order,
      message = {}
    } = data;

    // Validate required fields
    if (!fullName || typeof fullName !== "object" || !fullName.en) {
      throw new Error("Full name is required and must be an object with at least English translation");
    }

    if (!positionLevel || !['Federal Level', 'Bureau Level', 'Subcity Level', 'Office Level', 'District Level'].includes(positionLevel)) {
      throw new Error("Valid position level is required (Federal Level, Bureau Level, Subcity Level, Office Level, District Level)");
    }

    const sql = `
      INSERT INTO cabinet_members (
        image, full_name, position, position_level, \`order\`, message
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        image,
        JSON.stringify(fullName),
        JSON.stringify(position),
        positionLevel,
        order || 0,
        JSON.stringify(message)
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create cabinet member");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM cabinet_members ORDER BY \`order\` ASC, id DESC"
      );
      return rows.map((row) => ({
        ...row,
        fullName: safeParse(row.full_name, {}),
        position: safeParse(row.position, {}),
        message: safeParse(row.message, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch cabinet members");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid cabinet member ID");
    }

    try {
      const [rows] = await db.query("SELECT * FROM cabinet_members WHERE id = ?", [
        id,
      ]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        fullName: safeParse(row.full_name, {}),
        position: safeParse(row.position, {}),
        message: safeParse(row.message, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch cabinet member");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid cabinet member ID");
    }

    const {
      image,
      fullName = {},
      position = {},
      positionLevel,
      order,
      message = {}
    } = data;

    try {
      const sql = `
        UPDATE cabinet_members
        SET 
          image = COALESCE(?, image),
          full_name = COALESCE(?, full_name),
          position = COALESCE(?, position),
          position_level = COALESCE(?, position_level),
          \`order\` = COALESCE(?, \`order\`),
          message = COALESCE(?, message)
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        image,
        fullName ? JSON.stringify(fullName) : null,
        position ? JSON.stringify(position) : null,
        positionLevel,
        order,
        message ? JSON.stringify(message) : null,
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Cabinet member not found or no changes made");
      }

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update cabinet member");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid cabinet member ID");
    }

    try {
      const [result] = await db.query("DELETE FROM cabinet_members WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error("Cabinet member not found");
      }
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete cabinet member");
    }
  },
};

module.exports = CabinetMemberModel;