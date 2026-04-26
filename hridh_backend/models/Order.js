const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  pincode: { type: String },

  items: [{ type: Number, required: true }],

  itemsData: [{
    id: Number,
    code: String,
    name: String
  }],

  total: { type: Number, required: true },

  paymentId: {
    type: String,
    unique: true,
    required: true
  },

  certificateId: { type: String },   // ✅ NEW

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);