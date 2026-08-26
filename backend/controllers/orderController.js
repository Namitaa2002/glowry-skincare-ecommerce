import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";


// =========================================
// GENERATE ORDER ID
// =========================================

const generateOrderId = () => {

  const timestamp =
    Date.now().toString().slice(-8);

  const random =
    Math.floor(
      1000 +
      Math.random() * 9000
    );

  return `GLW-${timestamp}-${random}`;

};


// =========================================
// CREATE ORDER
// =========================================

export const createOrder = async (
  req,
  res
) => {

  try {

    // =======================================
    // AUTHENTICATION
    // =======================================

    if (
      !req.user ||
      !req.user.id
    ) {

      return res.status(401).json({

        message:
          "Authentication required. Please login again.",

      });

    }


    // IMPORTANT:
    // Never trust userId from frontend.
    // Always use authenticated user ID.

    const userId =
      req.user.id;


    // =======================================
    // GET USER
    // =======================================

    const user =
      await User.findById(
        userId
      );


    if (!user) {

      return res.status(404).json({

        message:
          "User not found.",

      });

    }


    // =======================================
    // GET CART
    // =======================================

    const cart =
      await Cart.findOne({
        userId,
      });


    if (
      !cart ||
      !Array.isArray(cart.items) ||
      cart.items.length === 0
    ) {

      return res.status(400).json({

        message:
          "Your cart is empty.",

      });

    }


    // =======================================
    // GET CHECKOUT DATA
    // =======================================

    const {

      orderId:
        checkoutOrderId,

      customer,

      paymentMethod =
        "cod",

      coupon =
        null,

      discount =
        0,

    } = req.body;


    // =======================================
    // CUSTOMER DETAILS
    // =======================================

    const {

      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,

    } = customer || {};


    // =======================================
    // REQUIRED FIELD VALIDATION
    // =======================================

    if (
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {

      return res.status(400).json({

        message:
          "Please provide complete delivery details.",

      });

    }


    // =======================================
    // PHONE VALIDATION
    // =======================================

    const cleanPhone =
      String(phone).trim();


    if (
      !/^\d{10}$/.test(
        cleanPhone
      )
    ) {

      return res.status(400).json({

        message:
          "Please provide a valid 10-digit phone number.",

      });

    }


    // =======================================
    // PINCODE VALIDATION
    // =======================================

    const cleanPincode =
      String(pincode).trim();


    if (
      !/^\d{6}$/.test(
        cleanPincode
      )
    ) {

      return res.status(400).json({

        message:
          "Please provide a valid 6-digit pincode.",

      });

    }


    // =======================================
    // EMAIL VALIDATION
    // =======================================

    const cleanEmail =
      String(email).trim();


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {

      return res.status(400).json({

        message:
          "Please provide a valid email address.",

      });

    }


    // =======================================
    // PAYMENT VALIDATION
    // =======================================

    if (
      ![
        "cod",
        "online",
      ].includes(
        paymentMethod
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid payment method.",

      });

    }


    // =======================================
    // PREPARE ORDER ITEMS
    // =======================================

    const orderItems = [];

    let subtotal = 0;


    // =======================================
    // CHECK EVERY CART PRODUCT
    // =======================================

    for (
      const cartItem of cart.items
    ) {

      // -------------------------------------
      // FIND PRODUCT
      // -------------------------------------

      const product =
        await Product.findById(
          cartItem.product
        );


      if (!product) {

        return res.status(400).json({

          message:
            "One of the products in your cart is no longer available.",

        });

      }


      // -------------------------------------
      // VALIDATE QUANTITY
      // -------------------------------------

      const itemQuantity =
        Number(
          cartItem.quantity
        );


      if (
        !Number.isInteger(
          itemQuantity
        ) ||
        itemQuantity < 1
      ) {

        return res.status(400).json({

          message:
            `Invalid quantity for ${product.name}.`,

        });

      }


      // -------------------------------------
      // STOCK CHECK
      // -------------------------------------

      if (
        product.stock <
        itemQuantity
      ) {

        return res.status(400).json({

          message:
            `${product.name} has only ${product.stock} item(s) left in stock.`,

        });

      }


      // -------------------------------------
      // USE DATABASE PRICE
      // -------------------------------------

      const itemPrice =
        Number(
          product.price
        );


      if (
        !Number.isFinite(
          itemPrice
        ) ||
        itemPrice < 0
      ) {

        return res.status(400).json({

          message:
            `Invalid price for ${product.name}.`,

        });

      }


      // -------------------------------------
      // CALCULATE SUBTOTAL
      // -------------------------------------

      subtotal +=
        itemPrice *
        itemQuantity;


      // -------------------------------------
      // PRODUCT SNAPSHOT
      // -------------------------------------

      orderItems.push({

        product:
          product._id,

        name:
          product.name,

        image:
          product.image || "",

        price:
          itemPrice,

        quantity:
          itemQuantity,

      });

    }


    // =======================================
    // VALIDATE DISCOUNT
    // =======================================

    let validDiscount =
      Number(discount);


    if (
      !Number.isFinite(
        validDiscount
      ) ||
      validDiscount < 0
    ) {

      validDiscount = 0;

    }


    // =======================================
    // DISCOUNT CANNOT EXCEED SUBTOTAL
    // =======================================

    validDiscount =
      Math.min(
        validDiscount,
        subtotal
      );


    // =======================================
    // FINAL TOTAL
    // =======================================

    const total =
      Math.max(
        0,
        subtotal -
        validDiscount
      );


    // =======================================
    // ORDER ID
    // =======================================

    const orderId =
      checkoutOrderId ||
      generateOrderId();


    // =======================================
    // CHECK DUPLICATE ORDER
    // =======================================

    const existingOrder =
      await Order.findOne({
        orderId,
      });


    if (existingOrder) {

      return res.status(409).json({

        message:
          "This order has already been placed.",

        orderId,

      });

    }


    // =======================================
    // CREATE ORDER
    // =======================================

    const order =
      await Order.create({

        orderId,

        userId,

        items:
          orderItems,

        customer: {

          fullName:
            String(
              fullName
            ).trim(),

          phone:
            cleanPhone,

          email:
            cleanEmail,

          address:
            String(
              address
            ).trim(),

          city:
            String(
              city
            ).trim(),

          state:
            String(
              state
            ).trim(),

          pincode:
            cleanPincode,

        },

        subtotal,

        coupon:
          coupon
            ? String(coupon).trim()
            : null,

        discount:
          validDiscount,

        total,

        paymentMethod,

        status:
          "Processing",

      });


    // =======================================
    // REDUCE STOCK
    // =======================================

    for (
      const cartItem of cart.items
    ) {

      const updatedProduct =
        await Product.findOneAndUpdate(

          {
            _id:
              cartItem.product,

            stock: {
              $gte:
                Number(
                  cartItem.quantity
                ),
            },

          },

          {

            $inc: {

              stock:
                -Number(
                  cartItem.quantity
                ),

            },

          },

          {
            new: true,
          }

        );


      // -------------------------------------
      // STOCK CHANGED / NO LONGER AVAILABLE
      // -------------------------------------

      if (!updatedProduct) {

        // Remove created order because
        // stock could not be safely reduced.

        await Order.findByIdAndDelete(
          order._id
        );


        return res.status(409).json({

          message:
            "Stock changed while placing the order. Please review your cart and try again.",

        });

      }

    }


    // =======================================
    // CLEAR CART
    // =======================================

    cart.items = [];

    await cart.save();


    // =======================================
    // RESPONSE
    // =======================================

    console.log(
      "ORDER CREATED:",
      order.orderId
    );


    return res.status(201).json({

      message:
        "Order placed successfully",

      order,

    });


  } catch (error) {

    console.error(
      "Create Order Error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to create order",

      error:
        error.message,

    });

  }

};


