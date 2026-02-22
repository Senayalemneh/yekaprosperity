const express = require('express');
const ceoController = require('../controllers/CEOController');

const router = express.Router();

// Create new CEO - Change from '/' to '/'
router.post('/', ceoController.createCEO);

// Get all CEOs - Change from '/' to '/'
router.get('/', ceoController.getAllCEOs);

// Get CEO by ID
router.get('/:id', ceoController.getCEOById);

// Update existing CEO
router.put('/:id', ceoController.updateCEO);

// Delete CEO
router.delete('/:id', ceoController.deleteCEO);

module.exports = router;