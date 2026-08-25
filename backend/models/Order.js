import mongoose from "mongoose";


// =========================================
// ORDER ITEM SCHEMA
// =========================================

const orderItemSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

});


// =========================================
// ORDER SCHEMA
// =========================================

const orderSchema = new mongoose.Schema(
  {

    orderId: {
      type: String,
      required: true,
      unique: true,
    },


    userId: {
      type: String,
      required: true,
    },


    items: {
      type: [orderItemSchema],
      required: true,
    },


    customer: {

      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

    },


    subtotal: {
      type: Number,
      required: true,
    },


    coupon: {
      type: String,
      default: null,
    },


    discount: {
      type: Number,
      default: 0,
    },


    total: {
      type: Number,
      required: true,
    },


    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },


    status: {
      type: String,
      enum: [
        "Processing",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },

  },
  {
    timestamps: true,
  }
);


export default mongoose.model(
  "Order",
  orderSchema
);