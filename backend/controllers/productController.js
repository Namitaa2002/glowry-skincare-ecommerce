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
    // VALIDATION
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
    // CREATE PRODUCT
    // =======================================

    const product =
      await Product.create({

        name,

        category,

        skinTypes:
          skinTypes || [],

        price,

        originalPrice,

        image,

        rating:
          rating || 0,

        reviews:
          reviews || 0,

        description:
          description || "",

        stock:
          stock || 0,

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

    const { id } = req.params;


    const product =
      await Product.findByIdAndUpdate(

        id,

        req.body,

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

    const { id } = req.params;


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