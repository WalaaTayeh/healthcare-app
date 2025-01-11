const express = require('express');
const multer = require('multer');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  '/upload',
  verifyToken,
  checkRole(['Patient']),
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.status(201).json({
      message: 'File uploaded successfully.',
      filePath: `/uploads/${req.file.filename}`,
    });
  }
);

module.exports = router;
