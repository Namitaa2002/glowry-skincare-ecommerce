import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


// =========================================
// HELPER — RETURN POPULATED CART
// =========================================

const getPopulatedCart = async (userId) => {
  return await Cart.findOne({ userId })
    .populate("items.product");
};


// =========================================
// HELPER — CHECK CART OWNERSHIP
// =========================================

const isAuthorizedUser = (req, userId) => {
  return (
    req.user &&
    String(req.user.id) === String(userId)
  );
};


// =========================================
// GET CART
// =========================================

export const getCart = async (req, res) => {

  try {

    const { userId } = req.params;

    // ---------------------------------------
    // SECURITY CHECK
    // ---------------------------------------

    if (!isAuthorizedUser(req, userId)) {

      return res.status(403).json({
        message:
          "You are not authorized to access this cart.",
      });

    }

    // ---------------------------------------
    // GET CART
    // ---------------------------------------

    let cart =
      await getPopulatedCart(userId);

    // ---------------------------------------
    // CREATE EMPTY CART IF NOT EXISTS
    // ---------------------------------------

    if (!cart) {

      cart = await Cart.create({
        userId,
        items: [],
      });

      cart =
        await getPopulatedCart(userId);
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
    });

  }

};


// =========================================
// ADD TO CART
// =========================================

export const addToCart = async (req, res) => {

  try {

    const { userId } = req.params;

    // ---------------------------------------
    // SECURITY CHECK
    // ---------------------------------------

    if (!isAuthorizedUser(req, userId)) {

      return res.status(403).json({
        message:
          "You are not authorized to access this cart.",
      });

    }

    const {
      productId,
      quantity = 1,
    } = req.body;

    // ---------------------------------------
    // VALIDATE PRODUCT ID
    // ---------------------------------------

    if (!productId) {

      return res.status(400).json({
        message:
          "Product ID is required",
      });

    }

    // ---------------------------------------
    // VALIDATE QUANTITY
    // ---------------------------------------

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {

      return res.status(400).json({
        message:
          "Quantity must be at least 1",
      });

    }

    // ---------------------------------------
    // FIND PRODUCT
    // ---------------------------------------

    const product =
      await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        message:
          "Product not found",
      });

    }

    // ---------------------------------------
    // CHECK STOCK
    // ---------------------------------------

    if (
      product.stock < requestedQuantity
    ) {

      return res.status(400).json({
        message:
          `Only ${product.stock} item(s) available in stock`,
      });

    }

    // ---------------------------------------
    // FIND USER CART
    // ---------------------------------------

    let cart =
      await Cart.findOne({ userId });

    // ---------------------------------------
    // CREATE CART IF NOT EXISTS
    // ---------------------------------------

    if (!cart) {

      cart = new Cart({
        userId,
        items: [],
      });

    }

    // ---------------------------------------
    // CHECK EXISTING PRODUCT
    // ---------------------------------------

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

    // ---------------------------------------
    // ADD PRODUCT
    // ---------------------------------------

    cart.items.push({
      product: productId,
      quantity: requestedQuantity,
    });

    await cart.save();

    // ---------------------------------------
    // RETURN UPDATED CART
    // ---------------------------------------

    const updatedCart =
      await getPopulatedCart(userId);

    res.status(201).json(updatedCart);

  } catch (error) {

    console.error(
      "Add To Cart Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to add product to cart",
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

      // ---------------------------------------
      // SECURITY CHECK
      // ---------------------------------------

      if (!isAuthorizedUser(req, userId)) {

        return res.status(403).json({
          message:
            "You are not authorized to access this cart.",
        });

      }

      const {
        quantity,
      } = req.body;

      const newQuantity =
        Number(quantity);

      // ---------------------------------------
      // VALIDATE QUANTITY
      // ---------------------------------------

      if (
        !Number.isInteger(newQuantity) ||
        newQuantity < 1
      ) {

        return res.status(400).json({
          message:
            "Quantity must be at least 1",
        });

      }

      // ---------------------------------------
      // FIND PRODUCT
      // ---------------------------------------

      const product =
        await Product.findById(productId);

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      // ---------------------------------------
      // CHECK STOCK
      // ---------------------------------------

      if (
        product.stock < newQuantity
      ) {

        return res.status(400).json({
          message:
            `Only ${product.stock} item(s) available in stock`,
        });

      }

      // ---------------------------------------
      // FIND CART
      // ---------------------------------------

      const cart =
        await Cart.findOne({ userId });

      if (!cart) {

        return res.status(404).json({
          message:
            "Cart not found",
        });

      }

      // ---------------------------------------
      // FIND CART ITEM
      // ---------------------------------------

      const item =
        cart.items.find(
          (cartItem) =>
            String(cartItem.product) ===
            String(productId)
        );

      if (!item) {

        return res.status(404).json({
          message:
            "Product not found in cart",
        });

      }

      // ---------------------------------------
      // UPDATE QUANTITY
      // ---------------------------------------

      item.quantity =
        newQuantity;

      await cart.save();

      // ---------------------------------------
      // RETURN UPDATED CART
      // ---------------------------------------

      const updatedCart =
        await getPopulatedCart(userId);

      res.status(200).json(updatedCart);

    } catch (error) {

      console.error(
        "Update Cart Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update cart",
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

      // ---------------------------------------
      // SECURITY CHECK
      // ---------------------------------------

      if (!isAuthorizedUser(req, userId)) {

        return res.status(403).json({
          message:
            "You are not authorized to access this cart.",
        });

      }

      // ---------------------------------------
      // FIND CART
      // ---------------------------------------

      const cart =
        await Cart.findOne({ userId });

      if (!cart) {

        return res.status(404).json({
          message:
            "Cart not found",
        });

      }

      // ---------------------------------------
      // CHECK PRODUCT IN CART
      // ---------------------------------------

      const originalLength =
        cart.items.length;

      cart.items =
        cart.items.filter(
          (item) =>
            String(item.product) !==
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

      // ---------------------------------------
      // RETURN UPDATED CART
      // ---------------------------------------

      const updatedCart =
        await getPopulatedCart(userId);

      res.status(200).json(updatedCart);

    } catch (error) {

      console.error(
        "Remove Cart Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to remove product",
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

      // ---------------------------------------
      // SECURITY CHECK
      // ---------------------------------------

      if (!isAuthorizedUser(req, userId)) {

        return res.status(403).json({
          message:
            "You are not authorized to access this cart.",
        });

      }

      // ---------------------------------------
      // FIND CART
      // ---------------------------------------

      const cart =
        await Cart.findOne({ userId });

      if (!cart) {

        return res.status(404).json({
          message:
            "Cart not found",
        });

      }

      // ---------------------------------------
      // CLEAR CART
      // ---------------------------------------

      cart.items = [];

      await cart.save();

      // ---------------------------------------
      // RESPONSE
      // ---------------------------------------

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
      });

    }

  };