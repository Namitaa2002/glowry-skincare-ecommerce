import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// =========================================================
// ADMIN USERS
// =========================================================

function AdminUsers() {

  const navigate = useNavigate();


  // =========================================================
  // STATES
  // =========================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);


  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          localStorage.getItem(
            "glowryAdminToken"
          );


        // =========================================
        // CHECK TOKEN
        // =========================================

        if (!token) {

          navigate("/admin/login");

          return;

        }


        // =========================================
        // API REQUEST
        // =========================================

        const response =
          await axios.get(

            "http://localhost:5000/api/admin/users",

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        console.log(
          "Admin Customers Response:",
          response.data
        );


        // =========================================
        // IMPORTANT
        // BACKEND RETURNS:
        //
        // {
        //   customers: [],
        //   totalCustomers: 0
        // }
        // =========================================

        if (
          Array.isArray(
            response.data?.customers
          )
        ) {

          setUsers(
            response.data.customers
          );

        } else {

          setUsers([]);

        }


      } catch (err) {

        console.error(
          "Admin Customers Error:",
          err
        );


        // =========================================
        // AUTH ERROR
        // =========================================

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
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

          err.response?.data?.message ||

          "Unable to load customers."

        );

      } finally {

        setLoading(false);

      }

    };


    fetchUsers();

  }, [navigate]);


  // =========================================================
  // SEARCH CUSTOMERS
  // =========================================================

  const filteredUsers =
    users.filter((user) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      if (!searchText) {

        return true;

      }


      return (

        user.name
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.email
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.phone
          ?.toLowerCase()
          .includes(searchText)

      );

    });


  // =========================================================
  // VIEW DETAILS
  // =========================================================

  const handleViewDetails =
    (user) => {

      setSelectedUser(user);

    };


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeUserModal =
    () => {

      setSelectedUser(null);

    };


  // =========================================================
  // ESCAPE KEY
  // =========================================================

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          setSelectedUser(null);

        }

      };


    if (selectedUser) {

      document.addEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "hidden";

    }


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "";

    };

  }, [selectedUser]);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <main className="admin-users-page">

        <div className="admin-users-loading">

          <div className="admin-users-spinner">
          </div>

          <p>
            Loading customers...
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

      <main className="admin-users-page">

        <div className="admin-users-error">

          <div className="admin-users-error-icon">
            !
          </div>


          <h2>
            Unable to Load Customers
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


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <main className="admin-users-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-users-header">

        <div>

          <p className="admin-users-eyebrow">
            GLOWRY ADMINISTRATION
          </p>


          <h1>
            Customers
          </h1>


          <p className="admin-users-subtitle">
            View and manage customers registered
            with your GLOWRY store.
          </p>

        </div>


        <button
          className="admin-users-dashboard-button"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          ← Dashboard
        </button>

      </header>



      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="admin-users-summary">

        <div className="admin-users-summary-content">

          <div className="admin-users-summary-icon">
            👥
          </div>


          <div>

            <span>
              TOTAL CUSTOMERS
            </span>


            <strong>
              {users.length}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-note">

          <span>
            Registered GLOWRY users
          </span>

        </div>

      </section>



      {/* =====================================================
          CUSTOMER CARD
      ===================================================== */}

      <section className="admin-users-card">


        {/* ===================================================
            CARD HEADER
        =================================================== */}

        <div className="admin-users-card-header">

          <div>

            <span>
              CUSTOMER DIRECTORY
            </span>


            <h2>
              All Customers
            </h2>

          </div>


          {/* SEARCH */}

          <div className="admin-users-search">

            <span>
              🔍
            </span>


            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>



        {/* ===================================================
            EMPTY
        =================================================== */}

        {filteredUsers.length === 0 ? (

          <div className="admin-users-empty">

            <div className="admin-users-empty-icon">
              👤
            </div>


            <h3>
              {search
                ? "No Customers Found"
                : "No Customers Yet"}
            </h3>


            <p>

              {search

                ? "Try searching with a different name, email or phone number."

                : "No customers have registered with GLOWRY yet."}

            </p>

          </div>

        ) : (


          /* =================================================
             TABLE
          ================================================= */

          <div className="admin-users-table">


            {/* TABLE HEADER */}

            <div className="admin-users-table-header">

              <span>
                Customer
              </span>


              <span>
                Email
              </span>


              <span>
                Phone
              </span>


              <span>
                Orders
              </span>


              <span>
                Joined
              </span>


              <span>
                Action
              </span>

            </div>



            {/* TABLE ROWS */}

            {filteredUsers.map(
              (user) => (

                <div
                  className="admin-users-row"
                  key={user._id}
                >


                  {/* CUSTOMER */}

                  <div className="admin-user-info">

                    <div className="admin-user-avatar">

                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}

                    </div>


                    <div className="admin-user-details">

                      <strong>
                        {user.name ||
                          "Unknown User"}
                      </strong>


                      <span>
                        Customer
                      </span>

                    </div>

                  </div>



                  {/* EMAIL */}

                  <span className="admin-user-email">

                    {user.email ||
                      "Not provided"}

                  </span>



                  {/* PHONE */}

                  <span className="admin-user-phone">

                    {user.phone
                      ? user.phone
                      : "Not provided"}

                  </span>



                  {/* ORDERS */}

                  <span className="admin-user-orders">

                    {user.totalOrders || 0}

                  </span>



                  {/* JOINED */}

                  <span className="admin-user-date">

                    {user.createdAt

                      ? new Date(
                          user.createdAt
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



                  {/* ACTION */}

                  <div className="admin-user-action">

                    <button
                      className="admin-user-view"
                      onClick={() =>
                        handleViewDetails(
                          user
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>



      {/* =====================================================
          CUSTOMER DETAILS MODAL
      ===================================================== */}

      {selectedUser && (

        <div
          className="admin-user-modal-overlay"
          onClick={closeUserModal}
        >

          <div
            className="admin-user-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="admin-user-modal-header">

              <div>

                <span>
                  CUSTOMER PROFILE
                </span>


                <h2>
                  Customer Details
                </h2>

              </div>


              <button
                className="admin-user-modal-close"
                onClick={closeUserModal}
                aria-label="Close"
              >
                ×
              </button>

            </div>



            {/* PROFILE */}

            <div className="admin-user-profile">

              <div className="admin-user-modal-avatar">

                {selectedUser.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}

              </div>


              <div>

                <h3>
                  {selectedUser.name ||
                    "Unknown User"}
                </h3>


                <p>
                  {selectedUser.email ||
                    "No email available"}
                </p>

              </div>

            </div>



            {/* DETAILS */}

            <div className="admin-user-details-grid">


              <div className="admin-user-detail-item">

                <span>
                  FULL NAME
                </span>


                <strong>
                  {selectedUser.name ||
                    "N/A"}
                </strong>

              </div>



              <div className="admin-user-detail-item">

                <span>
                  EMAIL ADDRESS
                </span>


                <strong>
                  {selectedUser.email ||
                    "N/A"}
                </strong>

              </div>



              <div className="admin-user-detail-item">

                <span>
                  PHONE NUMBER
                </span>


                <strong>
                  {selectedUser.phone ||
                    "Not provided"}
                </strong>

              </div>



              <div className="admin-user-detail-item">

                <span>
                  TOTAL ORDERS
                </span>


                <strong>
                  {selectedUser.totalOrders || 0}
                </strong>

              </div>



              <div className="admin-user-detail-item">

                <span>
                  TOTAL SPENT
                </span>


                <strong>
                  ₹{Number(
                    selectedUser.totalSpent || 0
                  ).toLocaleString("en-IN")}
                </strong>

              </div>



              <div className="admin-user-detail-item">

                <span>
                  JOINED ON
                </span>


                <strong>

                  {selectedUser.createdAt

                    ? new Date(
                        selectedUser.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )

                    : "N/A"}

                </strong>

              </div>



              <div className="admin-user-detail-item admin-user-detail-full">

                <span>
                  USER ID
                </span>


                <strong className="admin-user-id">

                  {selectedUser._id ||
                    "N/A"}

                </strong>

              </div>

            </div>



            {/* FOOTER */}

            <div className="admin-user-modal-footer">

              <button
                onClick={closeUserModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}


export default AdminUsers;