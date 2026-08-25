import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Only admin can access this login
      if (user.role !== "admin") {
        setError("Admin access required.");
        return;
      }

      // Separate admin storage
      localStorage.setItem(
        "glowryAdminToken",
        token
      );

      localStorage.setItem(
        "glowryAdminUser",
        JSON.stringify(user)
      );

      navigate("/admin/dashboard");

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

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

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

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="admin-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

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