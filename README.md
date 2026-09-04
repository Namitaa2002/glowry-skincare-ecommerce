# ✨ GLOWRY — Skincare E-Commerce Website

**GLOWRY** is a full-stack skincare e-commerce web application built using the **MERN Stack**. It provides a modern shopping experience for customers along with a dedicated admin panel for managing products, customers, and orders.

The project focuses on clean UI, responsive design, authentication, REST APIs, MongoDB integration, cart and wishlist functionality, server-side order validation, and complete order management.

---

## 🌸 Project Overview

GLOWRY is designed as a complete skincare shopping platform where users can:

* Explore skincare products
* Search, filter, and sort products
* View detailed product information
* Add products to cart and wishlist
* Manage their profile and addresses
* Place and track orders
* Manage account preferences
* Change their password
* Reset forgotten passwords
* Review products
* Contact the store

The application also includes a dedicated **Admin Dashboard** for store management.

---

## 🚀 Key Features

### 🛍️ Customer Features

* Modern responsive skincare storefront
* Product search
* Category filtering
* Product sorting
* Product details
* Wishlist
* Shopping cart
* Cart quantity management
* Checkout
* Server-side coupon and discount validation
* Order placement
* Order history
* Order tracking
* User profile
* Address management
* Account settings
* Change password
* Forgot password
* Password reset
* Product reviews
* Contact form with rate limiting

### 👑 Admin Features

* Secure admin authentication
* Admin dashboard
* Store statistics
* Customer management
* Product management
* Add products
* Edit products
* Delete products
* Order management
* Update order status
* Recent orders
* Revenue overview
* Admin-only protected routes

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| React.js     | User interface                    |
| Vite         | Frontend development & build tool |
| React Router | Page navigation                   |
| Axios        | API communication                 |
| Lucide React | Icons                             |
| CSS          | Styling & responsive UI           |

### Backend

| Technology | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | Backend runtime               |
| Express.js | REST API                      |
| MongoDB    | Database                      |
| Mongoose   | MongoDB ODM                   |
| JWT        | Authentication                |
| bcrypt.js  | Password hashing              |
| Nodemailer | Email functionality           |
| CORS       | Cross-origin request handling |

---

## 📁 Project Structure

```text
glowry-skincare-ecommerce/

│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── product-details/
│   │   ├── config/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── utils/
│   ├── public/
│   ├── seedProducts.js
│   ├── server.js
│   └── package.json
│
├── screenshots/
│   ├── home.png
│   ├── shop.png
│   ├── product-details.png
│   ├── cart.png
│   ├── user_dashboard.png
│   ├── admin_dashboard.png
│   └── admin_products.png
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 📸 Screenshots

### 🏠 Home Page

![GLOWRY Home](screenshots/home.png)

### 🛍️ Shop

![GLOWRY Shop](screenshots/shop.png)

### 🧴 Product Details

![Product Details](screenshots/product_details.png)

### 🛒 Shopping Cart

![Shopping Cart](screenshots/cart.png)

### 👤 User Dashboard

![User Dashboard](screenshots/user_dashboard.png)

### 👑 Admin Dashboard

![Admin Dashboard](screenshots/admin_dashboard.png)

### 📦 Admin Product Management

![Admin Products](screenshots/admin_products.png)

---

## 🔐 Authentication & Security

The application uses **JWT-based authentication** and **role-based access control** to protect user and admin functionality.

### User Authentication

* User registration
* Secure password hashing using bcrypt.js
* User login
* JWT token generation
* Protected user routes
* Password change
* Forgot password
* Password reset
* Generic login error response for invalid credentials
* Password validation during registration and password change

### Admin Authentication

* Separate admin login
* JWT-based admin authentication
* Admin-only protected routes
* Role-based authorization
* Admin creation/promotion script

### Security Measures

* Sensitive credentials are stored in environment variables
* `.env` files are excluded from Git
* JWT secrets are not committed to the repository
* Passwords are hashed before storage
* CORS is restricted using `FRONTEND_URL`
* Contact API is rate-limited
* Coupon and discount validation is handled server-side
* Order IDs are generated server-side
* Stock updates are rolled back if an order cannot be completed successfully

---

## 🛒 Shopping & Order Flow

The customer shopping flow includes:

```text
Browse Products
      ↓
View Product Details
      ↓
Add to Cart
      ↓
Review Cart
      ↓
Apply Coupon
      ↓
Checkout
      ↓
Place Order
      ↓
Order Confirmation
      ↓
