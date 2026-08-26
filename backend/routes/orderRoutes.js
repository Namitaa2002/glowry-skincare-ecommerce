import express from "express";

import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";

import {
  protect,
  authorizeUser,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================
// CREATE ORDER
// =========================================

router.post(
  "/",
  protect,
  createOrder
);


// =========================================
// GET MY ORDERS
// =========================================

router.get(
  "/user/:userId",
  protect,
  authorizeUser,
  getUserOrders
);


// =========================================
// GET SINGLE ORDER
// =========================================

router.get(
  "/details/:orderId",
  protect,
  getOrderById
);


// =========================================
// CANCEL ORDER
// =========================================

router.put(
  "/cancel/:orderId",
  protect,
  cancelOrder
);


export default router;