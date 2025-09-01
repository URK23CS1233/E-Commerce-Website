# E-Commerce Website

A full-stack e-commerce application built with React, Node.js, and MongoDB.

## Project Structure

```
E-Commerce-Website/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── netlify.toml       # Netlify deployment configuration
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud database)
- Git

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

## Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
