import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

// =========================================
// SKIN MATCH
// =========================================

function SkinMatch() {

  // =========================================
  // CONCERNS
  // =========================================

  const concerns = [

    {
      id: "hydration",
      icon: "💧",
      title: "Hydration",
      description:
        "Dry, tight or dehydrated skin",
      keywords: [
        "moisturizer",
        "hydration",
        "hydrating",
        "dry",
      ],
    },

    {
      id: "oiliness",
      icon: "✨",
      title: "Oil Control",
      description:
        "Excess oil and shine",
      keywords: [
        "oil",
        "oily",
        "balance",
        "niacinamide",
      ],
    },

    {
      id: "dullness",
      icon: "🌿",
      title: "Dullness",
      description:
        "Skin looking tired or uneven",
      keywords: [
        "bright",
        "dull",
        "glow",
        "vitamin",
        "serum",
      ],
    },

    {
      id: "sensitivity",
      icon: "🌸",
      title: "Sensitive Skin",
      description:
        "Gentle care for delicate skin",
      keywords: [
        "sensitive",
        "calm",
        "gentle",
        "barrier",
        "ceramide",
      ],
    },

    {
      id: "acne",
      icon: "🍃",
      title: "Breakouts",
      description:
        "Blemishes and congested skin",
      keywords: [
        "acne",
        "breakout",
        "clarify",
        "niacinamide",
        "cleanser",
      ],
    },

    {
      id: "protection",
      icon: "☀",
      title: "Protection",
      description:
        "Daily sun protection",
      keywords: [
        "sunscreen",
        "spf",
        "sun",
        "protect",
      ],
    },

  ];

  // =========================================
  // STATES
  // =========================================

  const [selectedConcern, setSelectedConcern] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `${API_BASE_URL}/products`
          );

        const productData =
          Array.isArray(response.data)
            ? response.data
            : [];

        setProducts(productData);

      } catch (error) {

        console.error(
          "Skin Match Products Error:",
          error
        );

        setProducts([]);

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

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${SERVER_BASE_URL}${image}`;
    }

    return `${SERVER_BASE_URL}/images/${image}`;

  };

  // =========================================
  // FIND RECOMMENDED PRODUCTS
  // =========================================

  const getRecommendedProducts = () => {

    if (!selectedConcern) {
      return [];
    }

    const concern =
      concerns.find(
        (item) =>
          item.id === selectedConcern
      );

    if (!concern) {
      return [];
    }

    const matchedProducts =
      products.filter((product) => {

        const productText = [

          product.name || "",

          product.category || "",

          product.description || "",

          ...(product.skinTypes || []),

        ]
          .join(" ")
          .toLowerCase();

        return concern.keywords.some(
          (keyword) =>
            productText.includes(
              keyword.toLowerCase()
            )
        );

      });

    // =====================================
    // IF MATCHES ARE LESS THAN 3
    // SHOW FIRST PRODUCTS AS FALLBACK
    // =====================================

    if (
      matchedProducts.length < 3
    ) {

      return products.slice(0, 3);

    }

    return matchedProducts.slice(0, 3);

  };

  const recommendedProducts =
    getRecommendedProducts();

  const selectedConcernData =
    concerns.find(
      (item) =>
        item.id === selectedConcern
    );

  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="skin-match-component">

      {/* =====================================
          CONCERN OPTIONS
      ===================================== */}

      <div className="skin-concern-grid">

        {concerns.map((concern) => (

          <button
            key={concern.id}
            type="button"
            className={`skin-concern-card ${
              selectedConcern === concern.id
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedConcern(
                concern.id
              )
            }
          >

            <span className="skin-concern-icon">
              {concern.icon}
            </span>

            <span className="skin-concern-content">

              <strong>
                {concern.title}
              </strong>

              <small>
                {concern.description}
              </small>

            </span>

            <span className="skin-concern-arrow">
              →
            </span>

          </button>

        ))}

      </div>

      {/* =====================================
          RECOMMENDATION AREA
      ===================================== */}

      {selectedConcern && (

        <div className="skin-recommendation-area">

          {/* ===================================
              RESULT HEADER
          =================================== */}

          <div className="skin-recommendation-header">

            <div>

              <span className="recommendation-label">
                YOUR GLOWRY MATCH
              </span>

              <h4>

                {selectedConcernData?.title}
                {" "}Care

              </h4>

              <p>

                We found a few essentials
                that may work beautifully
                with your routine.

              </p>

            </div>

            <div className="recommendation-badge">

              <span>
                {selectedConcernData?.icon}
              </span>

              <small>
                Recommended
              </small>

            </div>

          </div>

          {/* ===================================
              PRODUCTS
          =================================== */}

          {loading ? (

            <div className="skin-match-loading">

              <span className="skin-loader"></span>

              <p>
                Finding your glow match...
              </p>

            </div>

          ) : recommendedProducts.length > 0 ? (

            <>

              <div className="skin-recommended-products">

                {recommendedProducts.map(
                  (product) => (

                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="skin-recommended-product"
                    >

                      <div className="skin-recommended-image">

                        <img
                          src={getImageUrl(
                            product.image
                          )}
                          alt={product.name}
                        />

                      </div>

                      <div className="skin-recommended-info">

                        <span>
                          {product.category}
                        </span>

                        <h5>
                          {product.name}
                        </h5>

                        <div className="skin-product-bottom">

                          <strong>
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <div className="skin-product-rating">

                            <span>
                              ★
                            </span>

                            {product.rating ||
                              4.5}

                          </div>

                        </div>

                      </div>

                    </Link>

                  )
                )}

              </div>

              {/* =================================
                  SHOP BUTTON
              ================================= */}

              <div className="skin-recommendation-footer">

                <Link
                  to="/products"
                  className="skin-shop-button"
                >

                  Shop All Skincare

                  <span>
                    →
                  </span>

                </Link>

                <button
                  type="button"
                  className="skin-change-button"
                  onClick={() =>
                    setSelectedConcern(null)
                  }
                >

                  Choose another concern

                </button>

              </div>

            </>

          ) : (

            <div className="skin-no-products">

              <span>
                ✦
              </span>

              <p>
                We're still building your
                perfect match.
              </p>

              <Link to="/products">
                Explore all products →
              </Link>

            </div>

          )}

        </div>

      )}

      {/* =====================================
          INITIAL MESSAGE
      ===================================== */}

      {!selectedConcern && (

        <div className="skin-match-hint">

          <span>
            ✦
          </span>

          <p>
            Choose what your skin needs today
            to discover your GLOWRY match.
          </p>

        </div>

      )}

    </div>

  );

}

export default SkinMatch;