const bcrypt = require('bcryptjs');
const { dbHelpers } = require('../config/database');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        // Check if user already exists
        const existingUserByEmail = await dbHelpers.getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const existingUserByUsername = await dbHelpers.getUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userData = {
            username,
            email,
            password: hashedPassword,
            role
        };

        const newUser = await dbHelpers.createUser(userData);

        // Generate JWT token
        const token = generateToken({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await dbHelpers.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        const user = await dbHelpers.getUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await dbHelpers.getUserByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already taken by another user'
                });
            }
        }

        // Check if username is already taken by another user
        if (username) {
            const existingUser = await dbHelpers.getUserByUsername(username);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken by another user'
                });
            }
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        const updatedUser = await dbHelpers.updateUser(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
