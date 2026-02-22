const Candidate = require('../models/CandidateModel');

// Helper function to check if an object has at least one non-empty value
const hasAnyValue = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some(val => 
    val && typeof val === 'string' && val.trim() !== ''
  );
};

// Helper function to get the first non-empty value from a language object
const getFirstNonEmptyValue = (obj) => {
  if (!obj || typeof obj !== 'object') return '';
  const languages = ['en', 'am', 'or'];
  for (const lang of languages) {
    if (obj[lang] && typeof obj[lang] === 'string' && obj[lang].trim() !== '') {
      return obj[lang].trim();
    }
  }
  return '';
};

// Helper function to ensure all language fields have values (fallback to first non-empty)
const normalizeLanguageFields = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return { en: '', am: '', or: '' };
  }
  
  const firstValue = getFirstNonEmptyValue(obj);
  
  return {
    en: obj.en && obj.en.trim() !== '' ? obj.en.trim() : firstValue,
    am: obj.am && obj.am.trim() !== '' ? obj.am.trim() : firstValue,
    or: obj.or && obj.or.trim() !== '' ? obj.or.trim() : firstValue
  };
};

exports.createCandidate = async (req, res) => {
  try {
    // Validate that name exists and has at least one language with content
    if (!req.body.name || typeof req.body.name !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Candidate name must be provided as an object with language fields' 
      });
    }
    
    if (!hasAnyValue(req.body.name)) {
      return res.status(400).json({ 
        success: false,
        error: 'Candidate name is required in at least one language (English, Amharic, or Oromo)' 
      });
    }

    // Validate that party exists and has at least one language with content
    if (!req.body.party || typeof req.body.party !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Party must be provided as an object with language fields' 
      });
    }

    if (!hasAnyValue(req.body.party)) {
      return res.status(400).json({ 
        success: false,
        error: 'Party name is required in at least one language (English, Amharic, or Oromo)' 
      });
    }

    // Validate age
    if (!req.body.age) {
      return res.status(400).json({ 
        success: false,
        error: 'Age is required' 
      });
    }

    // Validate that bio exists and has at least one language with content
    if (!req.body.bio || typeof req.body.bio !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Bio must be provided as an object with language fields' 
      });
    }

    if (!hasAnyValue(req.body.bio)) {
      return res.status(400).json({ 
        success: false,
        error: 'Bio is required in at least one language (English, Amharic, or Oromo)' 
      });
    }

    // Validate region
    if (!req.body.region) {
      return res.status(400).json({ 
        success: false,
        error: 'Region is required' 
      });
    }

    // Validate election type
    if (!req.body.election_type) {
      return res.status(400).json({ 
        success: false,
        error: 'Election type is required' 
      });
    }

    // Validate age range
    if (req.body.age && (req.body.age < 18 || req.body.age > 120)) {
      return res.status(400).json({ 
        success: false,
        error: 'Age must be between 18 and 120' 
      });
    }

    // Normalize multilingual fields to ensure all languages have values
    const normalizedName = normalizeLanguageFields(req.body.name);
    const normalizedParty = normalizeLanguageFields(req.body.party);
    const normalizedBio = normalizeLanguageFields(req.body.bio);

    // Prepare data with multilingual structure
    const data = {
      name: normalizedName,
      party: normalizedParty,
      photo_url: req.body.photo_url || null,
      age: req.body.age,
      bio: normalizedBio,
      policies: req.body.policies || [],
      region: req.body.region,
      election_type: req.body.election_type,
      status: req.body.status || 'active',
      social_links: {
        facebook: req.body.social_links?.facebook || '',
        twitter: req.body.social_links?.twitter || '',
        instagram: req.body.social_links?.instagram || '',
        linkedin: req.body.social_links?.linkedin || ''
      }
    };

    console.log("Creating candidate with data:", JSON.stringify(data, null, 2));

    const result = await Candidate.create(data);
    res.status(201).json({ 
      success: true,
      message: 'Candidate created successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error creating candidate:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.getAll();
    res.status(200).json({ 
      success: true,
      count: candidates.length,
      data: candidates 
    });
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.getById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        error: 'Candidate not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: candidate 
    });
  } catch (err) {
    console.error('Error fetching candidate:', err);
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

exports.updateCandidate = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
    }

    // Validate age if provided
    if (req.body.age && (req.body.age < 18 || req.body.age > 120)) {
      return res.status(400).json({ 
        success: false,
        error: 'Age must be between 18 and 120' 
      });
    }

    // Get existing candidate to merge with updates
    const existing = await Candidate.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ 
        success: false,
        error: 'Candidate not found' 
      });
    }

    // Parse existing data
    const existingName = existing.name || {};
    const existingParty = existing.party || {};
    const existingBio = existing.bio || {};
    const existingSocialLinks = existing.social_links || {};

    // Prepare updated data with multilingual support
    let updatedName = existingName;
    let updatedParty = existingParty;
    let updatedBio = existingBio; // FIXED: Changed from 'updatedBio' to 'existingBio'

    // Handle name updates
    if (req.body.name) {
      if (typeof req.body.name === 'object') {
        // If updating with new language data, merge with existing
        updatedName = {
          en: req.body.name.en || existingName.en || '',
          am: req.body.name.am || existingName.am || '',
          or: req.body.name.or || existingName.or || ''
        };
        
        // Ensure at least one language has content after merge
        if (!hasAnyValue(updatedName)) {
          return res.status(400).json({ 
            success: false,
            error: 'Updated name must have content in at least one language' 
          });
        }
        
        // Normalize to ensure all languages have values
        updatedName = normalizeLanguageFields(updatedName);
      }
    }

    // Handle party updates
    if (req.body.party) {
      if (typeof req.body.party === 'object') {
        updatedParty = {
          en: req.body.party.en || existingParty.en || '',
          am: req.body.party.am || existingParty.am || '',
          or: req.body.party.or || existingParty.or || ''
        };
        
        if (!hasAnyValue(updatedParty)) {
          return res.status(400).json({ 
            success: false,
            error: 'Updated party must have content in at least one language' 
          });
        }
        
        updatedParty = normalizeLanguageFields(updatedParty);
      }
    }

    // Handle bio updates
    if (req.body.bio) {
      if (typeof req.body.bio === 'object') {
        updatedBio = {
          en: req.body.bio.en || existingBio.en || '',
          am: req.body.bio.am || existingBio.am || '',
          or: req.body.bio.or || existingBio.or || ''
        };
        
        if (!hasAnyValue(updatedBio)) {
          return res.status(400).json({ 
            success: false,
            error: 'Updated bio must have content in at least one language' 
          });
        }
        
        updatedBio = normalizeLanguageFields(updatedBio);
      }
    }

    const data = {
      name: updatedName,
      party: updatedParty,
      photo_url: req.body.photo_url !== undefined ? req.body.photo_url : existing.photo_url,
      age: req.body.age !== undefined ? req.body.age : existing.age,
      bio: updatedBio,
      policies: req.body.policies || existing.policies || [],
      region: req.body.region || existing.region,
      election_type: req.body.election_type || existing.election_type,
      status: req.body.status || existing.status || 'active',
      social_links: {
        facebook: req.body.social_links?.facebook || existingSocialLinks.facebook || '',
        twitter: req.body.social_links?.twitter || existingSocialLinks.twitter || '',
        instagram: req.body.social_links?.instagram || existingSocialLinks.instagram || '',
        linkedin: req.body.social_links?.linkedin || existingSocialLinks.linkedin || ''
      }
    };

    console.log("Updating candidate with data:", JSON.stringify(data, null, 2));

    const result = await Candidate.updateById(req.params.id, data);
    res.status(200).json({ 
      success: true,
      message: 'Candidate updated successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error updating candidate:', err);
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

exports.deleteCandidate = async (req, res) => {
  try {
    await Candidate.deleteById(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Candidate deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting candidate:', err);
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

// Additional controller methods
exports.getCandidatesByRegion = async (req, res) => {
  try {
    const candidates = await Candidate.getByRegion(req.params.region);
    res.status(200).json({ 
      success: true,
      count: candidates.length,
      data: candidates 
    });
  } catch (err) {
    console.error('Error fetching candidates by region:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getCandidatesByElectionType = async (req, res) => {
  try {
    const candidates = await Candidate.getByElectionType(req.params.electionType);
    res.status(200).json({ 
      success: true,
      count: candidates.length,
      data: candidates 
    });
  } catch (err) {
    console.error('Error fetching candidates by election type:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};

exports.getCandidatesByStatus = async (req, res) => {
  try {
    const candidates = await Candidate.getByStatus(req.params.status);
    res.status(200).json({ 
      success: true,
      count: candidates.length,
      data: candidates 
    });
  } catch (err) {
    console.error('Error fetching candidates by status:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Internal server error' 
    });
  }
};