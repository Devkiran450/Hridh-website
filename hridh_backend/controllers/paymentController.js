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


exports.verifyPayment = async (req, res) => {

try {

const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature,
orderData
} = req.body;


/* VERIFY SIGNATURE */

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


/* CHECK DUPLICATE PAYMENT */

const existingOrder =
await Order.findOne({
paymentId: razorpay_payment_id
});

if(existingOrder){

return res.json({
success:true,
certificateUrls:
existingOrder.items.map(id =>
`/certificates/certificate_${razorpay_payment_id}_${id}.pdf`
)
});

}


/* CHECK SOLD */

const alreadySold =
await Order.findOne({
items:{ $in: orderData.items }
});

if(alreadySold){

return res.status(400).json({
success:false,
message:"Product already sold"
});

}


/* SAVE ORDER */

const newOrder = new Order({

...orderData,

paymentId: razorpay_payment_id

});

await newOrder.save();


/* GENERATE MULTIPLE CERTIFICATES */

const certificateUrls = [];

for(const itemId of orderData.items){

const fileName =
generateCertificate(
newOrder,
itemId
);

certificateUrls.push(
`/certificates/${fileName}`
);

}


/* SEND ALL URLs */

res.json({

success:true,

certificateUrls

});

}

catch(err){

console.log(err);

res.status(500).json({
success:false,
message:"Server error"
});

}

};