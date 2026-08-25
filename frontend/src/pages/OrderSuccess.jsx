import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";


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
  // FETCH ORDER FROM BACKEND
  // =========================================

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        setLoading(true);

        setError("");


        if (!orderId) {

          setError(
            "Order ID is missing."
          );

          return;

        }


          const token = localStorage.getItem("glowryToken");

          if (!token) {
            setError("Authentication required. Please login again.");
            return;
          }

          const response = await axios.get(
            `http://localhost:5000/api/orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setOrder(
          response.data
        );


      } catch (error) {

        console.error(
          "Fetch Order Error:",
          error
        );


        setError(
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
    order.items || [];


  const subtotal =
    order.subtotal ??
    order.total ??
    0;


  const discount =
    order.discount || 0;


  const finalTotal =
    order.total ??
    Math.max(
      0,
      subtotal - discount
    );


  // =========================================
  // ORDER DATE
  // =========================================

  const orderDate =
    order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleDateString()
      : new Date().toLocaleDateString();


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



        {/* ===================================
            ORDER ID
        =================================== */}

        <div className="order-id-box">

          <span>
            Order ID
          </span>


          <strong>
            {order.orderId}
          </strong>

        </div>



        {/* ===================================
            DELIVERY
        =================================== */}

        <div className="delivery-box">

          <span>
            Estimated Delivery
          </span>


          <strong>
            3 - 5 Business Days
          </strong>

        </div>



        {/* ===================================
            ORDER DETAILS
        =================================== */}

        <div className="success-order-details">


          <div className="success-details-header">

            <span>
              ORDER DETAILS
            </span>

          </div>



          {/* PRODUCTS */}

          <div className="success-products">

            {items.map((product, index) => (

              <div
                className="success-product"
                key={
                  product.product ||
                  product._id ||
                  index
                }
              >


                <div className="success-product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />


                  <span>
                    {product.quantity}
                  </span>

                </div>



                <div className="success-product-info">

                  <strong>
                    {product.name}
                  </strong>


                  <span>
                    ₹{product.price} ×{" "}
                    {product.quantity}
                  </span>

                </div>



                <strong className="success-product-total">

                  ₹
                  {Number(product.price) *
                    Number(product.quantity)}

                </strong>

              </div>

            ))}

          </div>



          {/* =================================
              PRICE SUMMARY
          ================================= */}

          <div className="success-summary">


            <div className="success-summary-row">

              <span>
                Subtotal
              </span>


              <span>
                ₹{subtotal}
              </span>

            </div>



            {discount > 0 && (

              <div className="success-summary-row discount-row">

                <span>
                  Discount

                  {order.coupon && (

                    <small>
                      {" "}({order.coupon})
                    </small>

                  )}

                </span>


                <span>
                  -₹{discount}
                </span>

              </div>

            )}



            <div className="success-summary-row">

              <span>
                Shipping
              </span>


              <span className="free-shipping">
                FREE
              </span>

            </div>



            <div className="summary-divider"></div>



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



        {/* ===================================
            CUSTOMER + PAYMENT
        =================================== */}

        <div className="success-info-grid">


          {/* CUSTOMER */}

          <div className="success-info-box">

            <p>
              DELIVERING TO
            </p>


            <strong>
              {customer.fullName}
            </strong>


            <span>
              {customer.address}
            </span>


            <span>
              {customer.city},{" "}
              {customer.state}{" "}
              {customer.pincode}
            </span>


            <span>
              {customer.phone}
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



        {/* ===================================
            ORDER DATE
        =================================== */}

        <div className="success-order-date">

          <span>
            Order placed on
          </span>


          <strong>
            {orderDate}
          </strong>

        </div>



        {/* ===================================
            BUTTONS
        =================================== */}

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