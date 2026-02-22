const DirectorMessage = require('../models/DirectorMessageModel');

exports.createDirectorMessage = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.name.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Name is required with at least English translation' 
      });
    }

    const data = {
      image: req.body.image,
      name: {
        en: req.body.name.en,
        am: req.body.name.am || req.body.name.en,
        or: req.body.name.or || req.body.name.en
      },
      position: {
        en: req.body.position?.en || '',
        am: req.body.position?.am || req.body.position?.en || '',
        or: req.body.position?.or || req.body.position?.en || ''
      },
      title: {
        en: req.body.title?.en || '',
        am: req.body.title?.am || req.body.title?.en || '',
        or: req.body.title?.or || req.body.title?.en || ''
      },
      message: {
        en: req.body.message?.en || '',
        am: req.body.message?.am || req.body.message?.en || '',
        or: req.body.message?.or || req.body.message?.en || ''
      }
    };

    const result = await DirectorMessage.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Director message created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating director message:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllDirectorMessages = async (req, res) => {
  try {
    const messages = await DirectorMessage.getAll();
    res.status(200).json({ 
      success: true,
      count: messages.length,
      data: messages 
    });
  } catch (err) {
    console.error('Error fetching director messages:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getDirectorMessageById = async (req, res) => {
  try {
    const message = await DirectorMessage.getById(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false,
        error: 'Director message not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: message 
    });
  } catch (err) {
    console.error('Error fetching director message:', err);
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

exports.updateDirectorMessage = async (req, res) => {
  try {
    console.log("Update request for ID:", req.params.id); // Debug log
    console.log("Update data:", req.body); // Debug log

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing message to merge with updates
    const existing = await DirectorMessage.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Director message not found' 
      });
    }

    const data = {
      image: req.body.image !== undefined ? req.body.image : existing.image,
      name: {
        en: req.body.name?.en !== undefined ? req.body.name.en : existing.name.en,
        am: req.body.name?.am !== undefined ? req.body.name.am : existing.name.am,
        or: req.body.name?.or !== undefined ? req.body.name.or : existing.name.or
      },
      position: {
        en: req.body.position?.en !== undefined ? req.body.position.en : existing.position.en,
        am: req.body.position?.am !== undefined ? req.body.position.am : existing.position.am,
        or: req.body.position?.or !== undefined ? req.body.position.or : existing.position.or
      },
      title: {
        en: req.body.title?.en !== undefined ? req.body.title.en : existing.title.en,
        am: req.body.title?.am !== undefined ? req.body.title.am : existing.title.am,
        or: req.body.title?.or !== undefined ? req.body.title.or : existing.title.or
      },
      message: {
        en: req.body.message?.en !== undefined ? req.body.message.en : existing.message.en,
        am: req.body.message?.am !== undefined ? req.body.message.am : existing.message.am,
        or: req.body.message?.or !== undefined ? req.body.message.or : existing.message.or
      }
    };

    const result = await DirectorMessage.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Director message updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating director message:', err);
    if (err.message.includes('not found')) {
      return res.status(404).json({ 
        success: false,
        error: err.message 
      });
    }
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

exports.deleteDirectorMessage = async (req, res) => {
  try {
    console.log("Delete request for ID:", req.params.id); // Debug log
    
    await DirectorMessage.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Director message deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting director message:', err);
    if (err.message.includes('not found')) {
      return res.status(404).json({ 
        success: false,
        error: err.message 
      });
    }
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