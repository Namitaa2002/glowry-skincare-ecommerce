import express from "express";

import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================================
// ADMIN DASHBOARD
// =========================================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      // =========================================
      // TOTAL USERS
      // =========================================

      const totalUsers =
        await User.countDocuments({
          role: "user",
        });


      // =========================================
      // TOTAL PRODUCTS
      // =========================================

      const totalProducts =
        await Product.countDocuments();


      // =========================================
      // TOTAL ORDERS
      // =========================================

      const totalOrders =
        await Order.countDocuments();


      // =========================================
      // TOTAL REVENUE
      // =========================================

      const revenueResult =
        await Order.aggregate([

          {
            $match: {
              status: {
                $ne: "Cancelled",
              },
            },
          },

          {
            $group: {

              _id: null,

              totalRevenue: {
                $sum: "$total",
              },

            },
          },

        ]);


      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;


      // =========================================
      // RECENT ORDERS
      // =========================================

      const recentOrders =
        await Order.find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .lean();


      // =========================================
      // RESPONSE
      // =========================================

      res.status(200).json({

        totalUsers,

        totalProducts,

        totalOrders,

        totalRevenue,

        recentOrders,

      });


    } catch (error) {

      console.error(
        "Admin Dashboard Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to load admin dashboard.",

      });

    }

  }
);


export default router;