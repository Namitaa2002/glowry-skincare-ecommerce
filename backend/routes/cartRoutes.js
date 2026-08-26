import express from "express";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import {
  protect,
  authorizeUser,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// =========================================
// GET CART
// =========================================

router.get(
  "/:userId",
  protect,
  authorizeUser,
  getCart
);


// =========================================
// ADD TO CART
// =========================================

router.post(
  "/:userId",
  protect,
  authorizeUser,
  addToCart
);


// =========================================
// UPDATE CART QUANTITY
// =========================================

router.put(
  "/:userId/:productId",
  protect,
  authorizeUser,
  updateCartQuantity
);


// =========================================
// REMOVE PRODUCT
// =========================================

router.delete(
  "/:userId/:productId",
  protect,
  authorizeUser,
  removeFromCart
);


// =========================================
// CLEAR CART
// =========================================

router.delete(
  "/:userId",
  protect,
  authorizeUser,
  clearCart
);


export default router;