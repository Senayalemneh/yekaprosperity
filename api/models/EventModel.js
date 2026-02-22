const db = require("../config/db");

// Helper function to safely parse JSON fields
const safeParse = (data, defaultValue) => {
  if (typeof data === "object") return data;
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const EventModel = {
  create: async (data) => {
    const {
      title = {},
      description = {},
      startDate,
      endDate,
      location = {},
      coverImage,
      eventProgram,
      category = {},
      status = "upcoming",
    } = data;

    // Validate required fields
    if (!title || typeof title !== "object" || !title.en)
      throw new Error(
        "Title is required and must have at least English translation"
      );
    if (!description || typeof description !== "object" || !description.en)
      throw new Error(
        "Description is required and must have at least English translation"
      );
    if (!startDate || !endDate)
      throw new Error("Start and end dates are required");
    if (!location || typeof location !== "object" || !location.en)
      throw new Error(
        "Location is required and must have at least English translation"
      );
    if (!["upcoming", "ongoing", "completed", "cancelled"].includes(status))
      throw new Error("Invalid status value");

    const sql = `
      INSERT INTO events (
        title, description, start_date, end_date, location,
        cover_image, event_program, category, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(sql, [
        JSON.stringify(title),
        JSON.stringify(description),
        startDate,
        endDate,
        JSON.stringify(location),
        coverImage || null,
        eventProgram || null,
        JSON.stringify(category),
        status,
      ]);

      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create event");
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM events ORDER BY start_date ASC"
      );
      return rows.map((row) => ({
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        location: safeParse(row.location, {}),
        category: safeParse(row.category, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch events");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid event ID");

    try {
      const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        title: safeParse(row.title, {}),
        description: safeParse(row.description, {}),
        location: safeParse(row.location, {}),
        category: safeParse(row.category, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch event");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid event ID");

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      coverImage,
      eventProgram,
      category,
      status,
    } = data;

    const sql = `
      UPDATE events
      SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        location = COALESCE(?, location),
        cover_image = COALESCE(?, cover_image),
        event_program = COALESCE(?, event_program),
        category = COALESCE(?, category),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    try {
      const [result] = await db.query(sql, [
        title ? JSON.stringify(title) : null,
        description ? JSON.stringify(description) : null,
        startDate || null,
        endDate || null,
        location ? JSON.stringify(location) : null,
        coverImage || null,
        eventProgram || null,
        category ? JSON.stringify(category) : null,
        status || null,
        id,
      ]);

      if (result.affectedRows === 0)
        throw new Error("Event not found or no changes made");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update event");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid event ID");

    try {
      const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
      if (result.affectedRows === 0) throw new Error("Event not found");
      return result;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete event");
    }
  },
};

module.exports = EventModel;
