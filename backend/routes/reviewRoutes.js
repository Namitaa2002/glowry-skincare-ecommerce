import express from "express";

import Review from "../models/Review.js";
import Product from "../models/Product.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================================
// GET REVIEWS FOR PRODUCT
// =========================================================

router.get(
  "/product/:productId",
  async (req, res) => {

    try {

      const reviews =
        await Review.find({

          product:
            req.params.productId,

        })
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });


      res.json({
        reviews,
      });


    } catch (error) {

      console.error(
        "Get Reviews Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch reviews.",

      });

    }

  }
);


// =========================================================
// ADD REVIEW
// =========================================================

router.post(
  "/product/:productId",
  protect,
  async (req, res) => {

    try {

      const {
        rating,
        comment,
      } = req.body;


      // =======================================
      // GET USER ID
      // =======================================

      const userId =
        req.user?._id ||
        req.user?.id ||
        req.user?.userId;


      // =======================================
      // CHECK USER ID
      // =======================================

      if (!userId) {

        console.error(
          "Review Error: User ID missing from token.",
          req.user
        );


        return res.status(401).json({

          message:
            "User authentication data is missing. Please login again.",

        });

      }


      // =======================================
      // VALIDATION
      // =======================================

      if (
        !rating ||
        !comment ||
        !comment.trim()
      ) {

        return res.status(400).json({

          message:
            "Rating and review are required.",

        });

      }


      // =======================================
      // CONVERT RATING TO NUMBER
      // =======================================

      const numericRating =
        Number(rating);


      // =======================================
      // RATING VALIDATION
      // =======================================

      if (
        numericRating < 1 ||
        numericRating > 5
      ) {

        return res.status(400).json({

          message:
            "Rating must be between 1 and 5.",

        });

      }


      // =======================================
      // FIND PRODUCT
      // =======================================

      const product =
        await Product.findById(
          req.params.productId
        );


      if (!product) {

        return res.status(404).json({

          message:
            "Product not found.",

        });

      }


      // =======================================
      // CHECK EXISTING REVIEW
      // =======================================

      const existingReview =
        await Review.findOne({

          product:
            req.params.productId,

          user:
            userId,

        });


      if (existingReview) {

        return res.status(409).json({

          message:
            "You have already reviewed this product.",

        });

      }


      // =======================================
      // USER NAME
      // =======================================

      const userName =
        req.user?.name ||
        req.user?.fullName ||
        req.user?.username ||
        "Glowry Customer";


      // =======================================
      // CREATE REVIEW
      // =======================================

      const review =
        await Review.create({

          product:
            req.params.productId,

          user:
            userId,

          userName,

          rating:
            numericRating,

          comment:
            comment.trim(),

        });


      // =======================================
      // GET ALL REVIEWS
      // =======================================

      const allReviews =
        await Review.find({

          product:
            req.params.productId,

        });


      // =======================================
      // TOTAL REVIEWS
      // =======================================

      const totalReviews =
        allReviews.length;


      // =======================================
      // TOTAL RATING
      // =======================================

      const totalRating =
        allReviews.reduce(

          (sum, item) => {

            return (
              sum +
              Number(item.rating)
            );

          },

          0

        );


      // =======================================
      // AVERAGE RATING
      // =======================================

      const averageRating =
        totalReviews > 0

          ? Number(

              (
                totalRating /
                totalReviews
              ).toFixed(1)

            )

          : 0;


      // =======================================
      // UPDATE PRODUCT
      // =======================================

      await Product.findByIdAndUpdate(

        req.params.productId,

        {

          rating:
            averageRating,

          reviews:
            totalReviews,

        }

      );


      // =======================================
      // RESPONSE
      // =======================================

      res.status(201).json({

        message:
          "Review submitted successfully.",

        review,

        rating:
          averageRating,

        reviews:
          totalReviews,

      });


    } catch (error) {

      console.error(
        "Add Review Error:",
        error
      );


      // =======================================
      // DUPLICATE REVIEW
      // =======================================

      if (
        error.code === 11000
      ) {

        return res.status(409).json({

          message:
            "You have already reviewed this product.",

        });

      }


      // =======================================
      // VALIDATION ERROR
      // =======================================

      if (
        error.name ===
        "ValidationError"
      ) {

        return res.status(400).json({

          message:
            "Invalid review data.",

          error:
            error.message,

        });

      }


      // =======================================
      // SERVER ERROR
      // =======================================

      res.status(500).json({

        message:
          "Failed to submit review.",

      });

    }

  }
);


// =========================================================
// DELETE OWN REVIEW
// =========================================================

router.delete(
  "/:reviewId",
  protect,
  async (req, res) => {

    try {

      // =======================================
      // GET USER ID
      // =======================================

      const userId =
        req.user?._id ||
        req.user?.id ||
        req.user?.userId;


      if (!userId) {

        return res.status(401).json({

          message:
            "User authentication data is missing. Please login again.",

        });

      }


      // =======================================
      // FIND REVIEW
      // =======================================

      const review =
        await Review.findById(
          req.params.reviewId
        );


      if (!review) {

        return res.status(404).json({

          message:
            "Review not found.",

        });

      }


      // =======================================
      // CHECK REVIEW OWNER
      // =======================================

      if (
        String(review.user) !==
        String(userId)
      ) {

        return res.status(403).json({

          message:
            "You can only delete your own review.",

        });

      }


      // =======================================
      // SAVE PRODUCT ID
      // =======================================

      const productId =
        review.product;


      // =======================================
      // DELETE REVIEW
      // =======================================

      await Review.findByIdAndDelete(
        req.params.reviewId
      );


      // =======================================
      // GET REMAINING REVIEWS
      // =======================================

      const remainingReviews =
        await Review.find({

          product:
            productId,

        });


      // =======================================
      // TOTAL REVIEWS
      // =======================================

      const totalReviews =
        remainingReviews.length;


      // =======================================
      // TOTAL RATING
      // =======================================

      const totalRating =
        remainingReviews.reduce(

          (sum, item) => {

            return (
              sum +
              Number(item.rating)
            );

          },

          0

        );


      // =======================================
      // AVERAGE RATING
      // =======================================

      const averageRating =
        totalReviews > 0

          ? Number(

              (
                totalRating /
                totalReviews
              ).toFixed(1)

            )

          : 0;


      // =======================================
      // UPDATE PRODUCT
      // =======================================

      await Product.findByIdAndUpdate(

        productId,

        {

          rating:
            averageRating,

          reviews:
            totalReviews,

        }

      );


      // =======================================
      // RESPONSE
      // =======================================

      res.json({

        message:
          "Review deleted successfully.",

        rating:
          averageRating,

        reviews:
          totalReviews,

      });


    } catch (error) {

      console.error(
        "Delete Review Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to delete review.",

      });

    }

  }
);


export default router;