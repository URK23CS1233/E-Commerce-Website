# 🛒 E-Commerce Website

A comprehensive full-stack e-commerce application built with React.js, Node.js, Express.js, and MongoDB, featuring complete user authentication, Docker containerization, and modern design.

## ✨ Features

### 🔐 Authentication System
- **Email/Password Registration & Login**
- **OTP-based Authentication**
- **Forgot Password with Email Reset**
- **JWT Token Management with Refresh Tokens**
- **Rate Limiting & Security Middleware**
- **Password Strength Validation**

### 🛍️ E-Commerce Functionality
- **Product Categories & Best Selling Products**
- **Shopping Cart with Persistent Storage**
- **Wishlist Management**
- **User Profile Dashboard**
- **Order History & Management**
- **Product Search & Filtering**

### 🎨 Design & UX
- **Modern Teal Color Theme**
- **Fully Responsive Design**
- **Mobile-First Approach**
- **Intuitive User Interface**
- **Local Image Integration System**

### 🐳 Production Ready
- **Complete Docker Containerization**
- **Multi-Service Architecture**
- **Nginx Reverse Proxy**
- **MongoDB with Persistent Storage**
- **Environment Configuration Management**

## 🏗️ Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **CSS3** - Modern styling with CSS variables
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **nodemailer** - Email service
- **express-rate-limit** - Rate limiting

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and static file serving
- **MongoDB** - Database with persistent volumes

## Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd E-Commerce-Website
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Development Mode

1. Start MongoDB service on your machine

2. Start the backend server:

```bash
cd backend
npm run dev
```

3. Start the frontend development server:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`.

## Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI
2. Create a Heroku app:

```bash
cd backend
heroku create your-app-name
```

3. Set environment variables:

```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
```

4. Deploy:

```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Frontend Deployment (Netlify)

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Update the API URL in `src/services/api.js` to point to your deployed backend

3. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/build`
   - Deploy

## Features

- User authentication (register/login)
- Product catalog
- Shopping cart
- Order management
- Admin panel (to be implemented)

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Deployment**: Netlify (frontend), Heroku (backend)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product

### Orders

- `GET /api/orders` - Get all orders (to be implemented)

## Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## 📁 Project Structure

```
E-Commerce-Website/
├── frontend/                          # React frontend application
│   ├── public/                        # Static assets and images
│   │   ├── images/                    # Product and category images
│   │   │   ├── categories/            # Category images
│   │   │   └── products/              # Product images
│   │   └── index.html                 # Main HTML template
│   ├── src/                           # Source code
│   │   ├── components/                # Reusable components
│   │   ├── context/                   # React context providers
│   │   ├── pages/                     # Page components
│   │   ├── services/                  # API services
│   │   ├── utils/                     # Utility functions
│   │   └── theme.css                  # Theme variables
│   ├── Dockerfile                     # Frontend container config
│   └── nginx.conf                     # Nginx configuration
├── backend/                           # Node.js backend API
│   ├── middleware/                    # Custom middleware
│   ├── models/                        # MongoDB models
│   ├── routes/                        # API route handlers
│   ├── services/                      # Business logic services
│   ├── utils/                         # Backend utilities
│   ├── Dockerfile                     # Backend container config
│   └── server.js                      # Main server file
├── docker-compose.yml                 # Multi-container orchestration
├── mongo-init.js                      # MongoDB initialization
├── DOCKER-GUIDE.md                    # Docker deployment guide
├── DOCKER-DEPLOYMENT.md               # Deployment instructions
├── AUTHENTICATION_GUIDE.md            # Authentication documentation
└── README.md                          # Project documentation
```

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/

2. **Clone and Start**:
   ```bash
   git clone <repository-url>
   cd E-Commerce-Website
   docker-compose up --build
   ```

3. **Access Applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Local Development

1. **Prerequisites**:
   - Node.js (v18 or higher)
   - MongoDB (local or cloud)
   - Git

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   PORT=5000
   NODE_ENV=development
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Applications**:
   ```bash
   # Start backend (terminal 1)
   cd backend && npm run dev
   
   # Start frontend (terminal 2)
   cd frontend && npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Email Service (for OTP and password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_SERVICE=gmail

# Server
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (Environment)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/otp-login` - OTP-based login
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/best-selling` - Get best selling products

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Wishlist Endpoints
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

## 🐳 Docker Deployment

### Services Architecture
- **MongoDB**: Database with persistent storage
- **Backend**: Node.js API server
- **Frontend**: React app served by Nginx

### Commands
```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up --build -d

# View logs
docker-compose logs

# Stop services
docker-compose down

# Stop and remove data
docker-compose down -v
```

## 🎨 Theming

The application uses a comprehensive teal color palette:

```css
:root {
  --primary-color: #14b8a6;
  --primary-dark: #0f766e;
  --primary-light: #5eead4;
  --secondary-color: #0d9488;
  --accent-color: #2dd4bf;
  --background-color: #f0fdfa;
  --surface-color: #ffffff;
  --text-color: #0f172a;
  --text-light: #64748b;
  --border-color: #e2e8f0;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** middleware
- **CORS Protection**
- **Environment Variable Security**
- **Container Security** with non-root users

## 📱 Responsive Design

- **Mobile-First Approach**
- **Flexible Grid Layouts**
- **Touch-Friendly Interface**
- **Optimized Images**
- **Progressive Enhancement**

## 🚀 Deployment Options

### Cloud Platforms
- **AWS**: ECS, EKS, or Elastic Beanstalk
- **Azure**: Container Instances or AKS
- **Google Cloud**: Cloud Run or GKE
- **Digital Ocean**: App Platform
- **Railway**: Simple container deployment

### Traditional Hosting
- **Netlify**: Frontend static hosting
- **Heroku**: Backend and full-stack deployment
- **Vercel**: Frontend with API routes

## 📊 Performance

### Optimization Features
- **Code Splitting** in React
- **Image Optimization** and lazy loading
- **Nginx Gzip Compression**
- **Static Asset Caching**
- **Database Indexing**
- **Connection Pooling**

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests (when implemented)
cd backend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [DOCKER-GUIDE.md](DOCKER-GUIDE.md) for deployment help
- Review the [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for auth setup
- Open an issue for bugs or feature requests

## 🎯 Roadmap

- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Order tracking
- [ ] Product reviews
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

**Built with ❤️ using React, Node.js, and MongoDB**
