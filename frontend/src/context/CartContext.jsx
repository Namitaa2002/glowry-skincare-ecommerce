import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { CartContext } from "./CartContextValue";

import apiClient from "../services/apiClient";

import {
  API_BASE_URL,
} from "../config/api";



// =========================================
// GET AUTH DATA
// =========================================

const getAuthData = () => {
  try {
    const token =
      localStorage.getItem(
        "glowryToken"
      );

    const storedUser =
      localStorage.getItem(
        "glowryLoggedInUser"
      );

    const user = storedUser
      ? JSON.parse(storedUser)
      : null;

    const userId =
      user?.id ||
      user?._id ||
      user?.userId;

    return {
      token,
      userId,
    };
  } catch (error) {
    console.error(
      "Get Auth Data Error:",
      error
    );

    return {
      token: null,
      userId: null,
    };
  }
};


// =========================================
// FORMAT BACKEND CART
// =========================================

const formatCart = (
  backendCart
) => {

  if (
    !backendCart ||
    !backendCart.items
  ) {
    return [];
  }

  return backendCart.items
    .filter(
      (item) =>
        item.product
    )
    .map((item) => {

      const product =
        item.product;

      return {

        id:
          product._id,

        name:
          product.name,

        category:
          product.category,

        skinTypes:
          product.skinTypes ||
          [],

        price:
          Number(
            product.price || 0
          ),

        originalPrice:
          Number(
            product.originalPrice ||
            0
          ),

        image:
          product.image
            ? `${API_BASE_URL.replace(
                "/api",
                ""
              )}${product.image}`
            : "",

        rating:
          Number(
            product.rating || 0
          ),

        reviews:
          Number(
            product.reviews || 0
          ),

        description:
          product.description ||
          "",

        stock:
          Number(
            product.stock || 0
          ),

        quantity:
          Number(
            item.quantity || 1
          ),

      };

    });

};


// =========================================
// CART PROVIDER
// =========================================

