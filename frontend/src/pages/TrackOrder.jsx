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


function TrackOrder() {

  const {
    orderId,
  } = useParams();

  const navigate =
    useNavigate();


  // =========================================
  // ORDER STATE
  // =========================================

  const [order, setOrder] =
    useState(null);


  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] =
    useState(true);


  // =========================================
  // ERROR
  // =========================================

  const [error, setError] =
    useState("");


  // =========================================
  // FETCH ORDER
  // =========================================

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        setLoading(true);

        setError("");


        // =====================================
        // CHECK LOGGED IN USER
        // =====================================

        const savedUser =
          localStorage.getItem(
            "glowryLoggedInUser"
          );


        if (!savedUser) {

          navigate("/login");

          return;

        }


        // =====================================
        // GET TOKEN
        // =====================================

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


        // =====================================
        // CHECK ORDER ID
        // =====================================

        if (!orderId) {

          setError(
            "Order ID is missing."
          );

          return;

        }


        console.log(
          "Fetching Order:",
          orderId
        );


        // =====================================
        // FETCH ORDER FROM BACKEND
        // =====================================

        const response =
          await axios.get(

            `http://localhost:5000/api/orders/${orderId}`,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        console.log(
          "Track Order Response:",
          response.data
        );


        setOrder(
          response.data
        );


      } catch (error) {

        console.error(
          "================================="
        );

        console.error(
          "Track Order Error:",
          error
        );

        console.error(
          "STATUS:",
          error.response?.status
        );

        console.error(
          "BACKEND RESPONSE:",
          error.response?.data
        );

        console.error(
          "================================="
        );


        // =====================================
        // TOKEN / AUTH ERROR
        // =====================================

        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem(
            "glowryToken"
          );

          localStorage.removeItem(
            "glowryLoggedInUser"
          );


          setError(
            "Your session has expired. Please login again."
          );


          return;

        }


        // =====================================
        // ORDER NOT FOUND
        // =====================================

        if (
          error.response?.status === 404
        ) {

          setError(
            "Order not found. Please check the order ID."
          );


          return;

        }


        // =====================================
        // ACCESS DENIED
        // =====================================

        if (
          error.response?.status === 403
        ) {

          setError(
            "You are not authorized to view this order."
          );


          return;

        }


        // =====================================
        // OTHER ERROR
        // =====================================

        setError(

          error.response?.data?.message ||

          "Unable to find this order."

        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrder();


  }, [
    orderId,
    navigate,
  ]);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="track-order-page">

        <section className="track-order-header">

          <p className="section-small-title">
            GLOWRY DELIVERY
          </p>


          <h1>
            Track Your Order
          </h1>


          <p>
            Checking your order status...
          </p>

        </section>


        <section className="track-order-box">

          <div className="track-loading-icon">
            📦
          </div>


          <h2>
            Loading Order...
          </h2>

        </section>

      </main>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <main className="track-order-page">

        <section className="track-order-header">

          <p className="section-small-title">
            GLOWRY DELIVERY
          </p>


          <h1>
            Track Your Order
          </h1>

        </section>


        <section className="track-order-box">

          <div className="track-error-icon">
            ⚠
          </div>


          <h2>
            Order Not Found
          </h2>


          <p>
            {error}
          </p>


          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >

            <Link
              to="/my-orders"
              className="track-back-button"
            >
              ← Back to My Orders
            </Link>


            {error.includes(
              "login"
            ) && (

              <Link
                to="/login"
                className="track-back-button"
              >
                Login Again
              </Link>

            )}

          </div>

        </section>

      </main>

    );

  }


  // =========================================
  // STATUS
  // =========================================

  const status =
    order?.status ||
    "Processing";


  const statuses = [

    "Pending",

    "Confirmed",

    "Processing",

    "Shipped",

    "Delivered",

  ];


  // =========================================
  // STATUS INDEX
  // =========================================

  let statusIndex =
    statuses.indexOf(
      status
    );


  /*
    Backend currently creates orders
    with status = "Processing".

    So Processing should be treated
    as the first active stage.
  */

  if (statusIndex === -1) {

    statusIndex = 0;

  }


  // =========================================
  // CANCELLED
  // =========================================

  if (
    status === "Cancelled"
  ) {

    return (

      <main className="track-order-page">


        <section className="track-order-header">

          <p className="section-small-title">
            GLOWRY DELIVERY
          </p>


          <h1>
            Track Your Order
          </h1>


          <p>
            Order #{order.orderId}
          </p>

        </section>


        <section className="track-order-box">

          <div className="track-cancelled-icon">
            ✕
          </div>


          <h2>
            Order Cancelled
          </h2>


          <p>
            Unfortunately, this order has been
            cancelled.
          </p>


          <Link
            to="/my-orders"
            className="track-back-button"
          >
            ← Back to My Orders
          </Link>

        </section>

      </main>

    );

  }


  // =========================================
  // TRACKING PAGE
  // =========================================

  return (

    <main className="track-order-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="track-order-header">

        <p className="section-small-title">
          GLOWRY DELIVERY
        </p>


        <h1>
          Track Your Order
        </h1>


        <p>
          Order #{order.orderId}
        </p>

      </section>


      {/* =====================================
          ORDER SUMMARY
      ===================================== */}

      <section className="track-order-summary">


        <div>

          <span>
            Order Date
          </span>


          <strong>

            {order.createdAt

              ? new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )

              : "N/A"}

          </strong>

        </div>


        <div>

          <span>
            Payment
          </span>


          <strong>

            {order.paymentMethod ===
            "cod"

              ? "Cash on Delivery"

              : "Online Payment"}

          </strong>

        </div>


        <div>

          <span>
            Total Amount
          </span>


          <strong>

            ₹
            {Number(
              order.total || 0
            ).toLocaleString(
              "en-IN"
            )}

          </strong>

        </div>

      </section>


      {/* =====================================
          CURRENT STATUS
      ===================================== */}

      <section className="track-current-status">


        <div className="track-status-icon">

          {status === "Delivered"

            ? "✓"

            : "📦"}

        </div>


        <div>

          <span>
            CURRENT STATUS
          </span>


          <h2>
            {status}
          </h2>


          <p>

            {status === "Delivered"

              ? "Your order has been delivered successfully."

              : status === "Shipped"

              ? "Your order is on its way."

              : status === "Confirmed"

              ? "Your order has been confirmed and is being prepared."

              : status === "Processing"

              ? "Your order is being processed and prepared."

              : "Your order has been received successfully."}

          </p>

        </div>

      </section>


      {/* =====================================
          ORDER TIMELINE
      ===================================== */}

      <section className="tracking-timeline">


        <h2>
          Order Progress
        </h2>


        <div className="timeline">


          {statuses.map(
            (item, index) => {


              const completed =
                statusIndex >= index;


              const current =
                status === item;


              return (

                <div
                  className={`timeline-item ${
                    completed
                      ? "completed"
                      : ""
                  } ${
                    current
                      ? "current"
                      : ""
                  }`}
                  key={item}
                >


                  <div className="timeline-icon">

                    {completed

                      ? "✓"

                      : index + 1}

                  </div>


                  <div className="timeline-content">


                    <h3>
                      {item}
                    </h3>


                    <p>

                      {item ===
                        "Pending" &&
                        "Your order has been placed."}


                      {item ===
                        "Confirmed" &&
                        "Your order has been confirmed."}


                      {item ===
                        "Processing" &&
                        "Your order is being processed and prepared."}


                      {item ===
                        "Shipped" &&
                        "Your order has been shipped."}


                      {item ===
                        "Delivered" &&
                        "Your order has been delivered."}

                    </p>

                  </div>


                  {index <
                    statuses.length - 1 && (

                    <div className="timeline-line"></div>

                  )}

                </div>

              );

            }
          )}

        </div>

      </section>


      {/* =====================================
          PRODUCTS
      ===================================== */}

      <section className="track-products">


        <h2>
          Order Items
        </h2>


        {(order.items || []).map(
          (item, index) => (

            <div
              className="track-product"
              key={
                item.product ||
                item._id ||
                index
              }
            >


              <div className="track-product-image">

                {item.image ? (

                  <img
                    src={item.image}
                    alt={
                      item.name ||
                      "Product"
                    }
                  />

                ) : (

                  <span>
                    🧴
                  </span>

                )}

              </div>


              <div className="track-product-info">

                <h3>
                  {item.name ||
                    "Product"}
                </h3>


                <p>
                  Quantity: {item.quantity}
                </p>

              </div>


              <strong>

                ₹
                {(
                  Number(
                    item.price || 0
                  ) *
                  Number(
                    item.quantity || 0
                  )
                ).toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>

          )
        )}

      </section>


      {/* =====================================
          DELIVERY ADDRESS
      ===================================== */}

      {order.customer && (

        <section className="track-address">


          <h2>
            Delivery Address
          </h2>


          <p>

            <strong>

              {order.customer.fullName ||
                order.customer.name ||
                "Customer"}

            </strong>

          </p>


          <p>
            {order.customer.address}
          </p>


          <p>

            {order.customer.city},{" "}

            {order.customer.state}

          </p>


          <p>

            PIN:{" "}
            {order.customer.pincode}

          </p>


          <p>

            Phone:{" "}
            {order.customer.phone}

          </p>

        </section>

      )}


      {/* =====================================
          BACK
      ===================================== */}

      <div className="track-order-footer">

        <Link
          to="/my-orders"
          className="track-back-button"
        >
          ← Back to My Orders
        </Link>

      </div>


    </main>

  );

}


export default TrackOrder;