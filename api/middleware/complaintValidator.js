const { body, validationResult } = require('express-validator');

exports.validateComplaint = async (req, res, next) => {
  await Promise.all([
    // Basic information
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
      .run(req),
    
    body('age')
      .isInt({ min: 5, max: 120 }).withMessage('Age must be between 5 and 120')
      .run(req),
    
    body('gender')
      .isIn(['male', 'female', 'other']).withMessage('Invalid gender value')
      .run(req),
    
    // Contact information
    body('phoneNumber')
      .if(body('email').isEmpty())
      .notEmpty().withMessage('Either phone number or email is required')
      .isMobilePhone().withMessage('Invalid phone number format')
      .run(req),
    
    body('email')
      .if(body('phoneNumber').isEmpty())
      .notEmpty().withMessage('Either phone number or email is required')
      .isEmail().withMessage('Invalid email format')
      .run(req),
    
    // Location information
    body('city')
      .trim()
      .notEmpty().withMessage('City is required')
      .isLength({ max: 50 }).withMessage('City must be less than 50 characters')
      .run(req),
    
    body('subcity')
      .trim()
      .notEmpty().withMessage('Subcity is required')
      .isLength({ max: 50 }).withMessage('Subcity must be less than 50 characters')
      .run(req),
    
    body('woreda')
      .trim()
      .notEmpty().withMessage('Woreda is required')
      .isLength({ max: 50 }).withMessage('Woreda must be less than 50 characters')
      .run(req),
    
    // Complaint details
    body('complaintType')
      .isIn(['individual', 'group']).withMessage('Invalid complaint type')
      .run(req),
    
    body('groupSize')
      .if(body('complaintType').equals('group'))
      .isInt({ min: 2 }).withMessage('Group size must be at least 2')
      .run(req),
    
    body('institutionName')
      .trim()
      .notEmpty().withMessage('Institution name is required')
      .isLength({ max: 100 }).withMessage('Institution name must be less than 100 characters')
      .run(req),
    
    body('governmentResponse')
      .trim()
      .notEmpty().withMessage('Government response is required')
      .isLength({ min: 20, max: 1000 }).withMessage('Response must be between 20-1000 characters')
      .run(req),
    
    body('complaintSubject')
      .trim()
      .notEmpty().withMessage('Complaint subject is required')
      .isLength({ max: 100 }).withMessage('Subject must be less than 100 characters')
      .run(req),
    
    body('complaintDetails')
      .trim()
      .notEmpty().withMessage('Complaint details are required')
      .isLength({ min: 30, max: 5000 }).withMessage('Details must be between 30-5000 characters')
      .run(req),
    
    // Optional fields
    body('disabilityType')
      .if(body('hasDisability').equals('true'))
      .notEmpty().withMessage('Disability type is required when hasDisability is true')
      .run(req),
    
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value')
      .run(req)
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new Error(errorMessages.join(', '));
  }

  next();
};