# Primetrade.ai API Documentation

## Overview

The Primetrade.ai API is a RESTful web service built with Node.js and Express.js. It provides authentication, user management, and task management capabilities with role-based access control.

## Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.primetrade.ai/api/v1`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "john_updated",
  "email": "john.updated@example.com"
}
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /users
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user",
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <admin-token>
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "username": "updated_username",
  "email": "updated@example.com",
  "role": "admin"
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <admin-token>
```

### Task Management Endpoints

#### Get All Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "description": "Write comprehensive documentation",
        "status": "pending",
        "priority": "high",
        "user_id": 1,
        "user_name": "john_doe",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Task description",
  "status": "pending",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 2,
      "title": "New task title",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "user_id": 1
    }
  }
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "high"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Data Models

### User Model
```json
{
  "id": "integer",
  "username": "string (3-50 chars, alphanumeric + underscore)",
  "email": "string (valid email)",
  "password": "string (min 6 chars, must contain uppercase, lowercase, number)",
  "role": "string (user|admin)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Task Model
```json
{
  "id": "integer",
  "title": "string (1-200 chars)",
  "description": "string (max 1000 chars, optional)",
  "status": "string (pending|in-progress|completed)",
  "priority": "string (low|medium|high)",
  "user_id": "integer (foreign key to users.id)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 100 requests per 15 minutes per IP
- **Response**: 429 Too Many Requests when limit exceeded

## CORS Configuration

The API supports CORS for the following origins:
- `http://localhost:3000` (development)
- `http://localhost:3001` (development)
- `https://your-frontend-domain.com` (production)

## Interactive Documentation

Visit `http://localhost:5000/api-docs` for interactive Swagger documentation where you can:
- Test API endpoints directly
- View request/response schemas
- Generate client SDKs
- Export API specifications

## Postman Collection

A Postman collection is available in the `docs/` directory for easy API testing.

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Primetrade API is running",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```
