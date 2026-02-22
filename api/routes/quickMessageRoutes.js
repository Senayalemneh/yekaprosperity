const express = require('express');
const quickMessageController = require('../controllers/quickMessageController');

const router = express.Router();

// Create new quick message
router.post('/', quickMessageController.createQuickMessage);

// Get all quick messages
router.get('/', quickMessageController.getAllQuickMessages);

// Get quick message by ID
router.get('/:id', quickMessageController.getQuickMessageById);

// Update existing quick message
router.put('/:id', quickMessageController.updateQuickMessage);

// Delete quick message
router.delete('/:id', quickMessageController.deleteQuickMessage);

module.exports = router;