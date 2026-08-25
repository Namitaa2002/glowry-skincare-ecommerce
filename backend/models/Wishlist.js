import mongoose from "mongoose";


// =========================================
// WISHLIST ITEM SCHEMA
// =========================================

const wishlistItemSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
  },

  originalPrice: {
    type: Number,
    default: null,
  },

  category: {
    type: String,
    default: "SKINCARE",
  },

  rating: {
    type: Number,
    default: 0,
  },

});


// =========================================
// WISHLIST SCHEMA
// =========================================

const wishlistSchema = new mongoose.Schema(
  {

    userId: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [wishlistItemSchema],
      default: [],
    },

  },
  {
    timestamps: true,
  }
);


export default mongoose.model(
  "Wishlist",
  wishlistSchema
);