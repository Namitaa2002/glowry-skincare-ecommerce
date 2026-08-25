import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";


// =========================================
// CREATE CONTEXT
// =========================================

const CartContext = createContext();


// =========================================
// USER ID
// =========================================

const USER_ID = "namita";


// =========================================
// API URL
// =========================================

const API_URL = "http://localhost:5000/api/cart";


// =========================================
// CART PROVIDER
// =========================================

export function CartProvider({ children }) {

  // =======================================
  // CART
  // =======================================

  const [cart, setCart] = useState([]);


  // =======================================
  // LOADING
  // =======================================

  const [loading, setLoading] =
    useState(true);


  // =======================================
  // TOAST
  // =======================================

  const [toast, setToast] =
    useState("");


  // =======================================
  // COUPON
  // =======================================

  const [coupon, setCoupon] =
    useState(null);

  const [discount, setDiscount] =
    useState(0);


  // =======================================
  // SHOW TOAST
  // =======================================

  const showToast = (message) => {

    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);

  };


  // =======================================
  // FORMAT BACKEND CART
  // =======================================

  const formatCart = (backendCart) => {

    if (
      !backendCart ||
      !backendCart.items
    ) {

      return [];

    }


    return backendCart.items

      .filter(
        (item) => item.product
      )

      .map((item) => {

        const product =
          item.product;


        return {

          id: product._id,

          name: product.name,

          category:
            product.category,

          skinTypes:
            product.skinTypes || [],

          price:
            Number(product.price || 0),

          originalPrice:
            Number(
              product.originalPrice || 0
            ),
          image:
            product.image
              ? `http://localhost:5000${product.image}`
              : "",

          rating:
            Number(product.rating || 0),

          reviews:
            Number(product.reviews || 0),

          description:
            product.description || "",

          stock:
            Number(product.stock || 0),

          quantity:
            Number(item.quantity || 1),

        };

      });

  };


  // =======================================
  // FETCH CART
  // =======================================

  const fetchCart = async () => {

    try {

      setLoading(true);


      const response =
        await axios.get(
          `${API_URL}/${USER_ID}`
        );


      const formattedCart =
        formatCart(response.data);


      setCart(formattedCart);


    } catch (error) {

      console.error(
        "Fetch Cart Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =======================================
  // LOAD CART
  // =======================================

  useEffect(() => {

    fetchCart();

  }, []);


  // =======================================
  // ADD TO CART
  // =======================================

  const addToCart = async (product) => {

    try {

      const response =
        await axios.post(
          `${API_URL}/${USER_ID}`,
          {

            productId:
              product.id,

            quantity: 1,

          }
        );


      const formattedCart =
        formatCart(response.data);


      setCart(formattedCart);


      showToast(
        "Product added to cart 🛍️"
      );


      return true;


    } catch (error) {

      if (
        error.response?.status === 409
      ) {

        showToast(
          "Product is already in your cart 🛒"
        );

      } else {

        console.error(
          "Add To Cart Error:",
          error
        );

        showToast(
          "Failed to add product"
        );

      }


      return false;

    }

  };


  // =======================================
  // INCREASE QUANTITY
  // =======================================

  const increaseQuantity =
    async (productId) => {

      try {

        const product =
          cart.find(
            (item) =>
              String(item.id) ===
              String(productId)
          );


        if (!product) {
          return;
        }


        const response =
          await axios.put(

            `${API_URL}/${USER_ID}/${productId}`,

            {

              quantity:
                product.quantity + 1,

            }

          );


        setCart(
          formatCart(response.data)
        );


      } catch (error) {

        console.error(
          "Increase Quantity Error:",
          error
        );

      }

    };


  // =======================================
  // DECREASE QUANTITY
  // =======================================

  const decreaseQuantity =
    async (productId) => {

      try {

        const product =
          cart.find(
            (item) =>
              String(item.id) ===
              String(productId)
          );


        if (!product) {
          return;
        }


        // =================================
        // REMOVE IF QUANTITY IS 1
        // =================================

        if (
          product.quantity <= 1
        ) {

          await removeFromCart(
            productId
          );

          return;

        }


        const response =
          await axios.put(

            `${API_URL}/${USER_ID}/${productId}`,

            {

              quantity:
                product.quantity - 1,

            }

          );


        setCart(
          formatCart(response.data)
        );


      } catch (error) {

        console.error(
          "Decrease Quantity Error:",
          error
        );

      }

    };


  // =======================================
  // REMOVE FROM CART
  // =======================================

  const removeFromCart =
    async (productId) => {

      try {

        const response =
          await axios.delete(

            `${API_URL}/${USER_ID}/${productId}`

          );


        setCart(
          formatCart(response.data)
        );


        showToast(
          "Product removed from cart"
        );


      } catch (error) {

        console.error(
          "Remove Cart Error:",
          error
        );

      }

    };


  // =======================================
  // CLEAR CART
  // =======================================

  const clearCart = async () => {

    try {

      await axios.delete(
        `${API_URL}/${USER_ID}`
      );


      setCart([]);

      setCoupon(null);

      setDiscount(0);


    } catch (error) {

      console.error(
        "Clear Cart Error:",
        error
      );

    }

  };


  // =======================================
  // CART COUNT
  // =======================================

  const cartCount =
    cart.reduce(

      (total, item) =>

        total +
        Number(
          item.quantity || 0
        ),

      0

    );


  // =======================================
  // CART TOTAL
  // =======================================

  const cartTotal =
    cart.reduce(

      (total, item) =>

        total +
        Number(
          item.price || 0
        ) *
        Number(
          item.quantity || 0
        ),

      0

    );


  // =======================================
  // AVAILABLE COUPONS
  // =======================================

  const availableCoupons = [

    {
      code: "GLOW10",
      title: "10% OFF",
      description:
        "Get 10% off on orders above ₹699",
      minimum: 699,
      type: "percentage",
      value: 10,
    },

    {
      code: "WELCOME100",
      title: "₹100 OFF",
      description:
        "First order above ₹999",
      minimum: 999,
      type: "fixed",
      value: 100,
    },

    {
      code: "SKIN15",
      title: "15% OFF",
      description:
        "Get 15% off on orders above ₹1,499",
      minimum: 1499,
      type: "percentage",
      value: 15,
    },

    {
      code: "GLOW20",
      title: "20% OFF",
      description:
        "Get 20% off on orders above ₹1,999",
      minimum: 1999,
      type: "percentage",
      value: 20,
    },

  ];


  // =======================================
  // APPLY COUPON
  // =======================================

  const applyCoupon = (couponCode) => {

    const code =
      String(couponCode || "")
        .trim()
        .toUpperCase();


    if (!code) {

      showToast(
        "Please enter a coupon code 🎟️"
      );

      return false;

    }


    if (cart.length === 0) {

      showToast(
        "Add products before applying a coupon"
      );

      return false;

    }


    if (coupon === code) {

      showToast(
        "This coupon is already applied"
      );

      return false;

    }


    const selectedCoupon =
      availableCoupons.find(
        (item) =>
          item.code === code
      );


    if (!selectedCoupon) {

      showToast(
        "Invalid or expired coupon code"
      );

      return false;

    }


    if (
      cartTotal <
      selectedCoupon.minimum
    ) {

      const remaining =
        selectedCoupon.minimum -
        cartTotal;


      showToast(
        `Add ₹${remaining} more. Minimum order is ₹${selectedCoupon.minimum}`
      );

      return false;

    }


    if (
      selectedCoupon.code ===
      "WELCOME100"
    ) {

      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "glowryOrders"
          )
        ) || [];


      if (
        existingOrders.length > 0
      ) {

        showToast(
          "WELCOME100 is for first orders only"
        );

        return false;

      }

    }


    let discountAmount = 0;


    if (
      selectedCoupon.type ===
      "percentage"
    ) {

      discountAmount =
        Math.round(
          cartTotal *
          (
            selectedCoupon.value /
            100
          )
        );

    } else {

      discountAmount =
        selectedCoupon.value;

    }


    setCoupon(
      selectedCoupon.code
    );

    setDiscount(
      discountAmount
    );


    showToast(
      `${selectedCoupon.code} applied 🎉`
    );


    return true;

  };


  // =======================================
  // REMOVE COUPON
  // =======================================

  const removeCoupon = () => {

    setCoupon(null);

    setDiscount(0);

    showToast(
      "Coupon removed"
    );

  };


  // =======================================
  // FINAL TOTAL
  // =======================================

  const finalTotal =
    Math.max(
      0,
      cartTotal - discount
    );


  // =======================================
  // PROVIDER
  // =======================================

  return (

    <CartContext.Provider
      value={{

        cart,

        loading,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        cartCount,

        cartTotal,

        toast,

        coupon,

        discount,

        finalTotal,

        availableCoupons,

        applyCoupon,

        removeCoupon,

      }}
    >

      {children}

    </CartContext.Provider>

  );

}


// =========================================
// CUSTOM HOOK
// =========================================

export function useCart() {

  return useContext(
    CartContext
  );

}