// --- 1. Cart Data Initialization ---
let cart = JSON.parse(localStorage.getItem('ShopHub_Cart')) || [];

// --- 2. Update Cart Navbar Badges ---
function updateCartBadge() {
    const badges = document.querySelectorAll('.position-absolute.badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems === 0 ? 'none' : 'inline-block';
    });
}

// --- 3. Core Add to Cart Function ---
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('ShopHub_Cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`${product.name} has been added to your cart! 🛒`);
    
    // If we are on the cart page, re-render it instantly
    if (window.location.href.indexOf('cart.html') !== -1) {
        renderCartPage();
    }
}

// --- 4. Quantity Controls (Exposed Globally) ---
window.changeQuantity = function(id, amount) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            window.removeFromCart(id);
            return;
        }
        localStorage.setItem('ShopHub_Cart', JSON.stringify(cart));
        renderCartPage();
        updateCartBadge();
    }
};

// --- 5. Remove Controls (Exposed Globally) ---
window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('ShopHub_Cart', JSON.stringify(cart));
    renderCartPage();
    updateCartBadge();
};

// --- 6. Render Cart Content Dynamically ---
function renderCartPage() {
    const cartItemsContainer = document.querySelector('.col-lg-8');
    const summaryContainer = document.querySelector('.col-lg-4');
    
    if (!cartItemsContainer || !summaryContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="card border-0 shadow-sm p-5 text-center">
                <i class="bi bi-cart-x text-muted display-1 mb-3"></i>
                <h4 class="fw-bold">Your cart is empty!</h4>
                <p class="text-muted">Browse our premium lineup to add items here.</p>
                <a href="products.html" class="btn btn-coral mx-auto mt-2 px-4">Shop Now</a>
            </div>
        `;
        updateSummary(0);
        return;
    }

    let itemsHTML = `<h2 class="fw-bold mb-4"><i class="bi bi-cart3 me-2 text-danger"></i>Your Shopping Cart</h2>`;
    let subtotal = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        itemsHTML += `
            <div class="card border-0 shadow-sm p-4 mb-3">
                <div class="row align-items-center g-3">
                    <div class="col-md-2 col-4">
                        <img src="${item.img}" alt="${item.name}" class="img-fluid rounded border" style="height: 70px; object-fit: cover; width: 100%;">
                    </div>
                    <div class="col-md-5 col-8">
                        <h5 class="fw-bold fs-6 mb-1">${item.name}</h5>
                        <p class="text-muted small mb-0">Category: ${item.category}</p>
                    </div>
                    <div class="col-md-3 col-6 d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary px-2 py-1" onclick="changeQuantity('${item.id}', -1)"><i class="bi bi-minus"></i></button>
                        <span class="mx-3 fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary px-2 py-1" onclick="changeQuantity('${item.id}', 1)"><i class="bi bi-plus"></i></button>
                    </div>
                    <div class="col-md-2 col-6 text-end">
                        <h5 class="fw-bold text-danger mb-0">₹${itemTotal.toLocaleString('en-IN')}</h5>
                        <button class="btn btn-sm text-muted p-0 mt-1" onclick="removeFromCart('${item.id}')"><i class="bi bi-trash3 me-1"></i>Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    updateSummary(subtotal);
}

// --- 7. Order Summary Ledger Render ---
function updateSummary(subtotal) {
    const summaryContainer = document.querySelector('.col-lg-4');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
        <div class="card border-0 shadow-sm p-4">
            <h4 class="fw-bold mb-4">Order Summary</h4>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal</span>
                <span class="fw-medium">₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Shipping Fee</span>
                <span class="text-success fw-medium">${subtotal > 0 ? 'FREE' : '₹0'}</span>
            </div>
            <hr class="my-3">
            <div class="d-flex justify-content-between mb-4">
                <h5 class="fw-bold">Total Amount</h5>
                <h4 class="fw-bold text-danger">₹${subtotal.toLocaleString('en-IN')}</h4>
            </div>
            <button class="btn btn-coral w-100 py-3 fw-bold" ${subtotal === 0 ? 'disabled' : ''} onclick="alert('Order Placed Successfully! 🎉')">Proceed to Checkout</button>
        </div>
    `;
}

// --- 8. Main DOM Event Handler ---
document.addEventListener("DOMContentLoaded", () => {
    // --- Dark Mode Logic ---
    const themeBtn = document.getElementById("themeBtn");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (themeBtn) themeBtn.innerHTML = '<i class="bi bi-sun-fill me-1"></i> Light';
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                themeBtn.innerHTML = '<i class="bi bi-sun-fill me-1"></i> Light';
                localStorage.setItem("theme", "dark");
            } else {
                themeBtn.innerHTML = '<i class="bi bi-moon-fill me-1"></i> Mode';
                localStorage.setItem("theme", "light");
            }
        });
    }

    // Refresh navbar badge count on load
    updateCartBadge();

    // --- Dynamic Card Configuration ---
    const productCards = document.querySelectorAll('.sh-product-card');
    
    productCards.forEach((card, index) => {
        const btn = card.querySelector('.btn-coral') || card.querySelector('.btn');
        if (btn) {
            btn.textContent = "Add to Cart";
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Fail-safe element selection
                const nameEl = card.querySelector('h5.fw-bold, h6.fw-bold, .card-title, h5');
                const priceEl = card.querySelector('.text-danger.fw-bold, h4.text-danger, h5.text-danger, .text-danger');
                const imgEl = card.querySelector('img');
                const catEl = card.querySelector('.text-muted, span.small');

                // Fallback assignments if elements are missing
                const name = nameEl ? nameEl.textContent.trim() : `Premium Item #${index + 1}`;
                const priceText = priceEl ? priceEl.textContent.trim() : "0";
                const price = parseInt(priceText.replace(/[^\d]/g, '')) || 999; 
                const img = imgEl ? imgEl.src : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
                const category = catEl ? catEl.textContent.trim() : "General";
                const id = "prod_" + name.replace(/\s+/g, '_').toLowerCase() + "_" + index;

                addToCart({ id, name, price, img, category });
            });
        }
    });

    // Check if on cart page
    if (window.location.href.indexOf('cart.html') !== -1 || document.getElementById('cart-items-wrapper')) {
        renderCartPage();
    }
});

// --- Product Search & Filter ---
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

if (searchInput && categoryFilter) {

    function filterProducts() {
        const searchValue = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;

        const cards = document.querySelectorAll(".sh-product-card");

        cards.forEach(card => {

            const productName = card.querySelector("h6").textContent.toLowerCase();

            const category = card.querySelector("span.small").textContent.trim();

            const matchesSearch = productName.includes(searchValue);

            const matchesCategory =
                categoryValue === "all" || category === categoryValue;

            if (matchesSearch && matchesCategory) {
                card.parentElement.style.display = "block";
            } else {
                card.parentElement.style.display = "none";
            }
        });
    }

    searchInput.addEventListener("keyup", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);
}
