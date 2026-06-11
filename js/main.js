document.addEventListener("DOMContentLoaded", updateCartCount);
document.addEventListener("DOMContentLoaded", function () {

const container = document.getElementById("products");
const searchInput = document.getElementById("nav-search-input");

/* ---------------- TOAST ---------------- */

window.showToast = function(message){

const toast = document.getElementById("toast");

if(!toast) return;

toast.innerText = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2000);

}

/* ---------------- PRODUCTS ---------------- */

function renderProducts(list){

if(!container) return;

container.innerHTML="";

list.forEach(product=>{

const card=document.createElement("div");

card.className="product-card";

card.innerHTML=`

<div class="product-image">

${product.sold ? `<div class="sold-badge">SOLD</div>` : ""}

<img src="${product.images[0]}">

</div>

<div class="product-card-content">

<h3>${product.name}</h3>

<p class="product-tagline">
${product.tagline || ""}
</p>

<p class="product-code">

${product.productId || product.code}

</p>

<div class="deal-badge">

Launch Offer

</div>

<div class="price-row">

<span class="discount">

-${Math.round(((product.originalPrice-product.price)/product.originalPrice)*100)}%

</span>

<span class="final-price">

₹${product.price}

</span>

<span class="mrp">

₹${product.originalPrice}

</span>

</div>

<button class="cart-btn"></button>

</div>

`;

const btn=card.querySelector(".cart-btn");

/* qty */

function getQty(){

const cart=getCart();

const item=cart.find(p=>p.id===product.id);

return item ? item.qty : 0;

}

/* render button */

function renderBtn(){

if(product.sold){

card.classList.add("sold-item");

btn.style.display="none";

return;

}

const qty=getQty();

if(qty===0){

btn.innerText="Add to Cart";

btn.classList.remove("qty-mode");

}

else{

btn.innerHTML=`

<span class="qty-btn decrease">−</span>

<span class="quantity">${qty}</span>

<span class="qty-btn increase">+</span>

`;

btn.classList.add("qty-mode");

}

}

renderBtn();

/* button click */

btn.addEventListener("click",function(e){

e.stopPropagation();

if(product.sold) return;

const target=e.target;

const qty=getQty();

if(qty===0 && !target.classList.contains("qty-btn")){

addToCart(product);

showToast("Added to cart");

}

if(target.classList.contains("increase")){

showToast("Only one piece available");

}

if(target.classList.contains("decrease")){

decreaseQty(product.id);

}

renderBtn();

setTimeout(()=>updateCartCount(),0);

});

/* click card */

card.querySelector("img").onclick=()=>{

window.location.href=`product.html?id=${product.id}`;

};

card.querySelector("h3").onclick=()=>{

window.location.href=`product.html?id=${product.id}`;

};

container.appendChild(card);

});

}

/* ---------------- SOLD PRODUCTS ---------------- */

async function loadSoldProducts(){

try{

const res=await fetch("https://hridh-backend.onrender.com/api/products/sold-products");

const soldIds=await res.json();

localStorage.setItem("soldProducts",JSON.stringify(soldIds));

products.forEach(p=>{

if(soldIds.includes(p.id)){

p.sold=true;

}

});

}

catch{

const cached=JSON.parse(localStorage.getItem("soldProducts")) || [];

products.forEach(p=>{

if(cached.includes(p.id)){

p.sold=true;

}

});

}

}

/* ---------------- INIT ---------------- */

async function init(){

await loadSoldProducts();

renderProducts(products);

updateCartCount();

}

init();

/* ---------------- SEARCH ---------------- */

if(searchInput){

searchInput.addEventListener("input",function(){

const term=this.value.toLowerCase();

const filtered=products.filter(p=>

p.name.toLowerCase().includes(term)

||

(p.productId && p.productId.toLowerCase().includes(term))

);

renderProducts(filtered);

});

}

/* ---------------- FAQ ---------------- */

document.querySelectorAll(".faq-question").forEach(btn=>{

btn.addEventListener("click",()=>{

const faq=btn.parentElement;

const answer=faq.querySelector(".faq-answer");

if(faq.classList.contains("active")){

faq.classList.remove("active");

answer.style.maxHeight=null;

}

else{

faq.classList.add("active");

answer.style.maxHeight=answer.scrollHeight+"px";

}

});

});

/* ---------------- HERO ---------------- */

const slides=document.querySelectorAll(".slide");

let index=0;

function showSlide(){

slides.forEach(s=>s.classList.remove("active"));

slides[index].classList.add("active");

index++;

if(index>=slides.length){

index=0;

}

}

setInterval(showSlide,4000);

/* ---------------- MOBILE MENU ---------------- */

const toggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".nav");

if(toggle){

toggle.addEventListener("click",()=>{

nav.classList.toggle("active");

toggle.classList.toggle("open");

});

}

});

