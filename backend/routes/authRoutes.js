import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================
// REGISTER
// =========================================

router.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      phone,
    } = req.body;


    if (!name || !email || !password) {

      return res.status(400).json({
        message: "Please fill all required fields.",
      });

    }


    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });


    if (existingUser) {

      return res.status(409).json({
        message: "User already exists.",
      });

    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const user =
      await User.create({

        name,

        email:
          email.toLowerCase(),

        password:
          hashedPassword,

        phone:
          phone || "",

      });


    // =====================================
    // WELCOME EMAIL
    // =====================================

    try {

      await sendEmail({

        to: user.email,

        subject:
          "Welcome to GLOWRY ✨",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background: #fff8fa;
            border-radius: 12px;
          ">

            <h1 style="color: #b76e79;">
              Welcome to GLOWRY ✨
            </h1>

            <p>
              Hi ${user.name},
            </p>

            <p>
              Your GLOWRY account has been
              created successfully.
            </p>

            <p>
              We're happy to have you with us.
              Start exploring your skincare
              journey with GLOWRY.
            </p>

            <p>
              With love,<br />
              <strong>GLOWRY Team</strong>
            </p>

          </div>
        `,

      });

    } catch (emailError) {

      console.error(
        "Welcome Email Error:",
        emailError
      );

    }


    res.status(201).json({

      message:
        "Registration successful.",

      user: {

        id:
          user._id.toString(),

        name:
          user.name,

        fullName:
          user.name,

        email:
          user.email,

        phone:
          user.phone,

        role:
          user.role,

        createdAt:
          user.createdAt,

      },

    });


  } catch (error) {

    console.error(
      "Register Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to register user.",

    });

  }

});


// =========================================
// LOGIN
// =========================================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // =======================================
    // VALIDATION
    // =======================================

    if (!email || !password) {

      return res.status(400).json({

        message:
          "Email and password are required.",

      });

    }


    // =======================================
    // FIND USER
    // =======================================

    const user =
      await User.findOne({

        email:
          email.toLowerCase(),

      });


    if (!user) {

      return res.status(404).json({

        message:
          "User not found.",

      });

    }


    // =======================================
    // CHECK PASSWORD
    // =======================================

    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );


    if (!isMatch) {

      return res.status(401).json({

        message:
          "Invalid password.",

      });

    }


    // =======================================
    // CREATE JWT TOKEN
    // =======================================

    const token =
      jwt.sign(

        {
          id:
            user._id.toString(),

          role:
            user.role,

        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }

      );


    // =======================================
    // LOGIN RESPONSE
    // =======================================

    res.json({

      message:
        "Login successful.",

      token,

      user: {

        id:
          user._id.toString(),

        fullName:
          user.name,

        name:
          user.name,

        email:
          user.email,

        phone:
          user.phone,

        role:
          user.role,

        createdAt:
          user.createdAt,

      },

    });


  } catch (error) {

    console.error(
      "Login Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to login.",

    });

  }

});


// =========================================
// GET USER PROFILE
// =========================================

router.get(
  "/profile/:id",
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        ).select(
          "-password -resetPasswordToken -resetPasswordExpires"
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found.",

        });

      }


      res.json({

        user: {

          id:
            user._id.toString(),

          fullName:
            user.name,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone || "",

          role:
            user.role,

          createdAt:
            user.createdAt,

        },

      });

    } catch (error) {

      console.error(
        "Get Profile Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch profile.",

      });

    }

  }
);


// =========================================
// UPDATE USER PROFILE
// =========================================

router.put(
  "/profile/:id",
  async (req, res) => {

    try {

      const {
        fullName,
        email,
        phone,
      } = req.body;


      // =====================================
      // VALIDATION
      // =====================================

      if (!fullName || !email) {

        return res.status(400).json({

          message:
            "Name and email are required.",

        });

      }


      // =====================================
      // FIND USER
      // =====================================

      const user =
        await User.findById(
          req.params.id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found.",

        });

      }


      // =====================================
      // CHECK EMAIL
      // =====================================

      const normalizedEmail =
        email.toLowerCase().trim();


      const existingUser =
        await User.findOne({

          email:
            normalizedEmail,

          _id: {
            $ne:
              req.params.id,
          },

        });


      if (existingUser) {

        return res.status(409).json({

          message:
            "This email is already registered with another account.",

        });

      }


      // =====================================
      // UPDATE USER
      // =====================================

      user.name =
        fullName.trim();

      user.email =
        normalizedEmail;

      user.phone =
        phone || "";


      await user.save();


      // =====================================
      // RESPONSE
      // =====================================

      res.json({

        message:
          "Profile updated successfully.",

        user: {

          id:
            user._id.toString(),

          fullName:
            user.name,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone || "",

          role:
            user.role,

          createdAt:
            user.createdAt,

        },

      });

    } catch (error) {

      console.error(
        "Update Profile Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update profile.",

      });

    }

  }
);


// =====================================================
// GET ACCOUNT SETTINGS
// =====================================================

router.get(
  "/settings/:id",
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        ).select("settings");


      if (!user) {

        return res.status(404).json({

          message:
            "User not found.",

        });

      }


      // =====================================
      // DEFAULT SETTINGS
      // =====================================

      const settings = {

        emailNotification:
          user.settings?.emailNotification ??
          true,

        orderUpdates:
          user.settings?.orderUpdates ??
          true,

        offers:
          user.settings?.offers ??
          false,

        profilePrivacy:
          user.settings?.profilePrivacy ??
          true,

      };


      res.json({

        message:
          "Settings loaded successfully.",

        settings,

      });

    } catch (error) {

      console.error(
        "Get Settings Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to load account settings.",

      });

    }

  }
);


// =====================================================
// UPDATE ACCOUNT SETTINGS
// =====================================================

router.put(
  "/settings/:id",
  async (req, res) => {

    try {

      const {
        emailNotification,
        orderUpdates,
        offers,
        profilePrivacy,
      } = req.body;


      // =====================================
      // FIND USER
      // =====================================

      const user =
        await User.findById(
          req.params.id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found.",

        });

      }


      // =====================================
      // UPDATE SETTINGS
      // =====================================

      user.settings = {

        emailNotification:
          typeof emailNotification === "boolean"
            ? emailNotification
            : user.settings?.emailNotification ?? true,

        orderUpdates:
          typeof orderUpdates === "boolean"
            ? orderUpdates
            : user.settings?.orderUpdates ?? true,

        offers:
          typeof offers === "boolean"
            ? offers
            : user.settings?.offers ?? false,

        profilePrivacy:
          typeof profilePrivacy === "boolean"
            ? profilePrivacy
            : user.settings?.profilePrivacy ?? true,

      };


      await user.save();


      // =====================================
      // RESPONSE
      // =====================================

      res.json({

        message:
          "Settings updated successfully.",

        settings:
          user.settings,

      });

    } catch (error) {

      console.error(
        "Update Settings Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update settings.",

      });

    }

  }
);


// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(
  "/change-password/:id",
  async (req, res) => {

    try {

      const {
        currentPassword,
        newPassword,
      } = req.body;


      // =====================================
      // VALIDATION
      // =====================================

      if (
        !currentPassword ||
        !newPassword
      ) {

        return res.status(400).json({

          message:
            "Current password and new password are required.",

        });

      }


      if (
        newPassword.length < 6
      ) {

        return res.status(400).json({

          message:
            "New password must be at least 6 characters.",

        });

      }


      // =====================================
      // FIND USER
      // =====================================

      const user =
        await User.findById(
          req.params.id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found.",

        });

      }


      // =====================================
      // CHECK CURRENT PASSWORD
      // =====================================

      const passwordMatch =
        await bcrypt.compare(

          currentPassword,

          user.password

        );


      if (!passwordMatch) {

        return res.status(401).json({

          message:
            "Current password is incorrect.",

        });

      }


      // =====================================
      // HASH NEW PASSWORD
      // =====================================

      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10

        );


      user.password =
        hashedPassword;


      await user.save();


      // =====================================
      // RESPONSE
      // =====================================

      res.json({

        message:
          "Password changed successfully.",

      });

    } catch (error) {

      console.error(
        "Change Password Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to change password.",

      });

    }

  }
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  async (req, res) => {

    try {

      const {
        email,
      } = req.body;


      if (!email) {

        return res.status(400).json({

          message:
            "Email is required.",

        });

      }


      const user =
        await User.findOne({

          email:
            email.toLowerCase().trim(),

        });


      // Don't reveal whether email exists

      if (!user) {

        return res.json({

          message:
            "If an account exists with this email, a password reset link has been sent.",

        });

      }


      // =====================================
      // CREATE RESET TOKEN
      // =====================================

      const resetToken =
        crypto.randomBytes(32)
          .toString("hex");


      const hashedToken =
        crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");


      user.resetPasswordToken =
        hashedToken;


      user.resetPasswordExpires =
        Date.now() +
        1000 *
        60 *
        15;


      await user.save();


      // =====================================
      // RESET URL
      // =====================================

      const resetUrl =
        `http://localhost:5173/reset-password/${resetToken}`;


      // =====================================
      // SEND EMAIL
      // =====================================

      try {

        await sendEmail({

          to:
            user.email,

          subject:
            "Reset Your GLOWRY Password",

          html: `

            <div style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              padding: 30px;
              background: #fff8fa;
              border-radius: 12px;
            ">

              <h1 style="color:#b76e79;">
                GLOWRY Password Reset
              </h1>

              <p>
                Hi ${user.name},
              </p>

              <p>
                We received a request to reset
                your GLOWRY account password.
              </p>

              <p>
                Click the button below to create
                a new password.
              </p>

              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:12px 22px;
                  background:#b76e79;
                  color:white;
                  text-decoration:none;
                  border-radius:8px;
                  margin:15px 0;
                "
              >
                Reset Password
              </a>

              <p>
                This link will expire in 15 minutes.
              </p>

              <p>
                If you didn't request this,
                you can safely ignore this email.
              </p>

              <p>
                With love,<br/>
                <strong>GLOWRY Team</strong>
              </p>

            </div>

          `,

        });

      } catch (emailError) {

        console.error(
          "Reset Email Error:",
          emailError
        );

      }


      res.json({

        message:
          "If an account exists with this email, a password reset link has been sent.",

      });

    } catch (error) {

      console.error(
        "Forgot Password Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to process password reset request.",

      });

    }

  }
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.put(
  "/reset-password/:token",
  async (req, res) => {

    try {

      const {
        password,
      } = req.body;


      if (!password) {

        return res.status(400).json({

          message:
            "Password is required.",

        });

      }


      if (password.length < 6) {

        return res.status(400).json({

          message:
            "Password must be at least 6 characters.",

        });

      }


      // =====================================
      // HASH TOKEN
      // =====================================

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(req.params.token)
          .digest("hex");


      // =====================================
      // FIND USER
      // =====================================

      const user =
        await User.findOne({

          resetPasswordToken:
            hashedToken,

          resetPasswordExpires:
            {
              $gt:
                Date.now(),
            },

        });


      if (!user) {

        return res.status(400).json({

          message:
            "Password reset link is invalid or expired.",

        });

      }


      // =====================================
      // HASH PASSWORD
      // =====================================

      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );


      user.password =
        hashedPassword;


      user.resetPasswordToken =
        undefined;


      user.resetPasswordExpires =
        undefined;


      await user.save();


      res.json({

        message:
          "Password reset successfully.",

      });

    } catch (error) {

      console.error(
        "Reset Password Error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to reset password.",

      });

    }

  }
);


export default router;