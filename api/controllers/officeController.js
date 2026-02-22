const Office = require('../models/OfficeModel');

exports.createOffice = async (req, res) => {
  try {
    console.log('Creating office with data:', req.body);

    if (!req.body.officename) {
      return res.status(400).json({ 
        success: false,
        error: 'Officename is required' 
      });
    }

    const data = {
      officelogo: req.body.officelogo || '',
      officename: req.body.officename || {},
      missions: req.body.missions || {},
      vissions: req.body.vissions || {},
      values: req.body.values || {},
      aboutoffice: req.body.aboutoffice || {},
      locationstring: req.body.locationstring || {},
      social_links: req.body.social_links || {},
      emails: req.body.emails || [],
      contact_numbers: req.body.contact_numbers || [],
      specification: req.body.specification || ''
    };

    const result = await Office.create(data);
    
    res.status(201).json({ 
      success: true,
      message: 'Office created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating office:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllOffices = async (req, res) => {
  try {
    console.log('Fetching all offices');
    
    const offices = await Office.getAll();
    
    res.status(200).json({ 
      success: true,
      count: offices.length,
      data: offices 
    });
  } catch (err) {
    console.error('Error fetching offices:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getOfficeById = async (req, res) => {
  try {
    const officeId = parseInt(req.params.id);
    console.log('Fetching office by ID:', officeId);
    
    if (isNaN(officeId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid office ID' 
      });
    }

    const office = await Office.getById(officeId);
    if (!office) {
      return res.status(404).json({ 
        success: false,
        error: 'Office not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      data: office 
    });
  } catch (err) {
    console.error('Error fetching office:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.updateOffice = async (req, res) => {
  try {
    const officeId = parseInt(req.params.id);
    console.log('Updating office ID:', officeId, 'with data:', req.body);

    if (isNaN(officeId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid office ID' 
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    const data = {
      officelogo: req.body.officelogo,
      officename: req.body.officename,
      missions: req.body.missions,
      vissions: req.body.vissions,
      values: req.body.values,
      aboutoffice: req.body.aboutoffice,
      locationstring: req.body.locationstring,
      social_links: req.body.social_links,
      emails: req.body.emails,
      contact_numbers: req.body.contact_numbers,
      specification: req.body.specification
    };

    const result = await Office.updateById(officeId, data);
    
    res.status(200).json({ 
      success: true,
      message: 'Office updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating office:', err);
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

exports.deleteOffice = async (req, res) => {
  try {
    const officeId = parseInt(req.params.id);
    console.log('Deleting office ID:', officeId);

    if (isNaN(officeId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid office ID' 
      });
    }

    await Office.deleteById(officeId);
    
    res.status(200).json({ 
      success: true,
      message: 'Office deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting office:', err);
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