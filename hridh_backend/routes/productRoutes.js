const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/sold-products", async (req,res)=>{

try{

const orders = await Order.find({}, "items");

/* clean invalid values */
const soldIds =
orders
.flatMap(order => order.items)
.filter(id =>
id !== null &&
id !== undefined &&
typeof id === "number"
);

res.json(soldIds);

}
catch(err){

res.status(500).json({
error:"Server error"
});

}

});

module.exports = router;