# 🛡️ Multi-Auth Learning Application (JWT, Clerk, Google OAuth)

A full-stack authentication learning platform built with **Node.js, Express, MongoDB (Mongoose)** on the backend and **React + Vite** on the frontend.

---

## 📁 Project Structure

```
multi-auth-app/
├── multi-auth-app-backend/       # Node.js + Express + Mongoose Backend
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── models/User.js        # User model with bcrypt & JWT support
│   │   ├── utils/jwt.js          # JWT sign & verify helpers
│   │   ├── middleware/           # authMiddleware (protectJWT)
│   │   ├── controllers/          # jwtAuthController (register, login, me, inspect)
│   │   ├── routes/               # jwtAuthRoutes
│   │   └── server.js             # Express server entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
└── multi-auth-app-frontend/      # React + Vite + Vanilla CSS Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # App header & real-time API status
    │   │   ├── AuthSelector.jsx  # Strategy Switcher (JWT, Clerk, Google)
    │   │   ├── Dashboard.jsx     # Authenticated User Dashboard
    │   │   ├── Toast.jsx         # Notifications system
    │   │   ├── jwt/              # Login, Register & Token Inspector
    │   │   ├── clerk/            # Clerk architecture & preview
    │   │   └── google/           # Google OAuth architecture & preview
    │   ├── context/              # AuthContext (state management)
    │   ├── services/api.js       # Centralized API service
    │   ├── index.css             # Modern Glassmorphic CSS design system
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Getting Started

### 1. MongoDB Configuration
Make sure your MongoDB server is running locally or provide a MongoDB Atlas connection string in `multi-auth-app-backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/multi_auth_db
JWT_SECRET=super_secret_multi_auth_learning_key_2026_jwt_token_development
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

> **Tip (MongoDB Atlas)**: If you are using MongoDB Atlas, replace `MONGODB_URI` with:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/multi_auth_db?retryWrites=true&w=majority`

---

### 2. Start the Backend

```bash
cd multi-auth-app-backend
npm install
npm run dev
```

The backend will start at `http://localhost:5000`.

#### Backend API Endpoints:
- `POST /api/auth/jwt/register` - Create an account (Name, Email, Password)
- `POST /api/auth/jwt/login` - Authenticate and receive a JWT token
- `GET  /api/auth/jwt/me` - Protected endpoint (requires `Authorization: Bearer <token>`)
- `POST /api/auth/jwt/inspect` - Decode and verify signature of any JWT token
- `GET  /api/health` - API server status & strategy health check

---

### 3. Start the Frontend

```bash
cd multi-auth-app-frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## ✨ Features Implemented (Phase 1: JWT Auth)

1. **Authentication Strategy Switcher**: Seamlessly toggle between **JWT Auth** (Active), **Clerk Auth** (Phase 2), and **Google OAuth** (Phase 3).
2. **Registration Flow**: Name, Email, Password, matching password verification, and live password strength indicator.
3. **Login Flow**: Email & Password validation, show/hide password toggle, and quick one-click demo login fill.
4. **Interactive Dashboard**:
   - Authenticated user profile with dynamic avatar and provider badge.
   - **Interactive JWT Token Inspector**: Live color-coded breakdown of the 3 JWT parts (Header in red, Payload in purple, Signature in cyan), expiration countdown, and signature verification.
   - **Live Protected API Tester**: One-click tester that fires a request to `/api/auth/jwt/me` with the `Bearer` token and displays the real-time HTTP status, response time, and JSON payload.
5. **Session Management**: Automatically stores session token in `localStorage` and verifies active token on page refresh.
