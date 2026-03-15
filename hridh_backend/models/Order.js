const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: Array,
  total: Number,
  paymentId: {
  type: String,
  unique: true
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);