# E-Commerce Application

## Prerequisites

- Node.js (v16 or later)
- MySQL (v8 or later)
- Git

## Setup

### 1. Database Setup

```bash
# Login to MySQL and create database
mysql -u root -p
CREATE DATABASE ecommerce;
exit

# Import schema and seed data
mysql -u root -p ecommerce < sql/schema.sql
mysql -u root -p ecommerce < sql/seed.sql
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env file with your database credentials and JWT secrets
# Example .env content:
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=ecommerce
# JWT_SECRET=your_jwt_secret
# JWT_REFRESH_SECRET=your_refresh_secret
# PORT=3000
# FRONTEND_URL=http://localhost:5173

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

## Usage

- Backend server will run on: http://localhost:3000
- Frontend application will run on: http://localhost:5173

### Test Accounts

1. Admin User:
   - Email: admin@example.com
   - Password: admin123

2. Regular User:
   - Email: user@example.com
   - Password: user123

### Features

- User Authentication (Login/Register)
- Product Listing and Details
- Shopping Cart
- Order Management
- User Profile Management
- Admin Dashboard (for admin users)

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── views/
│   │   └── App.vue
│   └── package.json
├── sql/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## Development

The application uses:
- Backend: Node.js with Express
- Frontend: Vue 3 with Vite
- State Management: Pinia
- UI Components: PrimeVue
- Styling: Tailwind CSS
- Database: MySQL
- Authentication: JWT

## Common Issues

1. Database Connection Error
   - Check if MySQL service is running
   - Verify database credentials in .env file
   - Ensure database exists and is accessible

2. Port Already in Use
   - Change port in .env file if 3000 is already in use
   - For frontend, change vite.config.js if 5173 is in use

3. CORS Issues
   - Verify FRONTEND_URL in backend .env matches your frontend URL
   - Check if backend URL in frontend is correct
