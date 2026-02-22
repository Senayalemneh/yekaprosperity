const express = require('express');
const tenderController = require('../controllers/tenderController');

const router = express.Router();

// Create new tender
router.post('/', tenderController.createTender);

// Get all tenders
router.get('/', tenderController.getAllTenders);

// Get tender by ID
router.get('/:id', tenderController.getTenderById);

// Update existing tender
router.put('/:id', tenderController.updateTender);

// Delete tender
router.delete('/:id', tenderController.deleteTender);

module.exports = router;