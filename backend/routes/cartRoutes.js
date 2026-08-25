import express from "express";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";


const router = express.Router();


// =========================================
// GET CART
// =========================================

router.get(
  "/:userId",
  getCart
);


// =========================================
// ADD TO CART
// =========================================

router.post(
  "/:userId",
  addToCart
);


// =========================================
// UPDATE CART QUANTITY
// =========================================

router.put(
  "/:userId/:productId",
  updateCartQuantity
);


// =========================================
// REMOVE PRODUCT
// =========================================

router.delete(
  "/:userId/:productId",
  removeFromCart
);


// =========================================
// CLEAR CART
// =========================================

router.delete(
  "/:userId",
  clearCart
);


export default router;