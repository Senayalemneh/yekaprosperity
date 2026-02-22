const Resource = require('../models/ResourceModel');

exports.createResource = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.name.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Name is required with at least English translation' 
      });
    }
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Resource file is required' 
      });
    }

    const data = {
      name: {
        en: req.body.name.en,
        am: req.body.name.am || req.body.name.en,
        or: req.body.name.or || req.body.name.en
      },
      description: {
        en: req.body.description?.en || '',
        am: req.body.description?.am || req.body.description?.en || '',
        or: req.body.description?.or || req.body.description?.en || ''
      },
      owner: req.body.owner || 'Admin',
      resourcefile: req.file.path,
      coverpage: req.body.coverpage,
      category: {
        en: req.body.category?.en || 'General',
        am: req.body.category?.am || req.body.category?.en || 'አጠቃላይ',
        or: req.body.category?.or || req.body.category?.en || 'Waliigalaa'
      }
    };

    const result = await Resource.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Resource created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating resource:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.getAll();
    res.status(200).json({ 
      success: true,
      count: resources.length,
      data: resources 
    });
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.getById(req.params.id);
    if (!resource) {
      return res.status(404).json({ 
        success: false,
        error: 'Resource not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: resource 
    });
  } catch (err) {
    console.error('Error fetching resource:', err);
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

exports.updateResource = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    const data = {
      name: req.body.name ? {
        en: req.body.name.en,
        am: req.body.name.am,
        or: req.body.name.or
      } : undefined,
      description: req.body.description ? {
        en: req.body.description.en,
        am: req.body.description.am,
        or: req.body.description.or
      } : undefined,
      owner: req.body.owner,
      resourcefile: req.file?.path,
      coverpage: req.body.coverpage,
      category: req.body.category ? {
        en: req.body.category.en,
        am: req.body.category.am,
        or: req.body.category.or
      } : undefined
    };

    const result = await Resource.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Resource updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating resource:', err);
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

exports.deleteResource = async (req, res) => {
  try {
    const deletedResource = await Resource.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Resource deleted successfully',
      data: deletedResource 
    });
  } catch (err) {
    console.error('Error deleting resource:', err);
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

exports.getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await Resource.getByCategory(category);
    res.status(200).json({ 
      success: true,
      count: resources.length,
      data: resources 
    });
  } catch (err) {
    console.error('Error fetching resources by category:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};