const express = require('express');
const resourceController = require('../controllers/resourceController');
const upload = require('../config/multer'); // Configure multer for file uploads

const router = express.Router();

// Create new resource (with file upload)
router.post('/', upload.single('resourcefile'), resourceController.createResource);

// Get all resources
router.get('/', resourceController.getAllResources);

// Get resource by ID
router.get('/:id', resourceController.getResourceById);

// Update resource (with optional file upload)
router.put('/:id', upload.single('resourcefile'), resourceController.updateResource);

// Delete resource
router.delete('/:id', resourceController.deleteResource);

// Get resources by category
router.get('/category/:category', resourceController.getResourcesByCategory);

module.exports = router;