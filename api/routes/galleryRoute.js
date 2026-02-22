const express = require('express');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

// Create new gallery item
router.post('/', galleryController.createGalleryItem);

// Get all gallery items (optionally filtered by category)
router.get('/', galleryController.getAllGalleryItems);

// Get gallery item by ID
router.get('/:id', galleryController.getGalleryItemById);

// Update existing gallery item
router.put('/:id', galleryController.updateGalleryItem);

// Delete gallery item
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;