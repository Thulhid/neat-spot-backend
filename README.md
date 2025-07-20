# Neat Spot - Cleaning Service Management System

The project is a **cleaning service management system** that handles users, bookings, and services with **role-based access control** using JWT authentication.

## 🔐 Features

* **JWT-based authentication** (login, signup, logout)
* **Role-based authorization** (admin, customer)
* **Customer functionality**

  * Sign up & login
  * Create, update, delete and view their own bookings
* **Admin functionality**

  * Access to all bookings
  * Manage all users (CRUD)
  * Create, update, delete services
* **Proper error handling** using a centralized error controller
* **Protected routes** for authenticated users
* **Restricted routes** for admins

---

## 📁 API Structure

### 🔹 Auth Routes

```
POST    /api/v1/users/signup        → Register customer
POST    /api/v1/users/login         → Login (admin & customer)
GET     /api/v1/users/logout        → Logout
GET     /api/v1/users/me            → Get current user (protected)
```

### 🔹 User Management (Admin only)

```
GET     /api/v1/users/              → Get all users
POST    /api/v1/users/              → Create user
GET     /api/v1/users/:id           → Get user by ID
PUT     /api/v1/users/:id           → Update user
DELETE  /api/v1/users/:id           → Delete user
```

### 🔹 Booking Routes

```
GET     /api/v1/bookings/           → Get my bookings (customer only)
POST    /api/v1/bookings/           → Create new booking
PUT     /api/v1/bookings/:id        → Update booking
DELETE  /api/v1/bookings/:id        → Delete booking
GET     /api/v1/bookings/all        → Get all bookings (admin only)
```

### 🔹 Service Routes

```
GET     /api/v1/services/           → Get all services
POST    /api/v1/services/           → Create new service (admin only)
GET     /api/v1/services/:id        → Get service by ID (admin only)
PUT     /api/v1/services/:id        → Update service (admin only)
DELETE  /api/v1/services/:id        → Delete service (admin only)
```

---

## 🔐 Authentication & Authorization

* **JWT tokens** are used for secure authentication.
* Tokens are sent in `Authorization: Bearer <token>` headers or stored in HTTP-only cookies.
* Middleware `protect` ensures the user is authenticated.
* Middleware `restrictTo('admin')` restricts route access to admins only.

---

## 📦 Tech Stack

* **Node.js** / **Express.js**
* **MongoDB** with **Mongoose ODM**
* **JWT** for secure token-based authentication
* **bcrypt** for password hashing
* **dotenv** for environment variables

---

## 🛠 Project Structure

```
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── bookingController.js
│   └── serviceController.js
│   └── handlerFactory.js
├── models/
│   ├── userModel.js
│   ├── bookingModel.js
│   └── serviceModel.js
├── routes/
│   ├── userRoutes.js
│   ├── bookingRoutes.js
│   └── serviceRoutes.js
├── utils/
│   ├── appError.js
│   ├── catchAsync.js
│   └── createSendToken.js
│   └── apiFeatures.js
│
├── app.js
├── server.js
└── config.env
```

---

## 📄 Error Handling

* Uses custom `AppError` class for operational errors
* Centralized error controller handles:

  * CastError
  * Duplicate fields
  * Validation errors
  * JWT errors (invalid/expired)
* Returns consistent and informative API responses

---

## 🚀 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/neat-spot.git
cd neat-spot
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**
- create a `.env` file in the root directory based on `.env.example`

```
PORT=8000
DATABASE=mongodb+srv://...yourURI...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
NODE_ENV=development
```

4. **Run the server**

```bash
npm run dev
```

---

## 🔐 Demo Admin Credentials (For Testing Only)

- **Username**: admin
- **Password**: admin1234
  
## ✅ Completed As Part of Internship Task

* [x] Customer sign-up, login and booking management
* [x] Admin dashboard functionality for user and service management
* [x] Secure route access via roles
* [x] Error handling and validation
* [x] Readable, modular code structure

---

## 🙌 Acknowledgments

Built as part of the **Internship Program** by **Hiruna Thulhid**.
