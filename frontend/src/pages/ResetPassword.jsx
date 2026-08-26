
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useState,
} from "react";

import axios from "axios";

import {
  API_BASE_URL,
} from "../config/api";


function ResetPassword() {

  const { token } = useParams();

  const navigate =
    useNavigate();


  // =========================================
  // FORM DATA
  // =========================================

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // =========================================
  // STATES
  // =========================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================
  // SHOW PASSWORD
  // =========================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // =========================================
  // RESET PASSWORD
  // =========================================

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      // =======================================
      // VALIDATION
      // =======================================

      if (
        !password ||
        !confirmPassword
      ) {

        setError(
          "Please fill in all fields."
        );

        return;

      }


      if (password.length < 6) {

        setError(
          "Password must be at least 6 characters."
        );

        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;

      }


      if (!token) {

        setError(
          "Invalid password reset link."
        );

        return;

      }


      // =======================================
      // API REQUEST
      // =======================================

      try {

        setLoading(true);


        const response =
          await axios.post(

            `${API_BASE_URL}/auth/reset-password/${token}`,

            {

              password,

              confirmPassword,

            }

          );


        setSuccess(
          response.data.message
        );


        setPassword("");
        setConfirmPassword("");


        // =====================================
        // REDIRECT TO LOGIN
        // =====================================

        setTimeout(() => {

          navigate("/login");

        }, 2000);


      } catch (error) {

        console.error(
          "Reset Password Error:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Unable to reset password. Please try again."

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
            Reset Password
          </h1>

          <p>
            Create a new password for your
            GLOWRY account.
          </p>

        </div>


        {/* =================================
            FORM
        ================================= */}

        <form
          className="auth-form"
          onSubmit={handleResetPassword}
        >


          {/* =================================
              NEW PASSWORD
          ================================= */}

          <div className="auth-field">

            <label>
              New Password
            </label>


            <div className="password-input-wrapper">

              <input

                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                name="password"

                value={password}

                onChange={(e) => {

                  setPassword(
                    e.target.value
                  );

                  setError("");

                  setSuccess("");

                }}

                placeholder="Enter new password"

                autoComplete="new-password"

                required

              />


              <button

                type="button"

                className="password-toggle"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

              >

                {showPassword
                  ? "Hide"
                  : "Show"
                }

              </button>

            </div>

          </div>


          {/* =================================
              CONFIRM PASSWORD
          ================================= */}

          <div className="auth-field">

            <label>
              Confirm Password
            </label>


            <div className="password-input-wrapper">

              <input

                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }

                name="confirmPassword"

                value={
                  confirmPassword
                }

                onChange={(e) => {

                  setConfirmPassword(
                    e.target.value
                  );

                  setError("");

                  setSuccess("");

                }}

                placeholder="Confirm new password"

                autoComplete="new-password"

                required

              />


              <button

                type="button"

                className="password-toggle"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

              >

                {showConfirmPassword
                  ? "Hide"
                  : "Show"
                }

              </button>

            </div>

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
              ? "Updating Password..."
              : "Reset Password"
            }

          </button>


        </form>


        {/* =================================
            LOGIN LINK
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


export default ResetPassword;

