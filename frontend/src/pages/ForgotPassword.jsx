import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================
  // HANDLE FORGOT PASSWORD
  // =========================================

  const handleForgotPassword =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      if (!email.trim()) {

        setError(
          "Please enter your email address."
        );

        return;

      }


      try {

        setLoading(true);


        const response =
          await axios.post(
            "http://localhost:5000/api/auth/forgot-password",
            {
              email:
                email.trim().toLowerCase(),
            }
          );


        setSuccess(
          response.data.message
        );


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