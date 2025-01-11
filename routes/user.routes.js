const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();
router.get('/doctor/patients', verifyToken, checkRole(['Doctor']), (req, res) => {
  res.send('List of patients for the doctor.');
});

router.get('/patient/records', verifyToken, checkRole(['Patient']), (req, res) => {
  res.send('List of medical records for the patient.');
});

module.exports = router;
