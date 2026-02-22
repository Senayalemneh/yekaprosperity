const User = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const [rows] = await User.getAllUsers();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await User.addUser(name, email);
    res.json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  createUser,
};
