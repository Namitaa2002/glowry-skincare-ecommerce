import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";


function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  category,
}) {


  // =======================================
  // WISHLIST
  // =======================================

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();


  // =======================================
  // CART
  // =======================================

  const {
    addToCart,
  } = useCart();


  // =======================================
  // PRODUCT OBJECT
  // =======================================

  const productData = {

    id,
    name,
    image,
    price,
    originalPrice,
    rating,
    reviews,
    category,

  };


  return (

    <article className="product-card">


      {/* =================================
          PRODUCT IMAGE
      ================================= */}

      <div className="product-card-image">


        {/* PRODUCT DETAILS LINK */}

        <Link
          to={`/product/${id}`}
          className="product-image-link"
        >

          <img
            src={image}
            alt={name}
          />

        </Link>



        {/* WISHLIST */}

        <button
          type="button"
          className={`wishlist-button ${
            isInWishlist(id)
              ? "active"
              : ""
          }`}
          onClick={() =>
            toggleWishlist(productData)
          }
          aria-label="Add to wishlist"
        >

          {isInWishlist(id)
            ? "♥"
            : "♡"}

        </button>


      </div>



      {/* =================================
          PRODUCT INFORMATION
      ================================= */}

      <div className="product-card-info">


        {/* CATEGORY */}

        <p className="product-category">

          {category || "SKINCARE"}

        </p>



        {/* PRODUCT NAME */}

        <Link
          to={`/product/${id}`}
          className="product-name-link"
        >

          <h3 className="product-name">

            {name}

          </h3>

        </Link>



        {/* RATING */}

        <div className="product-rating">

          <span>
            ★
          </span>

          <span>
            {rating}
          </span>


          {reviews && (

            <span className="review-count">

              ({reviews})

            </span>

          )}

        </div>



        {/* PRICE */}

        <div className="product-price">

          <span className="current-price">

            ₹{price}

          </span>


          {originalPrice && (

            <span className="original-price">

              ₹{originalPrice}

            </span>

          )}

        </div>



        {/* ADD TO CART */}

        <button
          type="button"
          className="add-cart-button"
          onClick={() =>
            addToCart(productData)
          }
        >

          Add to Cart

        </button>


      </div>


    </article>

  );

}


export default ProductCard;