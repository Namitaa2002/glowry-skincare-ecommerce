import mongoose from "mongoose";


// =========================================
// CART ITEM SCHEMA
// =========================================

const cartItemSchema = new mongoose.Schema(
  {

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },


    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

  },

  {
    _id: false,
  }

);


// =========================================
// CART SCHEMA
// =========================================

const cartSchema = new mongoose.Schema(

  {

    userId: {
      type: String,
      required: true,
      unique: true,
    },


    items: {
      type: [cartItemSchema],
      default: [],
    },

  },

  {
    timestamps: true,
  }

);


// =========================================
// CART MODEL
// =========================================

const Cart =
  mongoose.model(
    "Cart",
    cartSchema
  );


export default Cart;