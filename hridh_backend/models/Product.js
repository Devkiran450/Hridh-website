const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

  productId: String,
  name: String,
  price: Number,
  image: String,

  isSold: {
    type: Boolean,
    default: false
  }

});

module.exports = mongoose.model("Product", ProductSchema);