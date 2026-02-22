const Gallery = require('../models/GalleryModel');

exports.createGalleryItem = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.title.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Title is required with at least English translation' 
      });
    }

    const data = {
      title: {
        en: req.body.title.en,
        am: req.body.title.am || req.body.title.en,
        or: req.body.title.or || req.body.title.en
      },
      description: {
        en: req.body.description?.en || '',
        am: req.body.description?.am || req.body.description?.en || '',
        or: req.body.description?.or || req.body.description?.en || ''
      },
      images: req.body.images || [],
      order: req.body.order || 0,
      category: req.body.category || 'general'
    };

    const result = await Gallery.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Gallery item created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllGalleryItems = async (req, res) => {
  try {
    const category = req.query.category || null;
    const items = await Gallery.getAll(category);
    res.status(200).json({ 
      success: true,
      count: items.length,
      data: items 
    });
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false,
        error: 'Gallery item not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: item 
    });
  } catch (err) {
    console.error('Error fetching gallery item:', err);
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

exports.updateGalleryItem = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing item to merge with updates
    const existing = await Gallery.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Gallery item not found' 
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
      images: req.body.images || existing.images,
      order: req.body.order !== undefined ? req.body.order : existing.order,
      category: req.body.category || existing.category
    };

    const result = await Gallery.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Gallery item updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating gallery item:', err);
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

exports.deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Gallery item deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
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