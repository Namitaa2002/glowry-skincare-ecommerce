
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Settings() {

  const navigate = useNavigate();


  // =========================================
  // STATES
  // =========================================

  const [settings, setSettings] = useState({

    emailNotification: true,

    orderUpdates: true,

    offers: false,

    profilePrivacy: true,

  });


  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const [showPasswordForm, setShowPasswordForm] =
    useState(false);


  const [passwordData, setPasswordData] =
    useState({

      currentPassword: "",

      newPassword: "",

      confirmPassword: "",

    });


  const [passwordLoading, setPasswordLoading] =
    useState(false);


  const [passwordError, setPasswordError] =
    useState("");


  const [passwordSuccess, setPasswordSuccess] =
    useState("");


  // =========================================
  // GET LOGGED IN USER
  // =========================================

  const getLoggedInUser = () => {

    const savedUser =
      localStorage.getItem(
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
  // LOAD SETTINGS
  // =========================================

  const loadSettings = async () => {

    try {

      setLoading(true);

      setError("");


      const user =
        getLoggedInUser();


      if (!user || !user.id) {

        navigate("/login");

        return;

      }


      const response =
        await axios.get(

          `http://localhost:5000/api/auth/settings/${user.id}`

        );


      if (response.data.settings) {

        setSettings({

          emailNotification:
            response.data.settings.emailNotification
            ?? true,

          orderUpdates:
            response.data.settings.orderUpdates
            ?? true,

          offers:
            response.data.settings.offers
            ?? false,

          profilePrivacy:
            response.data.settings.profilePrivacy
            ?? true,

        });

      }


    } catch (error) {

      console.error(
        "Load Settings Error:",
        error
      );


      setError(

        error.response?.data?.message ||

        "Failed to load account settings."

      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadSettings();

  }, []);


  // =========================================
  // UPDATE SETTINGS
  // =========================================

  const handleToggle = async (key) => {

    const updatedSettings = {

      ...settings,

      [key]:
        !settings[key],

    };


    // Update UI immediately

    setSettings(
      updatedSettings
    );


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const user =
        getLoggedInUser();


      if (!user || !user.id) {

        navigate("/login");

        return;

      }


      const response =
        await axios.put(

          `http://localhost:5000/api/auth/settings/${user.id}`,

          updatedSettings

        );


      if (response.data.settings) {

        setSettings(
          response.data.settings
        );

      }


      setSuccess(
        "Settings updated successfully."
      );


      setTimeout(() => {

        setSuccess("");

      }, 2500);


    } catch (error) {

      console.error(
        "Update Settings Error:",
        error
      );


      // Revert UI if backend fails

      setSettings(settings);


      setError(

        error.response?.data?.message ||

        "Failed to update settings."

      );

    } finally {

      setSaving(false);

    }

  };


  // =========================================
  // PASSWORD INPUT
  // =========================================

  const handlePasswordChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setPasswordData((previous) => ({

      ...previous,

      [name]:
        value,

    }));


    setPasswordError("");

    setPasswordSuccess("");

  };


  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async (e) => {

    e.preventDefault();


    setPasswordError("");

    setPasswordSuccess("");


    const user =
      getLoggedInUser();


    if (!user || !user.id) {

      navigate("/login");

      return;

    }


    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;


    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setPasswordError(
        "Please fill all password fields."
      );

      return;

    }


    if (newPassword.length < 6) {

      setPasswordError(
        "New password must be at least 6 characters."
      );

      return;

    }


    if (
      newPassword !==
      confirmPassword
    ) {

      setPasswordError(
        "New password and confirm password do not match."
      );

      return;

    }


    try {

      setPasswordLoading(true);


      const response =
        await axios.put(

          `http://localhost:5000/api/auth/change-password/${user.id}`,

          {

            currentPassword,

            newPassword,

          }

        );


      setPasswordSuccess(

        response.data.message ||

        "Password changed successfully."

      );


      setPasswordData({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

      });


      setTimeout(() => {

        setShowPasswordForm(false);

        setPasswordSuccess("");

      }, 2500);


    } catch (error) {

      console.error(
        "Change Password Error:",
        error
      );


      setPasswordError(

        error.response?.data?.message ||

        "Failed to change password."

      );

    } finally {

      setPasswordLoading(false);

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


    if (confirmLogout) {

      localStorage.removeItem(
        "glowryLoggedInUser"
      );


      navigate("/login");

    }

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="settings-page">

        <section className="settings-container">

          <p>
            Loading settings...
          </p>

        </section>

      </main>

    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <main className="settings-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="settings-header">

        <p className="section-small-title">

          MY GLOWRY

        </p>


        <h1>
          Account Settings
        </h1>


        <p>
          Manage your account preferences
          and privacy.
        </p>

      </section>


      {/* =====================================
          SETTINGS CONTAINER
      ===================================== */}

      <section className="settings-container">


        {/* ===================================
            ERROR
        =================================== */}

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


        {/* ===================================
            SUCCESS
        =================================== */}

        {success && (

          <div className="settings-success-box">

            <span>
              ✓
            </span>

            <p>
              {success}
            </p>

          </div>

        )}


        {/* ===================================
            NOTIFICATIONS
        =================================== */}

        <div className="settings-card">

          <h2>
            Notifications
          </h2>


          <p>
            Choose what updates you want
            to receive.
          </p>


          {/* EMAIL NOTIFICATIONS */}

          <div className="setting-row">

            <div>

              <strong>
                Email Notifications
              </strong>


              <span>
                Receive updates on your email
              </span>

            </div>


            <button

              type="button"

              disabled={saving}

              aria-label="Toggle email notifications"

              className={

                settings.emailNotification

                  ? "toggle active"

                  : "toggle"

              }


              onClick={() =>
                handleToggle(
                  "emailNotification"
                )
              }

            >

              <span></span>

            </button>

          </div>


          {/* ORDER UPDATES */}

          <div className="setting-row">

            <div>

              <strong>
                Order Updates
              </strong>


              <span>
                Get delivery and order status
                updates
              </span>

            </div>


            <button

              type="button"

              disabled={saving}

              aria-label="Toggle order updates"

              className={

                settings.orderUpdates

                  ? "toggle active"

                  : "toggle"

              }


              onClick={() =>
                handleToggle(
                  "orderUpdates"
                )
              }

            >

              <span></span>

            </button>

          </div>


          {/* OFFERS */}

          <div className="setting-row">

            <div>

              <strong>
                Offers & Promotions
              </strong>


              <span>
                Receive skincare offers and deals
              </span>

            </div>


            <button

              type="button"

              disabled={saving}

              aria-label="Toggle offers"

              className={

                settings.offers

                  ? "toggle active"

                  : "toggle"

              }


              onClick={() =>
                handleToggle(
                  "offers"
                )
              }

            >

              <span></span>

            </button>

          </div>

        </div>


        {/* ===================================
            PRIVACY
        =================================== */}

        <div className="settings-card">

          <h2>
            Privacy
          </h2>


          <p>
            Control your account visibility.
          </p>


          <div className="setting-row">

            <div>

              <strong>
                Profile Visibility
              </strong>


              <span>
                Allow personalised experience
              </span>

            </div>


            <button

              type="button"

              disabled={saving}

              aria-label="Toggle profile privacy"

              className={

                settings.profilePrivacy

                  ? "toggle active"

                  : "toggle"

              }


              onClick={() =>
                handleToggle(
                  "profilePrivacy"
                )
              }

            >

              <span></span>

            </button>

          </div>

        </div>


        {/* ===================================
            ACCOUNT
        =================================== */}

        <div className="settings-card">

          <h2>
            Account
          </h2>


          <p>
            Manage your account security.
          </p>


          {/* CHANGE PASSWORD */}

          <div className="settings-action">

            <div>

              <strong>
                Change Password
              </strong>


              <span>
                Update your account password
              </span>

            </div>


            <button

              type="button"

              onClick={() => {

                setShowPasswordForm(
                  !showPasswordForm
                );

                setPasswordError("");

                setPasswordSuccess("");

              }}

            >

              {showPasswordForm
                ? "Cancel"
                : "Change"}

            </button>

          </div>


          {/* PASSWORD FORM */}

          {showPasswordForm && (

            <form

              className="change-password-form"

              onSubmit={
                handleChangePassword
              }

            >

              {passwordError && (

                <div className="login-error-box">

                  <span>
                    ⚠
                  </span>

                  <p>
                    {passwordError}
                  </p>

                </div>

              )}


              {passwordSuccess && (

                <div className="settings-success-box">

                  <span>
                    ✓
                  </span>

                  <p>
                    {passwordSuccess}
                  </p>

                </div>

              )}


              <div className="password-field">

                <label>
                  Current Password
                </label>


                <input

                  type="password"

                  name="currentPassword"

                  value={
                    passwordData.currentPassword
                  }

                  onChange={
                    handlePasswordChange
                  }

                  placeholder="Enter current password"

                />

              </div>


              <div className="password-field">

                <label>
                  New Password
                </label>


                <input

                  type="password"

                  name="newPassword"

                  value={
                    passwordData.newPassword
                  }

                  onChange={
                    handlePasswordChange
                  }

                  placeholder="Enter new password"

                />

              </div>


              <div className="password-field">

                <label>
                  Confirm New Password
                </label>


                <input

                  type="password"

                  name="confirmPassword"

                  value={
                    passwordData.confirmPassword
                  }

                  onChange={
                    handlePasswordChange
                  }

                  placeholder="Confirm new password"

                />

              </div>


              <button

                type="submit"

                className="save-password-button"

                disabled={
                  passwordLoading
                }

              >

                {passwordLoading
                  ? "Updating..."
                  : "Update Password"}

              </button>

            </form>

          )}


          {/* LOGOUT */}

          <div className="settings-action logout-action">

            <div>

              <strong>
                Logout
              </strong>


              <span>
                Sign out from this device
              </span>

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


export default Settings;

