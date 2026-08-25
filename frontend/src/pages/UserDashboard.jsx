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
  // STATES
  // =========================================

  const [user, setUser] =
    useState(null);

  const [orders, setOrders] =
    useState([]);


  // =========================================
  // LOAD USER + ORDERS
  // =========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "glowryLoggedInUser"
      );


    // ---------------------------------------
    // USER NOT LOGGED IN
    // ---------------------------------------

    if (!savedUser) {

      navigate("/login");

      return;

    }


    try {

      const loggedInUser =
        JSON.parse(savedUser);

      setUser(loggedInUser);

    } catch (error) {

      console.error(
        "Error loading user:",
        error
      );

      localStorage.removeItem(
        "glowryLoggedInUser"
      );

      navigate("/login");

      return;

    }


    // ---------------------------------------
    // LOAD ORDERS
    // ---------------------------------------

    try {

      const savedOrders =
        JSON.parse(
          localStorage.getItem(
            "glowryOrders"
          )
        ) || [];


      setOrders(
        Array.isArray(savedOrders)
          ? savedOrders
          : []
      );

    } catch (error) {

      console.error(
        "Error loading orders:",
        error
      );

      setOrders([]);

    }

  }, [navigate]);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "glowryLoggedInUser"
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
            Welcome, {user.fullName}
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


        {/* ===================================
            ORDERS
        =================================== */}

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



        {/* ===================================
            WISHLIST
        =================================== */}

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



        {/* ===================================
            CART
        =================================== */}

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


        {/* ===================================
            ACCOUNT MENU
        =================================== */}

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
                  {wishlist.length !== 1
                    ? "s"
                    : ""}
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



        {/* ===================================
            RECENT ORDERS
        =================================== */}

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



          {/* =================================
              NO ORDERS
          ================================= */}

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


            /* =================================
               ORDERS
            ================================= */

            <div className="dashboard-orders">

              {orders
                .slice(0, 3)
                .map((order) => (

                  <div
                    className="dashboard-order"
                    key={order.orderId}
                  >


                    <div>

                      <strong>
                        {order.orderId}
                      </strong>


                      <span>
                        {order.date}
                      </span>

                    </div>


                    <div>

                      <strong>
                        ₹{Number(order.total || 0)}
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



      {/* =====================================
          ACCOUNT OVERVIEW
      ===================================== */}

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


          <div className="dashboard-stat">

            <div className="dashboard-stat-icon">
              💰
            </div>


            <div>

              <span>
                Total Spent
              </span>

              <strong>
                ₹{totalSpent}
              </strong>

            </div>

          </div>


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


          <div className="dashboard-stat">

            <div className="dashboard-stat-icon">
              🛍️
            </div>


            <div>

              <span>
                Cart Value
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