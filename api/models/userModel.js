const db = require('../config/db');

const getAllUsers = () => db.query('SELECT * FROM users');

const addUser = (name, email) =>
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

module.exports = {
  getAllUsers,
  addUser,
};
