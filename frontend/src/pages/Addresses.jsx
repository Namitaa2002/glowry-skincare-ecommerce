
import { useEffect, useState } from "react";
import axios from "axios";

function Addresses() {
  // =========================================
  // STATES
  // =========================================

  const [addresses, setAddresses] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // =========================================
  // GET LOGGED IN USER
  // =========================================

  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem(
      "glowryLoggedInUser"
    );

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "User Parse Error:",
        error
      );

      return null;
    }
  };

  // =========================================
  // LOAD ADDRESSES
  // =========================================

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      if (!user || !user.id) {
        setError(
          "Please login to manage your addresses."
        );

        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/addresses/${user.id}`
      );

      setAddresses(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Addresses Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });

    setEditId(null);
    setShowForm(false);
    setError("");
  };

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const handleAddAddress = () => {
    setEditId(null);

    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: addresses.length === 0,
    });

    setError("");
    setShowForm(true);
  };

  // =========================================
  // SAVE ADDRESS
  // =========================================

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    setError("");

    const user = getLoggedInUser();

    if (!user || !user.id) {
      setError("Please login first.");
      return;
    }

    try {
      setSaving(true);

      // ---------------------------------------
      // EDIT ADDRESS
      // ---------------------------------------

      if (editId) {
        const response = await axios.put(
          `http://localhost:5000/api/addresses/${editId}`,
          formData
        );

        const updatedAddress =
          response.data.address;

        setAddresses((previous) =>
          previous.map((item) =>
            item._id === editId
              ? updatedAddress
              : item
          )
        );

        // If edited address becomes default,
        // remove default from other addresses.
        if (updatedAddress?.isDefault) {
          setAddresses((previous) =>
            previous.map((item) => ({
              ...item,

              isDefault:
                item._id === editId,
            }))
          );
        }
      }

      // ---------------------------------------
      // ADD ADDRESS
      // ---------------------------------------

      else {
        const response = await axios.post(
          "http://localhost:5000/api/addresses",
          {
            userId: user.id,
            ...formData,
          }
        );

        const newAddress =
          response.data.address;

        setAddresses((previous) => {
          let updated = [
            ...previous,
            newAddress,
          ];

          // If new address is default,
          // make all other addresses non-default.
          if (newAddress?.isDefault) {
            updated = updated.map(
              (item) => ({
                ...item,

                isDefault:
                  item._id ===
                  newAddress._id,
              })
            );
          }

          return updated;
        });
      }

      resetForm();
    } catch (error) {
      console.error(
        "Save Address Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE ADDRESS
  // =========================================

  const deleteAddress = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `http://localhost:5000/api/addresses/${id}`
      );

      await loadAddresses();
    } catch (error) {
      console.error(
        "Delete Address Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete address."
      );
    }
  };

  // =========================================
  // EDIT ADDRESS
  // =========================================

  const editAddress = (item) => {
    setFormData({
      name: item.name || "",
      phone: item.phone || "",
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || "",
      isDefault: Boolean(item.isDefault),
    });

    setEditId(item._id);
    setShowForm(true);
    setError("");
  };

  // =========================================
  // MAKE DEFAULT
  // =========================================

  const makeDefault = async (id) => {
    try {
      setError("");

      const response = await axios.put(
        `http://localhost:5000/api/addresses/default/${id}`
      );

      const defaultAddress =
        response.data.address;

      setAddresses((previous) =>
        previous.map((item) => ({
          ...item,

          isDefault:
            item._id ===
            defaultAddress._id,
        }))
      );
    } catch (error) {
      console.error(
        "Make Default Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update default address."
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="address-page">
        <section className="address-container">
          <p>
            Loading addresses...
          </p>
        </section>
      </main>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <main className="address-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="address-header">

        <p className="section-small-title">
          MY GLOWRY
        </p>

        <h1>
          My Addresses
        </h1>

        <p>
          Manage your delivery addresses.
        </p>

      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

      <section className="address-container">

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

        {/* ADD BUTTON */}

        {!showForm && (
          <button
            type="button"
            className="add-address-button"
            onClick={handleAddAddress}
          >
            + Add New Address
          </button>
        )}

        {/* ===================================
            FORM
        =================================== */}

        {showForm && (
          <form
            className="address-form"
            onSubmit={handleSaveAddress}
          >

            <h2>
              {editId
                ? "Edit Address"
                : "Add New Address"}
            </h2>

            {/* NAME */}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* PHONE */}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* ADDRESS */}

            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            {/* CITY */}

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />

            {/* STATE */}

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />

            {/* PINCODE */}

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />

            {/* =================================
                DEFAULT ADDRESS
            ================================= */}

            <label className="address-default-option">

              <input
                type="checkbox"
                name="isDefault"
                checked={
                  formData.isDefault
                }
                onChange={handleChange}
              />

              <span>
                Make this my default address
              </span>

            </label>

            {/* =================================
                BUTTONS
            ================================= */}

            <div className="address-actions">

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Address"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>
        )}

        {/* ===================================
            ADDRESS LIST
        =================================== */}

        <div className="address-list">

          {addresses.length === 0 ? (

            <div className="empty-address">

              <div>
                📍
              </div>

              <h3>
                No saved addresses
              </h3>

              <p>
                Add an address for faster checkout.
              </p>

            </div>

          ) : (

            addresses.map((item) => (

              <div
                className="address-card"
                key={item._id}
              >

                {/* DEFAULT BADGE */}

                {item.isDefault && (
                  <span className="default-address">
                    Default
                  </span>
                )}

                {/* NAME */}

                <h3>
                  {item.name}
                </h3>

                {/* PHONE */}

                <p>
                  📞 {item.phone}
                </p>

                {/* ADDRESS */}

                <p>

                  {item.address}

                  <br />

                  {item.city},{" "}
                  {item.state}

                  <br />

                  {item.pincode}

                </p>

                {/* ACTIONS */}

                <div className="address-actions">

                  <button
                    type="button"
                    onClick={() =>
                      editAddress(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteAddress(
                        item._id
                      )
                    }
                  >
                    Delete
                  </button>

                  {!item.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        makeDefault(
                          item._id
                        )
                      }
                    >
                      Make Default
                    </button>
                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
}

export default Addresses;

