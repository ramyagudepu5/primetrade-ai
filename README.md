# 🚀 Primetrade.ai Backend Developer Assignment  

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## 🧰 Tech Stack
- *Frontend:* React.js  
- *Backend:* Node.js, Express.js  
- *Database:* SQLite  
- *Authentication:* JWT  
- *Security:* Helmet, CORS, Rate Limiting

## 🖼 UI Preview (Optional)
![Login Page](docs/images/login.png)
![Dashboard](docs/images/dashboard.png)
![Tasks Page](docs/images/tasks.png)


# Primetrade.ai Backend Developer Assignment

A scalable REST API with authentication & role-based access control built with Node.js and React.js.

## 🚀 Features

### Backend (Node.js + Express + SQLite)
- **User Authentication**: JWT-based authentication with secure password hashing
- **Role-Based Access Control**: User and Admin roles with different permissions
- **CRUD Operations**: Complete task management system
- **API Versioning**: Structured with `/v1/` prefix
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Helmet, CORS, rate limiting, and JWT security
- **API Documentation**: Interactive Swagger documentation
- **Database**: SQLite with normalized schema

### Frontend (React.js)
- **Modern UI**: Clean and responsive design
- **Authentication**: Login/Register forms with validation
- **Protected Routes**: Route protection based on authentication status
- **Task Management**: Full CRUD operations for tasks
- **Role-Based UI**: Different interfaces for User and Admin roles
- **Real-time Feedback**: Toast notifications for user actions
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## 🛠️ Installation & Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd primetrade
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp config.env .env
   
   # Edit .env file with your configuration
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   DB_PATH=./database/primetrade.db
   ```

4. **Start the backend server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Interactive Documentation
Visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

### API Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile
- `PUT /profile` - Update current user profile

#### Users (`/api/v1/users`) - Admin Only
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user by ID
- `DELETE /:id` - Delete user by ID

#### Tasks (`/api/v1/tasks`)
- `GET /` - Get all tasks (users see only their tasks, admins see all)
- `GET /:id` - Get task by ID
- `POST /` - Create new task
- `PUT /:id` - Update task by ID
- `DELETE /:id` - Delete task by ID

### Request/Response Examples

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Create Task
```bash
POST /api/v1/tasks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "status": "pending",
  "priority": "high"
}
```

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@primetrade.ai
- **Password**: admin123
- **Role**: admin

### User Account
Create a new user account through the registration form.

## 🏗️ Project Structure

```
primetrade/
├── src/                    # Backend source code
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & validation middleware
│   ├── config/            # Database & Swagger configuration
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
├── database/              # SQLite database files
├── docs/                  # Additional documentation
├── package.json           # Backend dependencies
└── README.md              # This file
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: Security headers
- **Role-Based Access**: Granular permission system

## 🚀 Scalability Considerations

### Current Architecture
- **Modular Design**: Separated concerns with controllers, services, and middleware
- **Database**: SQLite for development, easily replaceable with PostgreSQL/MySQL
- **API Versioning**: Structured for backward compatibility
- **Error Handling**: Centralized error management

### Future Scalability Options

1. **Database Migration**
   - Replace SQLite with PostgreSQL/MySQL for production
   - Add database connection pooling
   - Implement database sharding for large datasets

2. **Caching Layer**
   - Implement Redis for session storage
   - Add Redis for API response caching
   - Use CDN for static assets

3. **Microservices Architecture**
   - Split into separate services (Auth, Tasks, Users)
   - Implement API Gateway
   - Add service discovery

4. **Load Balancing**
   - Use Nginx or HAProxy for load balancing
   - Implement horizontal scaling
   - Add health checks and monitoring

5. **Containerization**
   - Dockerize the application
   - Use Docker Compose for local development
   - Implement Kubernetes for production deployment

6. **Monitoring & Logging**
   - Add application monitoring (New Relic, DataDog)
   - Implement structured logging
   - Add performance metrics

## 🧪 Testing

### Backend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application
3. Use PM2 for process management
4. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the React application
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email [support@primetrade.ai](mailto:support@primetrade.ai)

## 🎯 Assignment Completion Checklist

- ✅ User Registration & Login APIs with secure password hashing
- ✅ JWT-based authentication
- ✅ Role-based access control (User/Admin)
- ✅ CRUD APIs for Tasks entity
- ✅ API versioning (/v1/)
- ✅ Comprehensive error handling & validation
- ✅ Swagger API documentation
- ✅ SQLite database with normalized schema
- ✅ React.js frontend with authentication
- ✅ Protected dashboard with task management
- ✅ Responsive UI with error/success messages
- ✅ Scalability documentation
- ✅ Complete project setup instructions

---

**Note**: This project is created for the Primetrade.ai Backend Developer (Intern) Assignment. All requirements have been implemented with additional features for a production-ready application.
#   p r i m e t r a d e - a i 
 
 