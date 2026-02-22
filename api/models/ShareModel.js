const db = require("../config/db");
const crypto = require('crypto');

const ShareModel = {
  // Share file
  shareFile: async (data) => {
    const { file_id, user_id, permission = "view", shared_by = null, expires_at = null, download_limit = null } = data;
    
    const token = crypto.randomBytes(20).toString('hex');
    
    const sql = `
      INSERT INTO file_shares 
        (file_id, user_id, permission, token, expires_at, download_limit, shared_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [
      file_id, 
      user_id, 
      permission, 
      token, 
      expires_at, 
      download_limit, 
      shared_by
    ]);
    
    return { 
      id: result.insertId, 
      file_id, 
      user_id, 
      permission, 
      token,
      expires_at,
      download_limit,
      shared_by 
    };
  },

  // Get file share by token
  getFileShareByToken: async (token) => {
    const sql = `
      SELECT fs.*, f.* 
      FROM file_shares fs
      JOIN files f ON fs.file_id = f.id
      WHERE fs.token = ? AND fs.is_active = 1 
        AND (fs.expires_at IS NULL OR fs.expires_at > NOW())
        AND (fs.download_limit IS NULL OR fs.download_count < fs.download_limit)
    `;
    
    const [rows] = await db.query(sql, [token]);
    return rows.length ? rows[0] : null;
  },

  // Increment share download count
  incrementShareDownloadCount: async (share_id) => {
    const sql = `UPDATE file_shares SET download_count = download_count + 1 WHERE id = ?`;
    await db.query(sql, [share_id]);
  },

  // Revoke file share
  revokeFileShare: async (file_id, user_id) => {
    const sql = `UPDATE file_shares SET is_active = 0 WHERE file_id = ? AND user_id = ?`;
    const [result] = await db.query(sql, [file_id, user_id]);
    
    if (result.affectedRows === 0) {
      throw new Error("Share not found");
    }
    
    return result;
  },

  // List file shares
  listFileShares: async (file_id) => {
    const sql = `
      SELECT fs.*, u.username as shared_with_name
      FROM file_shares fs
      LEFT JOIN users u ON fs.user_id = u.id
      WHERE fs.file_id = ? AND fs.is_active = 1
    `;
    
    const [rows] = await db.query(sql, [file_id]);
    return rows;
  },

  // Share folder
  shareFolder: async (data) => {
    const { folder_id, user_id, permission = "view", shared_by = null } = data;
    
    const sql = `INSERT INTO folder_shares (folder_id, user_id, permission, shared_by) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [folder_id, user_id, permission, shared_by]);
    
    return { id: result.insertId, folder_id, user_id, permission, shared_by };
  },

  // Revoke folder share
  revokeFolderShare: async (folder_id, user_id) => {
    const [result] = await db.query("DELETE FROM folder_shares WHERE folder_id = ? AND user_id = ?", [folder_id, user_id]);
    
    if (result.affectedRows === 0) {
      throw new Error("Share not found");
    }
    
    return result;
  },

  // List folder shares
  listFolderShares: async (folder_id) => {
    const sql = `
      SELECT fs.*, u.username as shared_with_name
      FROM folder_shares fs
      LEFT JOIN users u ON fs.user_id = u.id
      WHERE fs.folder_id = ?
    `;
    
    const [rows] = await db.query(sql, [folder_id]);
    return rows;
  }
};

module.exports = ShareModel;