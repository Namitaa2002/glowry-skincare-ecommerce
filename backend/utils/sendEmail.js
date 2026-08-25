import dotenv from "dotenv";
import nodemailer from "nodemailer";


// =========================================
// LOAD ENVIRONMENT VARIABLES
// =========================================

dotenv.config();


// =========================================
// DEBUG EMAIL CONFIG
// =========================================

console.log(
  "SEND EMAIL USER:",
  process.env.EMAIL_USER
);

console.log(
  "SEND EMAIL PASS LENGTH:",
  process.env.EMAIL_PASS?.length
);


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

    } else {

      console.log(
        "Gmail transporter is ready to send emails."
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


    console.log(
      "Email sent successfully:",
      info.messageId
    );


    return info;


  } catch (error) {

    console.error(
      "Email Sending Error:",
      error
    );

    throw error;

  }

};