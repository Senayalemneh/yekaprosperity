const TopPerformer = require('../models/TopPerformerModel');
const moment = require('moment');

exports.createTopPerformer = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.name.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Name is required with at least English translation' 
      });
    }
    if (!req.body.position || !req.body.position.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Position is required with at least English translation' 
      });
    }
    if (!req.body.image) {
      return res.status(400).json({ 
        success: false,
        error: 'Image is required' 
      });
    }
    if (typeof req.body.result !== 'number' || req.body.result < 0 || req.body.result > 100) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid result (0-100) is required' 
      });
    }

    const data = {
      name: {
        en: req.body.name.en,
        am: req.body.name.am || req.body.name.en,
        or: req.body.name.or || req.body.name.en
      },
      position: {
        en: req.body.position.en,
        am: req.body.position.am || req.body.position.en,
        or: req.body.position.or || req.body.position.en
      },
      image: req.body.image,
      result: req.body.result,
      performance_period: req.body.performance_period || 'monthly',
      status: req.body.status || 'active'
    };

    const result = await TopPerformer.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Top performer created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating top performer:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllTopPerformers = async (req, res) => {
  try {
    const status = req.query.status || 'active';
    const period = req.query.period || null;
    const performers = await TopPerformer.getAll(status, period);
    res.status(200).json({ 
      success: true,
      count: performers.length,
      data: performers 
    });
  } catch (err) {
    console.error('Error fetching top performers:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getTopPerformerById = async (req, res) => {
  try {
    const performer = await TopPerformer.getById(req.params.id);
    if (!performer) {
      return res.status(404).json({ 
        success: false,
        error: 'Top performer not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: performer 
    });
  } catch (err) {
    console.error('Error fetching top performer:', err);
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

exports.updateTopPerformer = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing performer to merge with updates
    const existing = await TopPerformer.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Top performer not found' 
      });
    }

    const data = {
      name: {
        en: req.body.name?.en || existing.name.en,
        am: req.body.name?.am || existing.name.am,
        or: req.body.name?.or || existing.name.or
      },
      position: {
        en: req.body.position?.en || existing.position.en,
        am: req.body.position?.am || existing.position.am,
        or: req.body.position?.or || existing.position.or
      },
      image: req.body.image || existing.image,
      result: req.body.result || existing.result,
      performance_period: req.body.performance_period || existing.performance_period,
      status: req.body.status || existing.status
    };

    const result = await TopPerformer.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Top performer updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating top performer:', err);
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

exports.deleteTopPerformer = async (req, res) => {
  try {
    await TopPerformer.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Top performer deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting top performer:', err);
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

// Advanced reporting endpoints
exports.getPerformanceReport = async (req, res) => {
  try {
    const { periodType, year } = req.query;
    
    if (!['monthly', 'quarterly', 'half-yearly', 'yearly'].includes(periodType)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid period type. Must be monthly, quarterly, half-yearly, or yearly' 
      });
    }

    const report = await TopPerformer.getPerformanceReport(periodType, year);
    res.status(200).json({ 
      success: true,
      data: report 
    });
  } catch (err) {
    console.error('Error generating performance report:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getTopPerformersByPeriod = async (req, res) => {
  try {
    const { periodType, limit } = req.query;
    
    if (!['monthly', 'quarterly', 'half-yearly', 'yearly'].includes(periodType)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid period type. Must be monthly, quarterly, half-yearly, or yearly' 
      });
    }

    const performers = await TopPerformer.getTopPerformersByPeriod(periodType, parseInt(limit) || 10);
    res.status(200).json({ 
      success: true,
      count: performers.length,
      data: performers 
    });
  } catch (err) {
    console.error('Error fetching top performers by period:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.archivePastPerformers = async (req, res) => {
  try {
    const count = await TopPerformer.archivePastPerformers();
    res.status(200).json({ 
      success: true,
      message: `Archived ${count} past performers`,
      count 
    });
  } catch (err) {
    console.error('Error archiving past performers:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};