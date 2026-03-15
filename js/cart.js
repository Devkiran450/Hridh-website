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
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += 1;
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function decreaseQty(id) {
  let cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");

  if (!cartItemsDiv) return;

  const cart = getCart();
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerText = "";
    return;
  }

  cart.forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.images[0]}" />
      <div>
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>

        <div class="qty-controls">
          <button onclick="decreaseQty(${item.id})">−</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${item.id})">+</button>
        </div>
      </div>
    `;

    cartItemsDiv.appendChild(div);
  });

  totalDiv.innerText = "Total: ₹" + total;
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