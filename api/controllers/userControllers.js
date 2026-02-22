const UserModel = require('../models/userModels');

// Create
const createUser = async (req, res) => {
  try {
    const result = await UserModel.create(req.body);
    res.status(201).json({ message: 'User created successfully.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user.', error: err.message });
  }
};

// Read All
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
  }
};

// Read One
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user.', error: err.message });
  }
};

// Update
const updateUserById = async (req, res) => {
  try {
    const result = await UserModel.updateById(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user.', error: err.message });
  }
};

// Delete
const deleteUserById = async (req, res) => {
  try {
    const result = await UserModel.deleteById(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.', error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
