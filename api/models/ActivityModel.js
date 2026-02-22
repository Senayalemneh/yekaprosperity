const db = require("../config/db");

const ActivityModel = {
  // Log activity
  log: async (data) => {
    const { user_id, action, resource_type, resource_id, details = null, ip_address = null } = data;
    
    const sql = `
      INSERT INTO dms_activities 
        (user_id, action, resource_type, resource_id, details, ip_address) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [user_id, action, resource_type, resource_id, details, ip_address]);
    return result.insertId;
  },

  // Get activities
  getActivities: async (limit = 50, offset = 0) => {
    const sql = `
      SELECT 
        a.*,
        u.username as user_name
      FROM dms_activities a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await db.query(sql, [limit, offset]);
    return rows;
  },

  // Get activities by user
  getActivitiesByUser: async (user_id, limit = 50) => {
    const sql = `
      SELECT * FROM dms_activities 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const [rows] = await db.query(sql, [user_id, limit]);
    return rows;
  }
};

module.exports = ActivityModel;