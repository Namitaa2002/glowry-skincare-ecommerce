import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// =========================================
// GET ALL PRODUCTS
// GET /api/products
// PUBLIC
// =========================================

router.get(
  "/",
  getProducts
);


// =========================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// PUBLIC
// =========================================

router.get(
  "/:id",
  getProductById
);


// =========================================
// CREATE PRODUCT
// POST /api/products
// ADMIN ONLY
// =========================================

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);


// =========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ADMIN ONLY
// =========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);


// =========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ADMIN ONLY
// =========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);


export default router;