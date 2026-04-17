function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {

  const cart = getCart();

  const existing = cart.find(p => p.id === product.id);

  if (existing) {

    showToast("Only one piece available");
    return;

  }

  cart.push({ ...product, qty: 1 });

  saveCart(cart);
  updateCartCount();
}

function increaseQty(id) {

  showToast("Only one piece available");

}

function decreaseQty(id) {

  let cart = getCart();

  cart = cart.filter(p => p.id !== id);

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function updateCartCount() {

  const cart = getCart();

  const count = cart.length;

  const el = document.getElementById("cart-count");

  if (!el) return;

  if (count === 0) {

    el.innerText = "";

  } else {

    el.innerText = count;

  }

}

function renderCart(){

const cartItemsDiv = document.getElementById("cart-items");
const totalDiv = document.getElementById("total");

if(!cartItemsDiv) return;

const cart = getCart();

cartItemsDiv.innerHTML = "";

let total = 0;

if(cart.length === 0){

cartItemsDiv.innerHTML = `
<div class="empty-cart">
<p>Your cart is empty</p>
<br>
<a href="index.html">Continue shopping</a>
</div>
`;

totalDiv.innerText = "";
return;
}

cart.forEach(item => {

total += item.price;

const div = document.createElement("div");

div.className = "cart-item";

div.innerHTML = `

<img src="${item.images[0]}">

<div>

<h3>${item.name}</h3>

<div class="cart-price">
₹${item.price}
</div>

<button class="remove-btn"
onclick="decreaseQty(${item.id})">

Remove

</button>

</div>

`;

cartItemsDiv.appendChild(div);

});

totalDiv.innerText = "₹" + total;

}

const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {

  checkoutBtn.addEventListener("click", () => {

    const cart = getCart();

    if (cart.length === 0) {

      alert("Your cart is empty");
      return;

    }

    window.location.href = "checkout.html";

  });

}