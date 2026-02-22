const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const UPLOAD_BASE = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_BASE)) {
  fs.mkdirSync(UPLOAD_BASE, { recursive: true });
}

// Generate safe filename for MySQL 5.7 compatibility
const generateSafeFilename = (originalname) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  const extension = path.extname(originalname);
  const name = path.basename(originalname, extension)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 100);
  
  return `${timestamp}_${random}_${name}${extension}`;
};

// Simple file filter
const fileFilter = (req, file, cb) => {
  // Block potentially dangerous files
  const blockedExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.jar'];
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (blockedExtensions.includes(extension)) {
    return cb(new Error('File type not allowed'), false);
  }
  
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_BASE);
  },
  filename: (req, file, cb) => {
    cb(null, generateSafeFilename(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 5 // Max 5 files per upload
  }
});

const uploadSingle = upload.single('file');
const uploadMultiple = upload.array('files', 5);

module.exports = {
  upload: upload,
  uploadSingle: uploadSingle,
  uploadMultiple: uploadMultiple,
  UPLOAD_BASE: UPLOAD_BASE
};