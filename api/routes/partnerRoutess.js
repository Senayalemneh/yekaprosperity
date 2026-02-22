// routes/partnerRoutes.js
const express = require('express');
const partnerController = require('../controllers/partnerController');
const upload = require('../config/multer');

const router = express.Router();

router.post('/', upload.single('logo'), partnerController.createPartner);
router.get('/', partnerController.getAllPartners);
router.get('/featured', partnerController.getFeaturedPartners);
router.get('/:id', partnerController.getPartnerById);
router.put('/:id', upload.single('logo'), partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router; // ✅ Make sure it's only this
