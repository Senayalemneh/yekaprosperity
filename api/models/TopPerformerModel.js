const db = require("../config/db");

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

const TopPerformerModel = {
  create: async (data) => {
    const {
      name = {},
      position = {},
      image,
      result: performanceResult,
      performance_period = 'monthly',
      status = 'active'
    } = data;

    if (!name || typeof name !== "object" || !name.en)
      throw new Error("Name must include at least English translation");

    if (!position || typeof position !== "object" || !position.en)
      throw new Error("Position must include at least English translation");

    if (!image) throw new Error("Image is required");

    if (typeof performanceResult !== "number" || performanceResult < 0)
      throw new Error("Valid positive result is required");

    if (!['monthly', 'quarterly', 'half-yearly', 'yearly'].includes(performance_period))
      throw new Error("Invalid performance period");

    if (!['active', 'archived'].includes(status))
      throw new Error("Invalid status");

    const sql = `
      INSERT INTO top_performers (
        name, position, image, result, performance_period, status, start_date, end_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const now = new Date();
      let startDate, endDate;

      if (performance_period === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      } else if (performance_period === 'quarterly') {
        const q = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), q * 3, 1);
        endDate = new Date(now.getFullYear(), (q + 1) * 3, 0);
      } else if (performance_period === 'half-yearly') {
        const half = Math.floor(now.getMonth() / 6);
        startDate = new Date(now.getFullYear(), half * 6, 1);
        endDate = new Date(now.getFullYear(), (half + 1) * 6, 0);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
      }

      const [dbResult] = await db.query(sql, [
        JSON.stringify(name),
        JSON.stringify(position),
        image,
        performanceResult,
        performance_period,
        status,
        startDate,
        endDate
      ]);

      return {
        id: dbResult.insertId,
        ...data,
        start_date: startDate,
        end_date: endDate,
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to create top performer");
    }
  },

  getAll: async (status = 'active', period = null) => {
    try {
      let query = "SELECT * FROM top_performers";
      const params = [];

      if (status) {
        query += " WHERE status = ?";
        params.push(status);
      }
      if (period) {
        query += status ? " AND performance_period = ?" : " WHERE performance_period = ?";
        params.push(period);
      }

      query += " ORDER BY end_date DESC, result DESC";

      const [rows] = await db.query(query, params);
      return rows.map(row => ({
        ...row,
        name: safeParse(row.name, {}),
        position: safeParse(row.position, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch top performers");
    }
  },

  getById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid performer ID");

    try {
      const [rows] = await db.query("SELECT * FROM top_performers WHERE id = ?", [id]);
      if (!rows.length) return null;

      const row = rows[0];
      return {
        ...row,
        name: safeParse(row.name, {}),
        position: safeParse(row.position, {}),
      };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch performer");
    }
  },

  updateById: async (id, data) => {
    if (!id || isNaN(id)) throw new Error("Invalid performer ID");

    const { name, position, image, result, performance_period, status } = data;

    try {
      const sql = `
        UPDATE top_performers
        SET 
          name = COALESCE(?, name),
          position = COALESCE(?, position),
          image = COALESCE(?, image),
          result = COALESCE(?, result),
          performance_period = COALESCE(?, performance_period),
          status = COALESCE(?, status)
        WHERE id = ?
      `;

      const [res] = await db.query(sql, [
        name ? JSON.stringify(name) : null,
        position ? JSON.stringify(position) : null,
        image,
        result,
        performance_period,
        status,
        id,
      ]);

      if (res.affectedRows === 0)
        throw new Error("Top performer not found or no update made");

      return { id, ...data };
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to update performer");
    }
  },

  deleteById: async (id) => {
    if (!id || isNaN(id)) throw new Error("Invalid performer ID");

    try {
      const [res] = await db.query("DELETE FROM top_performers WHERE id = ?", [id]);
      if (res.affectedRows === 0)
        throw new Error("Top performer not found");

      return res;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to delete performer");
    }
  },

  getPerformanceReport: async (periodType, year = null) => {
    if (!['monthly', 'quarterly', 'half-yearly', 'yearly'].includes(periodType))
      throw new Error("Invalid period type");

    try {
      let query = `
        SELECT 
          performance_period,
          YEAR(start_date) AS year,
          COUNT(*) AS total_performers,
          AVG(result) AS average_result,
          MAX(result) AS max_result,
          MIN(result) AS min_result
        FROM top_performers
        WHERE performance_period = ?
      `;
      const params = [periodType];

      if (year) {
        query += " AND YEAR(start_date) = ?";
        params.push(year);
      }

      query += " GROUP BY performance_period, YEAR(start_date) ORDER BY YEAR(start_date) DESC";

      const [rows] = await db.query(query, params);
      return rows;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to generate performance report");
    }
  },

  getTopPerformersByPeriod: async (periodType, limit = 10) => {
    if (!['monthly', 'quarterly', 'half-yearly', 'yearly'].includes(periodType))
      throw new Error("Invalid period type");

    try {
      const query = `
        SELECT * FROM top_performers
        WHERE performance_period = ? AND status = 'active'
        ORDER BY result DESC
        LIMIT ?
      `;
      const [rows] = await db.query(query, [periodType, limit]);
      return rows.map(row => ({
        ...row,
        name: safeParse(row.name, {}),
        position: safeParse(row.position, {}),
      }));
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to fetch top performers");
    }
  },

  archivePastPerformers: async () => {
    try {
      const [res] = await db.query(`
        UPDATE top_performers
        SET status = 'archived'
        WHERE end_date < CURDATE() AND status = 'active'
      `);
      return res.affectedRows;
    } catch (err) {
      console.error("Database error:", err);
      throw new Error("Failed to archive past performers");
    }
  }
};

module.exports = TopPerformerModel;
