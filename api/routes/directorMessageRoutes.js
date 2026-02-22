const express = require('express');
const directorMessageController = require('../controllers/directorMessageController');

const router = express.Router();

// Create new director message
router.post('/', directorMessageController.createDirectorMessage);

// Get all director messages
router.get('/', directorMessageController.getAllDirectorMessages);

// Get director message by ID - make sure this is :id (not /id)
router.get('/:id', directorMessageController.getDirectorMessageById);

// Update existing director message - make sure this is :id (not /id)
router.put('/:id', directorMessageController.updateDirectorMessage);

// Delete director message - make sure this is :id (not /id)
router.delete('/:id', directorMessageController.deleteDirectorMessage);

module.exports = router;