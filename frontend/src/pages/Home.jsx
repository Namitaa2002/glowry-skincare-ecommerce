import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import RoutineStep from "../components/RoutineStep";
import ProductCard from "../components/ProductCard";
import SkinMatch from "../components/SkinMatch";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

// =========================================
// HOME PAGE
// =========================================

function Home() {

  // =========================================
  // ROUTINE STEPS
  // =========================================

  const routineSteps = [
    {
      number: "01",
      step: "STEP ONE",
      name: "Cleanse",
      description:
        "Start fresh with a gentle cleanse.",
      category: "cleansers",
      side: "left",
    },

    {
      number: "02",
      step: "STEP TWO",
      name: "Prepare",
      description:
        "Refresh and prepare your skin.",
      category: "toners",
      side: "right",
    },

    {
      number: "03",
      step: "STEP THREE",
      name: "Treat",
      description:
        "Target your skin's specific needs.",
      category: "serums",
      side: "left",
    },

    {
      number: "04",
      step: "STEP FOUR",
      name: "Hydrate",
      description:
        "Lock in hydration and comfort.",
      category: "moisturizers",
      side: "right",
    },

    {
      number: "05",
      step: "STEP FIVE",
      name: "Protect",
      description:
        "Protect your skin every day.",
      category: "sunscreens",
      side: "left",
    },

    {
      number: "06",
      step: "STEP SIX",
      name: "Weekly Care",
      description:
        "Give your skin an extra boost.",
      category: "face-masks",
      side: "right",
    },
  ];


  // =========================================
  // FEATURED PRODUCTS
  // =========================================

  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);


  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoadingProducts(true);

        const response =
          await axios.get(
            `${API_BASE_URL}/products`
          );

        const products =
          Array.isArray(response.data)
            ? response.data
            : [];

        setFeaturedProducts(
          products.slice(0, 4)
        );

      } catch (error) {

        console.error(
          "Home Products Error:",
          error
        );

      } finally {

        setLoadingProducts(false);

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
  // PAGE
  // =========================================

  return (

    <main className="home-page">


      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-hero-badge">

            <span></span>

            EVERYDAY SKINCARE, SIMPLIFIED

          </div>


          <h1>

            Your Skin.
            <br />

            <span>
              Your Glow.
            </span>

          </h1>


          <p className="home-hero-description">

            Thoughtfully created skincare essentials
            that make your everyday routine feel
            simple, intentional and beautiful.

          </p>


          <div className="home-hero-actions">

            <Link
              to="/products"
              className="home-primary-button"
            >
              Explore Skincare

              <span>
                →
              </span>

            </Link>


            <a
              href="#skin-needs"
              className="home-secondary-button"
            >
              Find Your Routine
            </a>

          </div>


          <div className="home-hero-note">

            <span>
              ✦
            </span>

            Simple ingredients. Thoughtful formulas.
            Everyday glow.

          </div>

        </div>


        <div className="home-hero-visual">

          <div className="hero-glow-circle"></div>


          <div className="hero-image-frame">

            <img
              src={`${SERVER_BASE_URL}/images/hero-skincare.jpg`}
              alt="GLOWRY skincare collection"
              className="hero-main-image"
            />

          </div>


          <div className="hero-floating-card hero-card-top">

            <span className="hero-card-icon">
              ✦
            </span>

            <div>

              <strong>
                Skin First
              </strong>

              <small>
                Always.
              </small>

            </div>

          </div>


          <div className="hero-floating-card hero-card-bottom">

            <strong>
              06
            </strong>

            <div>

              <small>
                Simple steps
              </small>

              <span>
                to your glow
              </span>

            </div>

          </div>

        </div>

      </section>



      {/* =================================================
          TRUST STRIP
      ================================================= */}

      <section className="home-trust-strip">

        <div className="home-trust-item">

          <span>
            ✦
          </span>

          <div>

            <strong>
              Thoughtfully Selected
            </strong>

            <small>
              Everyday essentials
            </small>

          </div>

        </div>


        <div className="home-trust-line"></div>


        <div className="home-trust-item">

          <span>
            ♡
          </span>

          <div>

            <strong>
              Made For Your Routine
            </strong>

            <small>
              Simple & consistent
            </small>

          </div>

        </div>


        <div className="home-trust-line"></div>


        <div className="home-trust-item">

          <span>
            ✧
          </span>

          <div>

            <strong>
              Your Skin, Your Way
            </strong>

            <small>
              Find what works for you
            </small>

          </div>

        </div>

      </section>



      {/* =================================================
          WHAT DOES YOUR SKIN NEED
      ================================================= */}

      <section
        className="skin-needs-section"
        id="skin-needs"
      >

        <div className="skin-needs-heading">

          <div className="skin-needs-title-wrap">

            <p className="section-small-title">
              YOUR SKIN, YOUR ROUTINE
            </p>

            <h2>

              What Does Your
              <br />

              <span>
                Skin Need Today?
              </span>

            </h2>

          </div>


          <p className="skin-needs-intro">

            Every skin day is different.
            Tell us what your skin is asking for
            and discover where to begin.

          </p>

        </div>


        <div className="skin-needs-layout">


          {/* LEFT DECORATIVE SIDE */}

          <div className="skin-needs-art">

            <div className="skin-art-circle">

              <div className="skin-art-inner">
                G
              </div>

            </div>


            <div className="skin-art-caption">

              <span>
                GLOWRY
              </span>

              <small>
                SKINCARE RITUAL
              </small>

            </div>

          </div>



          {/* SKIN MATCH */}

          <div className="skin-needs-card">

            <div className="skin-needs-card-top">

              <span className="skin-card-number">
                01
              </span>

              <span className="skin-card-label">
                SKIN MATCH
              </span>

            </div>


            <h3>

              Let's find what
              <br />
              your skin needs.

            </h3>


            <p>

              Answer a few simple questions
              and explore products that fit
              your skin concerns.

            </p>


            <SkinMatch />

          </div>

        </div>

      </section>



      {/* =================================================
          GLOWRY METHOD
      ================================================= */}

      <section className="routine-section">

        <div className="routine-heading">

          <p className="section-small-title">
            THE GLOWRY METHOD
          </p>


          <h2>
            Build Your Glow Routine
          </h2>


          <p>

            Six simple steps. Thoughtfully designed
            for your everyday skincare ritual.

          </p>

        </div>


        <div className="routine-journey">

          {routineSteps.map((item) => (

            <RoutineStep
              key={item.number}
              number={item.number}
              step={item.step}
              name={item.name}
              description={item.description}
              category={item.category}
              side={item.side}
            />

          ))}

        </div>


        <div className="routine-footer">

          <p>
            Your routine doesn't need to be complicated.
          </p>

          <span>
            Just consistent.
          </span>

        </div>

      </section>



      {/* =================================================
          FEATURED PRODUCTS
      ================================================= */}

      <section className="featured-section">

        <div className="section-heading">

          <p className="section-small-title">
            OUR FAVORITES
          </p>


          <h2>
            Everyday Glow Essentials
          </h2>


          <p>

            Skincare essentials selected to help
            you build your perfect routine.

          </p>

        </div>


        {loadingProducts ? (

          <div className="products-loading">

            <p>
              Loading products...
            </p>

          </div>

        ) : featuredProducts.length > 0 ? (

          <div className="products-grid">

            {featuredProducts.map(
              (product) => (

                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  image={getImageUrl(product.image)}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  category={product.category}
                />

              )
            )}

          </div>

        ) : (

          <div className="no-products">

            <h3>
              No products available
            </h3>

            <p>
              Please add products from
              the admin panel.
            </p>

          </div>

        )}


        <div className="featured-footer">

          <Link
            to="/products"
            className="view-all-products-button"
          >

            View All Products

            <span>
              →
            </span>

          </Link>

        </div>

      </section>



      {/* =================================================
          BRAND STATEMENT
      ================================================= */}

      <section className="home-brand-section">

        <div className="home-brand-content">

          <p className="section-small-title">
            A LITTLE REMINDER
          </p>


          <h2>

            Good skin doesn't
            <br />

            <em>
              need to be complicated.
            </em>

          </h2>


          <p>

            Take a moment. Build a routine
            that feels good. Stay consistent.
            Let your glow follow.

          </p>


          <Link
            to="/products"
            className="brand-shop-button"
          >

            Start Your Routine

            <span>
              →
            </span>

          </Link>

        </div>


        <div className="brand-decoration">

          <div className="brand-large-circle">
            G
          </div>

          <span className="brand-star one">
            ✦
          </span>

          <span className="brand-star two">
            ✧
          </span>

          <span className="brand-star three">
            ·
          </span>

        </div>

      </section>


    </main>

  );

}


export default Home;
