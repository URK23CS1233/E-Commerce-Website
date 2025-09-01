# MongoDB Dockerfile for Render
FROM mongo:7.0

# Copy initialization script
COPY mongo-init.js /docker-entrypoint-initdb.d/

# Expose MongoDB port
EXPOSE 27017

# Start MongoDB
CMD ["mongod", "--bind_ip_all"]