export function CartProvider({
  children,
}) {

  // =======================================
  // CART
  // =======================================

  const [cart, setCart] =
    useState([]);


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

  const showToast = (
    message
  ) => {

    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);

  };


  // =========================================
  // FETCH CART
  // =========================================

  const fetchCart =
    useCallback(
      async () => {

        try {

          setLoading(true);

          const {
            token,
            userId,
          } = getAuthData();


          // =================================
          // AUTH CHECK
          // =================================

          if (
            !token ||
            !userId
          ) {

            setCart([]);

            return;

          }


          // =================================
          // GET CART
          // =================================

          const response =
            await apiClient.get(
              `/cart/${userId}`
            );


          // =================================
          // FORMAT CART
          // =================================

          const formattedCart =
            formatCart(
              response.data
            );

          setCart(
            formattedCart
          );

        } catch (error) {

          console.error(
            "Fetch Cart Error:",
            error
          );


          // ===============================
          // UNAUTHORIZED
          // ===============================

          if (
            error.response?.status ===
            401
          ) {

            console.warn(
              "Cart authentication failed. Please login again."
            );

          }

        } finally {

          setLoading(false);

        }

      },
      []
    );


  // =========================================
  // LOAD CART
  // =========================================

  useEffect(() => {

    const timer =
      setTimeout(() => {
        fetchCart();
      }, 0);

    return () => {
      clearTimeout(timer);
    };

  }, [fetchCart]);


  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart =
    async (product) => {

      try {

        const {
          token,
          userId,
        } = getAuthData();


        // =================================
        // AUTH CHECK
        // =================================

        if (
          !token ||
          !userId
        ) {

          showToast(
            "Please login to add products to cart"
          );

          return false;

        }


        // =================================
        // ADD PRODUCT
        // =================================

        const response =
          await apiClient.post(
            `/cart/${userId}`,
            {
              productId:
                product.id,

              quantity:
                1,
            }
          );


        // =================================
        // UPDATE CART
        // =================================

        const formattedCart =
          formatCart(
            response.data
          );

        setCart(
          formattedCart
        );

        showToast(
          "Product added to cart 🛍️"
        );

        return true;

      } catch (error) {

        if (
          error.response?.status ===
          401
        ) {

          showToast(
            "Please login again"
          );

        } else if (
          error.response?.status ===
          409
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


  // =========================================
  // INCREASE QUANTITY
  // =========================================

  const increaseQuantity =
    async (productId) => {

      try {

        const {
          token,
          userId,
        } = getAuthData();

        if (
          !token ||
          !userId
        ) {

          showToast(
            "Please login first"
          );

          return;

        }

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
          await apiClient.put(
            `/cart/${userId}/${productId}`,
            {
              quantity:
                product.quantity +
                1,
            }
          );

        setCart(
          formatCart(
            response.data
          )
        );

      } catch (error) {

        console.error(
          "Increase Quantity Error:",
          error
        );

      }

    };


  // =========================================
  // DECREASE QUANTITY
  // =========================================

  const decreaseQuantity =
    async (productId) => {

      try {

        const {
          token,
          userId,
        } = getAuthData();

        if (
          !token ||
          !userId
        ) {

          showToast(
            "Please login first"
          );

          return;

        }

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
          await apiClient.put(
            `/cart/${userId}/${productId}`,
            {
              quantity:
                product.quantity -
                1,
            }
          );

        setCart(
          formatCart(
            response.data
          )
        );

      } catch (error) {

        console.error(
          "Decrease Quantity Error:",
          error
        );

      }

    };


  // =========================================
  // REMOVE FROM CART
  // =========================================

  const removeFromCart =
    async (productId) => {

      try {

        const {
          token,
          userId,
        } = getAuthData();

        if (
          !token ||
          !userId
        ) {

          showToast(
            "Please login first"
          );

          return;

        }

        const response =
          await apiClient.delete(
            `/cart/${userId}/${productId}`
          );

        setCart(
          formatCart(
            response.data
          )
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


  // =========================================
  // CLEAR CART
  // =========================================

  const clearCart =
    async () => {

      try {

        const {
          token,
          userId,
        } = getAuthData();

        if (
          !token ||
          !userId
        ) {

          setCart([]);

          return;

        }

        await apiClient.delete(
          `/cart/${userId}`
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


  // =========================================
  // CART COUNT
  // =========================================

  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );


  // =========================================
  // CART TOTAL
  // =========================================

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


  // =========================================
  // AVAILABLE COUPONS
  // =========================================

  const availableCoupons = [

    {
      code:
        "GLOW10",

      title:
        "10% OFF",

      description:
        "Get 10% off on orders above ₹699",

      minimum:
        699,

      type:
        "percentage",

      value:
        10,
    },

    {
      code:
        "WELCOME100",

      title:
        "₹100 OFF",

      description:
        "First order above ₹999",

      minimum:
        999,

      type:
        "fixed",

      value:
        100,
    },

    {
      code:
        "SKIN15",

      title:
        "15% OFF",

      description:
        "Get 15% off on orders above ₹1,499",

      minimum:
        1499,

      type:
        "percentage",

      value:
        15,
    },

    {
      code:
        "GLOW20",

      title:
        "20% OFF",

      description:
        "Get 20% off on orders above ₹1,999",

      minimum:
        1999,

      type:
        "percentage",

      value:
        20,
    },

  ];


  // =========================================
  // APPLY COUPON
  // =========================================

  const applyCoupon =
    (couponCode) => {

      const code =
        String(
          couponCode || ""
        )
          .trim()
          .toUpperCase();


      if (!code) {

        showToast(
          "Please enter a coupon code 🎟️"
        );

        return false;

      }


      if (
        cart.length === 0
      ) {

        showToast(
          "Add products before applying a coupon"
        );

        return false;

      }

      if (
        coupon === code
      ) {

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

      // =====================================
      // FIRST ORDER COUPON
      // =====================================

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
          existingOrders.length >
          0
        ) {

          showToast(
            "WELCOME100 is for first orders only"
          );

          return false;

        }

      }

      // =====================================
      // CALCULATE DISCOUNT
      // =====================================

      const discountAmount =
        selectedCoupon.type ===
        "percentage"

          ? Math.round(
              cartTotal *
                (
                  selectedCoupon.value /
                  100
                )
            )

          : selectedCoupon.value;

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

  // =========================================
  // REMOVE COUPON
  // =========================================

  const removeCoupon =
    () => {

      setCoupon(null);

      setDiscount(0);

      showToast(
        "Coupon removed"
      );

    };

  // =========================================
  // FINAL TOTAL
  // =========================================

  const finalTotal =
    Math.max(
      0,
      cartTotal -
        discount
    );

  // =========================================
  // PROVIDER
  // =========================================

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