Track Order
```

### Order Status

Orders can move through the following statuses:

* Processing
* Confirmed
* Shipped
* Delivered
* Cancelled

### Coupon & Discount Handling

Coupons and discounts are validated on the **server side** before an order is created.

The backend handles:

* Coupon code validation
* Minimum order requirements
* First-order-only coupon restrictions
* Discount calculation
* Final order amount calculation

This prevents the frontend from controlling the final discount value.

---

## 👑 Admin Dashboard

The admin dashboard provides an overview of the store through:

* Total Customers
* Total Products
* Total Orders
* Total Revenue
* Recent Orders

Administrators can also manage:

* Products
* Orders
* Customers
* Order statuses

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB

---

## 🔐 Environment Variables

GLOWRY uses environment variables for database configuration, authentication, frontend-backend communication, CORS, email functionality, and admin setup.

A `.env.example` file is included in the repository as a reference.

> **Do not commit real `.env` files or credentials to GitHub.**

### Backend Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5174
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### Frontend Environment Variables

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Namitaa2002/glowry-skincare-ecommerce.git

cd glowry-skincare-ecommerce
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder using the environment variables mentioned above.

Start the backend server:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5174
```

---

## 4. Database Setup

Make sure MongoDB is running and the `MONGO_URI` in the backend `.env` file points to the required MongoDB database.

Product seed data can be inserted using the project's product seed script.

---

## 5. Create / Promote Admin

The project includes an admin setup script:

```text
backend/scripts/seedAdmin.js
```

The script can be used to create or promote an administrator account using the configured admin credentials.

Run:

```bash
cd backend
npm run seed:admin
```

The script promotes an existing user when applicable instead of creating duplicate admin accounts.

---

## 🔗 Application Routes

### Customer

| Route           | Description      |
| --------------- | ---------------- |
| `/`             | Home             |
| `/products`     | Shop             |
| `/products/:id` | Product Details  |
| `/cart`         | Shopping Cart    |
| `/wishlist`     | Wishlist         |
| `/checkout`     | Checkout         |
| `/orders`       | My Orders        |
| `/track-order`  | Track Order      |
| `/profile`      | User Profile     |
| `/settings`     | Account Settings |

### Authentication

| Route              | Description       |
| ------------------ | ----------------- |
| `/login`           | User Login        |
| `/register`        | User Registration |
| `/forgot-password` | Forgot Password   |
| `/reset-password`  | Password Reset    |
| `/change-password` | Change Password   |

### Admin

| Route              | Description         |
| ------------------ | ------------------- |
| `/admin/login`     | Admin Login         |
| `/admin/dashboard` | Admin Dashboard     |
| `/admin/products`  | Product Management  |
| `/admin/orders`    | Order Management    |
| `/admin/users`     | Customer Management |

---

## 🔌 Backend API Modules

The backend is organized into separate REST API route modules for:

* Authentication
* Products
* Cart
* Wishlist
* Orders
* Addresses
* Reviews
* Contact
* Admin Products
* Admin Orders
* Admin Users

The backend follows a modular structure using separate routes, controllers, models, middleware, and utility modules.

---

## 📧 Email Functionality

GLOWRY includes email functionality using **Nodemailer**.

Email functionality is used for account-related communication such as:

* Welcome email after registration
* Password reset emails

Email credentials are configured through environment variables and are not stored in the repository.

---

## 📦 Order & Inventory Handling

Order creation is processed on the backend to maintain data integrity.

The backend handles:

* Server-generated order IDs
* Coupon validation
* Discount calculation
* Product price validation
* Stock validation
* Stock decrement
* Order creation
* Stock rollback if an order cannot be completed successfully

This ensures that sensitive order calculations and inventory operations are not controlled by the frontend.

---

## 🧩 Application Architecture

### Frontend

The frontend follows a component-based React architecture with:

* Reusable components
* React Router navigation
* Context-based state management
* Centralized API configuration
* Axios-based API communication
* Protected routes
* Customer and admin interfaces
* Responsive layouts

### Backend

The backend follows a modular Express.js architecture:

```text
Routes
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

Middleware is used for:

* Authentication
* Authorization
* CORS configuration
* Rate limiting
* Request handling

Business logic is maintained in controllers to keep the API structure organized and maintainable.

---

## 🎯 Learning Objectives

This project was developed to gain practical experience with:

* MERN stack development
* React component architecture
* REST API development
* MongoDB database operations
* Authentication and authorization
* JWT-based authentication
* Password hashing
* CRUD operations
* API integration using Axios
* State management
* Protected routes
* Admin dashboards
* E-commerce workflows
* Order management
* Server-side validation
* Responsive UI development
* Environment variable management
* Backend security practices

---

## 🔮 Future Improvements

Possible future enhancements include:

* Online payment gateway integration
* Product recommendation system
* Advanced skincare quiz
* Inventory management
* Sales analytics
* Cloud image storage
* Production deployment
* Automated email notifications
* Advanced admin reporting
* Automated testing
* CI/CD integration

---

## 👩‍💻 Author

### Namita Kingrani

**MCA Graduate | Aspiring Software Developer**

Built as a full-stack MERN project to demonstrate practical development skills across frontend, backend, database, authentication, security, and e-commerce functionality.

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

**GLOWRY — Your Skin. Your Glow.**
