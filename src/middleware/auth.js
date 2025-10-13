const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { dbHelpers } = require('../config/database');

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Get user from database
        const user = await dbHelpers.getUserById(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Add user info to request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Invalid token'
        });
    }
};

/**
 * Authorization middleware
 * Checks if user has required role
 * @param {Array} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

/**
 * Admin only middleware
 */
const adminOnly = authorize(['admin']);

/**
 * User or Admin middleware
 */
const userOrAdmin = authorize(['user', 'admin']);

module.exports = {
    authenticate,
    authorize,
    adminOnly,
    userOrAdmin
};
