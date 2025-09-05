# Restaurant Management Frontend

A Vue.js frontend application for the Restaurant Management System.

## Features

- 🎨 Modern Vue.js 3 application
- 🐳 Docker containerized for easy deployment
- 🔗 API connectivity testing
- 📱 Responsive design
- 🎯 Hello World starting point for development

## Getting Started

### With Docker (Recommended)

The frontend runs automatically when you start the docker-compose services:

```bash
# From the root directory
docker-compose up -d
```

The frontend will be available at: http://localhost:8080

### Manual Development

If you want to run the frontend outside of Docker:

```bash
cd frontend
npm install
npm run serve
```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── App.vue      # Main application component
│   └── main.js      # Application entry point
├── Dockerfile       # Docker configuration
├── package.json     # Dependencies and scripts
└── vue.config.js    # Vue CLI configuration
```

## API Integration

The frontend includes a health check feature that tests connectivity to the backend API running on port 3000. Click the "Check API Connection" button to verify the connection.

## Development

- **Port**: 8080
- **Hot Reload**: Enabled in development mode
- **API URL**: http://localhost:3000/api

## Next Steps

This is a basic Hello World setup. You can extend it by adding:

- Router for multiple pages
- State management (Vuex/Pinia)
- UI components library
- Authentication integration
- Restaurant management features
- API integration for CRUD operations

## Technologies Used

- Vue.js 3
- Vue CLI
- Docker
- Node.js (for build tools)
