const db = require("../config/db");

exports.logActivity = async (activityData) => {
  const {
    action,
    entityType,
    entityId,
    userId,
    metadata = {}
  } = activityData;

  const sql = `
    INSERT INTO activity_logs (
      action, entity_type, entity_id, user_id, metadata
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [
      action,
      entityType,
      entityId,
      userId,
      JSON.stringify(metadata)
    ]);
  } catch (err) {
    console.error('Error logging activity:', err);
    // Don't throw error as this shouldn't fail the main operation
  }
};

exports.getActivityLogs = async (filters = {}) => {
  let sql = `SELECT * FROM activity_logs WHERE 1=1`;
  const values = [];

  if (filters.userId) {
    sql += ` AND user_id = ?`;
    values.push(filters.userId);
  }

  if (filters.entityType) {
    sql += ` AND entity_type = ?`;
    values.push(filters.entityType);
  }

  if (filters.entityId) {
    sql += ` AND entity_id = ?`;
    values.push(filters.entityId);
  }

  sql += ` ORDER BY created_at DESC`;

  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (err) {
    console.error('Error retrieving activity logs:', err);
    throw err;
  }
};
