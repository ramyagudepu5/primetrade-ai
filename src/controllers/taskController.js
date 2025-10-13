const { dbHelpers } = require('../config/database');

/**
 * Get all tasks
 * Users can only see their own tasks, Admins can see all tasks
 */
const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.role === 'admin' ? null : req.user.id;
        const tasks = await dbHelpers.getAllTasks(userId);
        
        res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            data: {
                tasks,
                count: tasks.length
            }
        });
    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get task by ID
 * Users can only access their own tasks, Admins can access any task
 */
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await dbHelpers.getTaskById(id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user has permission to view this task
        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own tasks.'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                task: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    user_id: task.user_id,
                    user_name: task.user_name,
                    created_at: task.created_at,
                    updated_at: task.updated_at
                }
            }
        });
    } catch (error) {
        console.error('Get task by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Create new task
 */
const createTask = async (req, res) => {
    try {
        const { title, description, status = 'pending', priority = 'medium' } = req.body;
        
        const taskData = {
            title,
            description,
            status,
            priority,
            user_id: req.user.id
        };

        const newTask = await dbHelpers.createTask(taskData);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: {
                task: {
                    id: newTask.id,
                    title: newTask.title,
                    description: newTask.description,
                    status: newTask.status,
                    priority: newTask.priority,
                    user_id: newTask.user_id
                }
            }
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Update task by ID
 * Users can only update their own tasks, Admins can update any task
 */
const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        // Check if task exists
        const existingTask = await dbHelpers.getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user has permission to update this task
        if (req.user.role !== 'admin' && existingTask.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own tasks.'
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;

        const updatedTask = await dbHelpers.updateTask(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: {
                task: {
                    id: updatedTask.id,
                    title: updatedTask.title,
                    description: updatedTask.description,
                    status: updatedTask.status,
                    priority: updatedTask.priority
                }
            }
        });
    } catch (error) {
        console.error('Update task by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Delete task by ID
 * Users can only delete their own tasks, Admins can delete any task
 */
const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if task exists
        const existingTask = await dbHelpers.getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user has permission to delete this task
        if (req.user.role !== 'admin' && existingTask.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own tasks.'
            });
        }

        const result = await dbHelpers.deleteTask(id);

        if (result.deleted) {
            res.status(200).json({
                success: true,
                message: 'Task deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete task'
            });
        }
    } catch (error) {
        console.error('Delete task by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskById,
    deleteTaskById
};
