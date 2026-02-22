const express = require('express');
const vacancyController = require('../controllers/vacancyController');

const router = express.Router();

// Create new vacancy
router.post('/', vacancyController.createVacancy);

// Get all vacancies
router.get('/', vacancyController.getAllVacancies);

// Get vacancy by ID
router.get('/:id', vacancyController.getVacancyById);

// Update existing vacancy
router.put('/:id', vacancyController.updateVacancy);

// Delete vacancy
router.delete('/:id', vacancyController.deleteVacancy);

module.exports = router;