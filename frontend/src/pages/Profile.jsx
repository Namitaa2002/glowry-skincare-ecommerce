import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import apiClient from "../services/apiClient";


function Profile() {

  const navigate = useNavigate();


  // =========================================
  // USER
  // =========================================

  const [user, setUser] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    createdAt: "",
  });


  // =========================================
  // STATES
  // =========================================

  const [editMode, setEditMode] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // =========================================
  // FETCH PROFILE
  // =========================================

  const fetchProfile = useCallback(
    async (userId) => {

      try {

        const token =
          localStorage.getItem(
            "glowryToken"
          );


        // =====================================
        // CHECK TOKEN
        // =====================================

        if (!token) {

          navigate("/login");

          return;

        }


        // =====================================
        // GET PROFILE
        // =====================================

        const response =
          await apiClient.get(
            `/auth/profile/${userId}`
          );


        const profileUser =
          response.data?.user;


        if (!profileUser) {

          throw new Error(
            "User profile was not received."
          );

        }


        // =====================================
        // UPDATE PROFILE STATE
        // =====================================

        setUser({

          id:
            profileUser.id ||
            profileUser._id ||
            userId,

          fullName:
            profileUser.fullName ||
            profileUser.name ||
            "",

          email:
            profileUser.email ||
            "",

          phone:
            profileUser.phone ||
            "",

          createdAt:
            profileUser.createdAt ||
            "",

        });


      } catch (error) {

        console.error(
          "Profile Fetch Error:",
          error
        );


        // =====================================
        // UNAUTHORIZED
        // =====================================

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
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


        // =====================================
        // USER NOT FOUND
        // =====================================

        if (
          error.response?.status === 404
        ) {

          alert(
            "User account not found."
          );

          navigate("/login");

          return;

        }


        // =====================================
        // OTHER ERROR
        // =====================================

        alert(
          error.response?.data?.message ||
          "Failed to load profile."
        );


      } finally {

        setLoading(false);

      }

    },

    [navigate]
  );


  // =========================================
  // LOAD PROFILE
  // =========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "glowryLoggedInUser"
      );


    const token =
      localStorage.getItem(
        "glowryToken"
      );


    // =======================================
    // CHECK LOGIN
    // =======================================

    if (!savedUser || !token) {

      navigate("/login");

      return;

    }


    try {

      const loggedInUser =
        JSON.parse(savedUser);


      const userId =
        loggedInUser.id ||
        loggedInUser._id;


      if (!userId) {

        console.error(
          "User ID missing from localStorage."
        );

        navigate("/login");

        return;

      }


      // =====================================
      // FETCH REAL PROFILE FROM DATABASE
      // =====================================

      fetchProfile(userId);


    } catch (error) {

      console.error(
        "Error reading logged-in user:",
        error
      );


      localStorage.removeItem(
        "glowryLoggedInUser"
      );

      localStorage.removeItem(
        "glowryToken"
      );


      navigate("/login");

    }

  }, [
    navigate,
    fetchProfile,
  ]);


  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setUser((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = async () => {

    try {

      setSaving(true);


      const token =
        localStorage.getItem(
          "glowryToken"
        );


      // =====================================
      // CHECK TOKEN
      // =====================================

      if (!token) {

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return;

      }


      // =====================================
      // VALIDATION
      // =====================================

      if (
        !user.fullName.trim() ||
        !user.email.trim()
      ) {

        alert(
          "Name and email are required."
        );

        return;

      }


      // =====================================
      // UPDATE PROFILE
      // =====================================

      const response =
        await apiClient.put(

          `/auth/profile/${user.id}`,

          {

            fullName:
              user.fullName.trim(),

            email:
              user.email.trim().toLowerCase(),

            phone:
              user.phone.trim(),

          }

        );


      const updatedUser =
        response.data?.user;


      if (!updatedUser) {

        throw new Error(
          "Updated user information was not received."
        );

      }


      // =====================================
      // UPDATED USER OBJECT
      // =====================================

      const loggedInUser = {

        id:
          updatedUser.id ||
          updatedUser._id,

        fullName:
          updatedUser.fullName ||
          updatedUser.name ||
          "",

        name:
          updatedUser.name ||
          updatedUser.fullName ||
          "",

        email:
          updatedUser.email ||
          "",

        phone:
          updatedUser.phone ||
          "",

        role:
          updatedUser.role ||
          "user",

        createdAt:
          updatedUser.createdAt ||
          "",

      };


      // =====================================
      // UPDATE LOCAL STORAGE
      // =====================================

      localStorage.setItem(

        "glowryLoggedInUser",

        JSON.stringify(
          loggedInUser
        )

      );


      // =====================================
      // UPDATE PROFILE STATE
      // =====================================

      setUser({

        id:
          loggedInUser.id,

        fullName:
          loggedInUser.fullName,

        email:
          loggedInUser.email,

        phone:
          loggedInUser.phone,

        createdAt:
          loggedInUser.createdAt,

      });


      // =====================================
      // NOTIFY NAVBAR
      // =====================================

      window.dispatchEvent(
        new Event(
          "glowryUserUpdated"
        )
      );


      setEditMode(false);


      alert(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "Profile Update Error:",
        error
      );


      // =====================================
      // AUTH ERROR
      // =====================================

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
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


      // =====================================
      // ERROR MESSAGE
      // =====================================

      alert(

        error.response?.data?.message ||

        "Failed to update profile."

      );


    } finally {

      setSaving(false);

    }

  };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if (!confirmLogout) {

      return;

    }


    localStorage.removeItem(
      "glowryLoggedInUser"
    );

    localStorage.removeItem(
      "glowryToken"
    );


    // =====================================
    // NOTIFY NAVBAR
    // =====================================

    window.dispatchEvent(
      new Event(
        "glowryUserUpdated"
      )
    );


    navigate("/login");

  };


  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handlePassword = () => {

    navigate(
      "/dashboard/change-password"
    );

  };


  // =========================================
  // MEMBER SINCE
  // =========================================

  const memberSince =

    user.createdAt

      ?

      new Date(
        user.createdAt
      ).getFullYear()

      :

      "2026";


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="profile-page">

        <section className="profile-container">

          <p>
            Loading profile...
          </p>

        </section>

      </main>

    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <main className="profile-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <section className="profile-header">

        <p className="section-small-title">
          MY GLOWRY
        </p>

        <h1>
          My Profile
        </h1>

        <p>
          Manage your account details and
          personal information.
        </p>

      </section>


      {/* =====================================
          PROFILE CONTAINER
      ====================================== */}

      <section className="profile-container">


        {/* ===================================
            PROFILE TOP
        ==================================== */}

        <div className="profile-top">

          <div className="profile-avatar-large">

            {
              user.fullName

                ?

                user.fullName
                  .charAt(0)
                  .toUpperCase()

                :

                "U"
            }

          </div>


          <div className="profile-user-info">

            <h2>

              {
                user.fullName ||
                "Glowry User"
              }

            </h2>


            <p>

              {
                user.email ||
                "Email not added"
              }

            </p>


            <span className="verified-user">

              ✓ Verified Account

            </span>

          </div>


          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {

              if (editMode) {

                handleSave();

              } else {

                setEditMode(true);

              }

            }}
            disabled={saving}
          >

            {
              saving

                ?

                "Saving..."

                :

                editMode

                  ?

                  "Save Profile"

                  :

                  "✏️ Edit Profile"
            }

          </button>

        </div>


        {/* ===================================
            PERSONAL INFORMATION
        ==================================== */}

        <div className="profile-section">

          <h3>
            Personal Information
          </h3>


          <div className="profile-grid">


            {/* FULL NAME */}

            <div className="profile-info-box">

              <div className="profile-info-icon">
                👤
              </div>


              <div>

                <span>
                  Full Name
                </span>


                {
                  editMode

                    ?

                    <input
                      type="text"
                      name="fullName"
                      value={
                        user.fullName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your full name"
                    />

                    :

                    <strong>

                      {
                        user.fullName ||
                        "Not Added"
                      }

                    </strong>
                }

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-info-box">

              <div className="profile-info-icon">
                ✉️
              </div>


              <div>

                <span>
                  Email Address
                </span>


                {
                  editMode

                    ?

                    <input
                      type="email"
                      name="email"
                      value={
                        user.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your email"
                    />

                    :

                    <strong>

                      {
                        user.email ||
                        "Not Added"
                      }

                    </strong>
                }

              </div>

            </div>


            {/* PHONE */}

            <div className="profile-info-box">

              <div className="profile-info-icon">
                📞
              </div>


              <div>

                <span>
                  Phone Number
                </span>


                {
                  editMode

                    ?

                    <input
                      type="tel"
                      name="phone"
                      value={
                        user.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter phone number"
                    />

                    :

                    <strong>

                      {
                        user.phone ||
                        "Not Added"
                      }

                    </strong>
                }

              </div>

            </div>


            {/* MEMBER SINCE */}

            <div className="profile-info-box">

              <div className="profile-info-icon">
                📅
              </div>


              <div>

                <span>
                  Member Since
                </span>

                <strong>
                  {memberSince}
                </strong>

              </div>

            </div>


          </div>

        </div>


        {/* ===================================
            SECURITY
        ==================================== */}

        <div className="profile-section">

          <h3>
            Account Security
          </h3>


          {/* CHANGE PASSWORD */}

          <div className="profile-action">

            <div className="profile-action-left">

              <div className="profile-info-icon">
                🔒
              </div>


              <div>

                <strong>
                  Password
                </strong>

                <span>
                  Keep your account secure
                </span>

              </div>

            </div>


            <button
              type="button"
              onClick={
                handlePassword
              }
            >
              Change Password
            </button>

          </div>


          {/* LOGOUT */}

          <div className="profile-action">

            <div className="profile-action-left">

              <div className="profile-info-icon">
                ↪
              </div>


              <div>

                <strong>
                  Logout
                </strong>

                <span>
                  Sign out from this device
                </span>

              </div>

            </div>


            <button
              type="button"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>

          </div>


        </div>


      </section>


    </main>

  );

}


export default Profile;