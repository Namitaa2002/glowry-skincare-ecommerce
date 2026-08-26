import Product from "../models/Product.js";


// =========================================
// GET ALL PRODUCTS
// =========================================

export const getProducts = async (req, res) => {

  try {

    const products =
      await Product.find().sort({
        createdAt: -1,
      });

    res.status(200).json(products);

  } catch (error) {

    console.error(
      "Get Products Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch products",
      error:
        error.message,
    });

  }

};


// =========================================
// GET SINGLE PRODUCT
// =========================================

export const getProductById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {

      return res.status(404).json({
        message:
          "Product not found",
      });

    }

    res.status(200).json(product);

  } catch (error) {

    console.error(
      "Get Product Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch product",
      error:
        error.message,
    });

  }

};


// =========================================
// CREATE PRODUCT
// =========================================

export const createProduct = async (
  req,
  res
) => {

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


    // =======================================
    // REQUIRED FIELD VALIDATION
    // =======================================

    if (
      !name ||
      !category ||
      price === undefined ||
      originalPrice === undefined ||
      !image
    ) {

      return res.status(400).json({
        message:
          "Please provide all required product details",
      });

    }


    // =======================================
    // NUMBER CONVERSION
    // =======================================

    const productPrice =
      Number(price);

    const productOriginalPrice =
      Number(originalPrice);

    const productStock =
      Number(stock ?? 0);

    const productRating =
      Number(rating ?? 0);

    const productReviews =
      Number(reviews ?? 0);


    // =======================================
    // NUMBER VALIDATION
    // =======================================

    if (
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {

      return res.status(400).json({
        message:
          "Price must be a valid positive number",
      });

    }


    if (
      !Number.isFinite(productOriginalPrice) ||
      productOriginalPrice < 0
    ) {

      return res.status(400).json({
        message:
          "Original price must be a valid positive number",
      });

    }


    if (
      !Number.isInteger(productStock) ||
      productStock < 0
    ) {

      return res.status(400).json({
        message:
          "Stock must be a valid non-negative integer",
      });

    }


    if (
      !Number.isFinite(productRating) ||
      productRating < 0 ||
      productRating > 5
    ) {

      return res.status(400).json({
        message:
          "Rating must be between 0 and 5",
      });

    }


    if (
      !Number.isInteger(productReviews) ||
      productReviews < 0
    ) {

      return res.status(400).json({
        message:
          "Reviews must be a valid non-negative integer",
      });

    }


    // =======================================
    // CREATE PRODUCT
    // =======================================

    const product =
      await Product.create({

        name:
          String(name).trim(),

        category:
          String(category).trim(),

        skinTypes:
          Array.isArray(skinTypes)
            ? skinTypes
            : [],

        price:
          productPrice,

        originalPrice:
          productOriginalPrice,

        image:
          String(image).trim(),

        rating:
          productRating,

        reviews:
          productReviews,

        description:
          description
            ? String(description).trim()
            : "",

        stock:
          productStock,

      });


    res.status(201).json({

      message:
        "Product created successfully",

      product,

    });

  } catch (error) {

    console.error(
      "Create Product Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create product",

      error:
        error.message,

    });

  }

};


// =========================================
// UPDATE PRODUCT
// =========================================

export const updateProduct = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    // =======================================
    // ALLOWED FIELDS ONLY
    // =======================================

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


    const updateData = {};


    // =======================================
    // TEXT FIELDS
    // =======================================

    if (name !== undefined) {

      if (!String(name).trim()) {

        return res.status(400).json({
          message:
            "Product name cannot be empty",
        });

      }

      updateData.name =
        String(name).trim();

    }


    if (category !== undefined) {

      if (!String(category).trim()) {

        return res.status(400).json({
          message:
            "Product category cannot be empty",
        });

      }

      updateData.category =
        String(category).trim();

    }


    if (image !== undefined) {

      if (!String(image).trim()) {

        return res.status(400).json({
          message:
            "Product image is required",
        });

      }

      updateData.image =
        String(image).trim();

    }


    if (description !== undefined) {

      updateData.description =
        String(description).trim();

    }


    // =======================================
    // SKIN TYPES
    // =======================================

    if (skinTypes !== undefined) {

      if (!Array.isArray(skinTypes)) {

        return res.status(400).json({
          message:
            "Skin types must be an array",
        });

      }

      updateData.skinTypes =
        skinTypes;

    }


    // =======================================
    // PRICE
    // =======================================

    if (price !== undefined) {

      const productPrice =
        Number(price);

      if (
        !Number.isFinite(productPrice) ||
        productPrice < 0
      ) {

        return res.status(400).json({
          message:
            "Price must be a valid positive number",
        });

      }

      updateData.price =
        productPrice;

    }


    // =======================================
    // ORIGINAL PRICE
    // =======================================

    if (
      originalPrice !== undefined
    ) {

      const productOriginalPrice =
        Number(originalPrice);

      if (
        !Number.isFinite(
          productOriginalPrice
        ) ||
        productOriginalPrice < 0
      ) {

        return res.status(400).json({
          message:
            "Original price must be a valid positive number",
        });

      }

      updateData.originalPrice =
        productOriginalPrice;

    }


    // =======================================
    // STOCK
    // =======================================

    if (stock !== undefined) {

      const productStock =
        Number(stock);

      if (
        !Number.isInteger(
          productStock
        ) ||
        productStock < 0
      ) {

        return res.status(400).json({
          message:
            "Stock must be a valid non-negative integer",
        });

      }

      updateData.stock =
        productStock;

    }


    // =======================================
    // RATING
    // =======================================

    if (rating !== undefined) {

      const productRating =
        Number(rating);

      if (
        !Number.isFinite(
          productRating
        ) ||
        productRating < 0 ||
        productRating > 5
      ) {

        return res.status(400).json({
          message:
            "Rating must be between 0 and 5",
        });

      }

      updateData.rating =
        productRating;

    }


    // =======================================
    // REVIEWS
    // =======================================

    if (reviews !== undefined) {

      const productReviews =
        Number(reviews);

      if (
        !Number.isInteger(
          productReviews
        ) ||
        productReviews < 0
      ) {

        return res.status(400).json({
          message:
            "Reviews must be a valid non-negative integer",
        });

      }

      updateData.reviews =
        productReviews;

    }


    // =======================================
    // CHECK EMPTY UPDATE
    // =======================================

    if (
      Object.keys(updateData).length === 0
    ) {

      return res.status(400).json({
        message:
          "No valid product fields provided for update",
      });

    }


    // =======================================
    // UPDATE PRODUCT
    // =======================================

    const product =
      await Product.findByIdAndUpdate(

        id,

        updateData,

        {
          new: true,
          runValidators: true,
        }

      );


    if (!product) {

      return res.status(404).json({
        message:
          "Product not found",
      });

    }


    res.status(200).json({

      message:
        "Product updated successfully",

      product,

    });

  } catch (error) {

    console.error(
      "Update Product Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to update product",

      error:
        error.message,

    });

  }

};


// =========================================
// DELETE PRODUCT
// =========================================

export const deleteProduct = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const product =
      await Product.findByIdAndDelete(id);


    if (!product) {

      return res.status(404).json({
        message:
          "Product not found",
      });

    }


    res.status(200).json({

      message:
        "Product deleted successfully",

    });

  } catch (error) {

    console.error(
      "Delete Product Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete product",

      error:
        error.message,

    });

  }

};