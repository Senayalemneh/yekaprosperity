const express = require('express');
const topPerformerController = require('../controllers/topPerformerController');
const upload = require('../config/multer'); // Using your existing Multer config

const router = express.Router();

// Create new top performer (with image upload)
router.post('/', upload.single('image'), topPerformerController.createTopPerformer);

// Get all top performers
router.get('/', topPerformerController.getAllTopPerformers);

// Get top performer by ID
router.get('/:id', topPerformerController.getTopPerformerById);

// Update existing top performer
router.put('/:id', upload.single('image'), topPerformerController.updateTopPerformer);

// Delete top performer
router.delete('/:id', topPerformerController.deleteTopPerformer);

// Advanced reporting endpoints
router.get('/reports/performance', topPerformerController.getPerformanceReport);
router.get('/reports/top-by-period', topPerformerController.getTopPerformersByPeriod);
router.post('/actions/archive-past', topPerformerController.archivePastPerformers);

module.exports = router;