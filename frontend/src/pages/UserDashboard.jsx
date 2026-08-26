
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";


function UserDashboard() {

  const navigate = useNavigate();


  // =========================================
  // CART
  // =========================================

  const {
    cartCount,
  } = useCart();


  // =========================================
  // WISHLIST
  // =========================================

  const {
    wishlist,
  } = useWishlist();


  // =========================================
  // LOAD USER FROM LOCAL STORAGE
  // =========================================

  const [user] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem(
          "glowryLoggedInUser"
        );

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);

    } catch (error) {

      console.error(
        "Error loading user:",
        error
      );

      return null;

    }

  });


  // =========================================
  // LOAD ORDERS FROM LOCAL STORAGE
  // =========================================

  const [orders] = useState(() => {

    try {

      const savedOrders =
        localStorage.getItem(
          "glowryOrders"
        );

      if (!savedOrders) {
        return [];
      }

      const parsedOrders =
        JSON.parse(savedOrders);

      return Array.isArray(parsedOrders)
        ? parsedOrders
        : [];

    } catch (error) {

      console.error(
        "Error loading orders:",
        error
      );

      return [];

    }

  });


  // =========================================
  // CHECK LOGIN
  // =========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "glowryLoggedInUser"
      );


    if (!savedUser) {

      navigate("/login");

      return;

    }


    try {

      const loggedInUser =
        JSON.parse(savedUser);


      if (!loggedInUser?.id) {

        localStorage.removeItem(
          "glowryLoggedInUser"
        );

        navigate("/login");

      }

    } catch (error) {

      console.error(
        "Error validating user:",
        error
      );

      localStorage.removeItem(
        "glowryLoggedInUser"
      );

      navigate("/login");

    }

  }, [navigate]);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "glowryLoggedInUser"
    );

    localStorage.removeItem(
      "glowryToken"
    );

    navigate("/login");

  };


  // =========================================
  // TOTAL SPENT
  // =========================================

  const totalSpent = orders.reduce(

    (total, order) => {

      return (
        total +
        Number(order.total || 0)
      );

    },

    0

  );


  // =========================================
  // LOADING
  // =========================================

  if (!user) {

    return null;

  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <main className="dashboard-page">


      {/* =====================================
          DASHBOARD HEADER
      ===================================== */}

      <section className="dashboard-header">

        <div>

          <p className="section-small-title">
            MY GLOWRY
          </p>


          <h1>
            Welcome, {user.fullName || user.name || "User"}
          </h1>


          <p>
            Manage your account, orders and
            skincare preferences.
          </p>

        </div>


        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >

          <span>
            ↪
          </span>

          Logout

        </button>

      </section>


      {/* =====================================
          QUICK STATS
      ===================================== */}

      <section className="dashboard-stats">


        {/* ORDERS */}

        <Link
          to="/dashboard/orders"
          className="dashboard-stat"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >

          <div className="dashboard-stat-icon">
            📦
          </div>


          <div>

            <span>
              Orders
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

        </Link>


        {/* WISHLIST */}

        <Link
          to="/wishlist"
          className="dashboard-stat"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >

          <div className="dashboard-stat-icon">
            ♡
          </div>


          <div>

            <span>
              Wishlist
            </span>

            <strong>
              {wishlist.length}
            </strong>

          </div>

        </Link>


        {/* CART */}

        <Link
          to="/cart"
          className="dashboard-stat"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >

          <div className="dashboard-stat-icon">
            🛒
          </div>


          <div>

            <span>
              Cart Items
            </span>

            <strong>
              {cartCount}
            </strong>

          </div>

        </Link>


      </section>


      {/* =====================================
          DASHBOARD CONTENT
      ===================================== */}

      <section className="dashboard-content">


        {/* ACCOUNT MENU */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <p className="summary-label">
                ACCOUNT
              </p>

              <h2>
                Manage Your Account
              </h2>

            </div>

          </div>


          <div className="dashboard-menu">


            {/* PROFILE */}

            <Link
              to="/dashboard/profile"
              className="dashboard-menu-item"
            >

              <div className="dashboard-menu-icon">
                👤
              </div>


              <div className="dashboard-menu-text">

                <strong>
                  My Profile
                </strong>


                <span>
                  View and update your personal
                  information
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </Link>


            {/* ORDERS */}

            <Link
              to="/dashboard/orders"
              className="dashboard-menu-item"
            >

              <div className="dashboard-menu-icon">
                📦
              </div>


              <div className="dashboard-menu-text">

                <strong>
                  My Orders
                </strong>


                <span>
                  Track and view your previous orders
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </Link>


            {/* WISHLIST */}

            <Link
              to="/wishlist"
              className="dashboard-menu-item"
            >

              <div className="dashboard-menu-icon">
                ♡
              </div>


              <div className="dashboard-menu-text">

                <strong>
                  My Wishlist
                </strong>


                <span>
                  {wishlist.length} saved product
                  {wishlist.length !== 1 ? "s" : ""}
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </Link>


            {/* ADDRESSES */}

            <Link
              to="/dashboard/addresses"
              className="dashboard-menu-item"
            >

              <div className="dashboard-menu-icon">
                📍
              </div>


              <div className="dashboard-menu-text">

                <strong>
                  My Addresses
                </strong>


                <span>
                  Manage your delivery addresses
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </Link>


            {/* SETTINGS */}

            <Link
              to="/dashboard/settings"
              className="dashboard-menu-item"
            >

              <div className="dashboard-menu-icon">
                ⚙
              </div>


              <div className="dashboard-menu-text">

                <strong>
                  Settings
                </strong>


                <span>
                  Manage your account preferences
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </Link>


          </div>

        </div>


        {/* RECENT ORDERS */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <p className="summary-label">
                ORDERS
              </p>


              <h2>
                Recent Orders
              </h2>

            </div>


            {orders.length > 0 && (

              <Link
                to="/dashboard/orders"
                className="dashboard-view-all"
              >
                View All
              </Link>

            )}

          </div>


          {orders.length === 0 ? (

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">
                📦
              </div>


              <h3>
                No orders yet
              </h3>


              <p>
                Your recent orders will appear
                here once you place an order.
              </p>


              <Link
                to="/products"
                className="dashboard-shop-button"
              >
                Start Shopping
              </Link>

            </div>

          ) : (

            <div className="dashboard-orders">

              {orders
                .slice(0, 3)
                .map((order) => (

                  <div
                    className="dashboard-order"
                    key={
                      order.orderId ||
                      order._id
                    }
                  >

                    <div>

                      <strong>
                        {order.orderId ||
                          order._id ||
                          "Order"}
                      </strong>


                      <span>
                        {order.date ||
                          order.createdAt ||
                          "Recent order"}
                      </span>

                    </div>


                    <div>

                      <strong>
                        ₹
                        {Number(
                          order.total || 0
                        ).toLocaleString("en-IN")}
                      </strong>


                      <span className="order-status">
                        Confirmed
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>


      </section>


      {/* ACCOUNT OVERVIEW */}

      <section
        className="dashboard-card"
        style={{
          maxWidth: "1250px",
          margin: "22px auto 0",
        }}
      >

        <div className="dashboard-card-header">

          <div>

            <p className="summary-label">
              OVERVIEW
            </p>


            <h2>
              Your Glowry Activity
            </h2>

          </div>

        </div>


        <div className="dashboard-stats">


          {/* TOTAL SPENT */}

          <div className="dashboard-stat">

            <div className="dashboard-stat-icon">
              💰
            </div>


            <div>

              <span>
                Total Spent
              </span>


              <strong>
                ₹
                {totalSpent.toLocaleString("en-IN")}
              </strong>

            </div>

          </div>


          {/* SAVED PRODUCTS */}

          <div className="dashboard-stat">

            <div className="dashboard-stat-icon">
              ❤️
            </div>


            <div>

              <span>
                Saved Products
              </span>


              <strong>
                {wishlist.length}
              </strong>

            </div>

          </div>


          {/* CART ITEMS */}

          <div className="dashboard-stat">

            <div className="dashboard-stat-icon">
              🛍️
            </div>


            <div>

              <span>
                Cart Items
              </span>


              <strong>
                {cartCount}
              </strong>

            </div>

          </div>


        </div>

      </section>


    </main>

  );

}


export default UserDashboard;

