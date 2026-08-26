import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================================
  // HANDLE FORGOT PASSWORD
  // =========================================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =======================================
    // VALIDATION
    // =======================================

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    try {
      setLoading(true);

      // =====================================
      // FORGOT PASSWORD API
      // =====================================

      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          email: email.trim().toLowerCase(),
        }
      );

      setSuccess(
        response.data.message ||
          "Password reset link has been sent to your email."
      );

      // =====================================
      // CLEAR EMAIL
      // =====================================

      setEmail("");

    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <section className="auth-card">

        {/* =================================
            HEADER
        ================================= */}

        <div className="auth-header">

          <p className="section-small-title">
            ACCOUNT RECOVERY
          </p>

          <h1>
            Forgot Password?
          </h1>

          <p>
            Enter your registered email and
            we'll send you a password reset link.
          </p>

        </div>


        {/* =================================
            FORM
        ================================= */}

        <form
          className="auth-form"
          onSubmit={handleForgotPassword}
        >

          {/* EMAIL */}

          <div className="auth-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Enter your registered email"
              autoComplete="email"
              required
            />

          </div>


          {/* =================================
              ERROR
          ================================= */}

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


          {/* =================================
              SUCCESS
          ================================= */}

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}


          {/* =================================
              BUTTON
          ================================= */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"
            }
          </button>

        </form>


        {/* =================================
            BACK TO LOGIN
        ================================= */}

        <p className="auth-switch">

          Remember your password?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </section>

    </main>
  );
}

export default ForgotPassword;
