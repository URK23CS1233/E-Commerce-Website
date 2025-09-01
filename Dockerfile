# Single Container Dockerfile for Full-Stack E-Commerce Application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy root package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy backend package.json and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy frontend package.json and install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy frontend source code
COPY frontend/ ./frontend/

# Build frontend for production
RUN cd frontend && npm run build

# Copy built frontend to backend public directory
RUN mkdir -p backend/public && cp -r frontend/build/* backend/public/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ecommerce -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R ecommerce:nodejs /app

# Switch to non-root user
USER ecommerce

# Expose port
EXPOSE 5000

# Set working directory to backend
WORKDIR /app/backend

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
