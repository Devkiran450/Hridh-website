const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String
  },

  pincode: {
    type: String
  },

  /* numeric ids */
  items: [
    {
      type: Number,
      required: true
    }
  ],

  /* product names + codes */
  itemsData: [

    {

      id: Number,

      code: String,

      name: String

    }

  ],

  total: {
    type: Number,
    required: true
  },

  paymentId: {
    type: String,
    unique: true,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);