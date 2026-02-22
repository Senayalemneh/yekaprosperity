const QuickMessage = require('../models/QuickMessageModel');

exports.createQuickMessage = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.title.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Title is required with at least English translation' 
      });
    }
    if (!req.body.content) {
      return res.status(400).json({ 
        success: false,
        error: 'Content is required' 
      });
    }

    const data = {
      title: {
        en: req.body.title.en,
        am: req.body.title.am || req.body.title.en,
        or: req.body.title.or || req.body.title.en
      },
      content: req.body.content,
      status: req.body.status || 'active'
    };

    const result = await QuickMessage.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Quick message created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating quick message:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllQuickMessages = async (req, res) => {
  try {
    const status = req.query.status || 'active';
    const messages = await QuickMessage.getAll(status);
    res.status(200).json({ 
      success: true,
      count: messages.length,
      data: messages 
    });
  } catch (err) {
    console.error('Error fetching quick messages:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getQuickMessageById = async (req, res) => {
  try {
    const message = await QuickMessage.getById(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false,
        error: 'Quick message not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: message 
    });
  } catch (err) {
    console.error('Error fetching quick message:', err);
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

exports.updateQuickMessage = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing message to merge with updates
    const existing = await QuickMessage.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Quick message not found' 
      });
    }

    const data = {
      title: {
        en: req.body.title?.en || existing.title.en,
        am: req.body.title?.am || existing.title.am,
        or: req.body.title?.or || existing.title.or
      },
      content: req.body.content || existing.content,
      status: req.body.status || existing.status
    };

    const result = await QuickMessage.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Quick message updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating quick message:', err);
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

exports.deleteQuickMessage = async (req, res) => {
  try {
    await QuickMessage.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Quick message deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting quick message:', err);
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