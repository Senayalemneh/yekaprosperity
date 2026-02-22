const express = require('express');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

// Create new candidate
router.post('/', candidateController.createCandidate);

// Get all candidates
router.get('/', candidateController.getAllCandidates);

// Get candidates by region
router.get('/region/:region', candidateController.getCandidatesByRegion);

// Get candidates by election type
router.get('/election-type/:electionType', candidateController.getCandidatesByElectionType);

// Get candidates by status
router.get('/status/:status', candidateController.getCandidatesByStatus);

// Get candidate by ID
router.get('/:id', candidateController.getCandidateById);

// Update existing candidate
router.put('/:id', candidateController.updateCandidate);

// Delete candidate
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;