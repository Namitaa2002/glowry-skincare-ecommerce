
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import apiClient from "../services/apiClient";

function Login() {
  const navigate = useNavigate();

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =========================================
  // STATE
  // =========================================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    // =======================================
    // VALIDATION
    // =======================================

    if (!email || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);

      // =====================================
      // LOGIN REQUEST
      // =====================================

      const response =
        await apiClient.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const user =
        response.data?.user;

      const token =
        response.data?.token;

      // =====================================
      // CHECK USER
      // =====================================

      if (!user) {
        setError(
          "Login failed. User information was not received."
        );
        return;
      }

      // =====================================
      // ADMIN ACCOUNT
      // =====================================

      if (user.role === "admin") {
        setError(
          "This is an admin account. Please use the Admin Login page."
        );
        return;
      }

      // =====================================
      // CHECK TOKEN
      // =====================================

      if (!token) {
        setError(
          "Login failed. Authentication token was not received."
        );
        return;
      }

      // =====================================
      // USER ID
      // =====================================

      const userId =
        user.id ||
        user._id;

      if (!userId) {
        setError(
          "Login failed. User ID was not received."
        );
        return;
      }

      // =====================================
      // SAVE TOKEN
      // =====================================

      localStorage.setItem(
        "glowryToken",
        token
      );

      // =====================================
      // SAVE USER
      // =====================================

      const loggedInUser = {
        id: userId,

        fullName:
          user.fullName ||
          user.name ||
          "",

        name:
          user.name ||
          user.fullName ||
          "",

        email:
          user.email ||
          email,

        phone:
          user.phone ||
          "",

        role:
          user.role ||
          "user",
      };

      localStorage.setItem(
        "glowryLoggedInUser",
        JSON.stringify(
          loggedInUser
        )
      );

      // =====================================
      // CLEAR OLD ADMIN DATA
      // =====================================

      localStorage.removeItem(
        "glowryAdminToken"
      );

      localStorage.removeItem(
        "glowryAdminUser"
      );

      // =====================================
      // SUCCESS
      // =====================================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      // =====================================
      // BACKEND ERROR
      // =====================================

      if (error.response) {
        const status =
          error.response.status;

        const backendMessage =
          error.response.data?.message;

        if (status === 404) {
          setError(
            backendMessage ||
            "No account found with this email address."
          );
        }

        else if (status === 401) {
          setError(
            backendMessage ||
            "Invalid email or password."
          );
        }

        else if (status === 400) {
          setError(
            backendMessage ||
            "Please enter valid login details."
          );
        }

        else {
          setError(
            backendMessage ||
            "Unable to login. Please try again."
          );
        }
      }

      // =====================================
      // SERVER ERROR
      // =====================================

      else if (error.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend server is running."
        );
      }

      // =====================================
      // UNKNOWN ERROR
      // =====================================

      else {
        setError(
          "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="auth-page">

      <section className="auth-card">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="auth-header">

          <p className="section-small-title">
            WELCOME BACK
          </p>

          <h1>
            Login to Glowry
          </h1>

          <p>
            Continue your skincare journey
            with Glowry.
          </p>

        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="auth-field">

            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="auth-field">

            <label htmlFor="login-password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* FORGOT PASSWORD */}

          <div className="auth-forgot">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error-box">

              <span>
                ⚠
              </span>

              <p>
                {error}
              </p>

            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}

        <p className="auth-switch">

          Don't have an account?

          {" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </section>

    </main>
  );
}

export default Login;

