import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// =========================================
// LOAD ENVIRONMENT VARIABLES
// =========================================

dotenv.config();

console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);

console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS
    ? "Loaded"
    : "Missing"
);
// =========================================
// CREATE EXPRESS APP
// =========================================

const app = express();


const __dirname = path.resolve();

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);
// =========================================
// CONNECT DATABASE
// =========================================

connectDB();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json());


// =========================================
// PRODUCT ROUTES
// =========================================

app.use(
  "/api/products",
  productRoutes
);


// =========================================
// CART ROUTES
// =========================================

app.use(
  "/api/cart",
  cartRoutes
);

// =========================================
// ORDER ROUTES
// =========================================

app.use(
  "/api/orders",
  orderRoutes
);

// =========================================
// WISHLIST ROUTES
// =========================================


app.use(
  "/api/wishlist",
  wishlistRoutes
);

// =========================================
// AUTH ROUTES
// =========================================

app.use(
  "/api/auth",
  authRoutes
);

// =========================================
// CONTACT ROUTES
// =========================================

app.use(
  "/api/contact",
  contactRoutes
);

// =========================================
// ADDRESS ROUTES
// =========================================

app.use(
  "/api/addresses",
  addressRoutes
);

// =========================================
// ADMIN ROUTES
// =========================================

app.use(
  "/api/admin",
  adminRoutes
);

// =========================================
// ADMIN PRODUCTS ROUTES
// =========================================

app.use(
  "/api/admin/products",
  adminProductRoutes
);

// =========================================
// ADMIN ORDERS ROUTES
// =========================================

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);


// =========================================
// ADMIN USERS ROUTES
// =========================================
app.use(
  "/api/admin/users",
  adminUserRoutes
);

// =========================================
// REVIEWS ROUTES
// =========================================

app.use(
  "/api/reviews",
  reviewRoutes
);

// =========================================
// TEST ROUTE
// =========================================

app.get("/", (req, res) => {

  res.json({

    message:
      "GLOWRY Backend API is running",

  });

});


// =========================================
// SERVER
// =========================================

const PORT =
  process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});