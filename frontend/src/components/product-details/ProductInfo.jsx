function ProductInfo({
  product,
  quantity,
  decreaseQuantity,
  increaseQuantity,
  handleAddToCart,
  handleWishlist,
  handleBuyNow,
  isInWishlist,
}) {
  return (
    <div className="product-details-info">

      {/* CATEGORY */}

      <p className="product-details-category">
        {product.category}
      </p>

      {/* NAME */}

      <h1>
        {product.name}
      </h1>

      {/* RATING */}

      <div className="product-details-rating">

        <span>
          ★
        </span>

        <strong>
          {product.rating || 0}
        </strong>

        <span>
          / 5
        </span>

        <span>
          ({product.reviews || 0} reviews)
        </span>

      </div>

      {/* PRICE */}

      <div className="product-details-price">

        <span className="details-current-price">
          ₹
          {Number(
            product.price || 0
          ).toLocaleString("en-IN")}
        </span>

        {product.originalPrice && (
          <span className="details-original-price">
            ₹
            {Number(
              product.originalPrice
            ).toLocaleString("en-IN")}
          </span>
        )}

      </div>

      {/* DESCRIPTION */}

      <p className="product-details-description">
        {product.description ||
          "A thoughtfully formulated skincare essential designed to support your everyday skincare routine. Gentle, effective and suitable for your skincare needs."}
      </p>

      {/* SKIN TYPE */}

      <div className="product-details-section">

        <h3>
          Suitable For
        </h3>

        <div className="skin-type-tags">

          {product.skinTypes?.length > 0 ? (

            product.skinTypes.map(
              (skinType) => (
                <span
                  key={skinType}
                >
                  {skinType}
                </span>
              )
            )

          ) : (

            <span>
              All Skin Types
            </span>

          )}

        </div>

      </div>

      {/* STOCK */}

      <div className="product-stock-info">

        {product.stock > 0 ? (

          <span>
            ✓ {product.stock} available
          </span>

        ) : (

          <span>
            Out of stock
          </span>

        )}

      </div>

      {/* QUANTITY */}

      <div className="product-quantity-section">

        <h3>
          Quantity
        </h3>

        <div className="quantity-control">

          <button
            type="button"
            onClick={
              decreaseQuantity
            }
            disabled={
              quantity <= 1
            }
          >
            −
          </button>

          <span>
            {quantity}
          </span>

          <button
            type="button"
            onClick={
              increaseQuantity
            }
            disabled={
              product.stock > 0 &&
              quantity >= product.stock
            }
          >
            +
          </button>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="product-details-actions">

        {/* ADD TO CART */}

        <button
          type="button"
          className="details-add-cart"
          onClick={
            handleAddToCart
          }
          disabled={
            product.stock <= 0
          }
        >
          {product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

        {/* WISHLIST */}

        <button
          type="button"
          className={`details-wishlist ${
            isInWishlist(product._id)
              ? "active"
              : ""
          }`}
          onClick={
            handleWishlist
          }
        >

          {isInWishlist(
            product._id
          )
            ? "♥"
            : "♡"}

          <span>
            {isInWishlist(
              product._id
            )
              ? "Saved"
              : "Wishlist"}
          </span>

        </button>

      </div>

      {/* BUY NOW */}

      <button
        type="button"
        className="details-buy-now"
        disabled={
          product.stock <= 0
        }
        onClick={
          handleBuyNow
        }
      >
        {product.stock > 0
          ? "Buy Now"
          : "Out of Stock"}
      </button>

    </div>
  );
}

export default ProductInfo;