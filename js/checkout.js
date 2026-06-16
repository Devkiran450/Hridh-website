let paymentProcessing = false;

document.getElementById("checkout-form")
.addEventListener("submit", async function(e){

e.preventDefault();

/* prevent multiple clicks */
if(paymentProcessing) return;
paymentProcessing = true;


const name =
document.getElementById("name").value;

const phone =
document.getElementById("phone").value;

const address =
document.getElementById("address").value;

const city =
document.getElementById("city").value;

const pincode =
document.getElementById("pincode").value;


const cart =
JSON.parse(localStorage.getItem("cart")) || [];


if(cart.length === 0){

paymentProcessing = false;

alert("Your cart is empty");

return;

}


/* total */

const total =
cart.reduce(
(sum,item)=>sum+item.price,
0
);


console.log("CART:", cart);
console.log("TOTAL:", total);


/* create razorpay order */

let orderData;

try{

const orderRes =
await fetch(

"https://hridh-backend.onrender.com/api/payment/create-order",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

amount: total,

items:
cart.map(p=>p.id)

})

}

);


if(!orderRes.ok){

paymentProcessing = false;

const err =
await orderRes.json();

console.log("ORDER CREATE ERROR:", err);

alert(

err.message ||

"Unable to create payment order"

);

return;

}


orderData =
await orderRes.json();


console.log("ORDER CREATED:", orderData);

}
catch(err){

paymentProcessing = false;

console.log("CREATE ORDER SERVER ERROR:", err);

alert("Server error while creating order");

return;

}


/* razorpay popup */

const options = {

key:
"rzp_live_T2M1foF6ifIfpn",

amount:
orderData.amount,

currency:"INR",

order_id:
orderData.id,

name:"HRIDH",

description:
"Original Textile Artwork",


handler:
async function(response){

    document
.getElementById("payment-processing")
.classList.add("show");

console.log("RAZORPAY SUCCESS RESPONSE:", response);


/* safety check */

if(
!response ||
!response.razorpay_payment_id ||
!response.razorpay_signature ||
!response.razorpay_order_id
){

paymentProcessing = false;

console.log("INVALID PAYMENT RESPONSE");

alert("Payment not completed");

return;

}


try{

const verifyRes =
await fetch(

"https://hridh-backend.onrender.com/api/payment/verify-payment",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

razorpay_order_id:
response.razorpay_order_id,

razorpay_payment_id:
response.razorpay_payment_id,

razorpay_signature:
response.razorpay_signature,


orderData:{

name:name,

phone:phone,

address:address,

city:city,

pincode:pincode,

items:
cart.map(i=>i.id),

/* IMPORTANT: send product names */

itemsData:
cart.map(i=>({

id: i.id,

name: i.name,

tagline: i.tagline,

code: i.productId

})),

total:total

}

})

}

);


const result =
await verifyRes.json();


console.log("VERIFY RESPONSE:", result);


if(!result.success){

paymentProcessing = false;

console.log("VERIFY FAILED FULL RESPONSE:");
console.log(result);

alert(
"Verification failed. Check console log."
);

return;

}


/* store certificate url */

localStorage.setItem(

"certificateUrls",

JSON.stringify(
result.certificateUrls
)

);


/* store order */

localStorage.setItem(

"lastOrder",

JSON.stringify({

items:
cart.map(i=>i.id)

})

);


/* clear cart */

localStorage.removeItem("cart");


console.log("PAYMENT VERIFIED SUCCESSFULLY");


/* redirect */

window.location.href =
"success.html";


}
catch(err){

paymentProcessing = false;

console.log("VERIFY SERVER ERROR:", err);

alert("Server error during verification");

}

}

};


/* if popup closed */

options.modal = {

ondismiss: function(){

paymentProcessing = false;

console.log("USER CLOSED PAYMENT POPUP");

}

};


const rzp =
new Razorpay(options);


/* failure event */

rzp.on(

"payment.failed",

function(response){

paymentProcessing = false;

console.log("RAZORPAY FAILURE EVENT:");
console.log(response);

alert(
"Payment failed. Please try again."
);

}

);


rzp.open();

});