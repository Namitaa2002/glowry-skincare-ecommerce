import jwt from "jsonwebtoken";


// =========================================
// VERIFY JWT TOKEN
// =========================================

export const protect = async (req, res, next) => {

  try {

    // =======================================
    // GET AUTHORIZATION HEADER
    // =======================================

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({

        message:
          "Authentication required. Please login.",

      });

    }


    // =======================================
    // GET TOKEN
    // =======================================

    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({

        message:
          "Authentication token is missing.",

      });

    }


    // =======================================
    // VERIFY TOKEN
    // =======================================

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );


    // =======================================
    // SAVE USER INFORMATION
    // =======================================

    req.user = decoded;


    // =======================================
    // CONTINUE
    // =======================================

    next();


  } catch (error) {

    console.error(
      "JWT Authentication Error:",
      error
    );


    return res.status(401).json({

      message:
        "Invalid or expired authentication token.",

    });

  }

};


// =========================================
// ADMIN ONLY
// =========================================

export const adminOnly = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {

    return res.status(403).json({

      message:
        "Admin access required.",

    });

  }


  next();

};