import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================================
    // USER NAME
    // =========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================
    // EMAIL
    // =========================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =========================================
    // PASSWORD
    // =========================================

    password: {
      type: String,
      required: true,
    },

    // =========================================
    // PHONE
    // =========================================

    phone: {
      type: String,
      default: "",
    },

    // =========================================
    // USER ROLE
    // =========================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =========================================
    // USER SETTINGS
    // =========================================

    settings: {
      emailNotification: {
        type: Boolean,
        default: true,
      },

      orderUpdates: {
        type: Boolean,
        default: true,
      },

      offers: {
        type: Boolean,
        default: false,
      },

      profilePrivacy: {
        type: Boolean,
        default: true,
      },
    },

    // =========================================
    // PASSWORD RESET
    // =========================================

    resetPasswordToken: {
      type: String,
      default: undefined,
    },

    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;