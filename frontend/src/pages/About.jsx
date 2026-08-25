import { Link } from "react-router-dom";

function About() {
  return (
    <main className="about-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <p className="section-small-title">
            ABOUT GLOWRY
          </p>

          <h1>
            Skincare made
            <span> simple & beautiful.</span>
          </h1>

          <p>
            GLOWRY is a modern skincare destination
            created to make everyday skincare simple,
            thoughtful and accessible.
          </p>

          <Link
            to="/products"
            className="about-shop-button"
          >
            Explore Our Products
          </Link>

        </div>

        <div className="about-hero-decoration">
          <div className="about-circle">
            ✨
          </div>
        </div>

      </section>


      {/* =========================================
          OUR STORY
      ========================================= */}

      <section className="about-story">

        <div className="about-story-image">

          <div className="about-image-card">
            <span>GLOWRY</span>
            <strong>
              Your skin,
              <br />
              your glow.
            </strong>
          </div>

        </div>


        <div className="about-story-content">

          <p className="section-small-title">
            OUR STORY
          </p>

          <h2>
            Skincare that fits
            <br />
            into your everyday life.
          </h2>

          <p>
            At GLOWRY, we believe skincare should not
            feel complicated. Our goal is to bring
            carefully selected beauty and skincare
            products together in one simple,
            convenient place.
          </p>

          <p>
            From everyday essentials to products
            designed for different skin needs, GLOWRY
            helps you discover products that make
            taking care of your skin feel effortless.
          </p>

        </div>

      </section>


      {/* =========================================
          MISSION
      ========================================= */}

      <section className="about-mission">

        <div className="about-mission-content">

          <p className="section-small-title">
            OUR MISSION
          </p>

          <h2>
            Better skincare.
            <br />
            Better confidence.
          </h2>

          <p>
            Our mission is to create a skincare
            shopping experience that combines
            quality products, simple discovery and
            a beautiful user experience.
          </p>

        </div>


        <div className="about-mission-stats">

          <div className="about-stat">
            <strong>01</strong>
            <span>
              Simple
              <br />
              Experience
            </span>
          </div>

          <div className="about-stat">
            <strong>02</strong>
            <span>
              Curated
              <br />
              Products
            </span>
          </div>

          <div className="about-stat">
            <strong>03</strong>
            <span>
              Customer
              <br />
              Focused
            </span>
          </div>

        </div>

      </section>


      {/* =========================================
          WHY GLOWRY
      ========================================= */}

      <section className="about-why">

        <div className="about-section-heading">

          <p className="section-small-title">
            WHY GLOWRY
          </p>

          <h2>
            Everything you need
            <br />
            for your skincare journey.
          </h2>

        </div>


        <div className="about-feature-grid">

          <article className="about-feature-card">

            <div className="about-feature-icon">
              ✨
            </div>

            <h3>
              Carefully Selected
            </h3>

            <p>
              Discover products selected with
              everyday skincare needs in mind.
            </p>

          </article>


          <article className="about-feature-card">

            <div className="about-feature-icon">
              ♡
            </div>

            <h3>
              Made for You
            </h3>

            <p>
              Explore products based on your
              preferences and skincare needs.
            </p>

          </article>


          <article className="about-feature-card">

            <div className="about-feature-icon">
              🛍
            </div>

            <h3>
              Easy Shopping
            </h3>

            <p>
              From discovering products to placing
              your order, everything stays simple.
            </p>

          </article>


          <article className="about-feature-card">

            <div className="about-feature-icon">
              🌸
            </div>

            <h3>
              Beauty & Simplicity
            </h3>

            <p>
              A clean and modern experience designed
              around your skincare journey.
            </p>

          </article>

        </div>

      </section>


      {/* =========================================
          CTA
      ========================================= */}

      <section className="about-cta">

        <p className="section-small-title">
          YOUR GLOW AWAITS
        </p>

        <h2>
          Ready to find your
          <br />
          skincare essentials?
        </h2>

        <Link
          to="/products"
          className="about-cta-button"
        >
          Shop GLOWRY
        </Link>

      </section>

    </main>
  );
}

export default About;