// =========================================
// GET USER ORDERS
// =========================================

export const getUserOrders = async (
  req,
  res
) => {

  try {

    const {
      userId,
    } = req.params;


    // =======================================
    // SECURITY CHECK
    // =======================================

    if (
      !req.user ||
      String(req.user.id) !==
        String(userId)
    ) {

      return res.status(403).json({

        message:
          "You are not authorized to access these orders.",

      });

    }


    const orders =
      await Order.find({
        userId,
      }).sort({
        createdAt:
          -1,
      });


    return res.status(200).json(
      orders
    );


  } catch (error) {

    console.error(
      "Get User Orders Error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch orders",

      error:
        error.message,

    });

  }

};


// =========================================
// GET SINGLE ORDER
// =========================================

export const getOrderById = async (
  req,
  res
) => {

  try {

    const {
      orderId,
    } = req.params;


    if (!orderId) {

      return res.status(400).json({

        message:
          "Order ID is required.",

      });

    }


    const order =
      await Order.findOne({
        orderId,
      });


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found",

      });

    }


    // =======================================
    // AUTHORIZATION
    // =======================================

    if (!req.user) {

      return res.status(401).json({

        message:
          "Authentication required.",

      });

    }


    if (
      req.user.role !== "admin" &&
      String(req.user.id) !==
        String(order.userId)
    ) {

      return res.status(403).json({

        message:
          "You are not authorized to access this order.",

      });

    }


    return res.status(200).json(
      order
    );


  } catch (error) {

    console.error(
      "Get Order Error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch order",

      error:
        error.message,

    });

  }

};


// =========================================
// CANCEL ORDER
// =========================================

export const cancelOrder = async (
  req,
  res
) => {

  try {

    const {
      orderId,
    } = req.params;


    const order =
      await Order.findOne({
        orderId,
      });


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found",

      });

    }


    // =======================================
    // AUTHENTICATION
    // =======================================

    if (!req.user) {

      return res.status(401).json({

        message:
          "Authentication required.",

      });

    }


    // =======================================
    // OWNERSHIP
    // =======================================

    if (
      String(req.user.id) !==
      String(order.userId)
    ) {

      return res.status(403).json({

        message:
          "You are not authorized to cancel this order.",

      });

    }


    // =======================================
    // STATUS CHECK
    // =======================================

    if (
      [
        "Shipped",
        "Delivered",
        "Cancelled",
      ].includes(
        order.status
      )
    ) {

      return res.status(400).json({

        message:
          `Order cannot be cancelled because it is already ${order.status.toLowerCase()}.`,

      });

    }


    // =======================================
    // RESTORE STOCK
    // =======================================

    for (
      const item of order.items
    ) {

      await Product.findByIdAndUpdate(

        item.product,

        {

          $inc: {

            stock:
              Number(
                item.quantity
              ),

          },

        }

      );

    }


    // =======================================
    // UPDATE STATUS
    // =======================================

    order.status =
      "Cancelled";


    await order.save();


    // =======================================
    // RESPONSE
    // =======================================

    return res.status(200).json({

      message:
        "Order cancelled successfully",

      order,

    });


  } catch (error) {

    console.error(
      "Cancel Order Error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to cancel order",

      error:
        error.message,

    });

  }

};