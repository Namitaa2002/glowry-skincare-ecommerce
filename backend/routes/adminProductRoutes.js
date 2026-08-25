import express from "express";

import Product from "../models/Product.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================================
// GET ALL PRODUCTS
// GET /api/admin/products
// =====================================================

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const products = await Product.find()
        .sort({ createdAt: -1 });

      res.status(200).json(products);

    } catch (error) {

      console.error(
        "Admin Get Products Error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch products.",
      });

    }

  }
);


// =====================================================
// ADD PRODUCT
// POST /api/admin/products
// =====================================================

router.post(
  "/",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const {
        name,
        category,
        skinTypes,
        price,
        originalPrice,
        image,
        rating,
        reviews,
        description,
        stock,
      } = req.body;


      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (
        !name ||
        !category ||
        price === undefined ||
        originalPrice === undefined ||
        !image
      ) {

        return res.status(400).json({
          message:
            "Please fill all required product fields.",
        });

      }


      // -------------------------------
      // CREATE PRODUCT
      // -------------------------------

      const product = await Product.create({

        name: name.trim(),

        category: category.trim(),

        skinTypes:
          Array.isArray(skinTypes)
            ? skinTypes
            : [],

        price: Number(price),

        originalPrice:
          Number(originalPrice),

        image: image.trim(),

        rating:
          Number(rating || 0),

        reviews:
          Number(reviews || 0),

        description:
          description || "",

        stock:
          Number(stock || 0),

      });


      res.status(201).json({

        message:
          "Product added successfully.",

        product,

      });

    } catch (error) {

      console.error(
        "Admin Add Product Error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to add product.",

      });

    }

  }
);


// =====================================================
// UPDATE PRODUCT
// PUT /api/admin/products/:id
// =====================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );


      if (!product) {

        return res.status(404).json({

          message:
            "Product not found.",

        });

      }


      const {
        name,
        category,
        skinTypes,
        price,
        originalPrice,
        image,
        rating,
        reviews,
        description,
        stock,
      } = req.body;


      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (
        !name ||
        !category ||
        price === undefined ||
        originalPrice === undefined ||
        !image
      ) {

        return res.status(400).json({

          message:
            "Please fill all required product fields.",

        });

      }


      // -------------------------------
      // UPDATE
      // -------------------------------

      product.name =
        name.trim();

      product.category =
        category.trim();

      product.skinTypes =
        Array.isArray(skinTypes)
          ? skinTypes
          : [];

      product.price =
        Number(price);

      product.originalPrice =
        Number(originalPrice);

      product.image =
        image.trim();

      product.rating =
        Number(rating || 0);

      product.reviews =
        Number(reviews || 0);

      product.description =
        description || "";

      product.stock =
        Number(stock || 0);


      const updatedProduct =
        await product.save();


      res.status(200).json({

        message:
          "Product updated successfully.",

        product:
          updatedProduct,

      });

    } catch (error) {

      console.error(
        "Admin Update Product Error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update product.",

      });

    }

  }
);


// =====================================================
// DELETE PRODUCT
// DELETE /api/admin/products/:id
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );


      if (!product) {

        return res.status(404).json({

          message:
            "Product not found.",

        });

      }


      await Product.findByIdAndDelete(
        req.params.id
      );


      res.status(200).json({

        message:
          "Product deleted successfully.",

        productId:
          req.params.id,

      });

    } catch (error) {

      console.error(
        "Admin Delete Product Error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to delete product.",

      });

    }

  }
);


export default router;