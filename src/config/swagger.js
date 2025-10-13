const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Primetrade.ai API',
            version: '1.0.0',
            description: 'Scalable REST API with Authentication & Role-Based Access Control',
            contact: {
                name: 'Primetrade.ai',
                email: 'support@primetrade.ai'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.primetrade.ai',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'The auto-generated id of the user',
                            example: 1
                        },
                        username: {
                            type: 'string',
                            description: 'The username of the user',
                            minLength: 3,
                            maxLength: 50,
                            example: 'john_doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'The email of the user',
                            example: 'john@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'The role of the user',
                            example: 'user'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The date the user was created',
                            example: '2023-01-01T00:00:00.000Z'
                        }
                    }
                },
                Task: {
                    type: 'object',
                    required: ['title', 'user_id'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'The auto-generated id of the task',
                            example: 1
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the task',
                            minLength: 1,
                            maxLength: 200,
                            example: 'Complete project documentation'
                        },
                        description: {
                            type: 'string',
                            description: 'The description of the task',
                            maxLength: 1000,
                            example: 'Write comprehensive documentation for the project'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in-progress', 'completed'],
                            description: 'The status of the task',
                            example: 'pending'
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high'],
                            description: 'The priority of the task',
                            example: 'medium'
                        },
                        user_id: {
                            type: 'integer',
                            description: 'The ID of the user who owns the task',
                            example: 1
                        },
                        user_name: {
                            type: 'string',
                            description: 'The username of the task owner',
                            example: 'john_doe'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The date the task was created',
                            example: '2023-01-01T00:00:00.000Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The date the task was last updated',
                            example: '2023-01-01T00:00:00.000Z'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    $ref: '#/components/schemas/User'
                                },
                                token: {
                                    type: 'string',
                                    description: 'JWT token',
                                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'email'
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Please provide a valid email address'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Access token is missing or invalid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                message: 'Access denied. No token provided.'
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Access denied. Insufficient permissions.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                message: 'Access denied. Admin role required.'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                message: 'User not found'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Validation failed',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                message: 'Validation failed',
                                errors: [
                                    {
                                        field: 'email',
                                        message: 'Please provide a valid email address'
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and profile management'
            },
            {
                name: 'Users',
                description: 'User management (Admin only)'
            },
            {
                name: 'Tasks',
                description: 'Task management'
            }
        ]
    },
    apis: [
        './src/routes/*.js',
        './src/controllers/*.js'
    ]
};

const specs = swaggerJSDoc(options);

module.exports = specs;
