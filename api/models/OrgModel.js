const db = require("../config/db");

const safeParse = (v) => {
  try { return JSON.parse(v); } catch (e) { return v; }
};

const OrgModel = {

  // Create node
  create: async (data) => {
    const { name, position, parent_id = null, image = "" } = data;

    if (!name || !position) {
      throw new Error("Name and position are required");
    }

    const sql = `
      INSERT INTO org_structures (name, position, parent_id, image)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      position,
      parent_id,
      JSON.stringify(image)
    ]);

    return { id: result.insertId, ...data };
  },

  // Get full tree or list
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM org_structures ORDER BY id ASC");

    return rows.map(r => ({
      ...r,
      image: safeParse(r.image),
    }));
  },

  // Get single node
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM org_structures WHERE id = ?", [id]);
    if (!rows.length) return null;

    return {
      ...rows[0],
      image: safeParse(rows[0].image),
    };
  },

  // Update
  updateById: async (id, data) => {
    const { name, position, parent_id, image } = data;

    const sql = `
      UPDATE org_structures
      SET 
        name = COALESCE(?, name),
        position = COALESCE(?, position),
        parent_id = COALESCE(?, parent_id),
        image = COALESCE(?, image),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [res] = await db.query(sql, [
      name || null,
      position || null,
      parent_id !== undefined ? parent_id : null,
      image ? JSON.stringify(image) : null,
      id
    ]);

    if (res.affectedRows === 0) {
      throw new Error("Node not found");
    }

    return await OrgModel.getById(id);
  },

  // Delete
  deleteById: async (id) => {
    const [res] = await db.query("DELETE FROM org_structures WHERE id = ?", [id]);
    if (res.affectedRows === 0) throw new Error("Node not found");
    return res;
  }
};

module.exports = OrgModel;
