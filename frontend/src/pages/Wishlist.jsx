
import { Link } from "react-router-dom";
import { useWishlist } from "../context/useWishlist";
import { useCart } from "../context/useCart";

function Wishlist() {

  const {
    wishlist,
    toggleWishlist,
  } = useWishlist();


  const {
    addToCart,
  } = useCart();


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = async (product) => {

    await addToCart(product);

  };


  // =========================================
  // PAGE
  // =========================================

  return (

    <main className="wishlist-page">


      {/* ================================
          HEADER
      ================================= */}

      <section className="wishlist-header">

        <p className="section-small-title">
          YOUR GLOWRY
        </p>

        <h1>
          Wishlist
        </h1>

        <p>
          Your favorite skincare essentials,
          saved in one place.
        </p>

      </section>



      {/* ================================
          EMPTY WISHLIST
      ================================= */}

      {wishlist.length === 0 ? (

        <section className="empty-wishlist">

          <div className="empty-wishlist-icon">
            ♡
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save the products you love
            and find them here anytime.
          </p>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Explore Products
          </Link>

        </section>

      ) : (


        /* ================================
           WISHLIST PRODUCTS
        ================================= */

        <section className="wishlist-products">

          <div className="wishlist-grid">

            {wishlist.map((product) => (

              <article
                className="wishlist-card"
                key={product.id}
              >


                {/* IMAGE */}

                <div className="wishlist-card-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />


                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={() =>
                      toggleWishlist(product)
                    }
                    title="Remove from wishlist"
                  >
                    ♥
                  </button>

                </div>



                {/* INFORMATION */}

                <div className="wishlist-card-info">

                  <p className="product-category">
                    {product.category || "SKINCARE"}
                  </p>


                  <h3>
                    {product.name}
                  </h3>



                  {/* RATING */}

                  <div className="product-rating">

                    <span>
                      ★
                    </span>

                    <span>
                      {product.rating || 0}
                    </span>

                  </div>



                  {/* PRICE */}

                  <div className="product-price">

                    <span className="current-price">
                      ₹{product.price}
                    </span>


                    {product.originalPrice > 0 && (

                      <span className="original-price">
                        ₹{product.originalPrice}
                      </span>

                    )}

                  </div>



                  {/* ADD TO CART */}

                  <button
                    type="button"
                    className="wishlist-cart-button"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    Add to Cart
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>

      )}

    </main>

  );

}

export default Wishlist;

