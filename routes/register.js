const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db/mysql'); // MySQL connection
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  connection.query(query, [name, email, hashedPassword, role], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to register user.', details: err.message });
    }
    res.status(201).json({ message: 'User registered successfully.' });
  });
});

module.exports = router;
