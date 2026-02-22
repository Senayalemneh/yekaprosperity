const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
  create: async (data) => {
    const { full_name, user_name, password, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO userss (full_name, user_name, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [full_name, user_name, hashedPassword, role]);
    return result;
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT id, full_name, user_name, role FROM userss ORDER BY id ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT id, full_name, user_name, role FROM userss WHERE id = ?', [id]);
    return rows[0];
  },

  updateById: async (id, data) => {
    const { full_name, user_name, password, role } = data;

    let sql, values;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = 'UPDATE userss SET full_name = ?, user_name = ?, password = ?, role = ? WHERE id = ?';
      values = [full_name, user_name, hashedPassword, role, id];
    } else {
      sql = 'UPDATE userss SET full_name = ?, user_name = ?, role = ? WHERE id = ?';
      values = [full_name, user_name, role, id];
    }

    const [result] = await db.query(sql, values);
    return result;
  },

  deleteById: async (id) => {
    const [result] = await db.query('DELETE FROM userss WHERE id = ?', [id]);
    return result;
  }
};

module.exports = UserModel;
