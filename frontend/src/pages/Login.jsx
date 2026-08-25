import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import axios from "axios";


function Login() {

  const navigate =
    useNavigate();


  // =========================================
  // FORM DATA
  // =========================================

  const [
    formData,
    setFormData,
  ] = useState({

    email: "",
    password: "",

  });


  // =========================================
  // ERROR
  // =========================================

  const [
    error,
    setError,
  ] = useState("");


  // =========================================
  // LOADING
  // =========================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =========================================
  // SHOW PASSWORD
  // =========================================

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );


    // Clear old error
    setError("");

  };


  // =========================================
  // LOGIN
  // =========================================

  const handleLogin =
    async (e) => {

      e.preventDefault();


      const {
        email,
        password,
      } = formData;


      // =======================================
      // VALIDATION
      // =======================================

      if (!email.trim() || !password.trim()) {

        setError(
          "Please enter your email and password."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        // =====================================
        // LOGIN REQUEST
        // =====================================

        const response =
          await axios.post(

            "http://localhost:5000/api/auth/login",

            {

              email:
                email.trim().toLowerCase(),

              password:
                password,

            }

          );


        console.log(
          "Login Response:",
          response.data
        );


        // =====================================
        // GET USER + TOKEN
        // =====================================

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
        // ADMIN ACCOUNT CHECK
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
        // SAVE JWT TOKEN
        // =====================================

        localStorage.setItem(
          "glowryToken",
          token
        );


        // =====================================
        // SAVE LOGGED-IN USER
        // =====================================

        localStorage.setItem(

          "glowryLoggedInUser",

          JSON.stringify({

            id:
              user.id,

            fullName:
              user.fullName ||
              user.name,

            name:
              user.name ||
              user.fullName,

            email:
              user.email,

            phone:
              user.phone || "",

            role:
              user.role || "user",

          })

        );


        // =====================================
        // NOTIFY OTHER COMPONENTS
        // =====================================

        window.dispatchEvent(
          new Event("storage")
        );


        // =====================================
        // GO TO USER DASHBOARD
        // =====================================

        navigate(
          "/dashboard"
        );


      } catch (error) {

        console.error(
          "Login Error:",
          error
        );


        console.error(
          "Backend Response:",
          error.response?.data
        );


        // =====================================
        // BACKEND ERROR MESSAGE
        // =====================================

        if (error.response) {

          const status =
            error.response.status;

          const backendMessage =
            error.response.data?.message;


          // User not found
          if (status === 404) {

            setError(
              backendMessage ||
              "No account found with this email address."
            );

          }


          // Wrong password
          else if (status === 401) {

            setError(
              backendMessage ||
              "Invalid password. Please try again."
            );

          }


          // Validation error
          else if (status === 400) {

            setError(
              backendMessage ||
              "Please enter valid login details."
            );

          }


          // Other backend errors
          else {

            setError(
              backendMessage ||
              "Unable to login. Please try again."
            );

          }

        }


        // =====================================
        // SERVER NOT AVAILABLE
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
            Continue your skincare journey with Glowry.
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

            <label>
              Email Address
            </label>


            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

          </div>



          {/* PASSWORD */}

          <div className="auth-field">

            <label>
              Password
            </label>


            <div className="password-input-wrapper">

              <input
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