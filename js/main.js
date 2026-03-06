const container = document.getElementById("products");
const searchInput = document.getElementById("nav-search-input");

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function renderProducts(list) {
  container.innerHTML = "";

  list.forEach(product => {

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images[0]}" />
      <div class="product-card-content">
        <h3>${product.name}</h3>
        <p class="product-code">${product.code}</p>
        <div class="deal-badge">Launch Offer</div>
        <div class="price-row">
  <span class="discount">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
  <span class="final-price">₹${product.price}</span>
  <span class="mrp">₹${product.originalPrice}</span>
</div>
        <button>Add to Cart</button>
      </div>
    `;

    const btn = card.querySelector("button");

    function getQty() {
      const cart = getCart();
      const item = cart.find(p => p.id === product.id);
      return item ? item.qty : 0;
    }

    function renderBtn() {
  const qty = getQty();

  if (qty === 0) {
    btn.innerText = "Add to Cart";
    btn.classList.remove("qty-mode");
  } else {
    btn.innerHTML = `
      <span class="qty-btn decrease">−</span>
      <span class="quantity">${qty}</span>
      <span class="qty-btn increase">+</span>
    `;
    btn.classList.add("qty-mode");
  }
}

    renderBtn();

    btn.onclick = function(e) {
      e.stopPropagation();
      const qty = getQty();

      if (qty === 0) {
        addToCart(product);
        showToast("Added to cart");
      }

      if (e.target.classList.contains("increase")) increaseQty(product.id);
      if (e.target.classList.contains("decrease")) decreaseQty(product.id);

      renderBtn();
    };

    card.querySelector("img").onclick = () =>
      window.location.href = `product.html?id=${product.id}`;

    card.querySelector("h3").onclick = () =>
      window.location.href = `product.html?id=${product.id}`;

    container.appendChild(card);
  });
}

renderProducts(products);
updateCartCount();

document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {

    const faq = btn.parentElement;
    const answer = faq.querySelector(".faq-answer");

    if (faq.classList.contains("active")) {
      faq.classList.remove("active");
      answer.style.maxHeight = null;
    } else {
      faq.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }

  });
});