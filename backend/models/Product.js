import mongoose from "mongoose";


// =========================================
// PRODUCT SCHEMA
// =========================================

const productSchema = new mongoose.Schema(

  {

    name: {
      type: String,
      required: true,
      trim: true,
    },


    category: {
      type: String,
      required: true,
      trim: true,
    },


    skinTypes: {
      type: [String],
      default: [],
    },


    price: {
      type: Number,
      required: true,
    },


    originalPrice: {
      type: Number,
      required: true,
    },


    image: {
      type: String,
      required: true,
    },


    rating: {
      type: Number,
      default: 0,
    },


    reviews: {
      type: Number,
      default: 0,
    },


    description: {
      type: String,
      default: "",
    },


    stock: {
      type: Number,
      default: 0,
    },

  },

  {
    timestamps: true,
  }

);


// =========================================
// PRODUCT MODEL
// =========================================

const Product =
  mongoose.model(
    "Product",
    productSchema
  );


export default Product;