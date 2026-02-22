const db = require("../config/db");

const FolderModel = {
  // Create folder
  create: async (data) => {
    const { name, parent_id = null, created_by = null } = data;
    
    const sql = `INSERT INTO folders (name, parent_id, created_by) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [name, parent_id, created_by]);
    
    return { id: result.insertId, name: name, parent_id: parent_id, created_by: created_by };
  },

  // Get all folders
  getAll: async (user_id = null) => {
    let sql = `
      SELECT 
        f.*,
        (SELECT COUNT(*) FROM files WHERE files.folder_id = f.id) as file_count,
        (SELECT COUNT(*) FROM folders WHERE folders.parent_id = f.id) as subfolder_count
      FROM folders f
      ORDER BY f.name ASC
    `;
    
    const [rows] = await db.query(sql);
    return rows;
  },

  // Get folder by ID
  getById: async (id) => {
    const sql = `
      SELECT 
        f.*,
        (SELECT COUNT(*) FROM files WHERE files.folder_id = f.id) as file_count,
        (SELECT COUNT(*) FROM folders WHERE folders.parent_id = f.id) as subfolder_count
      FROM folders f 
      WHERE f.id = ?
    `;
    
    const [rows] = await db.query(sql, [id]);
    return rows.length ? rows[0] : null;
  },

  // Update folder
  updateById: async (id, data) => {
    const { name, parent_id } = data;
    
    const sql = `
      UPDATE folders 
      SET name = COALESCE(?, name), 
          parent_id = COALESCE(?, parent_id),
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    const [result] = await db.query(sql, [name, parent_id, id]);
    
    if (result.affectedRows === 0) {
      throw new Error("Folder not found");
    }
    
    return await FolderModel.getById(id);
  },

  // Delete folder
  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM folders WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      throw new Error("Folder not found");
    }
    
    return result;
  },

  // Get subfolders
  getSubfolders: async (parent_id) => {
    const sql = `
      SELECT 
        f.*,
        (SELECT COUNT(*) FROM files WHERE files.folder_id = f.id) as file_count
      FROM folders f 
      WHERE f.parent_id = ? 
      ORDER BY f.name ASC
    `;
    
    const [rows] = await db.query(sql, [parent_id]);
    return rows;
  },

  // Build folder tree (recursive in code, not SQL)
  buildTree: (folders, parentId = null) => {
    const tree = [];
    
    folders.forEach(folder => {
      if (folder.parent_id == parentId) {
        const children = FolderModel.buildTree(folders, folder.id);
        if (children.length > 0) {
          folder.children = children;
        }
        tree.push(folder);
      }
    });
    
    return tree;
  },

  // Search folders
  search: async (query, user_id = null) => {
    const sql = `SELECT * FROM folders WHERE name LIKE ? ORDER BY name ASC`;
    const [rows] = await db.query(sql, [`%${query}%`]);
    return rows;
  }
};

module.exports = FolderModel;