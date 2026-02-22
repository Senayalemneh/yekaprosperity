const Tender = require('../models/TenderModel');

exports.createTender = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.title.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Title is required with at least English translation' 
      });
    }
    if (!req.body.description || !req.body.description.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Description is required with at least English translation' 
      });
    }
    if (!req.body.referenceNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'Reference number is required' 
      });
    }
    if (!req.body.openingDate || !req.body.closingDate) {
      return res.status(400).json({ 
        success: false,
        error: 'Opening and closing dates are required' 
      });
    }
    if (!req.body.tenderDocument) {
      return res.status(400).json({ 
        success: false,
        error: 'Tender document is required' 
      });
    }

    const data = {
      title: {
        en: req.body.title.en,
        am: req.body.title.am || req.body.title.en,
        or: req.body.title.or || req.body.title.en
      },
      description: {
        en: req.body.description.en,
        am: req.body.description.am || req.body.description.en,
        or: req.body.description.or || req.body.description.en
      },
      referenceNumber: req.body.referenceNumber,
      openingDate: req.body.openingDate,
      closingDate: req.body.closingDate,
      coverImage: req.body.coverImage || null,
      tenderDocument: req.body.tenderDocument,
      category: {
        en: req.body.category?.en || "General",
        am: req.body.category?.am || req.body.category?.en || "አጠቃላይ",
        or: req.body.category?.or || req.body.category?.en || "Waliigalaa"
      },
      status: req.body.status || 'active'
    };

    const result = await Tender.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Tender created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating tender:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.getAll();
    res.status(200).json({ 
      success: true,
      count: tenders.length,
      data: tenders 
    });
  } catch (err) {
    console.error('Error fetching tenders:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getTenderById = async (req, res) => {
  try {
    const tender = await Tender.getById(req.params.id);
    if (!tender) {
      return res.status(404).json({ 
        success: false,
        error: 'Tender not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: tender 
    });
  } catch (err) {
    console.error('Error fetching tender:', err);
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

exports.updateTender = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing tender to merge with updates
    const existing = await Tender.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Tender not found' 
      });
    }

    const data = {
      title: {
        en: req.body.title?.en || existing.title.en,
        am: req.body.title?.am || existing.title.am,
        or: req.body.title?.or || existing.title.or
      },
      description: {
        en: req.body.description?.en || existing.description.en,
        am: req.body.description?.am || existing.description.am,
        or: req.body.description?.or || existing.description.or
      },
      referenceNumber: req.body.referenceNumber || existing.reference_number,
      openingDate: req.body.openingDate || existing.opening_date,
      closingDate: req.body.closingDate || existing.closing_date,
      coverImage: req.body.coverImage || existing.cover_image,
      tenderDocument: req.body.tenderDocument || existing.tender_document,
      category: {
        en: req.body.category?.en || existing.category.en,
        am: req.body.category?.am || existing.category.am,
        or: req.body.category?.or || existing.category.or
      },
      status: req.body.status || existing.status
    };

    const result = await Tender.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Tender updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating tender:', err);
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

exports.deleteTender = async (req, res) => {
  try {
    await Tender.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Tender deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting tender:', err);
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