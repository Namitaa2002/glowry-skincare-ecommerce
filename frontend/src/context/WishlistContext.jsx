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

const WishlistContext = createContext();


// =========================================
// USER ID
// =========================================

const USER_ID = "namita";


// =========================================
// API URL
// =========================================

const API_URL =
  "http://localhost:5000/api/wishlist";


// =========================================
// WISHLIST PROVIDER
// =========================================

export function WishlistProvider({ children }) {

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

  const showToast = (message) => {

    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);

  };


  // =======================================
  // FORMAT BACKEND WISHLIST
  // =======================================

  const formatWishlist = (data) => {

    if (
      !data ||
      !data.items
    ) {

      return [];

    }


    return data.items.map((item) => ({

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
          ? item.image.startsWith("http")
            ? item.image
            : `http://localhost:5000${item.image}`
          : "",

      price:
        Number(item.price || 0),

      originalPrice:
        Number(
          item.originalPrice || 0
        ),

      category:
        item.category || "SKINCARE",

      rating:
        Number(item.rating || 0),

    }));

  };


  // =======================================
  // FETCH WISHLIST
  // =======================================

  const fetchWishlist = async () => {

    try {

      setLoading(true);


      const response =
        await axios.get(
          `${API_URL}/${USER_ID}`
        );


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

      showToast(
        "Failed to load wishlist"
      );

    } finally {

      setLoading(false);

    }

  };


  // =======================================
  // LOAD WISHLIST
  // =======================================

  useEffect(() => {

    fetchWishlist();

  }, []);


  // =======================================
  // ADD TO WISHLIST
  // =======================================

  const addToWishlist = async (product) => {

    try {

      const response =
        await axios.post(

          `${API_URL}/${USER_ID}`,

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
                product.originalPrice || 0
              ),

            category:
              product.category || "SKINCARE",

            rating:
              Number(
                product.rating || 0
              ),

          }

        );


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
        error.response?.status === 409
      ) {

        showToast(
          "Product is already in wishlist ♡"
        );

      } else {

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

        const response =
          await axios.delete(

            `${API_URL}/${USER_ID}/${productId}`

          );


        setWishlist(
          formatWishlist(
            response.data.wishlist
          )
        );


        showToast(
          "Removed from wishlist"
        );


      } catch (error) {

        console.error(
          "Remove Wishlist Error:",
          error
        );

        showToast(
          "Failed to remove product"
        );

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

        await removeFromWishlist(
          productId
        );

        return;

      }


      await addToWishlist(product);

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


// =========================================
// CUSTOM HOOK
// =========================================

export function useWishlist() {

  return useContext(
    WishlistContext
  );

}