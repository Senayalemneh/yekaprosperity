const CabinetMember = require('../models/CabinetMemberModel');

exports.createCabinetMember = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.fullName || !req.body.fullName.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Full name is required with at least English translation' 
      });
    }

    if (!req.body.positionLevel || !['Federal Level', 'Bureau Level', 'Subcity Level', 'Office Level', 'District Level'].includes(req.body.positionLevel)) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid position level is required (Federal Level, Bureau Level, Subcity Level, Office Level, District Level)' 
      });
    }

    const data = {
      image: req.body.image,
      fullName: {
        en: req.body.fullName.en,
        am: req.body.fullName.am || req.body.fullName.en,
        or: req.body.fullName.or || req.body.fullName.en
      },
      position: {
        en: req.body.position?.en || '',
        am: req.body.position?.am || req.body.position?.en || '',
        or: req.body.position?.or || req.body.position?.en || ''
      },
      positionLevel: req.body.positionLevel,
      order: req.body.order || 0,
      message: {
        en: req.body.message?.en || '',
        am: req.body.message?.am || req.body.message?.en || '',
        or: req.body.message?.or || req.body.message?.en || ''
      }
    };

    const result = await CabinetMember.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Cabinet member created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating cabinet member:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllCabinetMembers = async (req, res) => {
  try {
    // Optional filtering by position level
    const positionLevel = req.query.positionLevel;
    let members = await CabinetMember.getAll();
    
    if (positionLevel) {
      members = members.filter(member => 
        member.position_level === positionLevel
      );
    }

    res.status(200).json({ 
      success: true,
      count: members.length,
      data: members 
    });
  } catch (err) {
    console.error('Error fetching cabinet members:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getCabinetMemberById = async (req, res) => {
  try {
    const member = await CabinetMember.getById(req.params.id);
    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Cabinet member not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: member 
    });
  } catch (err) {
    console.error('Error fetching cabinet member:', err);
    if (err.message.includes('Invalid')) {
      return res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.updateCabinetMember = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing member to merge with updates
    const existing = await CabinetMember.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Cabinet member not found' 
      });
    }

    // Validate position level if provided
    if (req.body.positionLevel && !['Federal Level', 'Bureau Level', 'Subcity Level', 'Office Level', 'District Level'].includes(req.body.positionLevel)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid position level' 
      });
    }

    const data = {
      image: req.body.image || existing.image,
      fullName: {
        en: req.body.fullName?.en || existing.fullName.en,
        am: req.body.fullName?.am || existing.fullName.am,
        or: req.body.fullName?.or || existing.fullName.or
      },
      position: {
        en: req.body.position?.en || existing.position.en,
        am: req.body.position?.am || existing.position.am,
        or: req.body.position?.or || existing.position.or
      },
      positionLevel: req.body.positionLevel || existing.positionLevel,
      order: req.body.order !== undefined ? req.body.order : existing.order,
      message: {
        en: req.body.message?.en || existing.message.en,
        am: req.body.message?.am || existing.message.am,
        or: req.body.message?.or || existing.message.or
      }
    };

    const result = await CabinetMember.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Cabinet member updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating cabinet member:', err);
    if (err.message.includes('not found')) {
      return res.status(404).json({ 
        success: false,
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.deleteCabinetMember = async (req, res) => {
  try {
    await CabinetMember.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Cabinet member deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting cabinet member:', err);
    if (err.message.includes('not found')) {
      return res.status(404).json({ 
        success: false,
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};