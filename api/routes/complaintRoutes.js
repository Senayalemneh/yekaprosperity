const express = require('express');
const complaintController = require('../controllers/ComplaintController');
const upload = require('../config/multer');

const router = express.Router();

// Create new complaint (with file upload)
router.post('/', upload.array('evidence_files', 5), complaintController.createComplaint);

// Get all complaints
router.get('/', complaintController.getAllComplaints);

// Get complaint statistics
router.get('/stats', complaintController.getComplaintStats);

// Get complaint by ID
router.get('/:id', complaintController.getComplaintById);

// Get complaint by tracking ID
router.get('/track/:trackingId', complaintController.getComplaintByTrackingId);

// Update existing complaint
router.put('/:id', upload.array('evidence_files', 5), complaintController.updateComplaint);

// Update complaint status
router.patch('/:id/status', complaintController.updateComplaintStatus);

// Update admin response
router.patch('/:id/response', complaintController.updateAdminResponse);

// Delete complaint
router.delete('/:id', complaintController.deleteComplaint);

module.exports = router;