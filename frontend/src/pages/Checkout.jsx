import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useCart,
} from "../context/CartContext";


function Checkout() {

  const navigate =
    useNavigate();


  const {
    cart,
    cartTotal,
    coupon,
    discount,
    finalTotal,
    clearCart,
  } = useCart();


  // =========================================
  // LOGGED IN USER
  // =========================================

  const [
    loggedInUser,
    setLoggedInUser,
  ] = useState(null);


  // =========================================
  // SAVED ADDRESSES
  // =========================================

  const [
    addresses,
    setAddresses,
  ] = useState([]);


  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState("");


  const [
    loadingAddress,
    setLoadingAddress,
  ] = useState(true);


  // =========================================
  // FORM DATA
  // =========================================

  const [
    formData,
    setFormData,
  ] = useState({

    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

  });


  // =========================================
  // PAYMENT
  // =========================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cod");


  // =========================================
  // ORDER STATE
  // =========================================

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // =========================================
  // GET LOGGED IN USER
  // =========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "glowryLoggedInUser"
      );


    const token =
      localStorage.getItem(
        "glowryToken"
      );


    if (!savedUser || !token) {

      setLoadingAddress(false);

      navigate("/login");

      return;

    }


    try {

      const user =
        JSON.parse(savedUser);


      if (!user?.id) {

        localStorage.removeItem(
          "glowryLoggedInUser"
        );

        localStorage.removeItem(
          "glowryToken"
        );

        navigate("/login");

        return;

      }


      setLoggedInUser(user);


      setFormData((previous) => ({

        ...previous,

        fullName:
          user.fullName ||
          user.name ||
          "",

        phone:
          user.phone ||
          "",

        email:
          user.email ||
          "",

      }));


    } catch (parseError) {

      console.error(
        "User Parse Error:",
        parseError
      );


      localStorage.removeItem(
        "glowryLoggedInUser"
      );


      localStorage.removeItem(
        "glowryToken"
      );


      navigate("/login");

    }

  }, [navigate]);


  // =========================================
  // LOAD SAVED ADDRESSES
  // =========================================

  useEffect(() => {

    const loadAddresses =
      async () => {

        if (!loggedInUser?.id) {

          return;

        }


        try {

          setLoadingAddress(true);

          setError("");


          const token =
            localStorage.getItem(
              "glowryToken"
            );


          if (!token) {

            setError(
              "Authentication required. Please login again."
            );

            navigate("/login");

            return;

          }


          // ===================================
          // GET SAVED ADDRESSES
          // ===================================

          const response =
            await axios.get(

              `http://localhost:5000/api/addresses/${loggedInUser.id}`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );


          const savedAddresses =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];


          setAddresses(
            savedAddresses
          );


          // ===================================
          // DEFAULT ADDRESS
          // ===================================

          const defaultAddress =
            savedAddresses.find(
              (item) =>
                item.isDefault === true
            );


          if (defaultAddress) {

            setSelectedAddressId(
              defaultAddress._id
            );


            fillAddressForm(
              defaultAddress
            );

          }


        } catch (error) {

          console.error(
            "Load Checkout Addresses Error:",
            error
          );


          setError(

            error.response?.data?.message ||

            "Failed to load saved addresses."

          );

        } finally {

          setLoadingAddress(false);

        }

      };


    loadAddresses();

  }, [
    loggedInUser,
    navigate,
  ]);


  // =========================================
  // FILL ADDRESS FORM
  // =========================================

  const fillAddressForm =
    (address) => {

      setFormData(
        (previous) => ({

          ...previous,

          fullName:
            address.name ||
            loggedInUser?.fullName ||
            loggedInUser?.name ||
            "",

          phone:
            address.phone ||
            loggedInUser?.phone ||
            "",

          email:
            loggedInUser?.email ||
            previous.email ||
            "",

          address:
            address.address ||
            "",

          city:
            address.city ||
            "",

          state:
            address.state ||
            "",

          pincode:
            address.pincode ||
            "",

        })
      );

    };


  // =========================================
  // SELECT ADDRESS
  // =========================================

  const handleAddressSelect =
    (e) => {

      const id =
        e.target.value;


      setSelectedAddressId(id);


      const selectedAddress =
        addresses.find(
          (item) =>
            item._id === id
        );


      if (selectedAddress) {

        fillAddressForm(
          selectedAddress
        );

      }

    };


  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange =
    (e) => {

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


      if (
        [
          "address",
          "city",
          "state",
          "pincode",
        ].includes(name)
      ) {

        setSelectedAddressId("");

      }


      setError("");

    };


  // =========================================
  // PLACE ORDER
  // =========================================

  const handlePlaceOrder =
    async (e) => {

      e.preventDefault();


      setError("");


      // =======================================
      // CHECK USER
      // =======================================

      if (!loggedInUser?.id) {

        navigate("/login");

        return;

      }


      // =======================================
      // CHECK TOKEN
      // =======================================

      const token =
        localStorage.getItem(
          "glowryToken"
        );


      if (!token) {

        setError(
          "Authentication required. Please login again."
        );

        navigate("/login");

        return;

      }


      // =======================================
      // CHECK CART
      // =======================================

      if (cart.length === 0) {

        alert(
          "Your cart is empty."
        );

        return;

      }


      if (placingOrder) {

        return;

      }


      // =======================================
      // VALIDATION
      // =======================================

      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.email ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {

        setError(
          "Please fill all delivery details."
        );

        return;

      }


      try {

        setPlacingOrder(true);


        // =====================================
        // CREATE ORDER ID
        // =====================================

        const orderId =
          "GLW-" +
          Math.floor(
            100000 +
            Math.random() *
            900000
          );


        // =====================================
        // ORDER ITEMS
        // =====================================

        const orderItems =
          cart.map(
            (product) => ({

              product:
                product.id,

              name:
                product.name,

              image:
                product.image,

              price:
                Number(
                  product.price || 0
                ),

              quantity:
                Number(
                  product.quantity || 1
                ),

            })
          );


        // =====================================
        // ORDER DATA
        // =====================================

        const orderData = {

          orderId,

          userId:
            loggedInUser.id,

          items:
            orderItems,

          customer:
            formData,

          subtotal:
            Number(
              cartTotal || 0
            ),

          coupon:
            coupon || null,

          discount:
            Number(
              discount || 0
            ),

          total:
            Number(
              finalTotal || 0
            ),

          paymentMethod:
            paymentMethod,

        };


        console.log(
          "Sending Order:",
          orderData
        );


        // =====================================
        // CREATE ORDER
        // =====================================

        const response =
          await axios.post(

            "http://localhost:5000/api/orders",

            orderData,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        console.log(
          "Order Created:",
          response.data
        );


        // =====================================
        // CLEAR CART
        // =====================================

        await clearCart();


        // =====================================
        // SUCCESS PAGE
        // =====================================

        navigate(
          `/order-success?id=${orderId}`
        );


      } catch (error) {

        console.error(
          "Place Order Error:",
          error
        );


        console.error(
          "Backend Response:",
          error.response?.data
        );


        setError(

          error.response?.data?.message ||

          "Failed to place order. Please try again."

        );

      } finally {

        setPlacingOrder(false);

      }

    };


  // =========================================
  // EMPTY CART
  // =========================================

  if (cart.length === 0) {

    return (

      <main className="checkout-page">

        <section className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>


          <h2>
            Your cart is empty
          </h2>


          <p>
            Add some skincare essentials
            before checking out.
          </p>


          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Explore Products
          </Link>

        </section>

      </main>

    );

  }


  // =========================================
  // CHECKOUT PAGE
  // =========================================

  return (

    <main className="checkout-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="checkout-header">

        <p className="section-small-title">
          GLOWRY CHECKOUT
        </p>


        <h1>
          Complete Your Order
        </h1>


        <p>
          Just a few details before
          your skincare reaches you.
        </p>

      </section>


      {/* =====================================
          CONTENT
      ===================================== */}

      <section className="checkout-content">


        {/* ===================================
            LEFT SIDE
        =================================== */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >


          {/* =================================
              SAVED ADDRESSES
          ================================= */}

          {!loadingAddress &&
            addresses.length > 0 && (

              <div className="checkout-saved-address">

                <div className="checkout-section-title">

                  <span>
                    01
                  </span>


                  <div>

                    <h2>
                      Saved Address
                    </h2>


                    <p>
                      Select a saved delivery
                      address.
                    </p>

                  </div>

                </div>


                <select
                  className="checkout-address-select"
                  value={
                    selectedAddressId
                  }
                  onChange={
                    handleAddressSelect
                  }
                >

                  <option value="">
                    Enter address manually
                  </option>


                  {addresses.map(
                    (item) => (

                      <option
                        key={item._id}
                        value={item._id}
                      >

                        {item.name}
                        {" - "}
                        {item.city}
                        {" - "}
                        {item.pincode}

                        {item.isDefault
                          ? " (Default)"
                          : ""}

                      </option>

                    )
                  )}

                </select>

              </div>

            )}


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
              DELIVERY DETAILS
          ================================= */}

          <div className="checkout-section-title">

            <span>
              {addresses.length > 0
                ? "02"
                : "01"}
            </span>


            <div>

              <h2>
                Delivery Details
              </h2>


              <p>
                Where should we deliver
                your Glowry order?
              </p>

            </div>

          </div>


          <div className="checkout-fields">


            {/* FULL NAME */}

            <div className="checkout-field">

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
                required
              />

            </div>


            {/* PHONE */}

            <div className="checkout-field">

              <label>
                Phone Number
              </label>


              <input
                type="tel"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your phone number"
                maxLength="10"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="checkout-field full-width">

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
                required
              />

            </div>


            {/* ADDRESS */}

            <div className="checkout-field full-width">

              <label>
                Address
              </label>


              <textarea
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
                placeholder="House no., street, area"
                rows="3"
                required
              />

            </div>


            {/* CITY */}

            <div className="checkout-field">

              <label>
                City
              </label>


              <input
                type="text"
                name="city"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
                placeholder="City"
                required
              />

            </div>


            {/* STATE */}

            <div className="checkout-field">

              <label>
                State
              </label>


              <input
                type="text"
                name="state"
                value={
                  formData.state
                }
                onChange={
                  handleChange
                }
                placeholder="State"
                required
              />

            </div>


            {/* PINCODE */}

            <div className="checkout-field">

              <label>
                Pincode
              </label>


              <input
                type="text"
                name="pincode"
                value={
                  formData.pincode
                }
                onChange={
                  handleChange
                }
                placeholder="6-digit pincode"
                maxLength="6"
                required
              />

            </div>

          </div>


          {/* =================================
              OFFERS / COUPON
          ================================= */}

          <div className="checkout-offers">

            <div className="checkout-section-title">

              <span>
                {addresses.length > 0
                  ? "03"
                  : "02"}
              </span>


              <div>

                <h2>
                  Offers & Coupons
                </h2>


                <p>
                  Apply an available offer
                  to save on your order.
                </p>

              </div>

            </div>


            {coupon ? (

              <div className="applied-coupon">

                <div>

                  <strong>
                    ✦ {coupon}
                  </strong>


                  <span>
                    Coupon applied successfully
                  </span>

                </div>


                <strong>
                  -₹{discount}
                </strong>

              </div>

            ) : (

              <div className="checkout-offer-message">

                <span>
                  🎁
                </span>


                <div>

                  <strong>
                    Offers available in cart
                  </strong>


                  <p>
                    Go back to your cart to
                    apply coupons and offers.
                  </p>

                </div>


                <Link
                  to="/cart"
                  className="checkout-offer-link"
                >
                  View Cart
                </Link>

              </div>

            )}

          </div>


          {/* =================================
              PAYMENT
          ================================= */}

          <div className="checkout-payment">

            <div className="checkout-section-title">

              <span>
                {addresses.length > 0
                  ? "04"
                  : "03"}
              </span>


              <div>

                <h2>
                  Payment Method
                </h2>


                <p>
                  Choose how you want to pay.
                </p>

              </div>

            </div>


            <div className="payment-options">


              {/* COD */}

              <label
                className={`payment-option ${
                  paymentMethod === "cod"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />


                <div>

                  <strong>
                    Cash on Delivery
                  </strong>


                  <span>
                    Pay when your order arrives
                  </span>

                </div>

              </label>


              {/* ONLINE PAYMENT */}

              <label
                className={`payment-option ${
                  paymentMethod === "online"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    paymentMethod === "online"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />


                <div>

                  <strong>
                    Online Payment
                  </strong>


                  <span>
                    UPI, Card or Net Banking
                  </span>

                </div>

              </label>

            </div>

          </div>


          {/* =================================
              PLACE ORDER
          ================================= */}

          <button
            type="submit"
            className="place-order-button"
            disabled={placingOrder}
          >

            {placingOrder
              ? "Placing Order..."
              : "Place Order"}

          </button>


          <p className="checkout-note">

            By placing your order, you agree
            to our terms and conditions.

          </p>


        </form>


        {/* ===================================
            RIGHT SIDE - SUMMARY
        =================================== */}

        <aside className="checkout-summary">


          <p className="summary-label">
            YOUR ORDER
          </p>


          <h2>
            Order Summary
          </h2>


          {/* PRODUCTS */}

          <div className="checkout-products">

            {cart.map(
              (product) => (

                <div
                  className="checkout-product"
                  key={product.id}
                >

                  <div className="checkout-product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />


                    <span>
                      {product.quantity}
                    </span>

                  </div>


                  <div className="checkout-product-info">

                    <h3>
                      {product.name}
                    </h3>


                    <p>
                      ₹{product.price}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>


          {/* SUBTOTAL */}

          <div className="checkout-summary-line">

            <span>
              Subtotal
            </span>


            <span>
              ₹{cartTotal}
            </span>

          </div>


          {/* COUPON */}

          {discount > 0 && (

            <div className="checkout-summary-line discount-row">

              <span>

                Discount

                {coupon && (

                  <small>
                    {" "}
                    ({coupon})
                  </small>

                )}

              </span>


              <span>
                -₹{discount}
              </span>

            </div>

          )}


          {/* SHIPPING */}

          <div className="checkout-summary-line">

            <span>
              Shipping
            </span>


            <span className="free-shipping">
              FREE
            </span>

          </div>


          <div className="summary-divider"></div>


          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Total
            </span>


            <strong>
              ₹{finalTotal}
            </strong>

          </div>


          {/* SAVINGS */}

          {discount > 0 && (

            <p className="cart-savings">

              ✦ You saved ₹{discount}

            </p>

          )}


          {/* TRUST */}

          <div className="checkout-trust">

            <span>
              ✓
            </span>

            Secure checkout

          </div>


        </aside>


      </section>

    </main>

  );

}


export default Checkout;