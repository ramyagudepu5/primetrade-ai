const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Use different database path for Vercel
const dbPath = process.env.VERCEL 
    ? '/tmp/primetrade.db' 
    : path.join(dbDir, 'primetrade.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

// Initialize database tables
function initializeTables() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created/verified');
        }
    });

    // Tasks table
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            priority VARCHAR(20) DEFAULT 'medium',
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        } else {
            console.log('Tasks table created/verified');
            createDefaultAdmin();
        }
    });
}

// Create default admin user
function createDefaultAdmin() {
    const bcrypt = require('bcryptjs');
    const adminPassword = bcrypt.hashSync('admin123', 10);
    
    db.get('SELECT id FROM users WHERE role = ?', ['admin'], (err, row) => {
        if (err) {
            console.error('Error checking admin user:', err.message);
        } else if (!row) {
            db.run(`
                INSERT INTO users (username, email, password, role)
                VALUES (?, ?, ?, ?)
            `, ['admin', 'admin@primetrade.ai', adminPassword, 'admin'], (err) => {
                if (err) {
                    console.error('Error creating admin user:', err.message);
                } else {
                    console.log('Default admin user created (username: admin, password: admin123)');
                }
            });
        }
    });
}

// Database helper functions
const dbHelpers = {
    // Get all users
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, username, email, role, created_at FROM users', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // Get user by ID
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get user by email
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get user by username
    getUserByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Create user
    createUser: (userData) => {
        return new Promise((resolve, reject) => {
            const { username, email, password, role = 'user' } = userData;
            db.run(`
                INSERT INTO users (username, email, password, role)
                VALUES (?, ?, ?, ?)
            `, [username, email, password, role], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, username, email, role });
            });
        });
    },

    // Update user
    updateUser: (id, userData) => {
        return new Promise((resolve, reject) => {
            const { username, email, role } = userData;
            db.run(`
                UPDATE users 
                SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [username, email, role, id], function(err) {
                if (err) reject(err);
                else resolve({ id, username, email, role });
            });
        });
    },

    // Delete user
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes > 0 });
            });
        });
    },

    // Get all tasks
    getAllTasks: (userId = null) => {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT t.*, u.username as user_name 
                FROM tasks t 
                JOIN users u ON t.user_id = u.id
            `;
            let params = [];
            
            if (userId) {
                query += ' WHERE t.user_id = ?';
                params.push(userId);
            }
            
            query += ' ORDER BY t.created_at DESC';
            
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // Get task by ID
    getTaskById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT t.*, u.username as user_name 
                FROM tasks t 
                JOIN users u ON t.user_id = u.id 
                WHERE t.id = ?
            `, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Create task
    createTask: (taskData) => {
        return new Promise((resolve, reject) => {
            const { title, description, status = 'pending', priority = 'medium', user_id } = taskData;
            db.run(`
                INSERT INTO tasks (title, description, status, priority, user_id)
                VALUES (?, ?, ?, ?, ?)
            `, [title, description, status, priority, user_id], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, title, description, status, priority, user_id });
            });
        });
    },

    // Update task
    updateTask: (id, taskData) => {
        return new Promise((resolve, reject) => {
            const { title, description, status, priority } = taskData;
            db.run(`
                UPDATE tasks 
                SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, description, status, priority, id], function(err) {
                if (err) reject(err);
                else resolve({ id, title, description, status, priority });
            });
        });
    },

    // Delete task
    deleteTask: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes > 0 });
            });
        });
    }
};

module.exports = { db, dbHelpers };
