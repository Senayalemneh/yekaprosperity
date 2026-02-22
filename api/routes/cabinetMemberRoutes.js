const express = require('express');
const cabinetMemberController = require('../controllers/cabinetMemberController');

const router = express.Router();

// Create new cabinet member
router.post('/', cabinetMemberController.createCabinetMember);

// Get all cabinet members (with optional positionLevel query parameter)
router.get('/', cabinetMemberController.getAllCabinetMembers);

// Get cabinet member by ID
router.get('/:id', cabinetMemberController.getCabinetMemberById);

// Update existing cabinet member
router.put('/:id', cabinetMemberController.updateCabinetMember);

// Delete cabinet member
router.delete('/:id', cabinetMemberController.deleteCabinetMember);

module.exports = router;