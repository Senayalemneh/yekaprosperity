const express = require('express');
const resourceFileController = require('../controllers/resourceFileController');
const upload = require('../config/multer'); // Using your existing Multer config

const router = express.Router();

// Create new resource file (with file upload)
router.post('/', upload.single('file'), resourceFileController.createResourceFile);

// Get all resource files
router.get('/', resourceFileController.getAllResourceFiles);

// Get resource file by ID
router.get('/:id', resourceFileController.getResourceFileById);

// Update existing resource file
router.put('/:id', upload.single('file'), resourceFileController.updateResourceFile);

// Delete resource file
router.delete('/:id', resourceFileController.deleteResourceFile);

module.exports = router;