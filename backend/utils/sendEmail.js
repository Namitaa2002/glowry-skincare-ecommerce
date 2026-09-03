
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// =========================================
// LOAD ENVIRONMENT VARIABLES
// =========================================

dotenv.config();

// =========================================
// EMAIL TRANSPORTER
// =========================================

const transporter =
  nodemailer.createTransport({
    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

// =========================================
// VERIFY EMAIL CONNECTION
// =========================================

transporter.verify(
  (error) => {
    if (error) {
      console.error(
        "Email Transporter Error:",
        error
      );
    }
  }
);

// =========================================
// SEND EMAIL FUNCTION
// =========================================

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const info =
      await transporter.sendMail({
        from:
          `"GLOWRY" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html,
      });

    return info;
  } catch (error) {
    console.error(
      "Email Sending Error:",
      error
    );

    throw error;
  }
};

