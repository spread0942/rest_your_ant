# Restaurant Management System

A full-stack restaurant management system with a REST API backend and Vue.js frontend, built with TypeScript, Express, Sequelize, and PostgreSQL.

## 🚀 Features

### Backend API
- **User Management**: Account creation, authentication, and role-based authorization
- **Restaurant Management**: Complete restaurant information handling
- **Menu Management**: Dynamic menu creation with plates and drinks
- **Inventory Management**: Product tracking with stock management
- **Table Management**: Restaurant table allocation and status tracking
- **Order Management**: Complete order processing with detailed items
- **JWT Authentication**: Secure API access with JSON Web Tokens
- **Role-Based Access**: Admin and user roles with different permissions
- **Database Relationships**: Complex many-to-many relationships between entities
- **Error Handling**: Comprehensive error handling and validation
- **API Documentation**: Swagger/OpenAPI documentation

### Frontend Application
- **Vue.js 3**: Modern reactive frontend framework
- **Responsive Design**: Mobile-first responsive interface
- **API Integration**: Seamless backend connectivity
- **Real-time Status**: API health checking functionality
- **Docker Ready**: Containerized for easy deployment

## 🏗️ Project Structure

```
rest-your-ant/
├── frontend/           # Vue.js Frontend Application
│   ├── src/
│   │   ├── App.vue     # Main application component
│   │   └── main.js     # Application entry point
│   ├── public/         # Static assets
│   ├── Dockerfile      # Frontend container configuration
│   ├── package.json    # Frontend dependencies
│   └── README.md       # Frontend documentation
├── src/                # Backend API Source Code
│   ├── config/         # Database connection, environment
│   ├── models/         # Sequelize models and associations
│   ├── controllers/    # Business logic and API controllers
│   ├── routes/         # Express routes and endpoints
│   ├── middleware/     # Authentication, error handling
│   ├── utils/          # Helper functions and utilities
│   └── app.ts          # Express application setup
├── docker-compose.yml  # Multi-container setup (API + Frontend + DB)
├── Dockerfile          # Backend API container configuration
├── package.json        # Backend dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md          # Project documentation
```

## 📊 Database Schema

### Core Entities
- **accounts** → User accounts with roles (admin/user)
- **restaurants** → Restaurant information
- **menus** → Restaurant menus
- **plates** → Food dishes with pricing
- **products** → Raw ingredients with inventory
- **drinks** → Beverages with categories
- **tables** → Physical restaurant tables
- **orders** → Customer orders with status tracking

### Junction Tables (Many-to-Many)
- **menus_plates** → Menu and plate relationships
- **plates_products** → Plate ingredients with quantities
- **menus_drinks** → Menu and drink relationships
- **orders_details** → Order items with plates/drinks

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (if running locally)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rest_your_ant
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
vim .env
```

### 3. Using Docker Compose (Recommended)
```bash
# Start all services (Backend API + Frontend + PostgreSQL)
docker-compose up -d

# Start only specific services
docker-compose up api          # Backend API only
docker-compose up frontend     # Frontend only
docker-compose up db          # Database only

# Build and start with latest changes
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 🌐 Available Services
After running `docker-compose up -d`, the following services will be available:

- **Frontend**: http://localhost:8080 - Vue.js application
- **Backend API**: http://localhost:3000 - REST API endpoints
- **API Documentation**: http://localhost:3000/api-docs - Swagger documentation
- **Database**: localhost:5432 - PostgreSQL database

### 4. Local Development Setup

#### Backend API
```bash
# Install dependencies
npm install

# Start PostgreSQL locally
# Update .env with local database credentials

# Run database migrations
npm run build

# Start development server with hot reload
npm run dev

# Or build and start production server
npm run build
npm start
```

#### Frontend Application
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run serve

# Build for production
npm run build
```

## 📡 API Endpoints

### Documentation
- GET /api-docs - API Documentation

### Authentication
- `POST /api/accounts/login` - User login
- `POST /api/accounts` - Create new account

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (admin)
- `PATCH /api/restaurants/:id` - Update restaurant (admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin)

### Menus
- `GET /api/menus` - List menus (filter by restaurant)
- `GET /api/menus/:id` - Get menu details
- `POST /api/menus` - Create menu (admin)
- `PATCH /api/menus/:id` - Update menu (admin)
- `DELETE /api/menus/:id` - Delete menu (admin)

### Plates
- `GET /api/plates` - List plates (filter by category)
- `GET /api/plates/:id` - Get plate details
- `POST /api/plates` - Create plate (admin)
- `PATCH /api/plates/:id` - Update plate (admin)
- `DELETE /api/plates/:id` - Delete plate (admin)

### Products
- `GET /api/products` - List products (admin)
- `GET /api/products/:id` - Get product details (admin)
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Drinks
- `GET /api/drinks` - List drinks (filter by category)
- `GET /api/drinks/:id` - Get drink details
- `POST /api/drinks` - Create drink (admin)
- `PATCH /api/drinks/:id` - Update drink (admin)
- `DELETE /api/drinks/:id` - Delete drink (admin)

### Tables
- `GET /api/tables` - List tables (filter by restaurant)
- `GET /api/tables/:id` - Get table details
- `POST /api/tables` - Create table (admin)
- `PATCH /api/tables/:id` - Update table (admin)
- `DELETE /api/tables/:id` - Delete table (admin)

### Orders
- `GET /api/orders` - List orders (filter by restaurant/status)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order (authenticated)
- `PATCH /api/orders/:id` - Update order (authenticated)
- `DELETE /api/orders/:id` - Delete order (admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Roles
- **admin**: Full access to all endpoints
- **user**: Limited access to user-specific operations

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🧪 Example Requests

### Create Account
```bash
curl -X POST http://localhost:3000/api/accounts \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "admin",
    "email": "admin@restaurant.com",
    "password": "password123",
    "role": "admin",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/accounts/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@restaurant.com",
    "password": "password123"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <your-token>" \\
  -d '{
    "restaurantId": 1,
    "tableId": 5,
    "items": [
      {
        "plateId": 1,
        "quantity": 2,
        "notes": "Extra spicy"
      },
      {
        "drinkId": 1,
        "quantity": 1
      }
    ]
  }'
```

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up --build

# View API logs
docker-compose logs api

# View database logs
docker-compose logs db

# Execute commands in API container
docker-compose exec api npm run build

# Execute database commands
docker-compose exec db psql -U postgres -d restaurant_db
```

## 🗄️ Database Management

### Connect to Database
```bash
# Using Docker
docker-compose exec db psql -U postgres -d restaurant_db

# Locally
psql -h localhost -U postgres -d restaurant_db
```

### Backup Database
```bash
docker-compose exec db pg_dump -U postgres restaurant_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U postgres restaurant_db < backup.sql
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run validate` - Validate environment variables and database connection
- `npm run db:seed` - Seed the database with sample data
- `npm run db:clear` - Clear all data from the database
- `npm run db:reset` - Clear and re-seed the database
- `npm test` - Run tests (placeholder)

### Development Workflow

```bash
# 1. Validate environment
npm run validate

# 2. Start development server
npm run dev

# 3. Seed database with sample data
npm run db:seed

# 4. Test API endpoints
./test-api.sh
```

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_db
DB_USER=postgres
DB_PASSWORD=password

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=3000
NODE_ENV=development
```

## 🚨 Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API health endpoint: `GET /api/health`
- Review the logs: `docker-compose logs api`
