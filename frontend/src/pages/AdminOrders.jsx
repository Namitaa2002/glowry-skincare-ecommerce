import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ShoppingBag,
  Eye,
  ArrowLeft,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";


// =========================================================
// API CONFIG
// =========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "";

const ADMIN_ORDERS_API =
  `${API_BASE_URL}/api/admin/orders`;


// =========================================================
// ADMIN ORDERS
// =========================================================

function AdminOrders() {

  const navigate = useNavigate();


  // =========================================================
  // STATES
  // =========================================================

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);


  // =========================================================
  // FETCH ORDERS
  // =========================================================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);
        setError("");


        const token =
          localStorage.getItem(
            "glowryAdminToken"
          );


        // ===============================================
        // CHECK ADMIN TOKEN
        // ===============================================

        if (!token) {

          navigate(
            "/admin/login",
            {
              replace: true,
            }
          );

          return;

        }


        // ===============================================
        // GET ORDERS
        // ===============================================

        const response =
          await axios.get(
            ADMIN_ORDERS_API,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        // ===============================================
        // RESPONSE DATA
        // ===============================================

        const data =
          response.data;


        if (Array.isArray(data)) {

          setOrders(data);

        } else if (
          Array.isArray(data?.orders)
        ) {

          setOrders(
            data.orders
          );

        } else {

          setOrders([]);

        }


      } catch (error) {

        console.error(
          "Admin Orders Error:",
          error
        );


        // ===============================================
        // AUTH ERROR
        // ===============================================

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
            "/admin/login",
            {
              replace: true,
            }
          );

          return;

        }


        // ===============================================
        // OTHER ERROR
        // ===============================================

        setError(

          error.response?.data?.message ||

          "Unable to load orders."

        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrders();

  }, [navigate]);


  // =========================================================
  // STATUS ICON
  // =========================================================

  const getStatusIcon = (status) => {

    switch (status) {

      case "Delivered":

        return (
          <CheckCircle2 size={15} />
        );


      case "Shipped":

        return (
          <Truck size={15} />
        );


      case "Confirmed":

        return (
          <PackageCheck size={15} />
        );


      case "Cancelled":

        return (
          <XCircle size={15} />
        );


      default:

        return (
          <Clock3 size={15} />
        );

    }

  };


  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Delivered":
        return "admin-status-delivered";

      case "Shipped":
        return "admin-status-shipped";

      case "Confirmed":
        return "admin-status-confirmed";

      case "Cancelled":
        return "admin-status-cancelled";

      default:
        return "admin-status-processing";

    }

  };


  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleStatusChange =
    async (
      orderId,
      newStatus
    ) => {

      try {

        setUpdatingOrderId(
          orderId
        );


        const token =
          localStorage.getItem(
            "glowryAdminToken"
          );


        // ===============================================
        // CHECK TOKEN
        // ===============================================

        if (!token) {

          navigate(
            "/admin/login",
            {
              replace: true,
            }
          );

          return;

        }


        // ===============================================
        // UPDATE STATUS
        // ===============================================

        const response =
          await axios.put(

            `${ADMIN_ORDERS_API}/${orderId}/status`,

            {
              status:
                newStatus,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        const updatedOrder =
          response.data?.order;


        if (!updatedOrder) {

          throw new Error(
            "Updated order was not returned by server."
          );

        }


        // ===============================================
        // UPDATE TABLE
        // ===============================================

        setOrders(
          (previousOrders) =>

            previousOrders.map(
              (order) =>

                order._id === orderId
                  ? updatedOrder
                  : order
            )
        );


        // ===============================================
        // UPDATE MODAL
        // ===============================================

        if (
          selectedOrder?._id === orderId
        ) {

          setSelectedOrder(
            updatedOrder
          );

        }


      } catch (error) {

        console.error(
          "Update Order Status Error:",
          error
        );


        // ===============================================
        // AUTH ERROR
        // ===============================================

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
            "/admin/login",
            {
              replace: true,
            }
          );

          return;

        }


        alert(

          error.response?.data?.message ||

          "Unable to update order status."

        );

      } finally {

        setUpdatingOrderId(
          null
        );

      }

    };


  // =========================================================
  // VIEW ORDER
  // =========================================================

  const handleViewOrder =
    async (
      orderId
    ) => {

      try {

        const token =
          localStorage.getItem(
            "glowryAdminToken"
          );


        // ===============================================
        // CHECK TOKEN
        // ===============================================

        if (!token) {

          navigate(
            "/admin/login",
            {
              replace: true,
            }
          );

          return;

        }


        // ===============================================
        // GET ORDER DETAILS
        // ===============================================

        const response =
          await axios.get(

            `${ADMIN_ORDERS_API}/${orderId}`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        const order =
          response.data?.order ||
          response.data;


        setSelectedOrder(
          order
        );


      } catch (error) {

        console.error(
          "View Order Error:",
          error
        );


        // ===============================================
        // AUTH ERROR
        // ===============================================

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
            "/admin/login",
            {
              replace: true,
            }
          );

          return;

        }


        alert(

          error.response?.data?.message ||

          "Unable to load order details."

        );

      }

    };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {

      return "N/A";

    }


    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <main className="admin-orders-page">

        <div className="admin-orders-loading">

          <div className="admin-loading-spinner">
          </div>

          <p>
            Loading orders...
          </p>

        </div>

      </main>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <main className="admin-orders-page">

        <div className="admin-orders-error">

          <ShoppingBag size={40} />

          <h2>
            Unable to Load Orders
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
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


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <main className="admin-orders-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-orders-header">

        <div>

          <p className="admin-orders-eyebrow">
            GLOWRY ADMINISTRATION
          </p>

          <h1>
            Orders
          </h1>

          <p>
            View and manage customer orders
            from your GLOWRY store.
          </p>

        </div>


        <button
          type="button"
          className="admin-orders-back"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >

          <ArrowLeft size={16} />

          Dashboard

        </button>

      </header>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="admin-orders-summary">

        <div>

          <span>
            TOTAL ORDERS
          </span>

          <strong>
            {orders.length}
          </strong>

        </div>


        <div>

          <span>
            PENDING
          </span>

          <strong>

            {
              orders.filter(
                (order) =>
                  order.status ===
                    "Processing" ||
                  order.status ===
                    "Confirmed"
              ).length
            }

          </strong>

        </div>


        <div>

          <span>
            DELIVERED
          </span>

          <strong>

            {
              orders.filter(
                (order) =>
                  order.status ===
                  "Delivered"
              ).length
            }

          </strong>

        </div>


        <div>

          <span>
            CANCELLED
          </span>

          <strong>

            {
              orders.filter(
                (order) =>
                  order.status ===
                  "Cancelled"
              ).length
            }

          </strong>

        </div>

      </section>


      {/* =====================================================
          ORDERS CARD
      ===================================================== */}

      <section className="admin-orders-card">

        <div className="admin-orders-card-header">

          <div>

            <span>
              STORE ACTIVITY
            </span>

            <h2>
              All Orders
            </h2>

          </div>

        </div>


        {/* ===================================================
            EMPTY
        =================================================== */}

        {orders.length === 0 ? (

          <div className="admin-orders-empty">

            <div className="admin-orders-empty-icon">

              <ShoppingBag size={28} />

            </div>

            <h3>
              No Orders Yet
            </h3>

            <p>
              Customer orders will appear
              here once they place an order.
            </p>

          </div>

        ) : (

          <div className="admin-orders-table">


            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="admin-orders-table-header">

              <span>
                Order
              </span>

              <span>
                Customer
              </span>

              <span>
                Date
              </span>

              <span>
                Amount
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>


            {/* =================================================
                ORDERS
            ================================================= */}

            {orders.map(
              (order) => (

                <div
                  className="admin-orders-row"
                  key={
                    order._id
                  }
                >


                  {/* ORDER */}

                  <div className="admin-order-id">

                    <strong>
                      #{order.orderId}
                    </strong>

                    <span>
                      {order.items?.length || 0}
                      {" "}
                      item(s)
                    </span>

                  </div>


                  {/* CUSTOMER */}

                  <div className="admin-order-customer">

                    <strong>
                      {
                        order.customer
                          ?.fullName ||
                        order.customer
                          ?.name ||
                        "Customer"
                      }
                    </strong>

                    <span>
                      {
                        order.customer
                          ?.email ||
                        "No email"
                      }
                    </span>

                  </div>


                  {/* DATE */}

                  <span className="admin-order-date">

                    {formatDate(
                      order.createdAt
                    )}

                  </span>


                  {/* AMOUNT */}

                  <strong className="admin-order-amount">

                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>


                  {/* STATUS */}

                  <div className="admin-order-status-wrapper">

                    <span
                      className={
                        `admin-order-status ${
                          getStatusClass(
                            order.status
                          )
                        }`
                      }
                    >

                      {getStatusIcon(
                        order.status
                      )}

                      {order.status ||
                        "Processing"}

                    </span>


                    <select
                      value={
                        order.status ||
                        "Processing"
                      }
                      disabled={
                        updatingOrderId ===
                        order._id
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                      className="admin-order-status-select"
                    >

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>


                  {/* ACTION */}

                  <button
                    type="button"
                    className="admin-order-view-button"
                    onClick={() =>
                      handleViewOrder(
                        order._id
                      )
                    }
                  >

                    <Eye size={15} />

                    View

                  </button>


                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (

        <div
          className="admin-order-modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="admin-order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="admin-order-modal-header">

              <div>

                <span>
                  ORDER DETAILS
                </span>

                <h2>
                  #{selectedOrder.orderId}
                </h2>

              </div>


              <button
                type="button"
                className="admin-order-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>


            {/* =================================================
                CUSTOMER
            ================================================= */}

            <div className="admin-order-detail-section">

              <span>
                CUSTOMER
              </span>

              <h3>
                {
                  selectedOrder.customer
                    ?.fullName ||
                  selectedOrder.customer
                    ?.name ||
                  "Customer"
                }
              </h3>

              <p>
                {
                  selectedOrder.customer
                    ?.email ||
                  "No email"
                }
              </p>

              <p>
                {
                  selectedOrder.customer
                    ?.phone ||
                  "No phone"
                }
              </p>

            </div>


            {/* =================================================
                ADDRESS
            ================================================= */}

            <div className="admin-order-detail-section">

              <span>
                DELIVERY ADDRESS
              </span>

              <p>
                {
                  selectedOrder.customer
                    ?.address ||
                  "Address not available"
                }
              </p>

              <p>

                {
                  selectedOrder.customer
                    ?.city ||
                  ""
                }

                {
                  selectedOrder.customer
                    ?.city &&
                  selectedOrder.customer
                    ?.state
                    ? ", "
                    : ""
                }

                {
                  selectedOrder.customer
                    ?.state ||
                  ""
                }

                {
                  selectedOrder.customer
                    ?.pincode
                    ? " - "
                    : ""
                }

                {
                  selectedOrder.customer
                    ?.pincode ||
                  ""
                }

              </p>

            </div>


            {/* =================================================
                ITEMS
            ================================================= */}

            <div className="admin-order-detail-section">

              <span>
                ORDER ITEMS
              </span>


              <div className="admin-order-items">

                {selectedOrder.items?.length > 0 ? (

                  selectedOrder.items.map(
                    (item, index) => {

                      const itemPrice =
                        Number(
                          item.price || 0
                        );

                      const quantity =
                        Number(
                          item.quantity || 0
                        );

                      const itemTotal =
                        itemPrice *
                        quantity;


                      return (

                        <div
                          className="admin-order-item"
                          key={
                            item._id ||
                            item.productId ||
                            index
                          }
                        >

                          <div>

                            <strong>
                              {item.name}
                            </strong>

                            <span>

                              ₹
                              {itemPrice.toLocaleString(
                                "en-IN"
                              )}

                              {" × "}

                              {quantity}

                            </span>

                          </div>


                          <strong>

                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                        </div>

                      );

                    }

                  )

                ) : (

                  <p>
                    No items found.
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                PAYMENT
            ================================================= */}

            <div className="admin-order-payment">

              <div>

                <span>
                  Payment
                </span>

                <strong>

                  {
                    selectedOrder.paymentMethod ===
                    "online"

                      ? "Online Payment"

                      : "Cash on Delivery"
                  }

                </strong>

              </div>


              <div>

                <span>
                  Subtotal
                </span>

                <strong>

                  ₹
                  {Number(
                    selectedOrder.subtotal ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>


              <div>

                <span>
                  Discount
                </span>

                <strong>

                  - ₹
                  {Number(
                    selectedOrder.discount ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>


              <div className="admin-order-total">

                <span>
                  Total
                </span>

                <strong>

                  ₹
                  {Number(
                    selectedOrder.total ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div className="admin-order-modal-status">

              <span>
                ORDER STATUS
              </span>

              <select
                value={
                  selectedOrder.status ||
                  "Processing"
                }
                disabled={
                  updatingOrderId ===
                  selectedOrder._id
                }
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder._id,
                    e.target.value
                  )
                }
              >

                <option value="Processing">
                  Processing
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}


export default AdminOrders;