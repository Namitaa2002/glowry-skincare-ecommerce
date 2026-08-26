
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../config/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // ADMIN LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // =======================================
      // LOGIN API
      // =======================================

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      const { token, user } = response.data;

      // =======================================
      // CHECK RESPONSE
      // =======================================

      if (!token || !user) {
        setError("Invalid login response.");
        return;
      }

      // =======================================
      // ADMIN ROLE CHECK
      // =======================================

      if (user.role !== "admin") {
        setError(
          "Admin access required. This account does not have admin privileges."
        );

        return;
      }

      // =======================================
      // CLEAR OLD ADMIN SESSION
      // =======================================

      localStorage.removeItem(
        "glowryAdminToken"
      );

      localStorage.removeItem(
        "glowryAdminUser"
      );

      // =======================================
      // SAVE ADMIN SESSION
      // =======================================

      localStorage.setItem(
        "glowryAdminToken",
        token
      );

      localStorage.setItem(
        "glowryAdminUser",
        JSON.stringify(user)
      );

      // =======================================
      // GO TO ADMIN DASHBOARD
      // =======================================

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "Admin Login Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to login. Please check your credentials."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // UI
  // =========================================

  return (

    <main className="admin-login-page">

      <div className="admin-login-card">

        {/* ===================================
            HEADER
        =================================== */}

        <p className="section-small-title">
          GLOWRY ADMIN
        </p>

        <h1>
          Admin Login
        </h1>

        <p>
          Login to access the GLOWRY
          administration panel.
        </p>


        {/* ===================================
            ERROR
        =================================== */}

        {error && (

          <div className="admin-login-error">

            {error}

          </div>

        )}


        {/* ===================================
            LOGIN FORM
        =================================== */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="admin-form-group">

            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => {

                setEmail(e.target.value);
                setError("");

              }}
              autoComplete="username"
              required
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="admin-form-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {

                setPassword(e.target.value);
                setError("");

              }}
              autoComplete="current-password"
              required
              disabled={loading}
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="admin-login-button"
          >

            {loading
              ? "Logging in..."
              : "Login as Admin"}

          </button>

        </form>

      </div>

    </main>

  );

}

export default AdminLogin;

