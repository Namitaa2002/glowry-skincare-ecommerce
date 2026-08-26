import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

function OrderSuccess() {

  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("id");


  // =========================================
  // ORDER STATE
  // =========================================

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


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

    return `${SERVER_BASE_URL}/${image}`;
  };


  // =========================================
  // FETCH ORDER FROM BACKEND
  // =========================================

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        setLoading(true);
        setError("");


        // -------------------------------------
        // CHECK ORDER ID
        // -------------------------------------

        if (!orderId) {

          setError(
            "Order ID is missing."
          );

          return;

        }


        // -------------------------------------
        // CHECK TOKEN
        // -------------------------------------

        const token =
          localStorage.getItem(
            "glowryToken"
          );


        if (!token) {

          setError(
            "Authentication required. Please login again."
          );

          return;

        }


        // -------------------------------------
        // GET ORDER
        // -------------------------------------

        const response =
          await axios.get(

            `${API_BASE_URL}/orders/details/${orderId}`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        console.log(
          "Fetched Order:",
          response.data
        );


        setOrder(
          response.data
        );


      } catch (error) {

        console.error(
          "Fetch Order Error:",
          error
        );

        console.error(
          "Backend Response:",
          error.response?.data
        );


        setError(

          error.response?.data?.message ||

          "This order may no longer be available or the order ID is incorrect."

        );


      } finally {

        setLoading(false);

      }

    };


    fetchOrder();

  }, [orderId]);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="order-success-page">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <p className="section-small-title">
            ORDER CONFIRMATION
          </p>

          <h1>
            Loading Your Order...
          </h1>

          <p className="success-text">
            Please wait while we fetch
            your order details.
          </p>

        </div>

      </main>

    );

  }


  // =========================================
  // ORDER NOT FOUND
  // =========================================

  if (!order) {

    return (

      <main className="order-success-page">

        <div className="success-card">

          <div className="success-icon">
            !
          </div>

          <p className="section-small-title">
            ORDER NOT FOUND
          </p>

          <h1>
            We Couldn't Find This Order
          </h1>

          <p className="success-text">

            {error ||
              "This order may no longer be available or the order ID is incorrect."}

          </p>

          <div className="success-buttons">

            <Link
              to="/products"
              className="success-btn"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="success-btn secondary"
            >
              Back Home
            </Link>

          </div>

        </div>

      </main>

    );

  }


  // =========================================
  // ORDER DATA
  // =========================================

  const customer =
    order.customer || {};

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const subtotal =
    Number(
      order.subtotal ??
      order.total ??
      0
    );

  const discount =
    Number(
      order.discount || 0
    );

  const finalTotal =
    Number(
      order.total ??
      Math.max(
        0,
        subtotal - discount
      )
    );


  // =========================================
  // ORDER DATE
  // =========================================

  const orderDate =
    order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : new Date().toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        );


  // =========================================
  // PAGE
  // =========================================

  return (

    <main className="order-success-page">

      {/* =====================================
          SUCCESS CARD
      ===================================== */}

      <div className="success-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✓
        </div>

        <p className="section-small-title">
          ORDER CONFIRMED
        </p>

        <h1>
          Thank You For Your Order
        </h1>

        <p className="success-text">
          Your Glowry skincare products
          are being prepared.
        </p>


        {/* ORDER ID */}

        <div className="order-id-box">

          <span>
            Order ID
          </span>

          <strong>
            {order.orderId}
          </strong>

        </div>


        {/* DELIVERY */}

        <div className="delivery-box">

          <span>
            Estimated Delivery
          </span>

          <strong>
            3 - 5 Business Days
          </strong>

        </div>


        {/* ORDER DETAILS */}

        <div className="success-order-details">

          <div className="success-details-header">

            <span>
              ORDER DETAILS
            </span>

          </div>


          {/* PRODUCTS */}

          <div className="success-products">

            {items.map(
              (product, index) => (

                <div
                  className="success-product"
                  key={
                    product.product ||
                    product._id ||
                    index
                  }
                >

                  {/* PRODUCT IMAGE */}

                  <div className="success-product-image">

                    {product.image ? (

                      <img
                        src={getImageUrl(
                          product.image
                        )}
                        alt={
                          product.name ||
                          "Glowry product"
                        }

                        onError={(e) => {

                          console.error(
                            "Order image failed:",
                            product.image
                          );

                          e.currentTarget.style.display =
                            "none";

                        }}

                      />

                    ) : (

                      <div className="product-image-placeholder">
                        G
                      </div>

                    )}

                    <span>
                      {product.quantity}
                    </span>

                  </div>


                  {/* PRODUCT INFORMATION */}

                  <div className="success-product-info">

                    <strong>
                      {product.name}
                    </strong>

                    <span>

                      ₹
                      {Number(
                        product.price || 0
                      )}

                      {" × "}

                      {Number(
                        product.quantity || 1
                      )}

                    </span>

                  </div>


                  {/* PRODUCT TOTAL */}

                  <strong className="success-product-total">

                    ₹
                    {Number(
                      product.price || 0
                    ) *
                      Number(
                        product.quantity || 1
                      )}

                  </strong>

                </div>

              )
            )}

          </div>


          {/* PRICE SUMMARY */}

          <div className="success-summary">

            {/* SUBTOTAL */}

            <div className="success-summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal}
              </span>

            </div>


            {/* DISCOUNT */}

            {discount > 0 && (

              <div className="success-summary-row discount-row">

                <span>

                  Discount

                  {order.coupon && (

                    <small>
                      {" "}
                      ({order.coupon})
                    </small>

                  )}

                </span>

                <span>
                  -₹{discount}
                </span>

              </div>

            )}


            {/* SHIPPING */}

            <div className="success-summary-row">

              <span>
                Shipping
              </span>

              <span className="free-shipping">
                FREE
              </span>

            </div>


            <div className="summary-divider"></div>


            {/* TOTAL */}

            <div className="success-summary-total">

              <span>
                Total Paid
              </span>

              <strong>
                ₹{finalTotal}
              </strong>

            </div>

          </div>

        </div>


        {/* CUSTOMER + PAYMENT */}

        <div className="success-info-grid">

          {/* CUSTOMER */}

          <div className="success-info-box">

            <p>
              DELIVERING TO
            </p>

            <strong>
              {customer.fullName ||
                "Customer"}
            </strong>

            <span>
              {customer.address ||
                ""}
            </span>

            <span>

              {customer.city ||
                ""}

              {customer.city &&
                customer.state
                ? ", "
                : ""}

              {customer.state ||
                ""}

              {customer.pincode
                ? ` ${customer.pincode}`
                : ""}

            </span>

            <span>
              {customer.phone ||
                ""}
            </span>

          </div>


          {/* PAYMENT */}

          <div className="success-info-box">

            <p>
              PAYMENT METHOD
            </p>

            <strong>

              {order.paymentMethod ===
              "cod"

                ? "Cash on Delivery"

                : "Online Payment"}

            </strong>

            <span>

              {order.paymentMethod ===
              "cod"

                ? "Pay when your order arrives"

                : "UPI, Card or Net Banking"}

            </span>

          </div>

        </div>


        {/* ORDER DATE */}

        <div className="success-order-date">

          <span>
            Order placed on
          </span>

          <strong>
            {orderDate}
          </strong>

        </div>


        {/* BUTTONS */}

        <div className="success-buttons">

          <Link
            to="/products"
            className="success-btn"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="success-btn secondary"
          >
            Back Home
          </Link>

        </div>

      </div>

    </main>

  );

}


export default OrderSuccess;