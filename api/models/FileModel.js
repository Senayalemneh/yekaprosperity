const db = require("../config/db");

const FileModel = {
  // Create file record
  create: async (data) => {
    const {
      folder_id = null,
      filename,
      original_name,
      mime_type = 'application/octet-stream',
      size = 0,
      path,
      description = null,
      tags = null,
      created_by = null
    } = data;

    const sql = `
      INSERT INTO files 
        (folder_id, filename, original_name, mime_type, size, path, description, tags, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      folder_id,
      filename,
      original_name,
      mime_type,
      size,
      path,
      description,
      tags,
      created_by
    ]);

    return { id: result.insertId, ...data };
  },

  // Get file by ID
  getById: async (id) => {
    const sql = `
      SELECT 
        f.*,
        fl.name as folder_name
      FROM files f
      LEFT JOIN folders fl ON f.folder_id = fl.id
      WHERE f.id = ?
    `;
    
    const [rows] = await db.query(sql, [id]);
    return rows.length ? rows[0] : null;
  },

  // Get files by folder ID
  getByFolderId: async (folder_id) => {
    const sql = `
      SELECT 
        f.*,
        fl.name as folder_name
      FROM files f
      LEFT JOIN folders fl ON f.folder_id = fl.id
      WHERE f.folder_id = ?
      ORDER BY f.original_name ASC
    `;
    
    const [rows] = await db.query(sql, [folder_id]);
    return rows;
  },

  // Update file
  updateById: async (id, data) => {
    const { folder_id, description, tags, original_name } = data;
    
    const sql = `
      UPDATE files 
      SET 
        folder_id = COALESCE(?, folder_id),
        description = COALESCE(?, description),
        tags = COALESCE(?, tags),
        original_name = COALESCE(?, original_name),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await db.query(sql, [
      folder_id || null,
      description || null,
      tags || null,
      original_name || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      throw new Error("File not found");
    }
    
    return await FileModel.getById(id);
  },

  // Delete file
  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM files WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      throw new Error("File not found");
    }
    
    return result;
  },

  // Increment download count
  incrementDownloadCount: async (id) => {
    const sql = `UPDATE files SET download_count = download_count + 1 WHERE id = ?`;
    await db.query(sql, [id]);
  },

  // Search files
  search: async (query, user_id = null) => {
    const sql = `
      SELECT 
        f.*,
        fl.name as folder_name
      FROM files f
      LEFT JOIN folders fl ON f.folder_id = fl.id
      WHERE f.original_name LIKE ? OR f.description LIKE ? OR f.tags LIKE ?
      ORDER BY f.original_name ASC
    `;
    
    const [rows] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`]);
    return rows;
  },

  // Get recent files
  getRecent: async (limit = 20, user_id = null) => {
    const sql = `
      SELECT 
        f.*,
        fl.name as folder_name
      FROM files f
      LEFT JOIN folders fl ON f.folder_id = fl.id
      ORDER BY f.created_at DESC
      LIMIT ?
    `;
    
    const [rows] = await db.query(sql, [limit]);
    return rows;
  }
};

module.exports = FileModel;