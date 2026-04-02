# 📊 Finance Data Processing and Access Control API

A secure backend system built with **Node.js, Express, MongoDB, and JWT authentication**, implementing **Role-Based Access Control (RBAC)** for managing financial records and dashboard analytics.

---

## 🚀 Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication (7 day expiry)
- Password hashing with bcrypt
- Admin account creation protected by a secret key
- Deactivated account login prevention

### 👥 Role-Based Access Control

Three roles with clearly defined permissions:

- **Viewer** — reads own records and own summary data only
- **Analyst** — reads all records, creates and updates own records, accesses full analytics
- **Admin** — full access to all records, users, and analytics

### 📦 Financial Records

- Create, read, update, soft delete records
- Filter by type, category, and date range
- Full-text search across title, note, and category
- Pagination support

### 📊 Analytics Dashboard

- Financial summary (income, expense, balance)
- Category-wise breakdown
- Monthly income and expense trends
- Recent activity feed

### 🛡️ Security

- Helmet for HTTP header protection
- MongoDB query sanitization
- HTTP Parameter Pollution prevention
- Rate limiting (100 requests per 15 minutes)
- Input validation on all routes
- Soft delete instead of hard delete

---

## 🛠 Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Runtime        | Node.js                     |
| Framework      | Express.js                  |
| Database       | MongoDB + Mongoose          |
| Authentication | JWT + bcrypt                |
| Validation     | express-validator           |
| Security       | Helmet, mongo-sanitize, hpp |
| Docs           | Swagger UI (OpenAPI 3.0)    |
| Logging        | Morgan                      |

---

## 📁 Project Structure

```
├── config/
│   ├── db.js               # MongoDB connection
│   └── swagger.js          # Swagger setup
│
├── controllers/
│   ├── authController.js   # Register and login logic
│   ├── recordController.js # Financial records CRUD
│   ├── userController.js   # User management
│   └── analyticsController.js # Dashboard analytics
│
├── middleware/
│   ├── authMiddleware.js   # JWT protect + authorizeRoles
│   ├── asyncHandler.js     # Async error wrapper
│   ├── errorMiddleware.js  # Global error handler
│   ├── rateLimiter.js      # Rate limiting
│   ├── logger.js           # Morgan request logger
│   ├── security.js         # Helmet, sanitize, hpp
│   └── validationMiddleware.js # express-validator handler
│
├── models/
│   ├── User.js             # User schema
│   └── Record.js           # Financial record schema
│
├── routes/
│   ├── authRoutes.js       # /api/auth
│   ├── recordRoutes.js     # /api/records
│   ├── userRoutes.js       # /api/users
│   └── analyticsRoutes.js  # /api/analytics
│
├── validators/
│   ├── auth.validation.js
│   ├── record.validation.js
│   ├── user.validation.js
│   └── index.js
│
├── swagger.yaml            # Full API documentation
├── server.js               # Entry point
├── .env                    # Environment variables
└── package.json
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <git-repo-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET=your_admin_secret_key
```

> `ADMIN_SECRET` is required when registering an admin account. Keep it private.

### 4. Start the Server

```bash
# Development
npx nodemon server.js

# Production
node server.js
```

Server runs at: `http://localhost:5000`  
Swagger docs at: `http://localhost:5000/api-docs`

---

## 🔐 Authentication APIs

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user     | No            |
| POST   | `/api/auth/login`    | Login and get JWT token | No            |

**Register Body:**

```json
{
  "name": "Priya Mehta",
  "email": "priya.mehta@test.com",
  "password": "priya123",
  "role": "analyst"
}
```

> To register an admin, add `"role": "admin"` and `"adminSecret": "your_secret"`.

**Login Body:**

```json
{
  "email": "priya.mehta@test.com",
  "password": "priya123"
}
```

All protected routes require:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Financial Record APIs

| Method | Endpoint           | Description                        | Allowed Roles              |
| ------ | ------------------ | ---------------------------------- | -------------------------- |
| POST   | `/api/records`     | Create a record                    | analyst, admin             |
| GET    | `/api/records`     | Get records (filtered + paginated) | viewer, analyst, admin     |
| GET    | `/api/records/:id` | Get a single record                | viewer, analyst, admin     |
| PUT    | `/api/records/:id` | Update a record                    | analyst (own), admin (any) |
| DELETE | `/api/records/:id` | Soft delete a record               | admin only                 |

**Supported query params for `GET /api/records`:**

| Param       | Example               | Description                  |
| ----------- | --------------------- | ---------------------------- |
| `type`      | `income` or `expense` | Filter by type               |
| `category`  | `Rent`                | Filter by category           |
| `startDate` | `2026-03-01`          | Date range start             |
| `endDate`   | `2026-03-31`          | Date range end               |
| `q`         | `rent`                | Search title, note, category |
| `page`      | `1`                   | Page number                  |
| `limit`     | `10`                  | Results per page (max 100)   |

