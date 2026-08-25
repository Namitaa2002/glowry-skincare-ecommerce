import { Link } from "react-router-dom";
import { useState } from "react";

import { useCart } from "../context/CartContext";


function Cart() {

  const {

    cart,

    increaseQuantity,

    decreaseQuantity,

    removeFromCart,

    cartTotal,

    coupon,

    discount,

    finalTotal,

    availableCoupons,

    applyCoupon,

    removeCoupon,

  } = useCart();


  const [couponCode, setCouponCode] =
    useState("");


  // =======================================
  // APPLY COUPON
  // =======================================

  const handleApplyCoupon = (e) => {

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    applyCoupon(couponCode);

  };


  // =======================================
  // SELECT COUPON
  // =======================================

  const handleSelectCoupon = (e, code) => {

    e.preventDefault();
    e.stopPropagation();

    setCouponCode(code);

  };


  return (

    <main className="cart-page">


      {/* =================================
          HEADER
      ================================= */}

      <section className="cart-header">

        <p className="section-small-title">
          YOUR GLOWRY
        </p>

        <h1>
          Shopping Cart
        </h1>

        <p>
          Your selected skincare essentials,
          ready for your routine.
        </p>

      </section>



      {/* =================================
          EMPTY CART
      ================================= */}

      {cart.length === 0 ? (

        <section className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Explore Products
          </Link>

        </section>

      ) : (

        <section className="cart-content">


          {/* =================================
              CART ITEMS
          ================================= */}

          <div className="cart-items">

            {cart.map((product) => (

              <article
                className="cart-item"
                key={product.id}
              >


                {/* PRODUCT IMAGE */}

                <div className="cart-item-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>



                {/* PRODUCT DETAILS */}

                <div className="cart-item-details">

                  <p className="product-category">

                    {product.category ||
                      "SKINCARE"}

                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="cart-item-price">
                    ₹{product.price}
                  </p>



                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          product.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {product.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          product.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>



                {/* ITEM TOTAL */}

                <div className="cart-item-right">

                  <p>

                    ₹
                    {Number(product.price) *
                      product.quantity}

                  </p>


                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() =>
                      removeFromCart(
                        product.id
                      )
                    }
                    title="Remove product"
                  >

                    <span className="delete-icon"></span>

                  </button>

                </div>

              </article>

            ))}



            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="back-shopping"
            >
              ← Continue Shopping
            </Link>

          </div>



          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <aside className="cart-summary">

            <p className="summary-label">
              ORDER SUMMARY
            </p>

            <h2>
              Your Order
            </h2>



            {/* =================================
                COUPON
            ================================= */}

            <div
              className="cart-coupon"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              {/* =================================
                  APPLIED COUPON
              ================================= */}

              {coupon ? (

                <div className="applied-coupon">

                  <div className="applied-coupon-left">

                    <span className="coupon-check">
                      ✓
                    </span>

                    <div>

                      <strong>
                        {coupon}
                      </strong>

                      <span>
                        Coupon applied
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="remove-coupon"
                    onClick={(e) => {

                      e.preventDefault();
                      e.stopPropagation();

                      removeCoupon();

                    }}
                  >
                    Remove
                  </button>

                </div>

              ) : (


                /* =================================
                    COUPON DROPDOWN
                ================================= */

                <details
                  className="coupon-dropdown"
                >


                  <summary
                    className="coupon-dropdown-header"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <div className="coupon-dropdown-title">

                      <span className="coupon-icon">
                        %
                      </span>

                      <div>

                        <strong>
                          Apply Coupon
                        </strong>

                        <span>
                          Save more on your order
                        </span>

                      </div>

                    </div>


                    <span className="coupon-dropdown-arrow">
                      +
                    </span>

                  </summary>



                  <div className="coupon-dropdown-content">


                    {/* =================================
                        INPUT
                    ================================= */}

                    <div className="coupon-input-wrapper">

                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(
                            e.target.value
                          )
                        }
                        placeholder="Enter coupon code"
                        onKeyDown={(e) => {

                          if (
                            e.key === "Enter"
                          ) {

                            handleApplyCoupon(e);

                          }

                        }}
                      />


                      <button
                        type="button"
                        onClick={
                          handleApplyCoupon
                        }
                      >
                        Apply
                      </button>

                    </div>



                    {/* =================================
                        AVAILABLE OFFERS
                    ================================= */}

                    <p className="available-coupons-title">
                      Available Offers
                    </p>


                    <div className="available-coupons">

                      {availableCoupons.map(
                        (item) => (

                          <button
                            type="button"
                            className="coupon-card"
                            key={item.code}
                            onClick={(e) =>
                              handleSelectCoupon(
                                e,
                                item.code
                              )
                            }
                          >

                            <div className="coupon-card-left">

                              <strong>
                                {item.code}
                              </strong>

                              <span>
                                {item.description}
                              </span>

                            </div>


                            <span className="coupon-arrow">
                              →
                            </span>

                          </button>

                        )
                      )}

                    </div>


                  </div>

                </details>

              )}

            </div>



            {/* =================================
                SUBTOTAL
            ================================= */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{cartTotal}
              </span>

            </div>



            {/* =================================
                DISCOUNT
            ================================= */}

            {discount > 0 && (

              <div className="summary-row discount-row">

                <span>
                  Discount
                </span>

                <span>
                  -₹{discount}
                </span>

              </div>

            )}



            {/* =================================
                SHIPPING
            ================================= */}

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <span className="free-shipping">
                FREE
              </span>

            </div>



            <div className="summary-divider"></div>



            {/* =================================
                FINAL TOTAL
            ================================= */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{finalTotal}
              </strong>

            </div>



            {/* =================================
                SAVINGS
            ================================= */}

            {discount > 0 && (

              <p className="cart-savings">
                ✦ You saved ₹{discount}
              </p>

            )}



            {/* =================================
                CHECKOUT
            ================================= */}

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>


            <p className="secure-checkout">
              Secure & safe shopping experience
            </p>

          </aside>

        </section>

      )}

    </main>

  );

}


export default Cart;