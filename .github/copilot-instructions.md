<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Restaurant Management API - Copilot Instructions

## Project Overview
This is a TypeScript-based REST API for restaurant management using Express.js, Sequelize ORM, and PostgreSQL. The API handles restaurants, menus, orders, tables, products, and user accounts with authentication.

## Code Style Guidelines

### TypeScript
- Use strict TypeScript settings
- Define proper interfaces for all data structures
- Use async/await instead of promises when possible
- Always type function parameters and return values
- Use proper error handling with try-catch blocks

### Express.js Patterns
- Follow RESTful API conventions
- Use proper HTTP status codes
- Implement standardized response format: `{ success: boolean, data?: any, message: string }`
- Use middleware for authentication, error handling, and validation
- Separate controllers, routes, and business logic

### Sequelize/Database
- Use proper Sequelize model definitions with TypeScript
- Define associations between models clearly
- Use transactions for complex operations
- Implement proper validation at the model level
- Use proper foreign key relationships

### Security
- Always hash passwords before storing
- Use JWT tokens for authentication
- Implement role-based authorization (admin/user)
- Validate all input data
- Use proper CORS and helmet configuration

## Project Structure
- `/src/config/` - Database configuration
- `/src/models/` - Sequelize models and associations
- `/src/controllers/` - Business logic and API handlers
- `/src/routes/` - Express route definitions
- `/src/middleware/` - Authentication, error handling
- `/src/utils/` - Helper functions and utilities

## Key Features to Remember
- Multi-tenant restaurant system
- Complex many-to-many relationships (menus-plates, plates-products, etc.)
- Order management with detailed items
- Role-based access control
- Comprehensive error handling
- Docker containerization

## Common Patterns
- Always authenticate protected routes
- Use pagination for list endpoints
- Include related data with proper Sequelize includes
- Validate foreign key references before operations
- Return consistent API response format
- Handle database constraints and validation errors

When generating code for this project, follow these patterns and maintain consistency with the existing codebase.
