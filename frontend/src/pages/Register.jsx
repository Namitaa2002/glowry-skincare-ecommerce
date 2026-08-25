import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import axios from "axios";


function Register() {

  const navigate =
    useNavigate();


  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] =
    useState({

      fullName: "",

      email: "",

      password: "",

      confirmPassword: "",

    });


  // =========================================
  // ERROR / SUCCESS
  // =========================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] =
    useState(false);


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

    setSuccess("");

  };


  // =========================================
  // HANDLE REGISTER
  // =========================================

  const handleRegister = async (e) => {

    e.preventDefault();


    const {
      fullName,
      email,
      password,
      confirmPassword,
    } = formData;


    // =======================================
    // VALIDATION
    // =======================================

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {

      setError(
        "Please fill in all fields."
      );

      return;

    }


    // =======================================
    // PASSWORD LENGTH
    // =======================================

    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    // =======================================
    // CONFIRM PASSWORD
    // =======================================

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    try {

      setLoading(true);

      setError("");

      setSuccess("");


      // =====================================
      // REGISTER USER
      // =====================================

      const response =
        await axios.post(

          "http://localhost:5000/api/auth/register",

          {

            name:
              fullName.trim(),

            email:
              email.trim().toLowerCase(),

            password,

          }

        );


      console.log(
        "Register Response:",
        response.data
      );


      // =====================================
      // SUCCESS
      // =====================================

      setSuccess(
        "Account created successfully! A confirmation email has been sent to your email address."
      );


      // =====================================
      // GO TO LOGIN
      // =====================================

      setTimeout(() => {

        navigate("/login");

      }, 2000);


    } catch (error) {

      console.error(
        "Register Error:",
        error
      );


      // =====================================
      // BACKEND ERROR
      // =====================================

      if (
        error.response
      ) {

        setError(

          error.response.data?.message ||
          "Registration failed. Please try again."

        );

      } else {

        setError(
          "Unable to connect to the server. Please make sure the backend is running."
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


        {/* =================================
            HEADER
        ================================= */}

        <div className="auth-header">

          <p className="section-small-title">

            JOIN GLOWRY

          </p>


          <h1>

            Create Your Account

          </h1>


          <p>

            Start your skincare journey
            with Glowry.

          </p>

        </div>



        {/* =================================
            FORM
        ================================= */}

        <form

          className="auth-form"

          onSubmit={
            handleRegister
          }

        >


          {/* FULL NAME */}

          <div className="auth-field">

            <label>
              Full Name
            </label>


            <input

              type="text"

              name="fullName"

              value={
                formData.fullName
              }

              onChange={
                handleChange
              }

              placeholder="Enter your full name"

              autoComplete="name"

              required

            />

          </div>



          {/* EMAIL */}

          <div className="auth-field">

            <label>
              Email Address
            </label>


            <input

              type="email"

              name="email"

              value={
                formData.email
              }

              onChange={
                handleChange
              }

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


            <input

              type="password"

              name="password"

              value={
                formData.password
              }

              onChange={
                handleChange
              }

              placeholder="Create password"

              autoComplete="new-password"

              required

            />

          </div>



          {/* CONFIRM PASSWORD */}

          <div className="auth-field">

            <label>
              Confirm Password
            </label>


            <input

              type="password"

              name="confirmPassword"

              value={
                formData.confirmPassword
              }

              onChange={
                handleChange
              }

              placeholder="Confirm password"

              autoComplete="new-password"

              required

            />

          </div>



          {/* ERROR */}

          {error && (

            <p className="auth-error">

              {error}

            </p>

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
              ? "Creating Account..."
              : "Create Account"}

          </button>


        </form>



        {/* =================================
            LOGIN LINK
        ================================= */}

        <p className="auth-switch">

          Already have an account?

          {" "}

          <Link to="/login">

            Login

          </Link>

        </p>


      </section>


    </main>

  );

}


export default Register;