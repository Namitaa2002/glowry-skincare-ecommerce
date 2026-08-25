
import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================
// CREATE ORDER
// =========================================

router.post("/", protect, async (req, res) => {

  try {

    const {
      orderId,
      items,
      customer,
      subtotal,
      coupon,
      discount,
      total,
      paymentMethod,
    } = req.body;


    // =======================================
    // GET USER FROM JWT
    // =======================================

    const userId =
      req.user.id;


    // =======================================
    // BASIC VALIDATION
    // =======================================

    if (
      !orderId ||
      !userId ||
      !items ||
      items.length === 0 ||
      !customer ||
      subtotal === undefined ||
      total === undefined
    ) {

      return res.status(400).json({

        message:
          "Required order details are missing.",

      });

    }


    // =======================================
    // CREATE ORDER
    // =======================================

    const order =
      await Order.create({

        orderId,

        userId,

        items,

        customer,

        subtotal,

        coupon:
          coupon || null,

        discount:
          discount || 0,

        total,

        paymentMethod:
          paymentMethod || "cod",

        status:
          "Processing",

      });


    // =======================================
    // RESPONSE
    // =======================================

    res.status(201).json({

      message:
        "Order placed successfully.",

      order,

    });


  } catch (error) {

    console.error(
      "Create Order Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to create order.",

      error:
        error.message,

    });

  }

});


// =========================================
// GET MY ORDERS
// =========================================

router.get("/user", protect, async (req, res) => {

  try {

    // =======================================
    // GET USER ID FROM JWT
    // =======================================

    const userId =
      req.user.id;


    // =======================================
    // FETCH ONLY LOGGED-IN USER ORDERS
    // =======================================

    const orders =
      await Order.find({

        userId:

          userId,

      })
      .sort({

        createdAt: -1,

      });


    res.json(orders);


  } catch (error) {

    console.error(
      "Fetch User Orders Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch orders.",

    });

  }

});


// =========================================
// GET SINGLE ORDER
// =========================================

router.get("/:orderId", protect, async (req, res) => {

  try {

    // =======================================
    // FIND ORDER
    // =======================================

    const order =
      await Order.findOne({

        orderId:
          req.params.orderId,

      });


    // =======================================
    // ORDER NOT FOUND
    // =======================================

    if (!order) {

      return res.status(404).json({

        message:
          "Order not found.",

      });

    }


    // =======================================
    // SECURITY CHECK
    // =======================================

    if (
      String(order.userId) !==
      String(req.user.id)
    ) {

      return res.status(403).json({

        message:
          "You are not authorized to view this order.",

      });

    }


    // =======================================
    // RESPONSE
    // =======================================

    res.json(order);


  } catch (error) {

    console.error(
      "Fetch Order Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch order.",

    });

  }

});


export default router;

