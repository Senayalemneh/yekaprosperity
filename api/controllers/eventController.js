const Event = require('../models/EventModel');

exports.createEvent = async (req, res) => {
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
    if (!req.body.startDate || !req.body.endDate) {
      return res.status(400).json({ 
        success: false,
        error: 'Start and end dates are required' 
      });
    }
    if (!req.body.location || !req.body.location.en) {
      return res.status(400).json({ 
        success: false,
        error: 'Location is required with at least English translation' 
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
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: {
        en: req.body.location.en,
        am: req.body.location.am || req.body.location.en,
        or: req.body.location.or || req.body.location.en
      },
      coverImage: req.body.coverImage || null,
      eventProgram: req.body.eventProgram || null,
      category: {
        en: req.body.category?.en || "General",
        am: req.body.category?.am || req.body.category?.en || "አጠቃላይ",
        or: req.body.category?.or || req.body.category?.en || "Waliigalaa"
      },
      status: req.body.status || 'upcoming'
    };

    const result = await Event.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Event created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.status(200).json({ 
      success: true,
      count: events.length,
      data: events 
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: event 
    });
  } catch (err) {
    console.error('Error fetching event:', err);
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

exports.updateEvent = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Get existing event to merge with updates
    const existing = await Event.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found' 
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
      startDate: req.body.startDate || existing.start_date,
      endDate: req.body.endDate || existing.end_date,
      location: {
        en: req.body.location?.en || existing.location.en,
        am: req.body.location?.am || existing.location.am,
        or: req.body.location?.or || existing.location.or
      },
      coverImage: req.body.coverImage || existing.cover_image,
      eventProgram: req.body.eventProgram || existing.event_program,
      category: {
        en: req.body.category?.en || existing.category.en,
        am: req.body.category?.am || existing.category.am,
        or: req.body.category?.or || existing.category.or
      },
      status: req.body.status || existing.status
    };

    const result = await Event.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Event updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating event:', err);
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

exports.deleteEvent = async (req, res) => {
  try {
    await Event.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Event deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting event:', err);
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