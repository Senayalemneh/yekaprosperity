const express = require('express');
const contactController = require('../controllers/contactController');
const upload = require('../config/multer'); // Reusing your existing Multer config


const router = express.Router();

// Public routes
router.post('/', upload.single('evidence'), contactController.createContact);

// Admin routes (protected)
router.get('/',  contactController.getAllContacts);
router.get('/:id',  contactController.getContactById);
router.patch('/:id/status',  contactController.updateContactStatus);
router.delete('/:id',  contactController.deleteContact);

module.exports = router;