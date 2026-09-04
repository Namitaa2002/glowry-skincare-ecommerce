function ProductReviews({
  product,
  reviews,
  reviewsLoading,
  reviewRating,
  reviewComment,
  setReviewComment,
  reviewSubmitting,
  reviewError,
  reviewSuccess,
  handleSubmitReview,
  handleDeleteReview,
  isOwnReview,
  formatReviewDate,
  renderStars,
}) {
  return (
    <section className="product-reviews-section">

      {/* REVIEWS HEADER */}

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

      {/* WRITE REVIEW */}

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

      {/* ALL REVIEWS */}

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

                  {/* DELETE */}

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
  );
}

export default ProductReviews;