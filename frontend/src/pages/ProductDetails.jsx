import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import apiClient from "../services/apiClient";

import {
  SERVER_BASE_URL,
} from "../config/api";

import {
  useCart,
} from "../context/useCart";

import {
  useWishlist,
} from "../context/useWishlist";

import ProductGallery from "../components/product-details/ProductGallery";

import ProductInfo from "../components/product-details/ProductInfo";

import ProductReviews from "../components/product-details/ProductReviews";

import RelatedProducts from "../components/product-details/RelatedProducts";


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
    cart,
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

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (
      image.startsWith("/")
    ) {
      return `${SERVER_BASE_URL}${image}`;
    }

    return `${SERVER_BASE_URL}/images/${image}`;
  };


  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError("");

        // CURRENT PRODUCT

        const response =
          await apiClient.get(
            `/products/${id}`
          );

        const currentProduct =
          response.data;

        setProduct(
          currentProduct
        );

        // RELATED PRODUCTS

        const allProductsResponse =
          await apiClient.get(
            "/products"
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

  const fetchReviews = useCallback(
  async () => {

    try {

      setReviewsLoading(true);
      setReviewError("");

      const response =
        await apiClient.get(
          `/reviews/product/${id}`
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

  },
  [id]
);


  // =========================================
  // LOAD REVIEWS
  // =========================================

  useEffect(() => {

  const timer =
    setTimeout(() => {

      if (id) {
        fetchReviews();
      }

    }, 0);

  return () => {
    clearTimeout(timer);
  };

}, [id, fetchReviews]);


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
  // PRODUCT DATA
  // =========================================

  const getProductData = () => {

    return {

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

  };


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = async () => {

    const productToAdd =
      getProductData();

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
  // BUY NOW
  // =========================================

  const handleBuyNow = async () => {

    const token =
      localStorage.getItem(
        "glowryToken"
      );

    if (!token) {

      navigate("/login");

      return;

    }

    const alreadyInCart =
      cart.some(
        (item) =>
          String(item.id) ===
          String(product._id)
      );

    if (alreadyInCart) {

      navigate("/checkout");

      return;

    }

    const added =
      await handleAddToCart();

    if (added) {

      navigate("/checkout");

    }

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

  const handleSubmitReview = async (
    event
  ) => {

    event.preventDefault();

    setReviewError("");
    setReviewSuccess("");

    const loggedInUser =
      getLoggedInUser();

    // LOGIN CHECK

    if (!loggedInUser) {

      setReviewError(
        "Please login to write a review."
      );

      return;

    }

    // TOKEN CHECK

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

    // RATING

    if (
      reviewRating < 1
    ) {

      setReviewError(
        "Please select a rating."
      );

      return;

    }

    // COMMENT

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

      setReviewSubmitting(
        true
      );

      const response =
        await apiClient.post(

          `/reviews/product/${id}`,

          {
            rating:
              reviewRating,

            comment:
              reviewComment.trim(),
          }

        );

      setReviewSuccess(
        "Your review has been submitted successfully. ✨"
      );

      setReviewRating(0);
      setReviewComment("");

      setProduct(
        (previous) => ({

          ...previous,

          rating:
            response.data.rating,

          reviews:
            response.data.reviews,

        })
      );

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

      setReviewSubmitting(
        false
      );

    }

  };


  // =========================================
  // DELETE REVIEW
  // =========================================

  const handleDeleteReview = async (
    reviewId
  ) => {

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
        await apiClient.delete(
          `/reviews/${reviewId}`
        );

      setProduct(
        (previous) => ({

          ...previous,

          rating:
            response.data.rating,

          reviews:
            response.data.reviews,

        })
      );

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

  const isOwnReview = (
    review
  ) => {

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
  // FORMAT REVIEW DATE
  // =========================================

  const formatReviewDate = (
    date
  ) => {

    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
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
              disabled={
                !clickable
              }
            >
              ★
            </button>

          )
        )}

      </div>

    );

  };


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
  // PAGE
  // =========================================

  return (

    <main className="product-details-page">

      {/* BREADCRUMB */}

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


      {/* PRODUCT DETAILS */}

      <section className="product-details-container">

        <ProductGallery
          image={
            product.image
          }
          productName={
            product.name
          }
          getImageUrl={
            getImageUrl
          }
        />

        <ProductInfo
          product={
            product
          }
          quantity={
            quantity
          }
          decreaseQuantity={
            decreaseQuantity
          }
          increaseQuantity={
            increaseQuantity
          }
          handleAddToCart={
            handleAddToCart
          }
          handleWishlist={
            handleWishlist
          }
          handleBuyNow={
            handleBuyNow
          }
          isInWishlist={
            isInWishlist
          }
        />

      </section>


      {/* PRODUCT INFORMATION */}

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


      {/* REVIEWS */}

      <ProductReviews
        product={
          product
        }
        reviews={
          reviews
        }
        reviewsLoading={
          reviewsLoading
        }
        reviewRating={
          reviewRating
        }
        setReviewRating={
          setReviewRating
        }
        reviewComment={
          reviewComment
        }
        setReviewComment={
          setReviewComment
        }
        reviewSubmitting={
          reviewSubmitting
        }
        reviewError={
          reviewError
        }
        reviewSuccess={
          reviewSuccess
        }
        handleSubmitReview={
          handleSubmitReview
        }
        handleDeleteReview={
          handleDeleteReview
        }
        isOwnReview={
          isOwnReview
        }
        formatReviewDate={
          formatReviewDate
        }
        renderStars={
          renderStars
        }
      />


      {/* RELATED PRODUCTS */}

      <RelatedProducts
        products={
          relatedProducts
        }
        getImageUrl={
          getImageUrl
        }
      />

    </main>

  );

}

export default ProductDetails;