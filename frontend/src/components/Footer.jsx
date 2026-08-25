import { Link } from "react-router-dom";


function Footer() {


  return (

    <footer className="glowry-footer">


      <div className="footer-container">



        {/* BRAND */}

        <div className="footer-column footer-brand">


          <Link
            to="/"
            className="footer-logo"
          >
            GLOWRY
          </Link>


          <p>

            Premium skincare products
            crafted for your everyday glow
            and healthy skin journey.

          </p>



        </div>





        {/* QUICK LINKS */}

        <div className="footer-column">


          <h3>
            Quick Links
          </h3>


          <Link to="/">
            Home
          </Link>


          <Link to="/products">
            Shop
          </Link>


          <Link to="/about">
            About
          </Link>


          <Link to="/contact">
            Contact
          </Link>


        </div>







        {/* CUSTOMER */}

        <div className="footer-column">


          <h3>
            Customer Care
          </h3>


          <Link to="/dashboard">
            My Account
          </Link>


          <Link to="/dashboard/orders">
            My Orders
          </Link>


          <Link to="/wishlist">
            Wishlist
          </Link>


          <Link to="/contact">
            Support
          </Link>


        </div>








        {/* CONTACT */}

        <div className="footer-column">


          <h3>
            Contact Us
          </h3>



          <p>
            📧 support@glowry.com
          </p>



          <p>
            ☎ +91 98765 43210
          </p>



          <p>
            📍 India
          </p>



        </div>




      </div>






      {/* BOTTOM */}

      <div className="footer-bottom">


        <p>

          © 2026 Glowry. All rights reserved.

        </p>


      </div>




    </footer>

  );

}


export default Footer;