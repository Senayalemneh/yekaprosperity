const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for document uploads
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: documentStorage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Handle file upload
router.post('/file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({ 
    success: true, 
    path: req.file.path.replace(/\\/g, '/') // Convert to forward slashes for URLs
  });
});

// Handle cover image upload
router.post('/cover', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image uploaded' });
  }
  res.json({ 
    success: true, 
    path: req.file.path.replace(/\\/g, '/') // Convert to forward slashes for URLs
  });
});

module.exports = router;