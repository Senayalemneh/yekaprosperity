const express = require('express');
const newsController = require('../controllers/newsController');

const router = express.Router();

// Create new news
router.post('/', newsController.createNews);

// Get all news (optional status filter: ?status=published)
router.get('/', newsController.getAllNews);

// Get news by ID
router.get('/:id', newsController.getNewsById);

// Update existing news
router.put('/:id', newsController.updateNews);

// Update news status
router.patch('/:id/status', newsController.updateNewsStatus);

// Delete news
router.delete('/:id', newsController.deleteNews);

// Get news by category
router.get('/category/:category', newsController.getNewsByCategory);

module.exports = router;