
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useCart,
} from "../context/useCart";

import apiClient from "../services/apiClient";

function Checkout() {
  const navigate = useNavigate();

  // =========================================
  // CART
  // =========================================

  const {
    cart,
    coupon,
    discount,
  } = useCart();

  // =========================================
  // LOGGED IN USER
  // =========================================

  const [
    loggedInUser,
  ] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(
          "glowryLoggedInUser"
        );

      const token =
        localStorage.getItem(
          "glowryToken"
        );

      if (!savedUser || !token) {
        return null;
      }

      const user =
        JSON.parse(savedUser);

      if (!user?.id) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(
        "User Parse Error:",
        error
      );

      return null;
    }
  });

  // =========================================
  // CALCULATE ORDER TOTALS
  // =========================================

  const calculatedSubtotal =
    Array.isArray(cart)
      ? cart.reduce(
          (total, product) => {
            const price =
              Number(
                product?.price || 0
              );

            const quantity =
              Number(
                product?.quantity || 1
              );

            return (
              total +
              price * quantity
            );
          },
          0
        )
      : 0;

  const calculatedDiscount =
    Math.min(
      Math.max(
        Number(discount || 0),
        0
      ),
      calculatedSubtotal
    );

  const calculatedFinalTotal =
    Math.max(
      0,
      calculatedSubtotal -
        calculatedDiscount
    );

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
  ] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(
          "glowryLoggedInUser"
        );

      if (!savedUser) {
        return {
          fullName: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
        };
      }

      const user =
        JSON.parse(savedUser);

      return {
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

        address: "",
        city: "",
        state: "",
        pincode: "",
      };
    } catch (error) {
      console.error(
        "Form User Parse Error:",
        error
      );

      return {
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      };
    }
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
  // LOGIN CHECK
  // =========================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "glowryToken"
      );

    if (!loggedInUser || !token) {
      navigate("/login");
    }
  }, [
    loggedInUser,
    navigate,
  ]);

  // =========================================
  // FILL ADDRESS FORM
  // =========================================

  const fillAddressForm =
    useCallback(
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
      },
      [loggedInUser]
    );

  // =========================================
  // LOAD SAVED ADDRESSES
  // =========================================

  useEffect(() => {
    if (!loggedInUser?.id) {
      return;
    }

    let isMounted = true;

    const loadAddresses =
      async () => {
        try {
          setLoadingAddress(true);
          setError("");

          const token =
            localStorage.getItem(
              "glowryToken"
            );

          if (!token) {
            if (!isMounted) {
              return;
            }

            setError(
              "Authentication required. Please login again."
            );

            navigate("/login");
            return;
          }

          const response =
            await apiClient.get(
              `/addresses/${loggedInUser.id}`
            );

          const savedAddresses =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          if (!isMounted) {
            return;
          }

          setAddresses(
            savedAddresses
          );

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

          if (!isMounted) {
            return;
          }

          if (
            error.response?.status ===
              401 ||
            error.response?.status ===
              403
          ) {
            localStorage.removeItem(
              "glowryToken"
            );

            localStorage.removeItem(
              "glowryLoggedInUser"
            );

            navigate("/login");
            return;
          }

          setError(
            error.response?.data?.message ||
              "Failed to load saved addresses."
          );
        } finally {
          if (isMounted) {
            setLoadingAddress(
              false
            );
          }
        }
      };

    loadAddresses();

    return () => {
      isMounted = false;
    };
  }, [
    loggedInUser,
    navigate,
    fillAddressForm,
  ]);

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

      let updatedValue =
        value;

      // PHONE
      if (name === "phone") {
        updatedValue =
          value
            .replace(/\D/g, "")
            .slice(0, 10);
      }

      // PINCODE
      if (name === "pincode") {
        updatedValue =
          value
            .replace(/\D/g, "")
            .slice(0, 6);
      }

      setFormData(
        (previous) => ({
          ...previous,
          [name]:
            updatedValue,
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

      if (placingOrder) {
        return;
      }

      // =======================================
      // LOGIN CHECK
      // =======================================

      if (!loggedInUser?.id) {
        navigate("/login");
        return;
      }

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
      // CART CHECK
      // =======================================

      if (
        !Array.isArray(cart) ||
        cart.length === 0
      ) {
        setError(
          "Your cart is empty."
        );

        return;
      }

      // =======================================
      // DELIVERY DETAILS
      // =======================================

      const requiredFields = [
        formData.fullName,
        formData.phone,
        formData.email,
        formData.address,
        formData.city,
        formData.state,
        formData.pincode,
      ];

      if (
        requiredFields.some(
          (field) =>
            !String(field).trim()
        )
      ) {
        setError(
          "Please fill all delivery details."
        );

        return;
      }

      // =======================================
      // PHONE VALIDATION
      // =======================================

      if (
        !/^\d{10}$/.test(
          formData.phone.trim()
        )
      ) {
        setError(
          "Please enter a valid 10-digit phone number."
        );

        return;
      }

      // =======================================
      // PINCODE VALIDATION
      // =======================================

      if (
        !/^\d{6}$/.test(
          formData.pincode.trim()
        )
      ) {
        setError(
          "Please enter a valid 6-digit pincode."
        );

        return;
      }

      // =======================================
      // EMAIL VALIDATION
      // =======================================

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim()
        )
      ) {
        setError(
          "Please enter a valid email address."
        );

        return;
      }

      try {
        setPlacingOrder(true);

        // =====================================
        // ORDER DATA
        // =====================================

        const orderData = {
          customer: {
            fullName:
              formData.fullName.trim(),

            phone:
              formData.phone.trim(),

            email:
              formData.email.trim(),

            address:
              formData.address.trim(),

            city:
              formData.city.trim(),

            state:
              formData.state.trim(),

            pincode:
              formData.pincode.trim(),
          },

          coupon:
            coupon || null,

          paymentMethod:
            paymentMethod,
        };

        // =====================================
        // CREATE ORDER
        // =====================================

        const response =
          await apiClient.post(
            "/orders",
            orderData
          );

        // =====================================
        // GET ACTUAL BACKEND ORDER
        // =====================================

        const createdOrder =
          response.data?.order;

        const finalOrderId =
          createdOrder?.orderId;

        if (!finalOrderId) {
          throw new Error(
            "Order ID was not returned by the server."
          );
        }

        // =====================================
        // SUCCESS PAGE
        // =====================================

        navigate(
          `/order-success?id=${finalOrderId}`
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

        if (
          error.response?.status ===
            401 ||
          error.response?.status ===
            403
        ) {
          localStorage.removeItem(
            "glowryToken"
          );

          localStorage.removeItem(
            "glowryLoggedInUser"
          );

          navigate("/login");
          return;
        }

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

  if (
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
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
      ====================================== */}

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
      ====================================== */}

      <section className="checkout-content">

        {/* ===================================
            CHECKOUT FORM
        ==================================== */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >

          {/* =================================
              SAVED ADDRESSES
          ================================== */}

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
          ================================== */}

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
          ================================== */}

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
                placeholder="Enter your 10-digit phone number"
                inputMode="numeric"
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
                inputMode="numeric"
                maxLength="6"
                required
              />
            </div>
          </div>

          {/* =================================
              OFFERS
          ================================== */}

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
                  -₹
                  {calculatedDiscount.toFixed(
                    2
                  )}
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
          ================================== */}

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
                className={
                  `payment-option ${
                    paymentMethod ===
                    "cod"
                      ? "selected"
                      : ""
                  }`
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    paymentMethod ===
                    "cod"
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

              {/* ONLINE */}

              <label
                className={
                  `payment-option ${
                    paymentMethod ===
                    "online"
                      ? "selected"
                      : ""
                  }`
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    paymentMethod ===
                    "online"
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
          ================================== */}

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
            ORDER SUMMARY
        ==================================== */}

        <aside className="checkout-summary">
          <p className="summary-label">
            YOUR ORDER
          </p>

          <h2>
            Order Summary
          </h2>

          {/* =================================
              PRODUCTS
          ================================== */}

          <div className="checkout-products">
            {cart.map(
              (product) => {
                const quantity =
                  Number(
                    product.quantity ||
                      1
                  );

                const price =
                  Number(
                    product.price ||
                      0
                  );

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    className="checkout-product"
                    key={product.id}
                  >
                    <div className="checkout-product-image">
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />

                      <span>
                        {quantity}
                      </span>
                    </div>

                    <div className="checkout-product-info">
                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        ₹
                        {price.toFixed(
                          2
                        )}
                        {" × "}
                        {quantity}
                        {" = "}
                        ₹
                        {itemTotal.toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* =================================
              SUBTOTAL
          ================================== */}

          <div className="checkout-summary-line">
            <span>
              Subtotal
            </span>

            <span>
              ₹
              {calculatedSubtotal.toFixed(
                2
              )}
            </span>
          </div>

          {/* =================================
              DISCOUNT
          ================================== */}

          {calculatedDiscount > 0 && (
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
                -₹
                {calculatedDiscount.toFixed(
                  2
                )}
              </span>
            </div>
          )}

          {/* =================================
              SHIPPING
          ================================== */}

          <div className="checkout-summary-line">
            <span>
              Shipping
            </span>

            <span className="free-shipping">
              FREE
            </span>
          </div>

          <div className="summary-divider"></div>

          {/* =================================
              FINAL TOTAL
          ================================== */}

          <div className="checkout-total">
            <span>
              Total
            </span>

            <strong>
              ₹
              {calculatedFinalTotal.toFixed(
                2
              )}
            </strong>
          </div>

          {/* =================================
              SAVINGS
          ================================== */}

          {calculatedDiscount > 0 && (
            <p className="cart-savings">
              ✦ You saved ₹
              {calculatedDiscount.toFixed(
                2
              )}
            </p>
          )}

          {/* =================================
              TRUST
          ================================== */}

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