---

## 📊 Analytics APIs

| Method | Endpoint                  | Description                       | Allowed Roles                |
| ------ | ------------------------- | --------------------------------- | ---------------------------- |
| GET    | `/api/analytics/summary`  | Total income, expense, balance    | viewer (own), analyst, admin |
| GET    | `/api/analytics/recent`   | Last 10 transactions              | viewer (own), analyst, admin |
| GET    | `/api/analytics/category` | Totals grouped by category        | analyst, admin               |
| GET    | `/api/analytics/monthly`  | Monthly income and expense trends | analyst, admin               |

---

## 👥 User Management APIs (Admin Only)

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/users`            | Get all users                 |
| GET    | `/api/users/:id`        | Get a single user             |
| PUT    | `/api/users/:id/role`   | Update a user's role          |
| PUT    | `/api/users/:id/status` | Activate or deactivate a user |

**Update Role Body:**

```json
{
  "role": "analyst"
}
```

**Update Status Body:**

```json
{
  "isActive": false
}
```

---

## 👥 Role Permissions

| Action             | Viewer | Analyst | Admin |
| ------------------ | ------ | ------- | ----- |
| Register / Login   | ✅     | ✅      | ✅    |
| Create record      | ❌     | ✅      | ✅    |
| View own records   | ✅     | ✅      | ✅    |
| View all records   | ❌     | ✅      | ✅    |
| Update own record  | ❌     | ✅      | ✅    |
| Update any record  | ❌     | ❌      | ✅    |
| Delete record      | ❌     | ❌      | ✅    |
| View own summary   | ✅     | ✅      | ✅    |
| View all analytics | ❌     | ✅      | ✅    |
| Category breakdown | ❌     | ✅      | ✅    |
| Monthly trends     | ❌     | ✅      | ✅    |
| Manage users       | ❌     | ❌      | ✅    |

---

## 🧪 Testing Flow

### Step 1 — Register Users

```bash
# Register Admin (needs adminSecret)
POST /api/auth/register  →  Rahul Sharma (admin)

# Register Analyst
POST /api/auth/register  →  Priya Mehta (analyst)

# Register Viewer
POST /api/auth/register  →  Arjun Nair (viewer)
```

### Step 2 — Login and Save Tokens

```bash
POST /api/auth/login  →  save rahul_token
POST /api/auth/login  →  save priya_token
POST /api/auth/login  →  save arjun_token
```

### Step 3 — Test Records

```bash
# Priya creates records (analyst) ✅
# Arjun tries to create → 403 ❌
# Arjun reads GET /records → sees only own ✅
# Priya reads GET /records → sees all ✅
# Priya updates own record ✅
# Priya tries to update Rahul's record → 403 ❌
# Rahul deletes any record ✅
# Priya tries to delete → 403 ❌
```

### Step 4 — Test Analytics

```bash
# All roles → GET /analytics/summary ✅
# Arjun → GET /analytics/category → 403 ❌
# Priya + Rahul → GET /analytics/category ✅
```

### Step 5 — Test User Management

```bash
# Rahul → GET /users → sees all ✅
# Rahul → PUT /users/:id/role → promotes Arjun to analyst ✅
# Rahul → PUT /users/:id/status → deactivates Arjun ✅
# Arjun tries to login after deactivation → 403 ❌
# Priya → GET /users → 403 ❌
```

---

## 🗂️ Data Models

### User

```json
{
  "name": "string (required)",
  "email": "string (unique, required)",
  "password": "string (hashed, min 6 chars)",
  "role": "viewer | analyst | admin",
  "isActive": "boolean (default: true)"
}
```

### Financial Record

```json
{
  "title": "string (required)",
  "amount": "number (required)",
  "type": "income | expense (required)",
  "category": "string (required)",
  "note": "string (optional, max 300 chars)",
  "date": "date (required)",
  "createdBy": "User ObjectId (required)",
  "isDeleted": "boolean (default: false)",
  "deletedAt": "date (null until deleted)"
}
```

---

## 📌 Assumptions Made

- Soft delete is used for records — deleted records are hidden from all queries but remain in the database
- Analysts can only update records they personally created; admins can update any record
- Only admins can delete records
- Viewers can see their own summary and recent activity but cannot access aggregated analytics
- Admin registration requires a secret key set in the environment — this prevents unauthorized admin creation
- An admin cannot deactivate their own account or change their own role, to prevent accidental lockout

---

## 🔮 Possible Future Improvements

- React frontend dashboard
- Refresh token support
- Audit logs for admin actions
- CSV / PDF export of records
- Advanced analytics (weekly trends, forecasting)
- Role management UI

---

## 👨‍💻 Author

Built as part of a backend internship assignment focused on:

- REST API design
- Role-based access control
- MongoDB schema design
- Authentication and security best practices
