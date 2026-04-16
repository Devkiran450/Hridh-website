const razorpay = require("../services/razorpayService");
const crypto = require("crypto");
const Order = require("../models/Order");
const generateCertificate = require("../services/certificateService");

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");


/* CREATE ORDER */

exports.createRazorpayOrder = async (req,res)=>{

try{

const { amount } = req.body;

const order =
await razorpay.orders.create({

amount: amount * 100,

currency:"INR",

receipt:"receipt_"+Date.now()

});

res.json(order);

}
catch(err){

console.log(err);

res.status(500).json({

success:false,

message:"Error creating Razorpay order"

});

}

};



/* helper to create ZIP */

function createZip(paymentId, files){

return new Promise((resolve,reject)=>{

const zipName = `certificates_${paymentId}.zip`;

const zipPath =
path.join(__dirname,"../certificates",zipName);

const output = fs.createWriteStream(zipPath);

const archive = archiver("zip");

output.on("close",()=>resolve(zipName));

archive.on("error",(err)=>reject(err));

archive.pipe(output);

files.forEach(file=>{

archive.file(
path.join(__dirname,"../certificates",file),
{ name:file }
);

});

archive.finalize();

});

}



/* VERIFY PAYMENT */

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


const expectedSignature =
crypto
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



/* prevent duplicate processing */

const existingOrder =
await Order.findOne({

paymentId: razorpay_payment_id

});


if(existingOrder){

return res.json({

success:true,

certificateUrls:

existingOrder.items.map(id=>

`/certificates/certificate_${razorpay_payment_id}_${id}.pdf`

)

});

}



/* ensure items exist */

if(!orderData || !orderData.items || orderData.items.length===0){

return res.status(400).json({

success:false,

message:"Invalid order data"

});

}



/* prevent race condition */

const alreadySold =
await Order.findOne({

items:{ $in: orderData.items }

});


if(alreadySold){

return res.status(400).json({

success:false,

message:"One of the artworks was just sold"

});

}



/* save order ONLY AFTER verification */

const newOrder =
new Order({

...orderData,

paymentId: razorpay_payment_id

});


await newOrder.save();



/* generate certificates */

const files = [];

for(const itemId of orderData.items){

const fileName =
generateCertificate(
newOrder,
itemId
);

files.push(fileName);

}



/* if multiple → zip */

let downloadFile;

if(files.length === 1){

downloadFile = files[0];

}
else{

downloadFile =
await createZip(
razorpay_payment_id,
files
);

}



/* return SINGLE download url */

res.json({

success:true,

certificateUrls:[
`/certificates/${downloadFile}`
]

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