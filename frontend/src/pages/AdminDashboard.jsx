
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../config/api";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  IndianRupee,
  LogOut,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";


// =========================================
// GET ADMIN DATA
// =========================================

const getInitialAdmin = () => {

  const adminToken =
    localStorage.getItem("glowryAdminToken");

  const adminUser =
    localStorage.getItem("glowryAdminUser");

  if (!adminToken || !adminUser) {
    return null;
  }

  try {

    const parsedAdmin =
      JSON.parse(adminUser);

    if (parsedAdmin.role !== "admin") {

      localStorage.removeItem(
        "glowryAdminToken"
      );

      localStorage.removeItem(
        "glowryAdminUser"
      );

      return null;
    }

    return parsedAdmin;

  } catch {

    localStorage.removeItem(
      "glowryAdminToken"
    );

    localStorage.removeItem(
      "glowryAdminUser"
    );

    return null;
  }
};


// =========================================
// ADMIN DASHBOARD
// =========================================

function AdminDashboard() {

  const navigate = useNavigate();

  // =========================================
  // ADMIN DATA
  // =========================================

  const [admin] =
    useState(getInitialAdmin);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);


  // =========================================
  // ADMIN AUTH CHECK
  // =========================================

  useEffect(() => {

    const adminToken =
      localStorage.getItem(
        "glowryAdminToken"
      );

    const adminUser =
      localStorage.getItem(
        "glowryAdminUser"
      );

    if (!adminToken || !adminUser || !admin) {

      navigate("/admin/login");

      return;
    }

    if (admin.role !== "admin") {

      localStorage.removeItem(
        "glowryAdminToken"
      );

      localStorage.removeItem(
        "glowryAdminUser"
      );

      navigate("/admin/login");
    }

  }, [admin, navigate]);


  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const token =
          localStorage.getItem(
            "glowryAdminToken"
          );

        if (!token) {
          return;
        }

        const response =
          await axios.get(
            `${API_BASE_URL}/admin/dashboard`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          response.data;

        setStats({

          totalUsers:
            data.totalUsers || 0,

          totalProducts:
            data.totalProducts || 0,

          totalOrders:
            data.totalOrders || 0,

          totalRevenue:
            data.totalRevenue || 0,

        });

        setRecentOrders(
          data.recentOrders || []
        );

      } catch (error) {

        console.error(
          "Admin Dashboard Error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchDashboardData();

  }, []);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "glowryAdminToken"
    );

    localStorage.removeItem(
      "glowryAdminUser"
    );

    setShowLogoutModal(false);

    navigate("/admin/login");

  };


  // =========================================
  // STATUS ICON
  // =========================================

  const getStatusIcon = (status) => {

    switch (status) {

      case "Delivered":
        return <CheckCircle2 size={16} />;

      case "Shipped":
        return <Truck size={16} />;

      case "Cancelled":
        return <XCircle size={16} />;

      case "Confirmed":
        return <CheckCircle2 size={16} />;

      default:
        return <Clock3 size={16} />;

    }

  };


  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Delivered":
        return "status-delivered";

      case "Shipped":
        return "status-shipped";

      case "Cancelled":
        return "status-cancelled";

      case "Confirmed":
        return "status-confirmed";

      default:
        return "status-processing";

    }

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="admin-dashboard-page">

        <div className="admin-loading">

          <div className="admin-loading-spinner"></div>

          <p>
            Loading GLOWRY Admin...
          </p>

        </div>

      </main>

    );

  }


  // =========================================
  // DASHBOARD
  // =========================================

  return (

    <main className="admin-dashboard-page">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="admin-sidebar">


        <div className="admin-brand">

          <div className="admin-brand-logo">
            G
          </div>

          <div>

            <h2>
              GLOWRY
            </h2>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-navigation">

          <div className="admin-nav-section">

            <p>
              OVERVIEW
            </p>


            <button
              className="admin-nav-item active"
            >

              <LayoutDashboard size={18} />

              <span>
                Dashboard
              </span>

            </button>


            <button
              className="admin-nav-item"
              onClick={() =>
                navigate("/admin/products")
              }
            >

              <Package size={18} />

              <span>
                Products
              </span>

            </button>


            <button
              className="admin-nav-item"
              onClick={() =>
                navigate("/admin/orders")
              }
            >

              <ShoppingBag size={18} />

              <span>
                Orders
              </span>

            </button>


            <button
              className="admin-nav-item"
              onClick={() =>
                navigate("/admin/users")
              }
            >

              <Users size={18} />

              <span>
                Customers
              </span>

            </button>

          </div>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-user">

            <div className="admin-avatar">
              {admin?.name?.charAt(0) || "A"}
            </div>

            <div>

              <strong>
                {admin?.name || "Admin"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>


          <button
            className="admin-logout-button"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <section className="admin-main-content">


        {/* TOP HEADER */}

        <header className="admin-topbar">

          <div>

            <p>
              GLOWRY ADMINISTRATION
            </p>

            <h1>
              Dashboard
            </h1>

          </div>


          <div className="admin-topbar-user">

            <div className="admin-topbar-avatar">
              {admin?.name?.charAt(0) || "A"}
            </div>

            <div>

              <strong>
                {admin?.name || "Admin"}
              </strong>

              <span>
                Admin
              </span>

            </div>

          </div>

        </header>


        {/* WELCOME */}

        <section className="admin-welcome-card">

          <div>

            <span>
              WELCOME BACK
            </span>

            <h2>
              Hello, {admin?.name || "Admin"} 👋
            </h2>

            <p>
              Here's what's happening with your
              GLOWRY store today.
            </p>

          </div>


          <div className="admin-welcome-decoration">
            ✦
          </div>

        </section>


        {/* =====================================
            STAT CARDS
        ===================================== */}

        <section className="admin-stats-grid">


          {/* USERS */}

          <article className="admin-stat-card">

            <div className="admin-stat-icon users">
              <Users size={21} />
            </div>

            <div className="admin-stat-content">

              <span>
                Total Customers
              </span>

              <h2>
                {stats.totalUsers}
              </h2>

              <small>
                Registered users
              </small>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={18}
            />

          </article>


          {/* PRODUCTS */}

          <article className="admin-stat-card">

            <div className="admin-stat-icon products">
              <Package size={21} />
            </div>

            <div className="admin-stat-content">

              <span>
                Total Products
              </span>

              <h2>
                {stats.totalProducts}
              </h2>

              <small>
                Products in store
              </small>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={18}
            />

          </article>


          {/* ORDERS */}

          <article className="admin-stat-card">

            <div className="admin-stat-icon orders">
              <ShoppingBag size={21} />
            </div>

            <div className="admin-stat-content">

              <span>
                Total Orders
              </span>

              <h2>
                {stats.totalOrders}
              </h2>

              <small>
                Orders received
              </small>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={18}
            />

          </article>


          {/* REVENUE */}

          <article className="admin-stat-card">

            <div className="admin-stat-icon revenue">
              <IndianRupee size={21} />
            </div>

            <div className="admin-stat-content">

              <span>
                Total Revenue
              </span>

              <h2>
                ₹{Number(
                  stats.totalRevenue
                ).toLocaleString("en-IN")}
              </h2>

              <small>
                Overall sales
              </small>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={18}
            />

          </article>

        </section>


        {/* =====================================
            RECENT ORDERS
        ===================================== */}

        <section className="admin-orders-card">


          <div className="admin-section-header">

            <div>

              <span>
                STORE ACTIVITY
              </span>

              <h2>
                Recent Orders
              </h2>

            </div>


            <button
              onClick={() =>
                navigate("/admin/orders")
              }
              className="admin-view-all"
            >
              View All →
            </button>

          </div>


          {recentOrders.length === 0 ? (

            <div className="admin-empty-orders">

              <ShoppingBag size={34} />

              <h3>
                No Orders Yet
              </h3>

              <p>
                New customer orders will appear
                here.
              </p>

            </div>

          ) : (

            <div className="admin-orders-table">

              <div className="admin-table-header">

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

              </div>


              {recentOrders.map(
                (order) => (

                  <div
                    className="admin-table-row"
                    key={order._id}
                  >

                    <strong>
                      #{order.orderId}
                    </strong>

                    <span>
                      {order.customer?.fullName ||
                        order.customer?.name ||
                        "Customer"}
                    </span>

                    <span>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </span>

                    <strong>
                      ₹{Number(
                        order.total || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                    <span
                      className={`admin-order-status ${getStatusClass(
                        order.status
                      )}`}
                    >

                      {getStatusIcon(
                        order.status
                      )}

                      {order.status ||
                        "Processing"}

                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <section className="admin-quick-section">

          <div className="admin-section-header">

            <div>

              <span>
                MANAGEMENT
              </span>

              <h2>
                Quick Actions
              </h2>

            </div>

          </div>


          <div className="admin-quick-grid">


            <button
              onClick={() =>
                navigate("/admin/products")
              }
              className="admin-quick-card"
            >

              <Package size={22} />

              <div>

                <strong>
                  Manage Products
                </strong>

                <span>
                  Add, edit or remove products
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>


            <button
              onClick={() =>
                navigate("/admin/orders")
              }
              className="admin-quick-card"
            >

              <ShoppingBag size={22} />

              <div>

                <strong>
                  Manage Orders
                </strong>

                <span>
                  View and update orders
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>


            <button
              onClick={() =>
                navigate("/admin/users")
              }
              className="admin-quick-card"
            >

              <Users size={22} />

              <div>

                <strong>
                  Customers
                </strong>

                <span>
                  View registered customers
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>

          </div>

        </section>


        {/* =====================================
            LOGOUT CONFIRMATION MODAL
        ===================================== */}

        {showLogoutModal && (

          <div
            className="admin-logout-overlay"
            onClick={() =>
              setShowLogoutModal(false)
            }
          >

            <div
              className="admin-logout-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="admin-logout-icon">

                <LogOut size={24} />

              </div>


              <h2>
                Are you sure?
              </h2>


              <p>
                Do you really want to logout
                from the GLOWRY Admin Panel?
              </p>


              <div className="admin-logout-actions">

                <button
                  type="button"
                  className="admin-cancel-logout"
                  onClick={() =>
                    setShowLogoutModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="admin-confirm-logout"
                  onClick={handleLogout}
                >

                  <LogOut size={16} />

                  Yes, Logout

                </button>

              </div>

            </div>

          </div>

        )}


      </section>

    </main>

  );

}


export default AdminDashboard;

