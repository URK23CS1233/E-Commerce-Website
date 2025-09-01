# Docker Deployment Guide

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB RAM available for containers

## Quick Start

### 1. Environment Setup

```bash
# Copy environment files
cp .env.production backend/.env
cp .env.docker .env
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Container Services

### MongoDB Container

- **Image**: mongo:7.0
- **Port**: 27017
- **Database**: ecommerce
- **Admin User**: admin / password123
- **App User**: ecommerce_user / userpassword123
- **Data Persistence**: mongodb_data volume

### Backend Container

- **Base Image**: node:18-alpine
- **Port**: 5000
- **Environment**: Production
- **Features**: API endpoints, authentication, file uploads

### Frontend Container

- **Base Image**: nginx:alpine
- **Port**: 3000 (mapped to nginx:80)
- **Features**: React app, nginx reverse proxy

## Development Commands

### View Container Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes data)
docker-compose down -v
```

### Rebuild Specific Service

```bash
# Rebuild backend only
docker-compose up --build backend

# Rebuild frontend only
docker-compose up --build frontend
```

## Database Access

### MongoDB Shell Access

```bash
# Connect to MongoDB container
docker exec -it ecommerce-mongodb mongosh

# Connect to ecommerce database
use ecommerce

# Authenticate as app user
db.auth("ecommerce_user", "userpassword123")

# View collections
show collections
```

## Production Configuration

### Environment Variables to Update

1. **JWT Secrets**: Change in docker-compose.yml
2. **Email Configuration**: Update EMAIL_USER and EMAIL_PASS
3. **MongoDB Passwords**: Update in docker-compose.yml and mongo-init.js
4. **API URL**: Update REACT_APP_API_URL for production domain

### Security Considerations

- Change default passwords
- Use Docker secrets for sensitive data
- Enable SSL/TLS in production
- Configure firewall rules
- Use environment-specific configurations

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   netstat -ano | findstr :27017
   ```

2. **Container Won't Start**

   ```bash
   # Check container status
   docker ps -a

   # View container logs
   docker logs ecommerce-backend
   docker logs ecommerce-frontend
   docker logs ecommerce-mongodb
   ```

3. **Database Connection Issues**

   ```bash
   # Test MongoDB connection
   docker exec ecommerce-mongodb mongosh --eval "db.adminCommand('ismaster')"
   ```

4. **Build Failures**
   ```bash
   # Clean rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### Performance Optimization

- Allocate more memory to Docker Desktop
- Use multi-stage builds (already implemented)
- Enable BuildKit for faster builds
- Use .dockerignore files (already included)

## File Structure

```
E-Commerce-Website/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── docker-compose.yml
├── mongo-init.js
├── .env.production
├── .env.docker
└── README.md
```

## Next Steps

1. Test the application thoroughly
2. Configure production domain and SSL
3. Set up CI/CD pipeline
4. Configure monitoring and logging
5. Implement backup strategies
