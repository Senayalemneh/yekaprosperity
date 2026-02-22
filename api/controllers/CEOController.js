const CEO = require('../models/CEOModel');

exports.createCEO = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.fullName || !req.body.fullName.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Full name is required with at least English translation' 
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
      socialMediaLinks: req.body.socialMediaLinks || [],
      order: req.body.order || 0,
      message: {
        en: req.body.message?.en || '',
        am: req.body.message?.am || req.body.message?.en || '',
        or: req.body.message?.or || req.body.message?.en || ''
      },
      workExperience: {
        en: req.body.workExperience?.en || '',
        am: req.body.workExperience?.am || req.body.workExperience?.en || '',
        or: req.body.workExperience?.or || req.body.workExperience?.en || ''
      },
      educationalQualification: {
        en: req.body.educationalQualification?.en || '',
        am: req.body.educationalQualification?.am || req.body.educationalQualification?.en || '',
        or: req.body.educationalQualification?.or || req.body.educationalQualification?.en || ''
      }
    };

    const result = await CEO.create(data);
    res.status(201).json({ 
      success: true,
      message: 'CEO created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating CEO:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllCEOs = async (req, res) => {
  try {
    const ceos = await CEO.getAll();
    res.status(200).json({ 
      success: true,
      count: ceos.length,
      data: ceos 
    });
  } catch (err) {
    console.error('Error fetching CEOs:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getCEOById = async (req, res) => {
  try {
    const ceo = await CEO.getById(req.params.id);
    if (!ceo) {
      return res.status(404).json({ 
        success: false,
        error: 'CEO not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: ceo 
    });
  } catch (err) {
    console.error('Error fetching CEO:', err);
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

exports.updateCEO = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing CEO to merge with updates
    const existing = await CEO.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'CEO not found' 
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
      socialMediaLinks: req.body.socialMediaLinks || existing.socialMediaLinks,
      order: req.body.order !== undefined ? req.body.order : existing.order,
      message: {
        en: req.body.message?.en || existing.message.en,
        am: req.body.message?.am || existing.message.am,
        or: req.body.message?.or || existing.message.or
      },
      workExperience: {
        en: req.body.workExperience?.en || existing.workExperience.en,
        am: req.body.workExperience?.am || existing.workExperience.am,
        or: req.body.workExperience?.or || existing.workExperience.or
      },
      educationalQualification: {
        en: req.body.educationalQualification?.en || existing.educationalQualification.en,
        am: req.body.educationalQualification?.am || existing.educationalQualification.am,
        or: req.body.educationalQualification?.or || existing.educationalQualification.or
      }
    };

    const result = await CEO.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'CEO updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating CEO:', err);
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

exports.deleteCEO = async (req, res) => {
  try {
    await CEO.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'CEO deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting CEO:', err);
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