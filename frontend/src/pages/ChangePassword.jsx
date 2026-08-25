import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {
  const navigate = useNavigate();

  // =========================================
  // FORM
  // =========================================

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================
  // SHOW / HIDE PASSWORD
  // =========================================

  const togglePassword = (field) => {
    setShowPassword((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    // ---------------------------------------
    // GET LOGGED IN USER
    // ---------------------------------------

    const savedUser = localStorage.getItem(
      "glowryLoggedInUser"
    );

    if (!savedUser) {
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "User Parse Error:",
        error
      );

      localStorage.removeItem(
        "glowryLoggedInUser"
      );

      navigate("/login");
      return;
    }

    if (!user.id) {
      setError(
        "User information is missing. Please login again."
      );
      return;
    }

    // ---------------------------------------
    // API REQUEST
    // ---------------------------------------

    try {
      setLoading(true);

      const response = await axios.put(
        `http://localhost:5000/api/auth/change-password/${user.id}`,
        {
          currentPassword,
          newPassword,
        }
      );

      setSuccess(
        response.data.message ||
          "Password changed successfully!"
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // -------------------------------------
      // GO BACK TO PROFILE
      // -------------------------------------

      setTimeout(() => {
        navigate("/dashboard/profile");
      }, 1500);
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <main className="change-password-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="change-password-header">

        <p className="section-small-title">
          ACCOUNT SECURITY
        </p>

        <h1>
          Change Password
        </h1>

        <p>
          Update your password to keep your
          GLOWRY account secure.
        </p>

      </section>


      {/* =====================================
          CONTAINER
      ===================================== */}

      <section className="change-password-container">

        <div className="change-password-card">

          {/* =================================
              CARD HEADER
          ================================= */}

          <div className="change-password-card-header">

            <h2>
              Update Your Password
            </h2>

            <p>
              Enter your current password and
              choose a new password for your account.
            </p>

          </div>


          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="change-password-error">

              <span>⚠</span>

              {error}

            </div>
          )}


          {/* =================================
              SUCCESS
          ================================= */}

          {success && (
            <div className="change-password-success">

              <span>✓</span>

              {success}

            </div>
          )}


          {/* =================================
              FORM
          ================================= */}

          <form
            className="change-password-form"
            onSubmit={handleSubmit}
          >

            {/* CURRENT PASSWORD */}

            <div className="password-field">

              <label htmlFor="currentPassword">
                Current Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="currentPassword"
                  type={
                    showPassword.current
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={
                    formData.currentPassword
                  }
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    togglePassword("current")
                  }
                  aria-label={
                    showPassword.current
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword.current
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* NEW PASSWORD */}

            <div className="password-field">

              <label htmlFor="newPassword">
                New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="newPassword"
                  type={
                    showPassword.new
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={
                    formData.newPassword
                  }
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    togglePassword("new")
                  }
                  aria-label={
                    showPassword.new
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword.new
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="password-field">

              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showPassword.confirm
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    togglePassword("confirm")
                  }
                  aria-label={
                    showPassword.confirm
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword.confirm
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* =================================
                PASSWORD REQUIREMENTS
            ================================= */}

            <div className="password-requirements">

              <strong>
                Password requirements
              </strong>

              <span>
                • Minimum 6 characters
              </span>

              <span>
                • Use a password you don't use
                elsewhere
              </span>

            </div>


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="change-password-actions">

              <button
                type="submit"
                className="change-password-save"
                disabled={loading}
              >
                {loading
                  ? "Changing Password..."
                  : "Change Password"}
              </button>


              <button
                type="button"
                className="change-password-cancel"
                onClick={() =>
                  navigate(
                    "/dashboard/profile"
                  )
                }
                disabled={loading}
              >
                Cancel
              </button>

            </div>

          </form>


          {/* =================================
              SECURITY INFO
          ================================= */}

          <div className="password-security-info">

            <div className="password-security-info-icon">
              🔒
            </div>

            <p>
              Your password is securely encrypted
              before being stored. Never share your
              password with anyone.
            </p>

          </div>


        </div>

      </section>

    </main>
  );
}

export default ChangePassword;