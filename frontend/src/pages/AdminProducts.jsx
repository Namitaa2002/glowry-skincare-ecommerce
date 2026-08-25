import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function AdminProducts() {

  const navigate = useNavigate();


  // =====================================================
  // PRODUCTS
  // =====================================================

  const [products, setProducts] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);


  const [editingProduct, setEditingProduct] =
    useState(null);


  const [saving, setSaving] =
    useState(false);


  // =====================================================
  // DELETE POPUP
  // =====================================================

  const [deleteProduct, setDeleteProduct] =
    useState(null);


  const [deleting, setDeleting] =
    useState(false);


  // =====================================================
  // FORM
  // =====================================================

  const initialForm = {

    name: "",

    category: "Cleansers",

    skinTypes: [],

    price: "",

    originalPrice: "",

    image: "",

    rating: "",

    reviews: "",

    description: "",

    stock: "",

  };


  const [formData, setFormData] =
    useState(initialForm);


  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {

    if (!image) {

      return "";

    }


    if (
      image.startsWith("http")
    ) {

      return image;

    }


    return `http://localhost:5000${image}`;

  };


  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        localStorage.getItem(
          "glowryAdminToken"
        );


      if (!token) {

        navigate(
          "/admin/login"
        );

        return;

      }


      const response =
        await axios.get(

          "http://localhost:5000/api/admin/products",

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );


      setProducts(
        response.data
      );


    } catch (error) {

      console.error(
        "Fetch Admin Products Error:",
        error
      );


      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem(
          "glowryAdminToken"
        );

        localStorage.removeItem(
          "glowryAdminUser"
        );

        navigate(
          "/admin/login"
        );

        return;

      }


      setError(

        error.response?.data?.message ||

        "Unable to load products."

      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchProducts();

  }, []);


  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

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

  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddProduct = () => {

    setEditingProduct(null);

    setFormData(
      initialForm
    );

    setShowModal(true);

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (product) => {

    setEditingProduct(
      product
    );


    setFormData({

      name:
        product.name || "",

      category:
        product.category || "Cleansers",

      skinTypes:
        product.skinTypes || [],

      price:
        product.price ?? "",

      originalPrice:
        product.originalPrice ?? "",

      image:
        product.image || "",

      rating:
        product.rating ?? "",

      reviews:
        product.reviews ?? "",

      description:
        product.description || "",

      stock:
        product.stock ?? "",

    });


    setShowModal(true);

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    if (saving) {

      return;

    }


    setShowModal(false);

    setEditingProduct(null);

    setFormData(
      initialForm
    );

  };


  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setSaving(true);


      const token =
        localStorage.getItem(
          "glowryAdminToken"
        );


      if (!token) {

        navigate(
          "/admin/login"
        );

        return;

      }


      const productData = {

        name:
          formData.name.trim(),

        category:
          formData.category,

        skinTypes:
          formData.skinTypes,

        price:
          Number(formData.price),

        originalPrice:
          Number(formData.originalPrice),

        image:
          formData.image.trim(),

        rating:
          Number(formData.rating || 0),

        reviews:
          Number(formData.reviews || 0),

        description:
          formData.description.trim(),

        stock:
          Number(formData.stock || 0),

      };


      // =================================================
      // UPDATE
      // =================================================

      if (editingProduct) {

        const response =
          await axios.put(

            `http://localhost:5000/api/admin/products/${editingProduct._id}`,

            productData,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        setProducts(
          (previous) =>
            previous.map(
              (product) =>
                product._id ===
                editingProduct._id

                  ? response.data.product

                  : product
            )
        );


      }

      // =================================================
      // ADD
      // =================================================

      else {

        const response =
          await axios.post(

            "http://localhost:5000/api/admin/products",

            productData,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        setProducts(
          (previous) => [

            response.data.product,

            ...previous,

          ]
        );

      }


      closeModal();


    } catch (error) {

      console.error(
        "Save Product Error:",
        error
      );


      alert(

        error.response?.data?.message ||

        "Unable to save product."

      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // OPEN DELETE POPUP
  // =====================================================

  const handleDeleteClick = (product) => {

    setDeleteProduct(
      product
    );

  };


  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async () => {

    if (!deleteProduct) {

      return;

    }


    try {

      setDeleting(true);


      const token =
        localStorage.getItem(
          "glowryAdminToken"
        );


      await axios.delete(

        `http://localhost:5000/api/admin/products/${deleteProduct._id}`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );


      setProducts(
        (previous) =>
          previous.filter(
            (product) =>
              product._id !==
              deleteProduct._id
          )
      );


      setDeleteProduct(
        null
      );


    } catch (error) {

      console.error(
        "Delete Product Error:",
        error
      );


      alert(

        error.response?.data?.message ||

        "Unable to delete product."

      );

    } finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <main className="admin-products-page">

        <div className="admin-products-loading">

          <div className="admin-loading-spinner">
          </div>

          <p>
            Loading products...
          </p>

        </div>

      </main>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <main className="admin-products-page">

        <div className="admin-products-error">

          <h2>
            Unable to Load Products
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            Back to Dashboard
          </button>

        </div>

      </main>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <main className="admin-products-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-products-header">

        <div>

          <p className="admin-products-eyebrow">
            GLOWRY ADMINISTRATION
          </p>

          <h1>
            Products
          </h1>

          <p>
            Manage the products available
            in your GLOWRY store.
          </p>

        </div>


        <div className="admin-products-header-actions">

          <button
            className="admin-products-back"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            ← Dashboard
          </button>


          <button
            className="admin-products-add"
            onClick={
              handleAddProduct
            }
          >
            + Add Product
          </button>

        </div>

      </header>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <section className="admin-products-summary">

        <div>

          <span>
            TOTAL PRODUCTS
          </span>

          <strong>
            {products.length}
          </strong>

        </div>

      </section>


      {/* =================================================
          PRODUCTS CARD
      ================================================= */}

      <section className="admin-products-card">

        <div className="admin-products-card-header">

          <div>

            <span>
              INVENTORY
            </span>

            <h2>
              All Products
            </h2>

          </div>

        </div>


        {products.length === 0 ? (

          <div className="admin-products-empty">

            <div className="admin-products-empty-icon">
              📦
            </div>

            <h3>
              No Products Found
            </h3>

            <p>
              Your store does not have
              any products yet.
            </p>

          </div>

        ) : (

          <div className="admin-products-table">


            {/* TABLE HEADER */}

            <div className="admin-products-table-header">

              <span>
                Product
              </span>

              <span>
                Category
              </span>

              <span>
                Price
              </span>

              <span>
                Stock
              </span>

              <span>
                Actions
              </span>

            </div>


            {/* PRODUCTS */}

            {products.map(
              (product) => (

                <div
                  className="admin-products-row"
                  key={
                    product._id
                  }
                >


                  {/* PRODUCT */}

                  <div className="admin-product-info">

                    <div className="admin-product-image">

                      {product.image ? (

                        <img
                          src={
                            getImageUrl(
                              product.image
                            )
                          }
                          alt={
                            product.name
                          }
                        />

                      ) : (

                        <span>
                          🧴
                        </span>

                      )}

                    </div>


                    <div className="admin-product-details">

                      <strong>
                        {product.name}
                      </strong>

                      <span>

                        {product.description

                          ? product.description.slice(
                              0,
                              55
                            )

                          : "No description"}

                      </span>

                    </div>

                  </div>


                  {/* CATEGORY */}

                  <span className="admin-product-category">

                    {product.category}

                  </span>


                  {/* PRICE */}

                  <strong className="admin-product-price">

                    ₹
                    {Number(
                      product.price || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>


                  {/* STOCK */}

                  <span
                    className={`
                      admin-product-stock
                      ${
                        Number(
                          product.stock
                        ) > 0
                          ? "in-stock"
                          : "out-of-stock"
                      }
                    `}
                  >

                    {Number(
                      product.stock
                    ) > 0

                      ? `${product.stock} available`

                      : "Out of stock"}

                  </span>


                  {/* ACTIONS */}

                  <div className="admin-product-actions">

                    <button
                      type="button"
                      className="admin-product-edit"
                      onClick={() =>
                        handleEdit(
                          product
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="admin-product-delete"
                      onClick={() =>
                        handleDeleteClick(
                          product
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="admin-product-modal-overlay">

          <div className="admin-product-modal">


            <div className="admin-product-modal-header">

              <div>

                <span>
                  {editingProduct
                    ? "UPDATE INVENTORY"
                    : "NEW INVENTORY"}
                </span>

                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>


              <button
                type="button"
                className="admin-product-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form
              className="admin-product-form"
              onSubmit={
                handleSubmit
              }
            >


              {/* NAME */}

              <div className="admin-product-form-group">

                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Berry Lip Mask"
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="admin-product-form-grid">

                <div className="admin-product-form-group">

                  <label>
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="Cleansers">
                      Cleansers
                    </option>

                    <option value="Toners">
                      Toners
                    </option>

                    <option value="Serums">
                      Serums
                    </option>

                    <option value="Moisturizers">
                      Moisturizers
                    </option>

                    <option value="Sunscreens">
                      Sunscreens
                    </option>

                    <option value="Face Masks">
                      Face Masks
                    </option>

                    <option value="Eye Care">
                      Eye Care
                    </option>

                    <option value="Lip Care">
                      Lip Care
                    </option>

                  </select>

                </div>


                {/* STOCK */}

                <div className="admin-product-form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={
                      formData.stock
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0"
                  />

                </div>

              </div>


              {/* PRICE */}

              <div className="admin-product-form-grid">

                <div className="admin-product-form-group">

                  <label>
                    Selling Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="499"
                    required
                  />

                </div>


                <div className="admin-product-form-group">

                  <label>
                    Original Price *
                  </label>

                  <input
                    type="number"
                    name="originalPrice"
                    min="0"
                    value={
                      formData.originalPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="699"
                    required
                  />

                </div>

              </div>


              {/* IMAGE */}

              <div className="admin-product-form-group">

                <label>
                  Image Path *
                </label>

                <input
                  type="text"
                  name="image"
                  value={
                    formData.image
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="/images/product.jpg"
                  required
                />

                <small>
                  Example: /images/berry-lip-mask.jpg
                </small>

              </div>


              {/* DESCRIPTION */}

              <div className="admin-product-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Write product description..."
                />

              </div>


              {/* RATING / REVIEWS */}

              <div className="admin-product-form-grid">

                <div className="admin-product-form-group">

                  <label>
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={
                      formData.rating
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="4.5"
                  />

                </div>


                <div className="admin-product-form-group">

                  <label>
                    Reviews
                  </label>

                  <input
                    type="number"
                    name="reviews"
                    min="0"
                    value={
                      formData.reviews
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="120"
                  />

                </div>

              </div>


              {/* BUTTONS */}

              <div className="admin-product-form-actions">

                <button
                  type="button"
                  className="admin-product-form-cancel"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-product-form-save"
                  disabled={saving}
                >

                  {saving

                    ? "Saving..."

                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          DELETE CONFIRMATION POPUP
      ================================================= */}

      {deleteProduct && (

        <div className="admin-delete-overlay">

          <div className="admin-delete-modal">

            <div className="admin-delete-icon">
              !
            </div>


            <h2>
              Delete Product?
            </h2>


            <p>

              Are you sure you want to delete{" "}

              <strong>
                {deleteProduct.name}
              </strong>

              ? This action cannot be undone.

            </p>


            <div className="admin-delete-actions">

              <button
                type="button"
                className="admin-delete-cancel"
                onClick={() =>
                  setDeleteProduct(
                    null
                  )
                }
                disabled={deleting}
              >
                Cancel
              </button>


              <button
                type="button"
                className="admin-delete-confirm"
                onClick={
                  confirmDelete
                }
                disabled={deleting}
              >

                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}


export default AdminProducts;