import express from "express";

import Order from "../models/Order.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================================
// ALLOWED ORDER STATUSES
// =========================================================

const allowedStatuses = [
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];


// =========================================================
// GET ALL ORDERS — ADMIN
// =========================================================

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .sort({
            createdAt: -1,
          });


      res.status(200).json(
        orders
      );


    } catch (error) {

      console.error(
        "Admin Get Orders Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch orders.",

      });

    }

  }
);


// =========================================================
// GET SINGLE ORDER — ADMIN
// =========================================================

router.get(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      // ---------------------------------------
      // VALIDATE ORDER ID
      // ---------------------------------------

      if (
        !/^[0-9a-fA-F]{24}$/.test(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order ID.",

        });

      }


      // ---------------------------------------
      // FIND ORDER
      // ---------------------------------------

      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res.status(404).json({

          message:
            "Order not found.",

        });

      }


      res.status(200).json(
        order
      );


    } catch (error) {

      console.error(
        "Admin Get Single Order Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch order.",

      });

    }

  }
);


// =========================================================
// UPDATE ORDER STATUS — ADMIN
// =========================================================

router.put(
  "/:id/status",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const {
        status,
      } = req.body;


      // ---------------------------------------
      // VALIDATE STATUS
      // ---------------------------------------

      if (
        !status ||
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order status.",

        });

      }


      // ---------------------------------------
      // VALIDATE ORDER ID
      // ---------------------------------------

      if (
        !/^[0-9a-fA-F]{24}$/.test(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order ID.",

        });

      }


      // ---------------------------------------
      // FIND ORDER
      // ---------------------------------------

      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res.status(404).json({

          message:
            "Order not found.",

        });

      }


      // ---------------------------------------
      // PREVENT CHANGING FINAL STATES
      // ---------------------------------------

      if (
        order.status === "Delivered" &&
        status !== "Delivered"
      ) {

        return res.status(400).json({

          message:
            "A delivered order cannot be moved to another status.",

        });

      }


      if (
        order.status === "Cancelled" &&
        status !== "Cancelled"
      ) {

        return res.status(400).json({

          message:
            "A cancelled order cannot be moved to another status.",

        });

      }


      // ---------------------------------------
      // UPDATE STATUS
      // ---------------------------------------

      order.status =
        status;


      await order.save();


      // ---------------------------------------
      // RESPONSE
      // ---------------------------------------

      res.status(200).json({

        message:
          "Order status updated successfully.",

        order,

      });


    } catch (error) {

      console.error(
        "Admin Update Order Status Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update order status.",

      });

    }

  }
);


export default router;