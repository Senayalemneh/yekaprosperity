const db = require("../config/db");

const FavoriteModel = {
  // Add favorite
  add: async (user_id, resource_type, resource_id) => {
    const sql = `INSERT IGNORE INTO dms_favorites (user_id, resource_type, resource_id) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [user_id, resource_type, resource_id]);
    return result.insertId;
  },

  // Remove favorite
  remove: async (user_id, resource_type, resource_id) => {
    const sql = `DELETE FROM dms_favorites WHERE user_id = ? AND resource_type = ? AND resource_id = ?`;
    const [result] = await db.query(sql, [user_id, resource_type, resource_id]);
    return result.affectedRows > 0;
  },

  // Get user favorites
  getByUser: async (user_id, resource_type = null) => {
    let sql = `
      SELECT 
        f.*,
        CASE 
          WHEN fav.resource_type = 'file' THEN files.original_name
          WHEN fav.resource_type = 'folder' THEN folders.name
        END as name,
        CASE 
          WHEN fav.resource_type = 'file' THEN files.mime_type
          ELSE 'folder'
        END as type
      FROM dms_favorites fav
      LEFT JOIN files ON (fav.resource_type = 'file' AND fav.resource_id = files.id)
      LEFT JOIN folders ON (fav.resource_type = 'folder' AND fav.resource_id = folders.id)
      WHERE fav.user_id = ?
    `;
    
    const params = [user_id];
    
    if (resource_type) {
      sql += " AND fav.resource_type = ?";
      params.push(resource_type);
    }
    
    sql += " ORDER BY fav.created_at DESC";
    
    const [rows] = await db.query(sql, params);
    return rows;
  },

  // Check if resource is favorited
  isFavorited: async (user_id, resource_type, resource_id) => {
    const sql = `SELECT id FROM dms_favorites WHERE user_id = ? AND resource_type = ? AND resource_id = ?`;
    const [rows] = await db.query(sql, [user_id, resource_type, resource_id]);
    return rows.length > 0;
  }
};

module.exports = FavoriteModel;