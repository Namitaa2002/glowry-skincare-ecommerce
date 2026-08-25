import express from "express";
import Address from "../models/Address.js";

const router = express.Router();


// =========================================
// GET USER ADDRESSES
// =========================================

router.get("/:userId", async (req, res) => {

  try {

    const addresses = await Address.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });


    res.json(addresses);

  } catch (error) {

    console.error(
      "Get Addresses Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to load addresses.",

    });

  }

});


// =========================================
// ADD ADDRESS
// =========================================

router.post("/", async (req, res) => {

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


    if (
      !userId ||
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {

      return res.status(400).json({

        message:
          "Please fill all address fields.",

      });

    }


    // If this is the first address,
    // make it default automatically.

    const existingAddresses =
      await Address.find({
        userId,
      });


    const shouldBeDefault =
      existingAddresses.length === 0
        ? true
        : Boolean(isDefault);


    // If new address is default,
    // remove default from previous addresses.

    if (shouldBeDefault) {

      await Address.updateMany(

        { userId },

        {
          $set: {
            isDefault: false,
          },
        }

      );

    }


    const newAddress =
      await Address.create({

        userId,

        name,

        phone,

        address,

        city,

        state,

        pincode,

        isDefault:
          shouldBeDefault,

      });


    res.status(201).json({

      message:
        "Address added successfully.",

      address:
        newAddress,

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

});


// =========================================
// UPDATE ADDRESS
// =========================================

router.put("/:id", async (req, res) => {

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


    const existingAddress =
      await Address.findById(
        req.params.id
      );


    if (!existingAddress) {

      return res.status(404).json({

        message:
          "Address not found.",

      });

    }


    // If making this address default,
    // remove default from all others.

    if (isDefault) {

      await Address.updateMany(

        {
          userId:
            existingAddress.userId,

          _id: {
            $ne:
              req.params.id,
          },

        },

        {
          $set: {
            isDefault: false,
          },
        }

      );

    }


    existingAddress.name =
      name;

    existingAddress.phone =
      phone;

    existingAddress.address =
      address;

    existingAddress.city =
      city;

    existingAddress.state =
      state;

    existingAddress.pincode =
      pincode;

    existingAddress.isDefault =
      Boolean(isDefault);


    await existingAddress.save();


    res.json({

      message:
        "Address updated successfully.",

      address:
        existingAddress,

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

});


// =========================================
// DELETE ADDRESS
// =========================================

router.delete("/:id", async (req, res) => {

  try {

    const address =
      await Address.findById(
        req.params.id
      );


    if (!address) {

      return res.status(404).json({

        message:
          "Address not found.",

      });

    }


    const wasDefault =
      address.isDefault;


    const userId =
      address.userId;


    await Address.findByIdAndDelete(
      req.params.id
    );


    // If deleted address was default,
    // make another address default.

    if (wasDefault) {

      const nextAddress =
        await Address.findOne({
          userId,
        }).sort({
          createdAt: 1,
        });


      if (nextAddress) {

        nextAddress.isDefault =
          true;

        await nextAddress.save();

      }

    }


    res.json({

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

});


// =========================================
// MAKE DEFAULT ADDRESS
// =========================================

router.put(
  "/default/:id",
  async (req, res) => {

    try {

      const address =
        await Address.findById(
          req.params.id
        );


      if (!address) {

        return res.status(404).json({

          message:
            "Address not found.",

        });

      }


      await Address.updateMany(

        {
          userId:
            address.userId,
        },

        {
          $set: {
            isDefault: false,
          },
        }

      );


      address.isDefault =
        true;


      await address.save();


      res.json({

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