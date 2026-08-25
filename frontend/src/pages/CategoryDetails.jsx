import { useParams, Link } from "react-router-dom";

function CategoryDetails() {

  const { categoryName } = useParams();

  const categoryData = {

    cleansers: {
      title: "Cleansers",

      subtitle:
        "Start your routine with clean, refreshed and comfortable skin.",

      whatAre:
        "Cleansers are skincare products designed to remove dirt, excess oil, makeup and everyday impurities from the skin.",

      description:
        "A good cleanser is the first step of a simple skincare routine. Our collection includes gentle formulas designed for different skin needs.",

      benefits: [
        "Removes dirt and excess oil",
        "Helps refresh the skin",
        "Prepares skin for the next skincare steps",
        "Available for different skin types",
      ],

      concerns: [
        "Daily Cleansing",
        "Excess Oil",
        "Dryness",
        "Sensitive Skin",
      ],
    },


    toners: {
      title: "Toners",

      subtitle:
        "Refresh, balance and prepare your skin for your routine.",

      whatAre:
        "Toners are lightweight skincare products used after cleansing to refresh the skin and prepare it for serums and moisturizers.",

      description:
        "Choose from hydrating and balancing formulas designed to complement different skincare routines.",

      benefits: [
        "Refreshes the skin",
        "Adds lightweight hydration",
        "Helps prepare skin for skincare products",
        "Supports a balanced skincare routine",
      ],

      concerns: [
        "Hydration",
        "Oil Balance",
        "Pore Care",
        "Skin Refresh",
      ],
    },


    serums: {
      title: "Serums",

      subtitle:
        "Targeted skincare for specific skin concerns.",

      whatAre:
        "Serums are lightweight and concentrated skincare formulas designed to target specific skin concerns.",

      description:
        "Explore targeted formulas created for concerns such as dullness, dryness, excess oil and uneven-looking skin.",

      benefits: [
        "Lightweight formulas",
        "Targeted skincare",
        "Easy to layer with other products",
        "Available for different skin needs",
      ],

      concerns: [
        "Brightening",
        "Hydration",
        "Oil Control",
        "Acne Care",
      ],
    },


    moisturizers: {
      title: "Moisturizers",

      subtitle:
        "Keep your skin soft, hydrated and comfortable every day.",

      whatAre:
        "Moisturizers are skincare products designed to provide hydration and help support the skin's natural moisture barrier.",

      description:
        "From lightweight gels to richer creams, discover moisturizers designed for different skin types and routines.",

      benefits: [
        "Helps maintain skin hydration",
        "Supports the skin barrier",
        "Keeps skin soft and comfortable",
        "Available in different textures",
      ],

      concerns: [
        "Dryness",
        "Dehydration",
        "Barrier Care",
        "Daily Hydration",
      ],
    },


    sunscreens: {
      title: "Sunscreens",

      subtitle:
        "Everyday sun protection for your skincare routine.",

      whatAre:
        "Sunscreens are skincare products designed to help protect the skin from harmful UV radiation.",

      description:
        "Discover lightweight sunscreen formulas that can easily become part of your everyday skincare routine.",

      benefits: [
        "Daily UV protection",
        "Lightweight options",
        "Suitable for everyday use",
        "Different finishes for different preferences",
      ],

      concerns: [
        "Daily Protection",
        "UV Protection",
        "Oil Control",
        "Hydration",
      ],
    },


    "face-masks": {
      title: "Face Masks",

      subtitle:
        "Give your skin an extra boost with targeted care.",

      whatAre:
        "Face masks are skincare treatments designed to provide targeted benefits such as hydration, purification or refreshing care.",

      description:
        "Choose from different mask formulas designed to complement your regular skincare routine.",

      benefits: [
        "Provides targeted care",
        "Helps refresh the skin",
        "Hydrating and purifying options",
        "Easy to add to your weekly routine",
      ],

      concerns: [
        "Deep Cleansing",
        "Hydration",
        "Glow Care",
        "Purifying Care",
      ],
    },


    "eye-care": {
      title: "Eye Care",

      subtitle:
        "Gentle care for the delicate skin around your eyes.",

      whatAre:
        "Eye care products are specially formulated for the delicate skin around the eyes.",

      description:
        "Explore lightweight formulas designed to complement your daily skincare routine.",

      benefits: [
        "Gentle formulas",
        "Lightweight textures",
        "Hydrating eye care",
        "Easy everyday application",
      ],

      concerns: [
        "Hydration",
        "Under-Eye Care",
        "Brightening",
        "Daily Eye Care",
      ],
    },


    "lip-care": {
      title: "Lip Care",

      subtitle:
        "Keep your lips soft, smooth and hydrated.",

      whatAre:
        "Lip care products are designed to provide hydration and gentle care for dry or uncomfortable lips.",

      description:
        "From everyday balms to overnight treatments, find simple products for your lip care routine.",

      benefits: [
        "Helps maintain soft lips",
        "Provides hydration",
        "Suitable for everyday use",
        "Simple and easy routine",
      ],

      concerns: [
        "Dry Lips",
        "Hydration",
        "Lip Softening",
        "Overnight Care",
      ],
    },

  };


  const category = categoryData[categoryName];


  // If category does not exist

  if (!category) {
    return (
      <main className="category-not-found">

        <h1>
          Category Not Found
        </h1>

        <Link to="/">
          Back to Home
        </Link>

      </main>
    );
  }


  return (
    <main className="category-details-page">


      {/* =========================
          CATEGORY HERO
      ========================== */}

      <section className="category-hero">

        <p className="category-label">
          GLOWRY SKINCARE
        </p>

        <h1>
          {category.title}
        </h1>

        <p>
          {category.subtitle}
        </p>

      </section>



      {/* =========================
          WHAT IS THIS CATEGORY?
      ========================== */}

      <section className="category-intro">

        <p className="section-small-title">
          KNOW YOUR SKINCARE
        </p>

        <h2>
          What are {category.title}?
        </h2>

        <p className="category-what-text">
          {category.whatAre}
        </p>

        <p className="category-description">
          {category.description}
        </p>

      </section>



      {/* =========================
          BENEFITS
      ========================== */}

      <section className="category-benefits">

        <div className="section-heading">

          <p className="section-small-title">
            WHY CHOOSE THEM
          </p>

          <h2>
            Benefits
          </h2>

        </div>


        <div className="benefits-grid">

          {category.benefits.map((benefit, index) => (

            <div
              className="benefit-card"
              key={index}
            >

              <span className="benefit-number">
                0{index + 1}
              </span>

              <p>
                {benefit}
              </p>

            </div>

          ))}

        </div>

      </section>



      {/* =========================
          SHOP BY CONCERN
      ========================== */}

      <section className="concerns-section">

        <div className="section-heading">

          <p className="section-small-title">
            FIND YOUR MATCH
          </p>

          <h2>
            Shop by Concern
          </h2>

        </div>


        <div className="concerns-grid">

          {category.concerns.map((concern, index) => (

            <div
              className="concern-card"
              key={index}
            >

              <span>
                0{index + 1}
              </span>

              <h3>
                {concern}
              </h3>

            </div>

          ))}

        </div>

      </section>



      {/* =========================
          EXPLORE PRODUCTS
      ========================== */}

      <section className="category-products">

        <p className="section-small-title">
          EXPLORE THE COLLECTION
        </p>

        <h2>
          Discover our {category.title}
        </h2>

        <p>
          Find products from our {category.title.toLowerCase()}
          collection designed for your skincare routine.
        </p>

        <Link
          to={`/products?category=${categoryName}`}
          className="category-shop-button"
        >
          Shop {category.title} →
        </Link>

      </section>


    </main>
  );
}

export default CategoryDetails;