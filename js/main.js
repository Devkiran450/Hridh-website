const container = document.getElementById("products");
const searchInput = document.getElementById("nav-search-input");

/* ===== RENDER PRODUCTS ===== */
function renderProducts(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <p style="color:#777;text-align:center;">
        No products found
      </p>
    `;
    return;
  }

  list.forEach(product => {
    const discount = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}" />
      <div class="product-card-content">
        <h3>${product.name}</h3>
        <p class="product-code">${product.code}</p>

        ${
          product.originalPrice
            ? `
          <div class="deal-badge">Launch Offer</div>
          <div class="price-row">
            <span class="discount">-${discount}%</span>
            <span class="final-price">₹${product.price}</span>
          </div>
          <div class="mrp">
            M.R.P: <span>₹${product.originalPrice}</span>
          </div>
        `
            : `<p>₹${product.price}</p>`
        }

        <button>Add to Cart</button>
      </div>
    `;

    /* ===== NAVIGATION TO PRODUCT PAGE ===== */
    card.querySelector("img").addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    card.querySelector("h3").addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    /* ===== ADD TO CART ===== */
    card.querySelector("button").addEventListener("click", e => {
      e.stopPropagation();
      addToCart(product);
    });

    container.appendChild(card);
  });
}

/* ===== INITIAL LOAD ===== */
renderProducts(products);
updateCartCount();

/* ===== LIVE SEARCH ===== */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();

  if (!q) {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(q)
  );

  renderProducts(filtered);
});

/* ===== SLIDER LOGIC ===== */
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");

  currentSlide = index;
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index));
});

setInterval(() => {
  if (slides.length === 0) return;
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}, 4500);