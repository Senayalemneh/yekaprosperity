const express = require('express');
const officeController = require('../controllers/officeController');

const router = express.Router();

// Create new office
router.post('/', officeController.createOffice);

// Get all offices
router.get('/', officeController.getAllOffices);

// Get office by ID
router.get('/:id', officeController.getOfficeById);

// Update existing office
router.put('/:id', officeController.updateOffice);

// Delete office
router.delete('/:id', officeController.deleteOffice);

module.exports = router;