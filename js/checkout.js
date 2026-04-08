document.getElementById("checkout-form").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const address = document.getElementById("address").value;
const city = document.getElementById("city").value;
const pincode = document.getElementById("pincode").value;

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart.length === 0){

alert("Your cart is empty");
return;

}

/* FIX: correct total calculation */
const total = cart.reduce((sum,item)=>sum+item.price,0);


/* create order */

const orderRes = await fetch(
"https://hridh-backend.onrender.com/api/payment/create-order",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

amount: total,

items: cart.map(p=>p.id)

})

});

const orderData = await orderRes.json();


/* razorpay */

const options = {

key: "rzp_test_SRQJ5gWZjy9rqr",

amount: orderData.amount,

currency: "INR",

order_id: orderData.id,

name: "HRIDH",

description: "Original Textile Artwork",

handler: async function (response) {

const verifyRes = await fetch(
"https://hridh-backend.onrender.com/api/payment/verify-payment",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

razorpay_order_id: response.razorpay_order_id,

razorpay_payment_id: response.razorpay_payment_id,

razorpay_signature: response.razorpay_signature,

orderData:{

name:name,

phone:phone,

address:address,

city:city,

pincode:pincode,

items:cart.map(i=>i.id),

total:total

}

})

});

const result = await verifyRes.json();

if(result.success){

/* auto download certificate */

const link = document.createElement("a");

link.href =
"https://hridh-backend.onrender.com" +
result.certificateUrl;

link.download = "HRIDH-Certificate.pdf";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);


/* store order */

localStorage.setItem(

"lastOrder",

JSON.stringify({

items: cart.map(i=>i.id)

})

);


/* clear cart */

localStorage.removeItem("cart");


/* redirect */

setTimeout(()=>{

window.location.href="success.html";

},1200);


}else{

alert("Payment verification failed");

}

}

};


const rzp = new Razorpay(options);

rzp.open();

});