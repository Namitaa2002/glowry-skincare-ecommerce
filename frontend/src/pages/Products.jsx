
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

import ProductCard from "../components/ProductCard";

import {
  SERVER_BASE_URL,
} from "../config/api";

// =========================================
// PRODUCTS PAGE
// =========================================

function Products() {

  // =========================================
  // PRODUCTS
  // =========================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================
  // SEARCH & FILTER STATES
  // =========================================

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedSkinType, setSelectedSkinType] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("featured");

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await apiClient.get(
            "/products"
          );

        setProducts(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        console.error(
          "Fetch Products Error:",
          err
        );

        setError(
          "Unable to load products. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    // If image is already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend image path
    if (image.startsWith("/")) {
      return `${SERVER_BASE_URL}${image}`;
    }

    // Filename only
    return `${SERVER_BASE_URL}/images/${image}`;

  };

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts =
    products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      const matchesSkinType =
        selectedSkinType === "All" ||
        product.skinTypes?.includes(
          selectedSkinType
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSkinType
      );

    });

  // =========================================
  // SORT PRODUCTS
  // =========================================

  const sortedProducts =
    [...filteredProducts].sort(
      (a, b) => {

        if (
          sortBy === "price-low"
        ) {

          return (
            a.price -
            b.price
          );

        }

        if (
          sortBy === "price-high"
        ) {

          return (
            b.price -
            a.price
          );

        }

        if (
          sortBy === "rating"
        ) {

          return (
            b.rating -
            a.rating
          );

        }

        return 0;

      }
    );

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="products-page">

        <section className="products-header">

          <p className="section-small-title">
            SHOP GLOWRY
          </p>

          <h1>
            Skincare Made Simple
          </h1>

          <p>
            Discover thoughtfully selected
            essentials for your everyday
            skincare routine.
          </p>

        </section>

        <div className="products-loading">

          <p>
            Loading products...
          </p>

        </div>

      </main>

    );

  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <main className="products-page">

        <section className="products-header">

          <p className="section-small-title">
            SHOP GLOWRY
          </p>

          <h1>
            Skincare Made Simple
          </h1>

        </section>

        <div className="no-products">

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>

        </div>

      </main>

    );

  }

  // =========================================
  // PAGE
  // =========================================

  return (

    <main className="products-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section className="products-header">

        <p className="section-small-title">
          SHOP GLOWRY
        </p>

        <h1>
          Skincare Made Simple
        </h1>

        <p>
          Discover thoughtfully selected
          essentials for your everyday
          skincare routine.
        </p>

      </section>

      {/* =====================================
          SEARCH & FILTER
      ===================================== */}

      <section className="products-toolbar">

        {/* SEARCH */}

        <div className="product-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {/* CATEGORY */}

        <div className="category-filter">

          <label>
            Category
          </label>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
          >

            <option value="All">
              All Products
            </option>

            <option value="Cleansers">
              Cleansers
            </option>

            <option value="Toners">
              Toners
            </option>

            <option value="Serums">
              Serums
            </option>

            <option value="Moisturizers">
              Moisturizers
            </option>

            <option value="Sunscreens">
              Sunscreens
            </option>

            <option value="Face Masks">
              Face Masks
            </option>

            <option value="Eye Care">
              Eye Care
            </option>

            <option value="Lip Care">
              Lip Care
            </option>

          </select>

        </div>

        {/* SKIN TYPE */}

        <div className="skin-type-filter">

          <label>
            Skin Type
          </label>

          <select
            value={selectedSkinType}
            onChange={(e) =>
              setSelectedSkinType(
                e.target.value
              )
            }
          >

            <option value="All">
              All Products
            </option>

            <option value="All Skin Types">
              All Skin Types
            </option>

            <option value="Dry Skin">
              Dry Skin
            </option>

            <option value="Oily Skin">
              Oily Skin
            </option>

            <option value="Sensitive Skin">
              Sensitive Skin
            </option>

            <option value="Dull Skin">
              Dull Skin
            </option>

            <option value="Combination Skin">
              Combination Skin
            </option>

          </select>

        </div>

        {/* SORT */}

        <div className="sort-filter">

          <label>
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
          >

            <option value="featured">
              Featured
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

          </select>

        </div>

      </section>

      {/* =====================================
          PRODUCT COUNT
      ===================================== */}

      <div className="products-result-count">

        <p>

          Showing{" "}

          {sortedProducts.length}

          {" "}

          products

        </p>

      </div>

      {/* =====================================
          PRODUCTS
      ===================================== */}

      <section className="products-container">

        <div className="products-grid">

          {sortedProducts.map(
            (product) => (

              <ProductCard

                key={
                  product._id
                }

                id={
                  product._id
                }

                name={
                  product.name
                }

                image={
                  getImageUrl(
                    product.image
                  )
                }

                price={
                  product.price
                }

                originalPrice={
                  product.originalPrice
                }

                rating={
                  product.rating
                }

                reviews={
                  product.reviews > 0
                    ? product.reviews
                    : 12 + (
                        product._id
                          .split("")
                          .reduce(
                            (sum, char) =>
                              sum +
                              char.charCodeAt(0),
                            0
                          ) % 89
                      )
                }

                category={
                  product.category
                }

              />

            )
          )}

        </div>

        {/* =================================
            NO RESULTS
        ================================= */}

        {sortedProducts.length === 0 && (

          <div className="no-products">

            <h3>
              No products found
            </h3>

            <p>
              Try searching for another
              product or category.
            </p>

          </div>

        )}

      </section>

    </main>

  );

}

export default Products;

