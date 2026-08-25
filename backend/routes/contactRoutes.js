import express from "express";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();


// =========================================
// SEND CONTACT MESSAGE
// =========================================

router.post("/", async (req, res) => {

  try {

    const {
      name,
      email,
      subject,
      message,
    } = req.body;


    // =======================================
    // VALIDATION
    // =======================================

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {

      return res.status(400).json({

        message:
          "Please fill all fields.",

      });

    }


    // =======================================
    // SEND EMAIL TO GLOWRY
    // =======================================

    await sendEmail({

      to:
        process.env.EMAIL_USER,

      subject:
        `GLOWRY Contact: ${subject}`,

      html: `

        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          color: #333;
        ">

          <h2 style="
            color: #7b5260;
          ">
            New Contact Message
          </h2>


          <p>
            <strong>Name:</strong>
            ${name}
          </p>


          <p>
            <strong>Email:</strong>
            ${email}
          </p>


          <p>
            <strong>Subject:</strong>
            ${subject}
          </p>


          <div style="
            margin-top: 20px;
            padding: 20px;
            background: #f8f4f5;
            border-radius: 8px;
          ">

            <strong>
              Message:
            </strong>

            <p>
              ${message}
            </p>

          </div>


          <p style="
            margin-top: 30px;
            color: #777;
          ">
            This message was sent from
            the GLOWRY website.
          </p>

        </div>

      `,

    });


    // =======================================
    // SUCCESS
    // =======================================

    res.json({

      message:
        "Your message has been sent successfully.",

    });


  } catch (error) {

    console.error(
      "Contact Email Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to send your message.",

    });

  }

});


export default router;