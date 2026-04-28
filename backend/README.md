# DramaStream Backend

Node.js + Express + MongoDB backend for the DramaStream application.

## Project Structure

```text
backend/
├── .gitignore
├── node_modules/
├── package-lock.json
├── package.json
├── README.md
└── src/
   ├── config/
   │   └── db.js
   ├── constants/
   ├── controllers/
   │   ├── authController.js
   │   ├── contentController.js
   │   └── tmdbController.js
   ├── jobs/
   │   └── tmbdImportJob.js
   ├── middleware/
   │   ├── auth.js
   │   ├── error.js
   │   └── global-rate-limit.js
   ├── models/
   │   ├── Content.js
   │   └── User.js
   ├── routes/
   │   ├── auth.js
   │   ├── content.js
   │   ├── health-check.js
   │   ├── index.js
   │   └── tmbdRoutes.js
   ├── services/
   │   └── tmdbService.js
   └── utils/
      └── logger.js
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `CORS_ORIGIN`: Frontend URL for CORS

4. **Start the server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user (requires token)

### Health
- `GET /health` - Health check endpoint

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```
