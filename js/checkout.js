document.getElementById("checkout-form").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const address = document.getElementById("address").value;

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart.length === 0){

alert("Your cart is empty");
return;

}

const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);


const orderRes = await fetch("http://localhost:5000/api/payment/create-order",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
amount: total,
productId: cart[0].id
})
});

const orderData = await orderRes.json();


const options = {

key: "rzp_test_SRQJ5gWZjy9rqr",

amount: orderData.amount,

currency: "INR",

order_id: orderData.id,

name: "HRIDH",

description: "Hand Painted Textile Art",

handler: async function (response) {

const verifyRes = await fetch("http://localhost:5000/api/payment/verify-payment",{

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
items:cart.map(i=>i.id),   // ✅ FIXED
total:total

}

})

});

const result = await verifyRes.json();

if(result.success){

localStorage.setItem("lastOrder", JSON.stringify({
productId: cart[0].id
}));

localStorage.removeItem("cart");

window.location.href="success.html";

}else{

alert("Payment verification failed");

}

}

};

const rzp = new Razorpay(options);

rzp.open();

});