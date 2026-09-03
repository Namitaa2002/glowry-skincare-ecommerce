
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import {
  API_BASE_URL,
} from "../config/api";


function Settings() {

  const navigate = useNavigate();


  // =========================================
  // LOAD LOGGED-IN USER
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
  // CHANGE PASSWORD FORM
  // =========================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // =========================================
  // SHOW / HIDE PASSWORD
  // =========================================

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


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
  // CHECK LOGIN
  // =========================================

  if (!user) {

    navigate("/login");

    return null;

  }


  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      // =======================================
      // VALIDATION
      // =======================================

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {

        setError(
          "Please fill in all password fields."
        );

        return;

      }


      if (newPassword.length < 6) {

        setError(
          "New password must be at least 6 characters."
        );

        return;

      }


      if (
        newPassword !==
        confirmPassword
      ) {

        setError(
          "New passwords do not match."
        );

        return;

      }


      if (
        currentPassword ===
        newPassword
      ) {

        setError(
          "New password must be different from your current password."
        );

        return;

      }


      // =======================================
      // API REQUEST
      // =======================================

      try {

        setLoading(true);


        const token =
          localStorage.getItem(
            "glowryToken"
          );


        const response =
          await axios.put(

            `${API_BASE_URL}/auth/change-password`,

            {

              userId: user.id,

              currentPassword,

              newPassword,

              confirmPassword,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        setSuccess(

          response.data.message ||
          "Password changed successfully."

        );


        // =====================================
        // CLEAR FORM
        // =====================================

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");


      } catch (error) {

        console.error(
          "Change Password Error:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Unable to change password. Please try again."

        );

      } finally {

        setLoading(false);

      }

    };


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
  // PAGE
  // =========================================

  return (

    <main className="dashboard-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="dashboard-header">

        <div>

          <p className="section-small-title">
            ACCOUNT SETTINGS
          </p>


          <h1>
            Settings
          </h1>


          <p>
            Manage your account preferences
            and security.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="dashboard-view-all"
        >
          ← Back to Dashboard
        </Link>

      </section>


      {/* =====================================
          SETTINGS CONTENT
      ===================================== */}

      <section className="dashboard-content">


        {/* ===================================
            ACCOUNT INFORMATION
        =================================== */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <p className="summary-label">
                ACCOUNT
              </p>


              <h2>
                Account Information
              </h2>

            </div>

          </div>


          <div className="settings-info-grid">


            {/* NAME */}

            <div className="settings-info-item">

              <span>
                Full Name
              </span>


              <strong>
                {user.fullName ||
                  user.name ||
                  "Not available"}
              </strong>

            </div>


            {/* EMAIL */}

            <div className="settings-info-item">

              <span>
                Email Address
              </span>


              <strong>
                {user.email ||
                  "Not available"}
              </strong>

            </div>


            {/* PHONE */}

            <div className="settings-info-item">

              <span>
                Phone Number
              </span>


              <strong>
                {user.phone ||
                  "Not available"}
              </strong>

            </div>


            {/* ROLE */}

            <div className="settings-info-item">

              <span>
                Account Type
              </span>


              <strong>
                {user.role === "admin"
                  ? "Administrator"
                  : "Customer"}
              </strong>

            </div>


          </div>

        </div>


        {/* ===================================
            SECURITY
        =================================== */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <p className="summary-label">
                SECURITY
              </p>


              <h2>
                Change Password
              </h2>


              <p>
                Update your password to keep
                your GLOWRY account secure.
              </p>

            </div>

          </div>


          <form
            className="auth-form settings-password-form"
            onSubmit={
              handleChangePassword
            }
          >


            {/* CURRENT PASSWORD */}

            <div className="auth-field">

              <label>
                Current Password
              </label>


              <div className="password-input-wrapper">

                <input

                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }

                  value={
                    currentPassword
                  }

                  onChange={(e) => {

                    setCurrentPassword(
                      e.target.value
                    );

                    setError("");
                    setSuccess("");

                  }}

                  placeholder="Enter current password"

                  autoComplete="current-password"

                  required

                />


                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }

                >

                  {showCurrentPassword
                    ? "Hide"
                    : "Show"}

                </button>

              </div>

            </div>


            {/* NEW PASSWORD */}

            <div className="auth-field">

              <label>
                New Password
              </label>


              <div className="password-input-wrapper">

                <input

                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }

                  value={
                    newPassword
                  }

                  onChange={(e) => {

                    setNewPassword(
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
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }

                >

                  {showNewPassword
                    ? "Hide"
                    : "Show"}

                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="auth-field">

              <label>
                Confirm New Password
              </label>


              <div className="password-input-wrapper">

                <input

                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }

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
                    : "Show"}

                </button>

              </div>

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


            {/* SUCCESS */}

            {success && (

              <p className="auth-success">

                {success}

              </p>

            )}


            {/* BUTTON */}

            <button

              type="submit"

              className="auth-button"

              disabled={loading}

            >

              {loading
                ? "Updating Password..."
                : "Update Password"}

            </button>


          </form>

        </div>


        {/* ===================================
            ACCOUNT ACTIONS
        =================================== */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <p className="summary-label">
                ACCOUNT
              </p>


              <h2>
                Account Actions
              </h2>


              <p>
                Manage your current GLOWRY
                account session.
              </p>

            </div>

          </div>


          <div className="settings-actions">


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
                  Edit Profile
                </strong>


                <span>
                  Update your personal information
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
                  Manage Addresses
                </strong>


                <span>
                  Add or update your delivery addresses
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </Link>


            {/* LOGOUT */}

            <button
              type="button"
              className="dashboard-menu-item settings-logout-item"
              onClick={handleLogout}
            >

              <div className="dashboard-menu-icon">
                ↪
              </div>


              <div className="dashboard-menu-text">

                <strong>
                  Logout
                </strong>


                <span>
                  Sign out from your GLOWRY account
                </span>

              </div>


              <span className="dashboard-arrow">
                →
              </span>

            </button>


          </div>

        </div>


      </section>


    </main>

  );

}


export default Settings;

