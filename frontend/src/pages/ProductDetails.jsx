import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";


// =========================================
// PRODUCT DETAILS
// =========================================

function ProductDetails() {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  // =========================================
  // PRODUCT
  // =========================================

  const [product, setProduct] =
    useState(null);


  const [relatedProducts, setRelatedProducts] =
    useState([]);


  // =========================================
  // PAGE STATES
  // =========================================

  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [quantity, setQuantity] =
    useState(1);


  // =========================================
  // REVIEWS
  // =========================================

  const [reviews, setReviews] =
    useState([]);


  const [reviewsLoading, setReviewsLoading] =
    useState(true);


  const [reviewRating, setReviewRating] =
    useState(0);


  const [reviewComment, setReviewComment] =
    useState("");


  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);


  const [reviewError, setReviewError] =
    useState("");


  const [reviewSuccess, setReviewSuccess] =
    useState("");


  // =========================================
  // CART
  // =========================================

  const {
    addToCart,
  } = useCart();


  // =========================================
  // WISHLIST
  // =========================================

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();


  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {

    if (!image) {

      return "";

    }


    // Complete URL

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {

      return image;

    }


    // Backend path

    if (
      image.startsWith("/")
    ) {

      return `http://localhost:5000${image}`;

    }


    // Filename only

    return `http://localhost:5000/images/${image}`;

  };


  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);

        setError("");


        // =====================================
        // CURRENT PRODUCT
        // =====================================

        const response =
          await axios.get(
            `http://localhost:5000/api/products/${id}`
          );


        const currentProduct =
          response.data;


        setProduct(
          currentProduct
        );


        // =====================================
        // RELATED PRODUCTS
        // =====================================

        const allProductsResponse =
          await axios.get(
            "http://localhost:5000/api/products"
          );


        const allProducts =
          Array.isArray(
            allProductsResponse.data
          )
            ? allProductsResponse.data
            : [];


        const related =
          allProducts
            .filter(
              (item) =>
                item.category ===
                  currentProduct.category &&
                item._id !==
                  currentProduct._id
            )
            .slice(0, 4);


        setRelatedProducts(
          related
        );


      } catch (err) {

        console.error(
          "Product Details Error:",
          err
        );


        if (
          err.response?.status === 404
        ) {

          setError(
            "Product not found."
          );

        } else {

          setError(
            "Unable to load product details."
          );

        }

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      fetchProduct();

    }

  }, [id]);


  // =========================================
  // FETCH REVIEWS
  // =========================================

  const fetchReviews = async () => {

    try {

      setReviewsLoading(true);

      setReviewError("");


      const response =
        await axios.get(

          `http://localhost:5000/api/reviews/product/${id}`

        );


      setReviews(

        Array.isArray(
          response.data.reviews
        )
          ? response.data.reviews
          : []

      );


    } catch (error) {

      console.error(
        "Fetch Reviews Error:",
        error
      );


      setReviews([]);


    } finally {

      setReviewsLoading(false);

    }

  };


  // =========================================
  // LOAD REVIEWS
  // =========================================

  useEffect(() => {

    if (id) {

      fetchReviews();

    }

  }, [id]);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="product-not-found">

        <div>

          <p className="section-small-title">
            GLOWRY
          </p>


          <h1>
            Loading Product...
          </h1>


          <p>
            Please wait while we load
            the product details.
          </p>

        </div>

      </main>

    );

  }


  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product || error) {

    return (

      <main className="product-not-found">

        <div>

          <p className="section-small-title">
            GLOWRY
          </p>


          <h1>
            Product Not Found
          </h1>


          <p>
            {error ||
              "Sorry, we couldn't find the product you're looking for."}
          </p>


          <Link
            to="/products"
            className="back-products-button"
          >
            Back to Products
          </Link>

        </div>

      </main>

    );

  }


  // =========================================
  // PRODUCT IMAGE
  // =========================================

  const productImage =
    getImageUrl(
      product.image
    );


  // =========================================
  // QUANTITY
  // =========================================

  const decreaseQuantity = () => {

    setQuantity(
      (current) =>
        current > 1
          ? current - 1
          : 1
    );

  };


  const increaseQuantity = () => {

    if (
      product.stock > 0 &&
      quantity >= product.stock
    ) {

      return;

    }


    setQuantity(
      (current) =>
        current + 1
    );

  };


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = async () => {

    const productToAdd = {

      id:
        product._id,

      name:
        product.name,

      image:
        product.image,

      price:
        product.price,

      originalPrice:
        product.originalPrice,

      rating:
        product.rating,

      reviews:
        product.reviews,

      category:
        product.category,

      quantity,

    };


    const added =
      await addToCart(
        productToAdd
      );


    return added;

  };


  // =========================================
  // WISHLIST
  // =========================================

  const handleWishlist = () => {

    toggleWishlist({

      id:
        product._id,

      name:
        product.name,

      image:
        product.image,

      price:
        product.price,

      originalPrice:
        product.originalPrice,

      rating:
        product.rating,

      reviews:
        product.reviews,

      category:
        product.category,

    });

  };


  // =========================================
  // LOGIN USER
  // =========================================

  const getLoggedInUser = () => {

    try {

      const savedUser =
        localStorage.getItem(
          "glowryLoggedInUser"
        );


      if (!savedUser) {

        return null;

      }


      return JSON.parse(
        savedUser
      );


    } catch (error) {

      console.error(
        "Logged User Error:",
        error
      );


      return null;

    }

  };


  // =========================================
  // SUBMIT REVIEW
  // =========================================

  const handleSubmitReview = async (event) => {

    event.preventDefault();


    setReviewError("");

    setReviewSuccess("");


    const loggedInUser =
      getLoggedInUser();


    // =======================================
    // LOGIN CHECK
    // =======================================

    if (!loggedInUser) {

      setReviewError(
        "Please login to write a review."
      );

      return;

    }


    // =======================================
    // TOKEN
    // =======================================

    const token =
      localStorage.getItem(
        "glowryToken"
      ) ||
      localStorage.getItem(
        "glowryUserToken"
      );


    if (!token) {

      setReviewError(
        "Please login again to write a review."
      );

      return;

    }


    // =======================================
    // RATING VALIDATION
    // =======================================

    if (
      reviewRating < 1
    ) {

      setReviewError(
        "Please select a rating."
      );

      return;

    }


    // =======================================
    // COMMENT VALIDATION
    // =======================================

    if (
      !reviewComment.trim()
    ) {

      setReviewError(
        "Please write your review."
      );

      return;

    }


    if (
      reviewComment.trim().length < 3
    ) {

      setReviewError(
        "Review must contain at least 3 characters."
      );

      return;

    }


    try {

      setReviewSubmitting(true);


      // =====================================
      // API
      // =====================================

      const response =
        await axios.post(

          `http://localhost:5000/api/reviews/product/${id}`,

          {

            rating:
              reviewRating,

            comment:
              reviewComment.trim(),

          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );


      // =====================================
      // SUCCESS
      // =====================================

      setReviewSuccess(
        "Your review has been submitted successfully. ✨"
      );


      setReviewRating(0);

      setReviewComment("");


      // =====================================
      // UPDATE PRODUCT RATING
      // =====================================

      setProduct(
        (previous) => ({

          ...previous,

          rating:
            response.data.rating,

          reviews:
            response.data.reviews,

        })
      );


      // =====================================
      // REFRESH REVIEWS
      // =====================================

      await fetchReviews();


    } catch (error) {

      console.error(
        "Submit Review Error:",
        error
      );


      setReviewError(

        error.response?.data?.message ||

        "Unable to submit review."

      );


    } finally {

      setReviewSubmitting(false);

    }

  };


  // =========================================
  // DELETE REVIEW
  // =========================================

  const handleDeleteReview = async (reviewId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete your review?"
      );


    if (!confirmDelete) {

      return;

    }


    const token =
      localStorage.getItem(
        "glowryToken"
      ) ||
      localStorage.getItem(
        "glowryUserToken"
      );


    if (!token) {

      setReviewError(
        "Please login again."
      );

      return;

    }


    try {

      const response =
        await axios.delete(

          `http://localhost:5000/api/reviews/${reviewId}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );


      // =====================================
      // UPDATE PRODUCT RATING
      // =====================================

      setProduct(
        (previous) => ({

          ...previous,

          rating:
            response.data.rating,

          reviews:
            response.data.reviews,

        })
      );


      // =====================================
      // REFRESH REVIEWS
      // =====================================

      await fetchReviews();


    } catch (error) {

      console.error(
        "Delete Review Error:",
        error
      );


      setReviewError(

        error.response?.data?.message ||

        "Unable to delete review."

      );

    }

  };


  // =========================================
  // CHECK REVIEW OWNER
  // =========================================

  const isOwnReview = (review) => {

    const loggedInUser =
      getLoggedInUser();


    if (!loggedInUser) {

      return false;

    }


    const loggedInId =
      loggedInUser.id ||
      loggedInUser._id;


    const reviewUserId =
      review.user?._id ||
      review.user;


    return (

      loggedInId &&
      reviewUserId &&
      String(loggedInId) ===
        String(reviewUserId)

    );

  };


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatReviewDate = (date) => {

    if (!date) {

      return "";

    }


    return new Date(
      date
    ).toLocaleDateString(

      "en-IN",

      {

        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",

      }

    );

  };


  // =========================================
  // RATING STARS
  // =========================================

  const renderStars = (
    rating,
    clickable = false
  ) => {

    return (

      <div
        className={
          clickable
            ? "review-stars clickable"
            : "review-stars"
        }
      >

        {[1, 2, 3, 4, 5].map(
          (star) => (

            <button
              key={star}
              type="button"
              className={
                star <= rating
                  ? "star active"
                  : "star"
              }
              onClick={
                clickable
                  ? () =>
                      setReviewRating(
                        star
                      )
                  : undefined
              }
              disabled={!clickable}
            >
              ★
            </button>

          )
        )}

      </div>

    );

  };


  // =========================================
  // PAGE
  // =========================================

  return (

    <main className="product-details-page">


      {/* =====================================
          BREADCRUMB
      ===================================== */}

      <div className="product-breadcrumb">

        <Link to="/">
          Home
        </Link>


        <span>
          /
        </span>


        <Link to="/products">
          Products
        </Link>


        <span>
          /
        </span>


        <span>
          {product.name}
        </span>

      </div>



      {/* =====================================
          PRODUCT DETAILS
      ===================================== */}

      <section className="product-details-container">


        {/* IMAGE */}

        <div className="product-details-image">

          <img
            src={productImage}
            alt={product.name}
            onError={(e) => {

              console.error(
                "Product image failed:",
                productImage
              );

              e.currentTarget.style.display =
                "none";

            }}
          />

        </div>



        {/* INFORMATION */}

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

              {isInWishlist(product._id)
                ? "♥"
                : "♡"}


              <span>

                {isInWishlist(product._id)
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
            onClick={async () => {

              const added =
                await handleAddToCart();


              if (added) {

                navigate("/cart");

              }

            }}
          >

            {product.stock > 0
              ? "Buy Now"
              : "Out of Stock"}

          </button>


        </div>

      </section>



      {/* =====================================
          PRODUCT INFORMATION
      ===================================== */}

      <section className="product-extra-info">


        <div className="product-info-box">

          <h2>
            Why You'll Love It
          </h2>


          <p>
            Designed to fit effortlessly into
            your daily skincare routine, this
            Glowry essential helps keep your
            skin feeling fresh, comfortable and
            cared for.
          </p>

        </div>



        <div className="product-info-box">

          <h2>
            How To Use
          </h2>


          <p>
            Apply the recommended amount to
            clean skin and gently massage until
            absorbed. Use consistently as part
            of your regular skincare routine.
          </p>

        </div>


      </section>



      {/* =====================================
          REVIEWS SECTION
      ===================================== */}

      <section className="product-reviews-section">


        {/* ===================================
            REVIEWS HEADER
        =================================== */}

        <div className="product-reviews-header">

          <div>

            <p className="section-small-title">
              CUSTOMER FEEDBACK
            </p>


            <h2>
              Customer Reviews
            </h2>


            <p>
              See what other GLOWRY customers
              think about this product.
            </p>

          </div>


          <div className="product-rating-summary">

            <strong>
              {product.rating || 0}
            </strong>


            <div>

              {renderStars(
                Math.round(
                  product.rating || 0
                )
              )}


              <span>
                {product.reviews || 0} reviews
              </span>

            </div>

          </div>

        </div>



        {/* ===================================
            REVIEW FORM
        =================================== */}

        <div className="write-review-card">

          <div>

            <p className="section-small-title">
              SHARE YOUR EXPERIENCE
            </p>


            <h3>
              Write a Review
            </h3>

          </div>


          <form
            onSubmit={
              handleSubmitReview
            }
          >


            {/* RATING */}

            <div className="review-form-field">

              <label>
                Your Rating
              </label>


              {renderStars(
                reviewRating,
                true
              )}


              {reviewRating > 0 && (

                <span className="selected-rating-text">

                  {reviewRating === 1 &&
                    "Poor"}

                  {reviewRating === 2 &&
                    "Fair"}

                  {reviewRating === 3 &&
                    "Good"}

                  {reviewRating === 4 &&
                    "Very Good"}

                  {reviewRating === 5 &&
                    "Excellent"}

                </span>

              )}

            </div>



            {/* COMMENT */}

            <div className="review-form-field">

              <label>
                Your Review
              </label>


              <textarea
                value={
                  reviewComment
                }
                onChange={(e) =>
                  setReviewComment(
                    e.target.value
                  )
                }
                placeholder="Tell us about your experience with this product..."
                rows="5"
                maxLength="500"
              />


              <small>
                {reviewComment.length}/500
              </small>

            </div>



            {/* ERROR */}

            {reviewError && (

              <div className="review-error-message">

                {reviewError}

              </div>

            )}



            {/* SUCCESS */}

            {reviewSuccess && (

              <div className="review-success-message">

                {reviewSuccess}

              </div>

            )}



            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-review-button"
              disabled={
                reviewSubmitting
              }
            >

              {reviewSubmitting
                ? "Submitting..."
                : "Submit Review"}

            </button>

          </form>

        </div>



        {/* ===================================
            ALL REVIEWS
        =================================== */}

        <div className="all-reviews-section">

          <div className="all-reviews-title">

            <h3>
              Reviews
            </h3>


            <span>
              {reviews.length}
            </span>

          </div>


          {reviewsLoading ? (

            <div className="reviews-loading">

              <p>
                Loading reviews...
              </p>

            </div>

          ) : reviews.length === 0 ? (

            <div className="no-reviews">

              <div>
                ★
              </div>


              <h3>
                No Reviews Yet
              </h3>


              <p>
                Be the first customer to review
                this product.
              </p>

            </div>

          ) : (

            <div className="reviews-list">

              {reviews.map(
                (review) => (

                  <article
                    className="review-card"
                    key={review._id}
                  >


                    {/* REVIEW TOP */}

                    <div className="review-card-top">


                      <div className="review-user">

                        <div className="review-avatar">

                          {(
                            review.userName ||
                            review.user?.name ||
                            "G"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <div>

                          <strong>

                            {review.userName ||
                              review.user?.name ||
                              "Glowry Customer"}

                          </strong>


                          <span>

                            {formatReviewDate(
                              review.createdAt
                            )}

                          </span>

                        </div>

                      </div>



                      {/* RATING */}

                      {renderStars(
                        review.rating
                      )}

                    </div>



                    {/* COMMENT */}

                    <p className="review-comment">

                      {review.comment}

                    </p>



                    {/* DELETE OWN REVIEW */}

                    {isOwnReview(
                      review
                    ) && (

                      <button
                        type="button"
                        className="delete-review-button"
                        onClick={() =>
                          handleDeleteReview(
                            review._id
                          )
                        }
                      >

                        Delete Review

                      </button>

                    )}

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>



      {/* =====================================
          RELATED PRODUCTS
      ===================================== */}

      {relatedProducts.length > 0 && (

        <section className="related-products-section">


          <div className="related-products-header">

            <p className="section-small-title">
              YOU MAY ALSO LIKE
            </p>


            <h2>
              Related Products
            </h2>

          </div>



          <div className="related-products-grid">

            {relatedProducts.map(
              (relatedProduct) => (

                <Link
                  key={
                    relatedProduct._id
                  }
                  to={`/product/${relatedProduct._id}`}
                  className="related-product-card"
                >

                  <div className="related-product-image">

                    <img
                      src={
                        getImageUrl(
                          relatedProduct.image
                        )
                      }
                      alt={
                        relatedProduct.name
                      }
                      onError={(e) => {

                        console.error(
                          "Related product image failed:",
                          relatedProduct.image
                        );

                        e.currentTarget.style.display =
                          "none";

                      }}
                    />

                  </div>


                  <div className="related-product-info">

                    <p>
                      {relatedProduct.category}
                    </p>


                    <h3>
                      {relatedProduct.name}
                    </h3>


                    <strong>
                      ₹
                      {Number(
                        relatedProduct.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </Link>

              )
            )}

          </div>


        </section>

      )}


    </main>

  );

}


export default ProductDetails;