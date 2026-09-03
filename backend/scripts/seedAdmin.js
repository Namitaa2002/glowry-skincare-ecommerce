
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail =
      process.env.ADMIN_EMAIL;

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      !adminEmail ||
      !adminPassword
    ) {
      console.error(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );

      process.exit(1);
    }

    const normalizedEmail =
      adminEmail
        .toLowerCase()
        .trim();

    const existingAdmin =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingAdmin) {
      if (
        existingAdmin.role !==
        "admin"
      ) {
        existingAdmin.role =
          "admin";

        await existingAdmin.save();
      }

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        adminPassword,
        10
      );

    await User.create({
      name: "GLOWRY Admin",
      email:
        normalizedEmail,
      password:
        hashedPassword,
      phone: "",
      role: "admin",
    });

    process.exit(0);
  } catch (error) {
    console.error(
      "Admin Seed Error:",
      error
    );

    process.exit(1);
  }
};

seedAdmin();

