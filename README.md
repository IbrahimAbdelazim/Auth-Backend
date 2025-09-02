# EasyGenerator Task Backend API

A robust NestJS backend application with JWT authentication, MongoDB integration, and comprehensive API documentation. Built with modern security practices and production-ready Docker containerization.

## 🚀 Features

- **Authentication System**: Complete JWT-based authentication with sign-up and sign-in
- **User Management**: User profile management with secure password hashing
- **MongoDB Integration**: Mongoose ODM with schema validation
- **API Documentation**: Swagger/OpenAPI documentation with interactive UI
- **Security**: Helmet, rate limiting, CORS, input validation, and password hashing with Argon2
- **Production Ready**: Multi-stage Docker builds, health checks, and environment validation
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks, and comprehensive testing setup

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Contributing](#contributing)

## 🛠 Prerequisites

- Node.js 20+ 
- npm or yarn
- MongoDB 7+
- Docker & Docker Compose (for containerized deployment)

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd easygenerator/backend

# Install dependencies
npm install
```

## ⚙️ Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGO_URI=mongodb://admin:password123@localhost:27017/easygenerator?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Application environment | No | `development` |
| `PORT` | Server port | No | `3000` |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration | No | `7d` |

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start in development mode with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

The API will be available at:
- **Base URL**: `http://localhost:3000/api/v1`
- **Health Check**: `http://localhost:3000/api/v1/health`
- **API Documentation**: `http://localhost:3000/api/v1/api-docs`

## 📚 API Documentation

Interactive Swagger documentation is available at `/api/v1/api-docs` when the application is running.

### Key Features:
- Interactive API testing
- Request/response schemas
- Authentication examples
- Error response documentation

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services (MongoDB + Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t easygenerator-backend .

# Run the container
docker run -p 3000:3000 --env-file .env easygenerator-backend
```

### Docker Services

- **Backend**: `http://localhost:3000`
- **MongoDB**: `localhost:27017`
- **MongoDB Admin**: admin/password123

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                 # Data transfer objects
│   ├── guard/               # JWT auth guard
│   ├── strategy/            # Passport JWT strategy
│   └── decorator/           # Custom decorators
├── user/                    # User management module
│   ├── interfaces/          # User interfaces
│   └── schemas/             # Mongoose schemas
├── common/                  # Shared utilities
│   ├── filters/             # Exception filters
│   └── interceptors/        # Request/response interceptors
├── config/                  # Configuration files
├── database/                # Database connection module
└── main.ts                  # Application entry point
```

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/sign-up` | User registration | No |
| `POST` | `/auth/sign-in` | User login | No |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/user/me` | Get current user profile | Yes |

### Request/Response Examples

#### Sign Up
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "SecurePass123!"
  }'
```

#### Sign In
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get User Profile
```bash
curl -X GET http://localhost:3000/api/v1/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Argon2 for secure password storage
- **Bearer Token**: Standard Authorization header format

### API Security
- **Helmet**: Security headers protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Class-validator with DTO validation

### Password Requirements
- Minimum 8 characters
- At least one letter
- At least one number  
- At least one special character

### Production Security
- Non-root Docker user
- Environment variable validation
- Global exception handling
- Request/response logging

## 🛠 Development Tools

### Code Quality
```bash
# Linting
npm run lint

# Code formatting
npm run format
```

### Git Hooks
- **Pre-commit**: Automatic linting and formatting via Husky
- **Lint-staged**: Only process staged files

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Application Health**: Built-in NestJS health checks
- **Docker Health**: Container-level health monitoring

### Logging
- Global request/response logging
- Exception tracking with detailed error information
- Structured logging with timestamps

## 🚀 Deployment Considerations

### Environment Setup
1. Set strong JWT secrets in production
2. Use proper MongoDB authentication
3. Configure CORS for your frontend domain
4. Set up proper SSL/TLS certificates
5. Configure rate limiting based on your needs

### Scaling
- Stateless design allows horizontal scaling
- JWT tokens eliminate server-side session storage
- MongoDB supports replica sets and sharding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow existing ESLint configuration
- Use Prettier for code formatting
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api/v1/api-docs`
- Review the application logs
- Ensure all environment variables are properly set
- Verify MongoDB connection and authentication

---

**Built with ❤️ using NestJS, MongoDB, and modern DevOps practices**