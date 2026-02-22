const db = require("../config/db");

// safeParse handles stringified JSON
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

const OfficeModel = {
  create: async (data) => {
    const {
      officelogo,
      officename = {},
      missions = {},
      vissions = {},
      values = {},
      aboutoffice = {},
      locationstring = {},
      social_links = {},
      emails = [],
      contact_numbers = [],
      specification = "",
    } = data;

    if (!officename || typeof officename !== "object") {
      throw new Error("Officename is required and must be an object");
    }

    const sql = `
      INSERT INTO office_info (
        officelogo, officename, missions, vissions, \`values\`, aboutoffice, locationstring,
        social_links, emails, contact_numbers, specification
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        officelogo || null,
        JSON.stringify(officename),
        JSON.stringify(missions),
        JSON.stringify(vissions),
        JSON.stringify(values),
        JSON.stringify(aboutoffice),
        JSON.stringify(locationstring),
        JSON.stringify(social_links),
        JSON.stringify(emails),
        JSON.stringify(contact_numbers),
        specification,
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create office record: " + err.message);
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM office_info ORDER BY created_at DESC"
      );

      return rows.map((row) => ({
        id: row.id,
        officelogo: row.officelogo,
        officename: safeParse(row.officename, {}),
        missions: safeParse(row.missions, {}),
        vissions: safeParse(row.vissions, {}),
        values: safeParse(row.values, {}),
        aboutoffice: safeParse(row.aboutoffice, {}),
        locationstring: safeParse(row.locationstring, {}),
        social_links: safeParse(row.social_links, {}),
        emails: safeParse(row.emails, []),
        contact_numbers: safeParse(row.contact_numbers, []),
        specification: row.specification,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch offices: " + err.message);
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid office ID");

    try {
      const [rows] = await db.query("SELECT * FROM office_info WHERE id = ?", [
        id,
      ]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        id: row.id,
        officelogo: row.officelogo,
        officename: safeParse(row.officename, {}),
        missions: safeParse(row.missions, {}),
        vissions: safeParse(row.vissions, {}),
        values: safeParse(row.values, {}),
        aboutoffice: safeParse(row.aboutoffice, {}),
        locationstring: safeParse(row.locationstring, {}),
        social_links: safeParse(row.social_links, {}),
        emails: safeParse(row.emails, []),
        contact_numbers: safeParse(row.contact_numbers, []),
        specification: row.specification,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch office: " + err.message);
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid office ID");

    const {
      officelogo,
      officename = {},
      missions = {},
      vissions = {},
      values = {},
      aboutoffice = {},
      locationstring = {},
      social_links = {},
      emails = [],
      contact_numbers = [],
      specification = "",
    } = data;

    try {
      const [existing] = await db.query(
        "SELECT id FROM office_info WHERE id = ?",
        [id]
      );
      if (!existing.length) throw new Error("Office not found");

      const sql = `
        UPDATE office_info
        SET 
          officelogo = ?,
          officename = ?,
          missions = ?,
          vissions = ?,
          \`values\` = ?,
          aboutoffice = ?,
          locationstring = ?,
          social_links = ?,
          emails = ?,
          contact_numbers = ?,
          specification = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.query(sql, [
        officelogo || null,
        JSON.stringify(officename),
        JSON.stringify(missions),
        JSON.stringify(vissions),
        JSON.stringify(values),
        JSON.stringify(aboutoffice),
        JSON.stringify(locationstring),
        JSON.stringify(social_links),
        JSON.stringify(emails),
        JSON.stringify(contact_numbers),
        specification,
        id,
      ]);

      if (result.affectedRows === 0)
        throw new Error("No changes made to office");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update office: " + err.message);
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid office ID");

    try {
      const [result] = await db.query("DELETE FROM office_info WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) throw new Error("Office not found");
      return { message: "Office deleted successfully" };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete office: " + err.message);
    }
  },
};

module.exports = OfficeModel;
