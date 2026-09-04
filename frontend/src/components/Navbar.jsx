import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useCart,
} from "../context/useCart";


function Navbar() {

  const {
    cartCount,
  } = useCart();


  const navigate =
    useNavigate();

  const location =
    useLocation();


  // =========================================
  // GET USER FROM LOCAL STORAGE
  // =========================================

  const [user, setUser] =
    useState(() => {

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
          "User Parse Error:",
          error
        );

        return null;

      }

    });


  // =========================================
  // LOAD / UPDATE USER
  // =========================================

  useEffect(() => {

    const loadUser = () => {

      try {

        const savedUser =
          localStorage.getItem(
            "glowryLoggedInUser"
          );


        if (!savedUser) {

          setUser(null);

          return;

        }


        const parsedUser =
          JSON.parse(savedUser);


        setUser(parsedUser);

      } catch (error) {

        console.error(
          "Navbar User Load Error:",
          error
        );

        setUser(null);

      }

    };


    // Load user initially
    loadUser();


    // Listen for login/user update
    window.addEventListener(
      "glowryUserUpdated",
      loadUser
    );


    // Listen for localStorage changes
    window.addEventListener(
      "storage",
      loadUser
    );


    return () => {

      window.removeEventListener(
        "glowryUserUpdated",
        loadUser
      );


      window.removeEventListener(
        "storage",
        loadUser
      );

    };

  }, []);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if (!confirmLogout) {
      return;
    }


    // Remove user data
    localStorage.removeItem(
      "glowryLoggedInUser"
    );


    localStorage.removeItem(
      "glowryToken"
    );


    // Update Navbar immediately
    setUser(null);


    // Notify other components
    window.dispatchEvent(
      new Event("glowryUserUpdated")
    );


    // Go to login
    navigate("/login");

  };


  // =========================================
  // HIDE NAVBAR ON AUTH PAGES
  // =========================================

  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {

    return null;

  }


  // =========================================
  // NAVBAR
  // =========================================

  return (

    <header className="navbar">

      <div className="navbar-container">


        {/* ===================================
            LOGO
        =================================== */}

        <Link
          to="/"
          className="logo"
        >
          GLOWRY
        </Link>


        {/* ===================================
            NAV LINKS
        =================================== */}

        <nav className="nav-links">

          <Link to="/">
            Home
          </Link>


          <Link to="/products">
            Shop
          </Link>


          <Link to="/about">
            About
          </Link>


          <Link to="/contact">
            Contact
          </Link>

        </nav>


        {/* ===================================
            NAV ACTIONS
        =================================== */}

        <div className="nav-actions">


          {/* =================================
              WISHLIST
          ================================= */}

          <Link
            to="/wishlist"
            className="nav-icon"
          >
            ♡
          </Link>


          {/* =================================
              ACCOUNT
          ================================= */}

          <div className="account-menu">

            <button
              type="button"
              className="account-button"
            >

              <span>
                ♙
              </span>


              <span>

                {
                  user
                    ? (
                        user.fullName ||
                        user.name ||
                        "Account"
                      )
                    : "Account"
                }

              </span>


              <span>
                ⌄
              </span>

            </button>


            {/* ================================
                ACCOUNT DROPDOWN
            ================================= */}

            <div className="account-dropdown">

              {
                user

                  ? (

                    <>

                      <Link to="/dashboard">
                        My Dashboard
                      </Link>


                      <Link to="/dashboard/orders">
                        My Orders
                      </Link>


                      <Link to="/wishlist">
                        Wishlist
                      </Link>


                      <Link to="/dashboard/addresses">
                        My Addresses
                      </Link>


                      <Link to="/dashboard/settings">
                        Settings
                      </Link>


                      {/* ======================
                          LOGOUT
                      ======================= */}

                      <button
                        type="button"
                        className="logout-dropdown"
                        onClick={
                          handleLogout
                        }
                      >

                        <span className="logout-symbol">
                          ↪
                        </span>


                        <span>
                          Logout
                        </span>

                      </button>

                    </>

                  )

                  : (

                    <>

                      <Link to="/login">
                        Login
                      </Link>


                      <Link to="/register">
                        Register
                      </Link>

                    </>

                  )

              }

            </div>

          </div>


          {/* =================================
              CART
          ================================= */}

          <Link
            to="/cart"
            className="cart-button"
          >

            <span>
              🛒
            </span>


            {
              user && (

                <span className="cart-count">

                  {cartCount}

                </span>

              )
            }

          </Link>


        </div>

      </div>

    </header>

  );

}


export default Navbar;