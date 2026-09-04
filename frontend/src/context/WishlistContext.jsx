import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { WishlistContext } from "./WishlistContextValue";

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

    const userData =
      localStorage.getItem(
        "glowryLoggedInUser"
      );

    const user =
      userData
        ? JSON.parse(userData)
        : null;

    return {
      token,
      user,
    };

  } catch (error) {

    console.error(
      "Auth Data Error:",
      error
    );

    return {
      token: null,
      user: null,
    };

  }
};


// =========================================
// FORMAT BACKEND WISHLIST
// =========================================

const formatWishlist = (
  data
) => {

  if (
    !data ||
    !data.items
  ) {
    return [];
  }

  return data.items.map(
    (item) => ({

      id:
        item.product?._id ||
        item.product,

      productId:
        item.product?._id ||
        item.product,

      name:
        item.name,

      image:
        item.image
          ? item.image.startsWith(
              "http"
            )
            ? item.image
            : `${API_BASE_URL.replace(
                "/api",
                ""
              )}${item.image}`
          : "",

      price:
        Number(
          item.price || 0
        ),

      originalPrice:
        Number(
          item.originalPrice || 0
        ),

      category:
        item.category ||
        "SKINCARE",

      rating:
        Number(
          item.rating || 0
        ),

    })
  );

};


// =========================================
// WISHLIST PROVIDER
// =========================================

export function WishlistProvider({
  children,
}) {

  // =======================================
  // WISHLIST
  // =======================================

  const [wishlist, setWishlist] =
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


  // =======================================
  // FETCH WISHLIST
  // =======================================

  const fetchWishlist =
    useCallback(
      async () => {

        try {

          setLoading(true);


          // =================================
          // GET AUTH DATA
          // =================================

          const {
            token,
            user,
          } = getAuthData();


          // =================================
          // CHECK LOGIN
          // =================================

          if (
            !token ||
            !user?.id
          ) {

            setWishlist([]);

            return;

          }


          // =================================
          // GET WISHLIST
          // =================================

          const response =
            await apiClient.get(
              `/wishlist/${user.id}`
            );


          // =================================
          // FORMAT RESPONSE
          // =================================

          setWishlist(
            formatWishlist(
              response.data
            )
          );

        } catch (error) {

          console.error(
            "Fetch Wishlist Error:",
            error
          );


          // =================================
          // UNAUTHORIZED
          // =================================

          if (
            error.response?.status ===
              401 ||
            error.response?.status ===
              403
          ) {

            setWishlist([]);

          } else {

            showToast(
              "Failed to load wishlist"
            );

          }

        } finally {

          setLoading(false);

        }

      },
      []
    );


  // =======================================
  // LOAD WISHLIST
  // =======================================

  useEffect(() => {

    const timer =
      setTimeout(() => {
        fetchWishlist();
      }, 0);

    return () => {
      clearTimeout(timer);
    };

  }, [fetchWishlist]);


  // =======================================
  // ADD TO WISHLIST
  // =======================================

  const addToWishlist =
    async (product) => {

      try {

        // =================================
        // GET AUTH DATA
        // =================================

        const {
          token,
          user,
        } = getAuthData();


        // =================================
        // CHECK LOGIN
        // =================================

        if (
          !token ||
          !user?.id
        ) {

          showToast(
            "Please login to add products to wishlist"
          );

          return false;

        }


        // =================================
        // ADD PRODUCT
        // =================================

        const response =
          await apiClient.post(
            `/wishlist/${user.id}`,
            {

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

              originalPrice:
                Number(
                  product.originalPrice ||
                  0
                ),

              category:
                product.category ||
                "SKINCARE",

              rating:
                Number(
                  product.rating || 0
                ),

            }
          );


        // =================================
        // UPDATE WISHLIST
        // =================================

        setWishlist(
          formatWishlist(
            response.data
          )
        );

        showToast(
          "Added to wishlist ♡"
        );

        return true;

      } catch (error) {

        // =================================
        // DUPLICATE PRODUCT
        // =================================

        if (
          error.response?.status ===
          409
        ) {

          showToast(
            "Product is already in wishlist ♡"
          );

        }


        // =================================
        // UNAUTHORIZED
        // =================================

        else if (
          error.response?.status ===
            401 ||
          error.response?.status ===
            403
        ) {

          showToast(
            "Please login to manage your wishlist"
          );

        }


        // =================================
        // OTHER ERROR
        // =================================

        else {

          console.error(
            "Add Wishlist Error:",
            error
          );

          showToast(
            "Failed to add to wishlist"
          );

        }

        return false;

      }

    };


  // =======================================
  // REMOVE FROM WISHLIST
  // =======================================

  const removeFromWishlist =
    async (productId) => {

      try {

        // =================================
        // GET AUTH DATA
        // =================================

        const {
          token,
          user,
        } = getAuthData();


        // =================================
        // CHECK LOGIN
        // =================================

        if (
          !token ||
          !user?.id
        ) {

          showToast(
            "Please login to manage your wishlist"
          );

          return false;

        }


        // =================================
        // DELETE PRODUCT
        // =================================

        const response =
          await apiClient.delete(
            `/wishlist/${user.id}/${productId}`
          );


        // =================================
        // UPDATE WISHLIST
        // =================================

        setWishlist(
          formatWishlist(
            response.data
              .wishlist
          )
        );

        showToast(
          "Removed from wishlist"
        );

        return true;

      } catch (error) {

        // =================================
        // UNAUTHORIZED
        // =================================

        if (
          error.response?.status ===
            401 ||
          error.response?.status ===
            403
        ) {

          showToast(
            "Please login to manage your wishlist"
          );

        }


        // =================================
        // OTHER ERROR
        // =================================

        else {

          console.error(
            "Remove Wishlist Error:",
            error
          );

          showToast(
            "Failed to remove product"
          );

        }

        return false;

      }

    };


  // =======================================
  // TOGGLE WISHLIST
  // =======================================

  const toggleWishlist =
    async (product) => {

      const productId =
        product.id ||
        product.productId;


      const alreadyExists =
        wishlist.some(
          (item) =>
            String(item.id) ===
            String(productId)
        );


      if (alreadyExists) {

        return await removeFromWishlist(
          productId
        );

      }


      return await addToWishlist(
        product
      );

    };


  // =======================================
  // CHECK WISHLIST
  // =======================================

  const isInWishlist =
    (productId) => {

      return wishlist.some(
        (item) =>
          String(item.id) ===
          String(productId)
      );

    };


  // =======================================
  // PROVIDER
  // =======================================

  return (

    <WishlistContext.Provider
      value={{

        wishlist,

        loading,

        toast,

        addToWishlist,

        removeFromWishlist,

        toggleWishlist,

        isInWishlist,

        fetchWishlist,

      }}
    >

      {children}

    </WishlistContext.Provider>

  );

}