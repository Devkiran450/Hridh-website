const razorpay = require("../services/razorpayService");
const sendTelegramMessage = require("../services/telegramService");
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

try{

console.log("FILES RECEIVED FOR ZIP:",files);

const zipName =
`certificates_${paymentId}.zip`;

const zipPath =
path.join(
__dirname,
"../certificates",
zipName
);

const output =
fs.createWriteStream(zipPath);

const archive =
archiver("zip",{ zlib:{ level:9 } });

output.on("close",()=>{

console.log(
"ZIP SIZE:",
archive.pointer()
);

resolve(zipName);

});

archive.on("error",(err)=>{

console.log("ZIP ERROR:",err);

reject(err);

});

archive.pipe(output);

for(const file of files){

const fullPath =
path.join(
__dirname,
"../certificates",
file
);

console.log("ADDING FILE:",fullPath);

if(!fs.existsSync(fullPath)){

console.log("MISSING FILE:",file);

continue;

}

archive.file(
fullPath,
{ name:file }
);

}

archive.finalize();

}
catch(err){

reject(err);

}

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



console.log("VERIFY REQUEST:",req.body);


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


console.log("EXPECTED:",expectedSignature);
console.log("RECEIVED:",razorpay_signature);


if(expectedSignature !== razorpay_signature){

console.log("SIGNATURE FAILED");

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

console.log("ORDER ALREADY EXISTS");

return res.json({

success:true,

certificateUrls:

existingOrder.items.map(id=>

`/certificates/certificate_${razorpay_payment_id}_${id}.pdf`

)

});

}



/* validate order data */

if(!orderData || !orderData.items || orderData.items.length===0){

console.log("INVALID ORDER DATA");

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

console.log("ITEM ALREADY SOLD");

return res.status(400).json({

success:false,

message:"One of the artworks was just sold"

});

}



/* save order AFTER verification */

const newOrder = new Order({

...orderData,

paymentId: razorpay_payment_id,

itemsData: orderData.itemsData || []

});


await newOrder.save();

/* build product list */

const productList =
orderData.items
.map(id => {

const item =
newOrder.itemsData?.find(p => p.id == id);

if(item){

return `• ${item.code} — ${item.name}`;

}

return `• Item ID: ${id}`;

})
.join("\n");


/* send telegram alert */

await sendTelegramMessage(

`🛍️ <b>NEW ORDER</b>

<b>Customer:</b>
${orderData.name}
${orderData.city}
${orderData.pincode}

<b>Items:</b>
${productList}

<b>Total:</b> ₹${orderData.total}

Check admin panel.`

);



/* generate certificates */

const files = [];

for(const itemId of orderData.items){

try{

const fileName =
await generateCertificate(
newOrder,
itemId
);

files.push(fileName);

}
catch(err){

console.log("CERT ERROR:",err);

}

}



/* small delay ensures pdf write completed */





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



/* response */

console.log("DOWNLOAD FILE:",downloadFile);


res.json({

success:true,

certificateUrls:[
`/certificates/${downloadFile}`
]

});


}
catch(err){

console.log("VERIFY ERROR:",err);

res.status(500).json({

success:false,

message:"Server error"

});

}

};