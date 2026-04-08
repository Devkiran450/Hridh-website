const razorpay = require("../services/razorpayService");
const crypto = require("crypto");
const Order = require("../models/Order");
const generateCertificate = require("../services/certificateService");

exports.createRazorpayOrder = async (req,res)=>{

try{

const { amount, items } = req.body;

const alreadySold = await Order.findOne({
items:{ $in:items }
});

if(alreadySold){

return res.status(400).json({
success:false,
message:"Artwork already sold"
});

}

const order = await razorpay.orders.create({

amount: amount*100,
currency:"INR",
receipt:"receipt_"+Date.now()

});

res.json(order);

}catch(err){

console.log(err);

res.status(500).json({
success:false,
message:"Error creating Razorpay order"
});

}

};


exports.verifyPayment = async (req,res)=>{

try{

const {

razorpay_order_id,
razorpay_payment_id,
razorpay_signature,
orderData

} = req.body;


/* verify signature */

const body =
razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
.createHmac(
"sha256",
process.env.RAZORPAY_KEY_SECRET
)
.update(body.toString())
.digest("hex");

if(expectedSignature !== razorpay_signature){

return res.status(400).json({
success:false,
message:"Payment verification failed"
});

}


/* prevent duplicate payment */

const existingOrder =
await Order.findOne({

paymentId:razorpay_payment_id

});

if(existingOrder){

return res.json({
success:true,
certificateUrl:
`/certificates/certificate_${existingOrder.paymentId}.pdf`
});

}


/* check already sold */

const alreadySold = await Order.findOne({

items:{ $in:orderData.items }

});

if(alreadySold){

return res.status(400).json({
success:false,
message:"Product already sold"
});

}


/* save order */

const newOrder = new Order({

...orderData,
paymentId: razorpay_payment_id

});

await newOrder.save();


/* generate certificate */

const fileName =
generateCertificate(newOrder);


/* send certificate url */

res.json({

success:true,

certificateUrl:
`/certificates/${fileName}`

});

}catch(err){

console.log(err);

res.status(500).json({
success:false,
message:"Server error"
});

}

};