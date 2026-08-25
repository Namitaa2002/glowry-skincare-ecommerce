import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";


function Navbar() {


  const {
    cartCount,
  } = useCart();


  const navigate = useNavigate();

  const location = useLocation();



  const [user, setUser] =
    useState(null);




  useEffect(()=>{


    const savedUser =
      localStorage.getItem(
        "glowryLoggedInUser"
      );


    if(savedUser){

      setUser(
        JSON.parse(savedUser)
      );

    }
    else{

      setUser(null);

    }


  }, [location]);







  const handleLogout = ()=>{


    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if(confirmLogout){


      localStorage.removeItem(
        "glowryLoggedInUser"
      );


      setUser(null);


      navigate("/login");


    }


  };






  // LOGIN PAGE PAR NAVBAR HIDE

  if(
    location.pathname === "/login" ||
    location.pathname === "/register"
  ){

    return null;

  }






  return (


<header className="navbar">


<div className="navbar-container">



<Link
to="/"
className="logo"
>
GLOWRY
</Link>





<nav className="nav-links">

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


</nav>






<div className="nav-actions">





<Link
to="/wishlist"
className="nav-icon"
>

♡


</Link>








<div className="account-menu">


<button className="account-button">


<span>
♙
</span>


<span>

{
user
?
user.fullName
:
"Account"
}

</span>


<span>
⌄
</span>


</button>






<div className="account-dropdown">



{
user

?

<>


<Link to="/dashboard">
My Dashboard
</Link>


<Link to="/dashboard/orders">
My Orders
</Link>


<Link to="/wishlist">
Wishlist
</Link>


<Link to="/dashboard/addresses">
My Addresses
</Link>


<Link to="/dashboard/settings">
Settings
</Link>


<button

  className="logout-dropdown"

  onClick={handleLogout}

>

  <span className="logout-symbol">
    ↪
  </span>

  <span>
    Logout
  </span>

</button>


</>


:

<>

<Link to="/login">
Login
</Link>


<Link to="/register">
Register
</Link>


</>


}



</div>


</div>



<Link
to="/cart"
className="cart-button"
>


<span>
🛒
</span>



{
user && (

<span className="cart-count">

{cartCount}

</span>

)
}



</Link>





</div>



</div>


</header>


  );

}


export default Navbar;