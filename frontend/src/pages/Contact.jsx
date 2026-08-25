import { useState } from "react";
import axios from "axios";

function Contact() {

  const [formData, setFormData] = useState({

    name: "",

    email: "",

    subject: "",

    message: "",

  });


  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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
  // HANDLE SUBMIT
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    setError("");

    setSuccess("");


    // =======================================
    // VALIDATION
    // =======================================

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {

      setError(
        "Please fill all fields."
      );

      return;

    }


    try {

      setLoading(true);


      const response =
        await axios.post(

          "http://localhost:5000/api/contact",

          {

            name:
              formData.name.trim(),

            email:
              formData.email.trim(),

            subject:
              formData.subject.trim(),

            message:
              formData.message.trim(),

          }

        );


      setSuccess(
        response.data.message
      );


      // =====================================
      // CLEAR FORM
      // =====================================

      setFormData({

        name: "",

        email: "",

        subject: "",

        message: "",

      });


    } catch (error) {

      console.error(
        "Contact Error:",
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

    <main className="contact-page">


      {/* ===================================
          HEADER
      =================================== */}

      <section className="contact-hero">

        <p className="section-small-title">
          GET IN TOUCH
        </p>

        <h1>
          We'd Love to Hear From You
        </h1>

        <p>
          Have a question about your skincare
          routine, products, or your order?
          We're here to help.
        </p>

      </section>


      {/* ===================================
          CONTACT CONTENT
      =================================== */}

      <section className="contact-container">


        {/* =================================
            CONTACT INFORMATION
        ================================= */}

        <div className="contact-info">


          <div className="contact-info-card">

            <h3>
              Email Us
            </h3>

            <p>
              Have a question?
              Send us an email and we'll
              get back to you.
            </p>

            <a href="mailto:namita.techworks@gmail.com">
              namita.techworks@gmail.com
            </a>

          </div>


          <div className="contact-info-card">

            <h3>
              Customer Support
            </h3>

            <p>
              We're happy to help with
              products, orders and account
              related questions.
            </p>

            <span>
              Monday - Saturday
            </span>

            <span>
              10:00 AM - 7:00 PM
            </span>

          </div>


          <div className="contact-info-card">

            <h3>
              GLOWRY
            </h3>

            <p>
              Your skincare journey,
              made simpler.
            </p>

          </div>


        </div>


        {/* =================================
            CONTACT FORM
        ================================= */}

        <div className="contact-form-wrapper">


          <h2>
            Send Us a Message
          </h2>


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >


            {/* NAME */}

            <div className="auth-field">

              <label>
                Your Name
              </label>

              <input

                type="text"

                name="name"

                value={formData.name}

                onChange={handleChange}

                placeholder="Enter your name"

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

                value={formData.email}

                onChange={handleChange}

                placeholder="Enter your email"

                autoComplete="email"

                required

              />

            </div>


            {/* SUBJECT */}

            <div className="auth-field">

              <label>
                Subject
              </label>

              <input

                type="text"

                name="subject"

                value={formData.subject}

                onChange={handleChange}

                placeholder="What can we help you with?"

                required

              />

            </div>


            {/* MESSAGE */}

            <div className="auth-field">

              <label>
                Message
              </label>

              <textarea

                name="message"

                value={formData.message}

                onChange={handleChange}

                placeholder="Write your message here..."

                rows="6"

                required

              />

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
                ? "Sending..."
                : "Send Message"
              }

            </button>


          </form>

        </div>


      </section>


    </main>

  );

}

export default Contact;