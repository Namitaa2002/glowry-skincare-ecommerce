import express from "express";
import Address from "../models/Address.js";

import {
  protect,
  authorizeUser,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================================
// GET USER ADDRESSES
// GET /api/addresses/:userId
// AUTHENTICATED USER ONLY
// =========================================

router.get(
  "/:userId",
  protect,
  authorizeUser,
  async (req, res) => {
    try {
      const addresses = await Address.find({
        userId: req.params.userId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json(addresses);

    } catch (error) {
      console.error(
        "Get Addresses Error:",
        error
      );

      res.status(500).json({
        message: "Failed to load addresses.",
      });
    }
  }
);


// =========================================
// ADD ADDRESS
// POST /api/addresses
// AUTHENTICATED USER ONLY
// =========================================

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        userId,
        name,
        phone,
        address,
        city,
        state,
        pincode,
        isDefault,
      } = req.body;


      // =====================================
      // USER OWNERSHIP CHECK
      // =====================================

      if (
        !userId ||
        !req.user ||
        String(req.user.id) !== String(userId)
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to add an address for this user.",
        });
      }


      // =====================================
      // VALIDATION
      // =====================================

      if (
        !name?.trim() ||
        !phone?.trim() ||
        !address?.trim() ||
        !city?.trim() ||
        !state?.trim() ||
        !pincode?.trim()
      ) {
        return res.status(400).json({
          message:
            "Please fill all address fields.",
        });
      }


      // =====================================
      // GET EXISTING ADDRESSES
      // =====================================

      const existingAddresses =
        await Address.find({
          userId,
        });


      // First address automatically becomes default
      const shouldBeDefault =
        existingAddresses.length === 0
          ? true
          : Boolean(isDefault);


      // =====================================
      // REMOVE PREVIOUS DEFAULT
      // =====================================

      if (shouldBeDefault) {
        await Address.updateMany(
          {
            userId,
          },
          {
            $set: {
              isDefault: false,
            },
          }
        );
      }


      // =====================================
      // CREATE ADDRESS
      // =====================================

      const newAddress =
        await Address.create({
          userId,

          name: name.trim(),

          phone: phone.trim(),

          address: address.trim(),

          city: city.trim(),

          state: state.trim(),

          pincode: pincode.trim(),

          isDefault: shouldBeDefault,
        });


      // =====================================
      // RESPONSE
      // =====================================

      res.status(201).json({
        message:
          "Address added successfully.",

        address: newAddress,
      });

    } catch (error) {
      console.error(
        "Add Address Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to add address.",
      });
    }
  }
);


// =========================================
// UPDATE ADDRESS
// PUT /api/addresses/:id
// AUTHENTICATED USER ONLY
// =========================================

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const {
        name,
        phone,
        address,
        city,
        state,
        pincode,
        isDefault,
      } = req.body;


      // =====================================
      // FIND ADDRESS
      // =====================================

      const existingAddress =
        await Address.findById(
          req.params.id
        );


      if (!existingAddress) {
        return res.status(404).json({
          message: "Address not found.",
        });
      }


      // =====================================
      // USER OWNERSHIP CHECK
      // =====================================

      if (
        !req.user ||
        String(req.user.id) !==
          String(existingAddress.userId)
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to update this address.",
        });
      }


      // =====================================
      // VALIDATION
      // =====================================

      if (
        !name?.trim() ||
        !phone?.trim() ||
        !address?.trim() ||
        !city?.trim() ||
        !state?.trim() ||
        !pincode?.trim()
      ) {
        return res.status(400).json({
          message:
            "Please fill all address fields.",
        });
      }


      // =====================================
      // MAKE THIS ADDRESS DEFAULT
      // =====================================

      if (Boolean(isDefault)) {
        await Address.updateMany(
          {
            userId: existingAddress.userId,

            _id: {
              $ne: existingAddress._id,
            },
          },
          {
            $set: {
              isDefault: false,
            },
          }
        );
      }


      // =====================================
      // UPDATE ADDRESS
      // =====================================

      existingAddress.name =
        name.trim();

      existingAddress.phone =
        phone.trim();

      existingAddress.address =
        address.trim();

      existingAddress.city =
        city.trim();

      existingAddress.state =
        state.trim();

      existingAddress.pincode =
        pincode.trim();

      existingAddress.isDefault =
        Boolean(isDefault);


      // =====================================
      // PREVENT NO DEFAULT ADDRESS
      // =====================================

      if (!existingAddress.isDefault) {
        const anotherDefault =
          await Address.findOne({
            userId:
              existingAddress.userId,

            isDefault: true,

            _id: {
              $ne: existingAddress._id,
            },
          });

        // If another default exists, that's fine.
        // Otherwise keep current address as default.
        if (!anotherDefault) {
          existingAddress.isDefault = true;
        }
      }


      await existingAddress.save();


      // =====================================
      // RESPONSE
      // =====================================

      res.status(200).json({
        message:
          "Address updated successfully.",

        address: existingAddress,
      });

    } catch (error) {
      console.error(
        "Update Address Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update address.",
      });
    }
  }
);


// =========================================
// DELETE ADDRESS
// DELETE /api/addresses/:id
// AUTHENTICATED USER ONLY
// =========================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      // =====================================
      // FIND ADDRESS
      // =====================================

      const address =
        await Address.findById(
          req.params.id
        );


      if (!address) {
        return res.status(404).json({
          message: "Address not found.",
        });
      }


      // =====================================
      // USER OWNERSHIP CHECK
      // =====================================

      if (
        !req.user ||
        String(req.user.id) !==
          String(address.userId)
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to delete this address.",
        });
      }


      // =====================================
      // SAVE DEFAULT STATUS
      // =====================================

      const wasDefault =
        Boolean(address.isDefault);

      const userId =
        address.userId;


      // =====================================
      // DELETE ADDRESS
      // =====================================

      await Address.findByIdAndDelete(
        req.params.id
      );


      // =====================================
      // SET NEXT DEFAULT ADDRESS
      // =====================================

      if (wasDefault) {
        const nextAddress =
          await Address.findOne({
            userId,
          }).sort({
            createdAt: 1,
          });


        if (nextAddress) {
          nextAddress.isDefault = true;

          await nextAddress.save();
        }
      }


      // =====================================
      // RESPONSE
      // =====================================

      res.status(200).json({
        message:
          "Address deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete Address Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete address.",
      });
    }
  }
);


// =========================================
// MAKE DEFAULT ADDRESS
// PUT /api/addresses/default/:id
// AUTHENTICATED USER ONLY
// =========================================

router.put(
  "/default/:id",
  protect,
  async (req, res) => {
    try {
      // =====================================
      // FIND ADDRESS
      // =====================================

      const address =
        await Address.findById(
          req.params.id
        );


      if (!address) {
        return res.status(404).json({
          message: "Address not found.",
        });
      }


      // =====================================
      // USER OWNERSHIP CHECK
      // =====================================

      if (
        !req.user ||
        String(req.user.id) !==
          String(address.userId)
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to change this address.",
        });
      }


      // =====================================
      // REMOVE DEFAULT FROM ALL ADDRESSES
      // =====================================

      await Address.updateMany(
        {
          userId: address.userId,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );


      // =====================================
      // MAKE CURRENT ADDRESS DEFAULT
      // =====================================

      address.isDefault = true;

      await address.save();


      // =====================================
      // RESPONSE
      // =====================================

      res.status(200).json({
        message:
          "Default address updated.",

        address,
      });

    } catch (error) {
      console.error(
        "Default Address Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update default address.",
      });
    }
  }
);


export default router;