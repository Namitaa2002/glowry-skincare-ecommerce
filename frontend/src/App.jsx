import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryDetails from "./pages/CategoryDetails";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import Settings from "./pages/Settings";
import ProductDetails from "./pages/ProductDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import TrackOrder from "./pages/TrackOrder";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

import { WishlistProvider } from "./context/WishlistContext";

import {
  CartProvider,
  useCart,
} from "./context/CartContext";


// =========================================
// CART TOAST
// =========================================

function CartToast() {

  const {
    toast
  } = useCart();


  if (!toast) {
    return null;
  }


  const message =
    String(toast)
      .trim()
      .toLowerCase();


  const isSuccess =
    message.includes("added to cart") ||
    message.includes("applied") ||
    message.includes("removed");


  let title = "Glowry";


  if (message.includes("added to cart")) {

    title = "Added to Cart";

  }

  else if (message.includes("already in cart")) {

    title = "Already in Cart";

  }

  else if (message.includes("applied")) {

    title = "Coupon Applied";

  }

  else if (message.includes("invalid")) {

    title = "Invalid Coupon";

  }

  else if (message.includes("minimum")) {

    title = "Coupon Not Applied";

  }

  else if (message.includes("empty")) {

    title = "Cart Empty";

  }

  else if (message.includes("removed")) {

    title = "Removed";

  }


  return (

    <div
      className={
        `glowry-toast ${
          isSuccess
            ? "toast-success"
            : "toast-error"
        }`
      }
    >

      <div className="glowry-toast-icon">

        {
          isSuccess
            ? "✓"
            : "!"
        }

      </div>


      <div className="glowry-toast-content">

        <strong>
          {title}
        </strong>


        <span>
          {toast}
        </span>

      </div>


      <div className="glowry-toast-line"></div>

    </div>

  );

}


// =========================================
// APP CONTENT
// =========================================

function AppContent() {

  const location =
    useLocation();


  // =======================================
  // ADMIN ROUTE CHECK
  // =======================================

  const isAdminRoute =
    location.pathname.startsWith("/admin");


  return (

    <>

      {/* =================================
          USER NAVBAR
      ================================= */}

      {!isAdminRoute && (
        <Navbar />
      )}


      {/* =================================
          CART TOAST
      ================================= */}

      {!isAdminRoute && (
        <CartToast />
      )}


      {/* =================================
          ROUTES
      ================================= */}

      <Routes>


        {/* =================================
            PUBLIC USER ROUTES
        ================================= */}


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/products"
          element={<Products />}
        />


        <Route
          path="/category/:categoryName"
          element={<CategoryDetails />}
        />


        <Route
          path="/about"
          element={<About />}
        />


        <Route
          path="/contact"
          element={<Contact />}
        />


        <Route
          path="/cart"
          element={<Cart />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />


        <Route
          path="/dashboard/change-password"
          element={<ChangePassword />}
        />


        <Route
          path="/checkout"
          element={<Checkout />}
        />


        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />


        <Route
          path="/track-order/:orderId"
          element={<TrackOrder />}
        />


        {/* =================================
            ADMIN ROUTES
        ================================= */}


        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        {/* =================================
            PROTECTED USER ROUTES
        ================================= */}


        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />


      </Routes>


      {/* =================================
          USER FOOTER
      ================================= */}

      {!isAdminRoute && (
        <Footer />
      )}

    </>

  );

}


// =========================================
// APP
// =========================================

function App() {

  return (

    <BrowserRouter>

      <WishlistProvider>

        <CartProvider>

          <AppContent />

        </CartProvider>

      </WishlistProvider>

    </BrowserRouter>

  );

}


export default App;