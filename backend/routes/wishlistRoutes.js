import express from "express";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();


// =========================================
// GET USER WISHLIST
// =========================================

router.get("/:userId", async (req, res) => {

  try {

    const wishlist = await Wishlist.findOne({
      userId: req.params.userId,
    });

    if (!wishlist) {

      return res.json({
        userId: req.params.userId,
        items: [],
      });

    }

    res.json(wishlist);

  } catch (error) {

    console.error(
      "Fetch Wishlist Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch wishlist.",
    });

  }

});


// =========================================
// ADD TO WISHLIST
// =========================================

router.post("/:userId", async (req, res) => {

  try {

    const {
      product,
      name,
      image,
      price,
      originalPrice,
      category,
      rating,
    } = req.body;


    if (!product || !name || price === undefined) {

      return res.status(400).json({
        message: "Product details are missing.",
      });

    }


    let wishlist = await Wishlist.findOne({
      userId: req.params.userId,
    });


    // Create wishlist if it doesn't exist

    if (!wishlist) {

      wishlist = await Wishlist.create({

        userId: req.params.userId,

        items: [
          {
            product,
            name,
            image,
            price,
            originalPrice,
            category,
            rating,
          },
        ],

      });

      return res.status(201).json(wishlist);

    }


    // Check duplicate

    const alreadyExists =
      wishlist.items.some(
        (item) =>
          item.product.toString() ===
          product.toString()
      );


    if (alreadyExists) {

      return res.status(409).json({
        message: "Product already in wishlist.",
        wishlist,
      });

    }


    wishlist.items.push({

      product,
      name,
      image,
      price,
      originalPrice,
      category,
      rating,

    });


    await wishlist.save();


    res.status(201).json(wishlist);

  } catch (error) {

    console.error(
      "Add Wishlist Error:",
      error
    );

    res.status(500).json({
      message: "Failed to add product to wishlist.",
      error: error.message,
    });

  }

});


// =========================================
// REMOVE FROM WISHLIST
// =========================================

router.delete(
  "/:userId/:productId",
  async (req, res) => {

    try {

      const wishlist =
        await Wishlist.findOne({
          userId: req.params.userId,
        });


      if (!wishlist) {

        return res.status(404).json({
          message: "Wishlist not found.",
        });

      }


      wishlist.items =
        wishlist.items.filter(
          (item) =>
            item.product.toString() !==
            req.params.productId
        );


      await wishlist.save();


      res.json({
        message:
          "Product removed from wishlist.",
        wishlist,
      });

    } catch (error) {

      console.error(
        "Remove Wishlist Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to remove product from wishlist.",
      });

    }

  }
);


export default router;