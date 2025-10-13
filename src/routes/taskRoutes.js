const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { authenticate, userOrAdmin } = require('../middleware/auth');
const { validateTaskCreation, validateTaskUpdate, validateId } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           description: The status of the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: The priority of the task
 *         user_id:
 *           type: integer
 *           description: The ID of the user who owns the task
 *         user_name:
 *           type: string
 *           description: The username of the task owner
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Users can only see their own tasks, Admins can see all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, userOrAdmin, taskController.getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     description: Users can only access their own tasks, Admins can access any task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. You can only view your own tasks
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, userOrAdmin, validateId, taskController.getTaskById);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, userOrAdmin, validateTaskCreation, taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update task by ID
 *     description: Users can only update their own tasks, Admins can update any task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. You can only update your own tasks
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, userOrAdmin, validateId, validateTaskUpdate, taskController.updateTaskById);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     description: Users can only delete their own tasks, Admins can delete any task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. You can only delete your own tasks
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, userOrAdmin, validateId, taskController.deleteTaskById);

module.exports = router;
