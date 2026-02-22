const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM userss WHERE user_name = ?', [user_name]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Do not return password
    const { password: _, ...safeUser } = user;

    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

module.exports = router;
