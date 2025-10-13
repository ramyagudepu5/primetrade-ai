const { dbHelpers } = require('../config/database');

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await dbHelpers.getAllUsers();
        
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users,
                count: users.length
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get user by ID (Admin only)
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await dbHelpers.getUserById(id);
        
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
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Update user by ID (Admin only)
 */
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        // Check if user exists
        const existingUser = await dbHelpers.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is already taken by another user
        if (email) {
            const userWithEmail = await dbHelpers.getUserByEmail(email);
            if (userWithEmail && userWithEmail.id !== parseInt(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already taken by another user'
                });
            }
        }

        // Check if username is already taken by another user
        if (username) {
            const userWithUsername = await dbHelpers.getUserByUsername(username);
            if (userWithUsername && userWithUsername.id !== parseInt(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken by another user'
                });
            }
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const updatedUser = await dbHelpers.updateUser(id, updateData);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
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
        console.error('Update user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Delete user by ID (Admin only)
 */
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await dbHelpers.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        const result = await dbHelpers.deleteUser(id);

        if (result.deleted) {
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
    } catch (error) {
        console.error('Delete user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};
