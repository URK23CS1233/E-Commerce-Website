# 🐳 Single Container Deployment Guide

## 🎯 Overview

Your e-commerce application has been containerized into a **single Docker container** that includes both the React frontend and Node.js backend. This approach simplifies deployment and reduces infrastructure complexity.

## 🏗️ Architecture

```
Single Container:
├── React Frontend (Built and served by Express)
├── Node.js/Express Backend (API + Static File Server)
└── Public Directory (Built React app)

External Services:
└── MongoDB Database (Separate container/service)
```

## 🚀 Deployment Options

### **Option 1: Local Docker Development**

1. **Build and run single container:**

   ```bash
   # Build the image
   docker build -t ecommerce-app .

   # Run with external MongoDB
   docker run -p 5000:5000 \
     -e MONGODB_URI="mongodb://localhost:27017/ecommerce" \
     -e JWT_SECRET="your-secret-key" \
     -e NODE_ENV="production" \
     ecommerce-app
   ```

2. **Use Docker Compose (Recommended):**
   ```bash
   # Run single container with MongoDB
   docker-compose -f docker-compose.single.yml up --build
   ```

### **Option 2: Render Deployment**

1. **Update your environment variables in Render:**

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

2. **Deploy with Docker:**
   - Service Type: **Web Service**
   - Environment: **Docker**
   - Dockerfile Path: `./Dockerfile`
   - Docker Context: `.`

### **Option 3: Other Cloud Platforms**

**AWS (ECS/Fargate):**

```bash
# Build and push to ECR
docker build -t ecommerce-app .
docker tag ecommerce-app:latest your-ecr-repo-uri:latest
docker push your-ecr-repo-uri:latest
```

**Google Cloud Run:**

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/your-project/ecommerce-app
gcloud run deploy --image gcr.io/your-project/ecommerce-app --platform managed
```

## 📋 Container Details

### **What's Inside the Container:**

1. **Frontend (React):**

   - Built for production (`npm run build`)
   - Static files served by Express
   - Optimized bundle sizes

2. **Backend (Node.js/Express):**

   - API endpoints (`/api/*`)
   - Static file serving
   - Health check endpoint (`/api/health`)

3. **Security Features:**
   - Non-root user execution
   - Minimal Alpine Linux base
   - Health checks included

### **Port Configuration:**

- **Container Port:** 5000
- **Frontend Access:** http://localhost:5000
- **API Access:** http://localhost:5000/api

## 🛠️ Build Process

The Dockerfile performs these steps:

1. **Install Dependencies:**

   ```dockerfile
   # Backend dependencies
   COPY backend/package*.json ./backend/
   RUN cd backend && npm ci --only=production

   # Frontend dependencies
   COPY frontend/package*.json ./frontend/
   RUN cd frontend && npm ci --only=production
   ```

2. **Build Frontend:**

   ```dockerfile
   # Build React app
   RUN cd frontend && npm run build

   # Copy to backend public directory
   RUN mkdir -p backend/public && cp -r frontend/build/* backend/public/
   ```

3. **Configure Security:**
   ```dockerfile
   # Create non-root user
   RUN adduser -S ecommerce -u 1001
   USER ecommerce
   ```

## 🔧 Environment Variables

### **Required:**

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-mongo-host:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
```

### **Optional:**

```env
PORT=5000
JWT_REFRESH_SECRET=your-refresh-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
RATE_LIMIT_MAX_REQUESTS=100
```

## 🎮 Commands

### **Development:**

```bash
# Install all dependencies
npm run install:all

# Build for production
npm run build

# Start development servers
npm run dev
```

### **Docker:**

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Docker Compose
npm run docker:dev
```

### **Testing:**

```bash
# Test the health endpoint
curl http://localhost:5000/api/health

# Test the frontend
curl http://localhost:5000
```

## 🔒 Security Features

1. **Container Security:**

   - Non-root user execution
   - Minimal attack surface
   - Health checks for reliability

2. **Application Security:**
   - JWT authentication
   - Rate limiting
   - Input validation
   - CORS protection

## 📊 Performance Optimizations

1. **Frontend:**

   - Production React build
   - Static asset optimization
   - Gzip compression (via Express)

2. **Backend:**
   - Connection pooling
   - Optimized dependencies
   - Health monitoring

## 🚀 Scaling Options

1. **Horizontal Scaling:**

   - Run multiple container instances
   - Load balancer in front
   - Shared MongoDB database

2. **Vertical Scaling:**
   - Increase container resources
   - Optimize database queries
   - Enable caching

## 📝 Troubleshooting

### **Common Issues:**

1. **Container Won't Start:**

   ```bash
   # Check logs
   docker logs container-name

   # Debug build
   docker build --no-cache -t ecommerce-app .
   ```

2. **Database Connection:**

   ```bash
   # Verify MongoDB URI
   echo $MONGODB_URI

   # Test connection
   docker exec -it container-name curl localhost:5000/api/health
   ```

3. **Frontend Not Loading:**

   ```bash
   # Check if build files exist
   docker exec -it container-name ls -la backend/public/

   # Verify static serving
   curl -I http://localhost:5000/static/js/
   ```

## ✅ Deployment Checklist

- [ ] Update environment variables
- [ ] Configure MongoDB connection
- [ ] Set up email service credentials
- [ ] Test health endpoint
- [ ] Verify frontend loads correctly
- [ ] Test API endpoints
- [ ] Configure domain/SSL (production)
- [ ] Set up monitoring/logging

---

**Your single-container e-commerce application is ready for production deployment!** 🎉

Choose your preferred deployment platform and follow the corresponding guide above.
