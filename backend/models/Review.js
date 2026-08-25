import mongoose from "mongoose";

// =========================================
// REVIEW SCHEMA
// =========================================

const reviewSchema = new mongoose.Schema(
  {
    // =======================================
    // PRODUCT
    // =======================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // =======================================
    // USER
    // =======================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =======================================
    // USER NAME
    // =======================================

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    // =======================================
    // RATING
    // =======================================

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // =======================================
    // REVIEW TEXT
    // =======================================

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
  },

  {
    timestamps: true,
  }
);


// =========================================
// ONE USER = ONE REVIEW PER PRODUCT
// =========================================

reviewSchema.index(
  {
    product: 1,
    user: 1,
  },
  {
    unique: true,
  }
);


// =========================================
// REVIEW MODEL
// =========================================

const Review = mongoose.model(
  "Review",
  reviewSchema
);


export default Review;