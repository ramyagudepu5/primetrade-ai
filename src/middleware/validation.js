const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
    
    handleValidationErrors
];

/**
 * User login validation
 */
const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

/**
 * User update validation
 */
const validateUserUpdate = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
    
    handleValidationErrors
];

/**
 * Task creation validation
 */
const validateTaskCreation = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    
    handleValidationErrors
];

/**
 * Task update validation
 */
const validateTaskUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    
    handleValidationErrors
];

/**
 * ID parameter validation
 */
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    
    handleValidationErrors
];

/**
 * Pagination validation
 */
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validateTaskCreation,
    validateTaskUpdate,
    validateId,
    validatePagination,
    handleValidationErrors
};
