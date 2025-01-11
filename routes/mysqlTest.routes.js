const express = require('express');
const connection = require('../db/mysql');
const router = express.Router();

router.get('/test-mysql', (req, res) => {
  connection.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'MySQL query failed.', details: err.message });
      return;
    }
    res.status(200).json({ message: 'MySQL connection successful!', result: results[0].result });
  });
});

module.exports = router;

