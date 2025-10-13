const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token
 * @param {Object} payload - User data to encode
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'primetrade-api',
        audience: 'primetrade-client'
    });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'primetrade-api',
            audience: 'primetrade-client'
        });
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};

module.exports = {
    generateToken,
    verifyToken,
    extractTokenFromHeader
};
