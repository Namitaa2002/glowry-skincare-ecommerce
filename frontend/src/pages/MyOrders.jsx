
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import apiClient from "../services/apiClient";

import {
  SERVER_BASE_URL,
} from "../config/api";

function MyOrders() {

  const navigate = useNavigate();

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

    return `${SERVER_BASE_URL}/images/${image}`;

  };

  // =========================================
  // ORDERS
  // =========================================

  const [orders, setOrders] = useState([]);

  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] = useState(true);

  // =========================================
  // ERROR
  // =========================================

  const [error, setError] = useState("");

  // =========================================
  // FETCH ORDERS
  // =========================================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);
        setError("");

        // =====================================
        // GET LOGGED IN USER
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
        // PARSE USER
        // =====================================

        let user;

        try {

          user =
            JSON.parse(savedUser);

        } catch (parseError) {

          console.error(
            "User Parse Error:",
            parseError
          );

          localStorage.removeItem(
            "glowryLoggedInUser"
          );

          localStorage.removeItem(
            "glowryToken"
          );

          navigate("/login");

          return;
        }

        // =====================================
        // CHECK USER ID
        // =====================================

        if (!user?.id) {

          setError(
            "User information is missing. Please login again."
          );

          return;
        }

        // =====================================
        // GET JWT TOKEN
        // =====================================

        const token =
          localStorage.getItem(
            "glowryToken"
          );

        // =====================================
        // CHECK TOKEN
        // =====================================

        if (!token) {

          setError(
            "Authentication required. Please login again."
          );

          navigate("/login");

          return;
        }

        // =====================================
        // FETCH USER ORDERS
        // =====================================

        const response =
          await apiClient.get(
            `/orders/user/${user.id}`
          );

        // =====================================
        // SAVE ORDERS
        // =====================================

        setOrders(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.error(
          "FETCH ORDERS ERROR:",
          error
        );

        // =====================================
        // ERROR MESSAGE
        // =====================================

        setError(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to load your orders. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, [navigate]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="my-orders-page">

        <section className="orders-header">

          <p className="section-small-title">
            YOUR GLOWRY
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            Track and manage your Glowry
            skincare orders.
          </p>

        </section>

        <section className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>
            Loading Orders...
          </h2>

          <p>
            Please wait while we fetch
            your orders.
          </p>

        </section>

      </main>

    );

  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <main className="my-orders-page">

        <section className="orders-header">

          <p className="section-small-title">
            YOUR GLOWRY
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            Track and manage your Glowry
            skincare orders.
          </p>

        </section>

        <section className="empty-orders">

          <div className="empty-orders-icon">
            ⚠
          </div>

          <h2>
            Something Went Wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="continue-shopping-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </section>

      </main>

    );

  }

  // =========================================
  // EMPTY ORDERS
  // =========================================

  if (orders.length === 0) {

    return (

      <main className="my-orders-page">

        <section className="orders-header">

          <p className="section-small-title">
            YOUR GLOWRY
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            Track and manage your Glowry
            skincare orders.
          </p>

        </section>

        <section className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
            Start shopping for your skincare
            essentials.
          </p>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Explore Products
          </Link>

        </section>

      </main>

    );

  }

  // =========================================
  // ORDERS PAGE
  // =========================================

  return (

    <main className="my-orders-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="orders-header">

        <p className="section-small-title">
          YOUR GLOWRY
        </p>

        <h1>
          My Orders
        </h1>

        <p>
          Track and manage your Glowry
          skincare orders.
        </p>

      </section>

      {/* =====================================
          ORDERS LIST
      ===================================== */}

      <section className="orders-container">

        {orders.map((order) => (

          <article
            className="order-card"
            key={
              order._id ||
              order.orderId
            }
          >

            {/* =================================
                ORDER HEADER
            ================================= */}

            <div className="order-card-header">

              <div>

                <p className="order-label">
                  ORDER ID
                </p>

                <h2>
                  {order.orderId}
                </h2>

              </div>

              <div className="order-status">

                <span className="status-dot"></span>

                {order.status ||
                  "Processing"}

              </div>

            </div>

            {/* =================================
                ORDER INFO
            ================================= */}

            <div className="order-info">

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
                  Items
                </span>

                <strong>

                  {(order.items || []).reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.quantity || 0
                      ),
                    0
                  )}

                </strong>

              </div>

              <div>

                <span>
                  Total
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

            </div>

            {/* =================================
                PRODUCTS
            ================================= */}

            <div className="order-products">

              {(order.items || []).map(
                (item, index) => (

                  <div
                    className="order-product"
                    key={
                      item.product ||
                      item._id ||
                      index
                    }
                  >

                    <div className="order-product-image">

                      {item.image ? (

                        <img
                          src={getImageUrl(
                            item.image
                          )}
                          alt={
                            item.name ||
                            "Product"
                          }
                        />

                      ) : (

                        <div className="order-product-no-image">
                          🧴
                        </div>

                      )}

                      <span>
                        {item.quantity}
                      </span>

                    </div>

                    <div className="order-product-details">

                      <h3>
                        {item.name ||
                          "Product"}
                      </h3>

                      <p>

                        ₹
                        {Number(
                          item.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </p>

                    </div>

                    <strong className="order-product-total">

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

            </div>

            {/* =================================
                DELIVERY
            ================================= */}

            <div className="order-delivery">

              <div>

                <span>
                  Estimated Delivery
                </span>

                <strong>
                  3 - 5 Business Days
                </strong>

              </div>

              <span className="delivery-status">

                ✓{" "}
                {order.status ||
                  "Processing"}

              </span>

            </div>

            {/* =================================
                TRACK ORDER
            ================================= */}

            <div className="track-order-action">

              <Link
                to={`/track-order/${order.orderId}`}
                className="track-order-button"
              >
                Track Order →
              </Link>

            </div>

          </article>

        ))}

      </section>

      {/* =====================================
          CONTINUE SHOPPING
      ===================================== */}

      <div className="orders-shopping">

        <Link
          to="/products"
          className="back-shopping"
        >
          ← Continue Shopping
        </Link>

      </div>

    </main>

  );

}

export default MyOrders;

