const Vacancy = require('../models/VacancyModel');

exports.createVacancy = async (req, res) => {
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
    if (!req.body.category || !req.body.category.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Category is required with at least English translation' 
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
      order: req.body.order || 0,
      coverimage: req.body.coverimage || null,
      file: req.body.file || null,
      category: {
        en: req.body.category.en,
        am: req.body.category.am || req.body.category.en,
        or: req.body.category.or || req.body.category.en
      },
      status: req.body.status || 'open'
    };

    const result = await Vacancy.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Vacancy created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating vacancy:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.getAll();
    res.status(200).json({ 
      success: true,
      count: vacancies.length,
      data: vacancies 
    });
  } catch (err) {
    console.error('Error fetching vacancies:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getVacancyById = async (req, res) => {
  try {
    const vacancy = await Vacancy.getById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ 
        success: false,
        error: 'Vacancy not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: vacancy 
    });
  } catch (err) {
    console.error('Error fetching vacancy:', err);
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

exports.updateVacancy = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing vacancy to merge with updates
    const existing = await Vacancy.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Vacancy not found' 
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
      order: req.body.order !== undefined ? req.body.order : existing.order,
      coverimage: req.body.coverimage || existing.coverimage,
      file: req.body.file || existing.file,
      category: {
        en: req.body.category?.en || existing.category.en,
        am: req.body.category?.am || existing.category.am,
        or: req.body.category?.or || existing.category.or
      },
      status: req.body.status || existing.status
    };

    const result = await Vacancy.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Vacancy updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating vacancy:', err);
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

exports.deleteVacancy = async (req, res) => {
  try {
    await Vacancy.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Vacancy deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting vacancy:', err);
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