import Cart from "../models/Cart.js";


// =========================================
// GET CART
// =========================================

export const getCart = async (req, res) => {

  try {

    const { userId } = req.params;

    let cart =
      await Cart.findOne({
        userId,
      }).populate("items.product");


    // =======================================
    // CREATE EMPTY CART IF NOT EXISTS
    // =======================================

    if (!cart) {

      cart = await Cart.create({

        userId,

        items: [],

      });

    }


    res.status(200).json(cart);

  } catch (error) {

    console.error(
      "Get Cart Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch cart",

      error:
        error.message,

    });

  }

};



// =========================================
// ADD TO CART
// =========================================

export const addToCart = async (req, res) => {

  try {

    const { userId } = req.params;

    const {
      productId,
      quantity = 1,
    } = req.body;


    // =======================================
    // VALIDATE PRODUCT ID
    // =======================================

    if (!productId) {

      return res.status(400).json({

        message:
          "Product ID is required",

      });

    }


    // =======================================
    // FIND USER CART
    // =======================================

    let cart =
      await Cart.findOne({
        userId,
      });


    // =======================================
    // CREATE CART IF NOT EXISTS
    // =======================================

    if (!cart) {

      cart = new Cart({

        userId,

        items: [],

      });

    }


    // =======================================
    // CHECK EXISTING PRODUCT
    // =======================================

    const existingItem =
      cart.items.find(

        (item) =>

          String(item.product) ===
          String(productId)

      );


    if (existingItem) {

      return res.status(409).json({

        message:
          "Product is already in your cart",

      });

    }


    // =======================================
    // ADD PRODUCT
    // =======================================

    cart.items.push({

      product: productId,

      quantity:
        Number(quantity) || 1,

    });


    await cart.save();


    // =======================================
    // RETURN UPDATED CART
    // =======================================

    const updatedCart =
      await Cart.findOne({

        userId,

      }).populate(
        "items.product"
      );


    res.status(201).json(
      updatedCart
    );

  } catch (error) {

    console.error(
      "Add To Cart Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to add product to cart",

      error:
        error.message,

    });

  }

};



// =========================================
// UPDATE CART QUANTITY
// =========================================

export const updateCartQuantity =
  async (req, res) => {

    try {

      const {
        userId,
        productId,
      } = req.params;


      const {
        quantity,
      } = req.body;


      const newQuantity =
        Number(quantity);


      // =====================================
      // VALIDATE QUANTITY
      // =====================================

      if (
        !newQuantity ||
        newQuantity < 1
      ) {

        return res.status(400).json({

          message:
            "Quantity must be at least 1",

        });

      }


      // =====================================
      // FIND CART
      // =====================================

      const cart =
        await Cart.findOne({
          userId,
        });


      if (!cart) {

        return res.status(404).json({

          message:
            "Cart not found",

        });

      }


      // =====================================
      // FIND PRODUCT
      // =====================================

      const item =
        cart.items.find(

          (cartItem) =>

            String(
              cartItem.product
            ) ===
            String(productId)

        );


      if (!item) {

        return res.status(404).json({

          message:
            "Product not found in cart",

        });

      }


      // =====================================
      // UPDATE QUANTITY
      // =====================================

      item.quantity =
        newQuantity;


      await cart.save();


      // =====================================
      // RETURN UPDATED CART
      // =====================================

      const updatedCart =
        await Cart.findOne({

          userId,

        }).populate(
          "items.product"
        );


      res.status(200).json(
        updatedCart
      );

    } catch (error) {

      console.error(
        "Update Cart Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update cart",

        error:
          error.message,

      });

    }

  };



// =========================================
// REMOVE PRODUCT
// =========================================

export const removeFromCart =
  async (req, res) => {

    try {

      const {
        userId,
        productId,
      } = req.params;


      const cart =
        await Cart.findOne({
          userId,
        });


      if (!cart) {

        return res.status(404).json({

          message:
            "Cart not found",

        });

      }


      // =====================================
      // REMOVE PRODUCT
      // =====================================

      const originalLength =
        cart.items.length;


      cart.items =
        cart.items.filter(

          (item) =>

            String(
              item.product
            ) !==
            String(productId)

        );


      if (
        cart.items.length ===
        originalLength
      ) {

        return res.status(404).json({

          message:
            "Product not found in cart",

        });

      }


      await cart.save();


      // =====================================
      // RETURN UPDATED CART
      // =====================================

      const updatedCart =
        await Cart.findOne({

          userId,

        }).populate(
          "items.product"
        );


      res.status(200).json(
        updatedCart
      );

    } catch (error) {

      console.error(
        "Remove Cart Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to remove product",

        error:
          error.message,

      });

    }

  };



// =========================================
// CLEAR CART
// =========================================

export const clearCart =
  async (req, res) => {

    try {

      const { userId } =
        req.params;


      const cart =
        await Cart.findOne({
          userId,
        });


      if (!cart) {

        return res.status(404).json({

          message:
            "Cart not found",

        });

      }


      cart.items = [];


      await cart.save();


      res.status(200).json({

        message:
          "Cart cleared successfully",

        cart,

      });

    } catch (error) {

      console.error(
        "Clear Cart Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to clear cart",

        error:
          error.message,

      });

    }

  };