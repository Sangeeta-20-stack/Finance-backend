# 📊 Role-Based Record Management API (MERN Backend)

A secure backend system built with **Node.js, Express, MongoDB, and JWT authentication** implementing **Role-Based Access Control (RBAC)** for managing records.

---

## 🚀 Features

### 🔐 Authentication

- User registration & login
- JWT-based authentication
- Password hashing using bcrypt
- Admin creation protected with secret key

### 👥 Roles

- **Viewer**
- **Analyst**
- **Admin**

### 📦 Record System

- Create records
- Read records (role-based access)
- Update records
- Soft delete (`isDeleted: true`)
- Filtering, search, pagination support

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt.js

---

## 📁 Project Structure

# 📊 Role-Based Record Management API (MERN Backend)

A secure backend system built with **Node.js, Express, MongoDB, and JWT authentication** implementing **Role-Based Access Control (RBAC)** for managing records.

---

## 🚀 Features

### 🔐 Authentication

- User registration & login
- JWT-based authentication
- Password hashing using bcrypt
- Admin creation protected with secret key

### 👥 Roles

- **Viewer**
- **Analyst**
- **Admin**

### 📦 Record System

- Create records
- Read records (role-based access)
- Update records
- Soft delete (`isDeleted: true`)
- Filtering, search, pagination support

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt.js

---

## 📁 Project Structure

/models
User.js
Record.js

/controllers
authController.js
recordController.js

/routes
authRoutes.js
recordRoutes.js

/middleware
authMiddleware.js
roleMiddleware.js

server.js

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>

2. Install Dependencies
npm install

3. Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=superadmin123

4. Start Server
nodemon server.js
Server runs on:
http://localhost:5000

🔐 Authentication APIs
Register User:
POST /api/auth/register

Login User:
POST /api/auth/login

Authorization: Bearer JWT_TOKEN:
Authorization: Bearer JWT_TOKEN

📦 Record APIs

Create Record:
POST /api/records

Get Records (role-based):
GET /api/records

Get Single Record:
GET /api/records/:id

Update Record:
PUT /api/records/:id

Delete Record (Soft Delete):
DELETE /api/records/:id

Summary of finance:
GET api/analytics/summary

Category breakdown:
GET api/analytics/category

Monthly analytics:
GET api/analytics/monthly

Get all users:
GET api/users

Change user role:
PUT api/user/:id/role

Activate/Deactivate user:
PUT api/user/:id/status
```
