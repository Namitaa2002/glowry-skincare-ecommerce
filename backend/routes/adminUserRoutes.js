
import express from "express";

import User from "../models/User.js";
import Order from "../models/Order.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================
// GET ALL CUSTOMERS — ADMIN
// =========================================

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      // =====================================
      // GET ONLY NORMAL USERS
      // =====================================

      const users = await User.find(
        {
          role: "user",
        },
        {
          password: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
        }
      ).sort({
        createdAt: -1,
      });


      // =====================================
      // GET ORDER INFORMATION
      // =====================================

      const orders = await Order.find(
        {}
      ).select(
        "userId total"
      );


      // =====================================
      // CREATE CUSTOMER STATS
      // =====================================

      const customerStats = {};


      orders.forEach((order) => {

        const userId =
          String(order.userId);


        if (!customerStats[userId]) {

          customerStats[userId] = {
            totalOrders: 0,
            totalSpent: 0,
          };

        }


        customerStats[userId].totalOrders += 1;

        customerStats[userId].totalSpent +=
          Number(order.total || 0);

      });


      // =====================================
      // COMBINE USER + ORDER DATA
      // =====================================

      const customers = users.map(
        (user) => {

          const userId =
            String(user._id);


          const stats =
            customerStats[userId] || {
              totalOrders: 0,
              totalSpent: 0,
            };


          return {

            _id:
              user._id,

            name:
              user.name,

            email:
              user.email,

            phone:
              user.phone || "",

            createdAt:
              user.createdAt,

            totalOrders:
              stats.totalOrders,

            totalSpent:
              stats.totalSpent,

          };

        }
      );


      res.json({

        customers,

        totalCustomers:
          customers.length,

      });

    } catch (error) {

      console.error(
        "Admin Customers Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch customers.",

      });

    }

  }
);


// =========================================
// GET SINGLE CUSTOMER — ADMIN
// =========================================

router.get(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const user =
        await User.findOne({

          _id:
            req.params.id,

          role:
            "user",

        }).select(
          "-password -resetPasswordToken -resetPasswordExpires"
        );


      if (!user) {

        return res.status(404).json({

          message:
            "Customer not found.",

        });

      }


      // =====================================
      // CUSTOMER ORDERS
      // =====================================

      const orders =
        await Order.find({

          userId:
            String(user._id),

        }).sort({

          createdAt:
            -1,

        });


      const totalSpent =
        orders.reduce(
          (sum, order) =>
            sum +
            Number(order.total || 0),
          0
        );


      res.json({

        customer: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone || "",

          createdAt:
            user.createdAt,

          totalOrders:
            orders.length,

          totalSpent,

        },

        orders,

      });

    } catch (error) {

      console.error(
        "Admin Customer Details Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch customer details.",

      });

    }

  }
);


export default router;
