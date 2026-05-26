// ===============================
// SHOPHUB CART SYSTEM
// ===============================


// CART STORAGE KEY
const CART_KEY = "ShopHub_Cart";

// LOAD CART
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

// STORAGE SYNC
window.addEventListener("storage", () => {

    cart = JSON.parse(
        localStorage.getItem(CART_KEY)
    ) || [];

    updateCartBadge();

    renderCartPage();
});

// ===============================
// UPDATE CART BADGE
// ===============================
function updateCartBadge() {

    const badges = document.querySelectorAll("#cartBadge");

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    badges.forEach(badge => {

        badge.textContent = total;

        if (total <= 0) {
            badge.style.display = "none";
        } else {
            badge.style.display = "inline-block";
        }

    });
}

// ===============================
// SAVE CART
// ===============================
function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartBadge();
}

// ===============================
// ADD TO CART
// ===============================
function addToCart(product) {

    const existing = cart.find(
        item => item.id === product.id
    );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    alert(product.name + " added to cart 🛒");
}

// ===============================
// REMOVE PRODUCT
// ===============================
window.removeFromCart = function(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    saveCart();

    renderCartPage();
};

// ===============================
// CHANGE QUANTITY
// ===============================
window.changeQuantity = function(id, amount) {

    const item = cart.find(
        product => product.id === id
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(id);

        return;
    }

    saveCart();

    renderCartPage();
};

// ===============================
// RENDER CART PAGE
// ===============================
function renderCartPage() {

    const cartItems =
        document.getElementById("cart-items");

    const cartSummary =
        document.getElementById("cart-summary");

    if (!cartItems || !cartSummary) return;

    // EMPTY CART
    if (cart.length === 0) {

        cartItems.innerHTML = `
        
        <div class="card shadow-sm border-0 p-5 text-center">

            <i class="bi bi-cart-x display-1 text-muted"></i>

            <h3 class="mt-3 fw-bold">
                Your cart is empty
            </h3>

            <p class="text-muted">
                Add products to your shopping cart
            </p>

            <a href="products.html"
               class="btn btn-danger mt-3">
               Shop Now
            </a>

        </div>
        
        `;

        cartSummary.innerHTML = "";

        return;
    }

    let itemsHTML = "";

    let subtotal = 0;

    cart.forEach(item => {

        const total =
            item.price * item.quantity;

        subtotal += total;

        itemsHTML += `
        
        <div class="card shadow-sm border-0 mb-3 p-3">

            <div class="row align-items-center">

                <div class="col-md-2 col-4">

                    <img src="${item.img}"
                         class="img-fluid rounded"
                         style="height:80px;
                                width:100%;
                                object-fit:cover;">

                </div>

                <div class="col-md-4 col-8">

                    <h5 class="fw-bold">
                        ${item.name}
                    </h5>

                    <p class="text-muted mb-0">
                        ${item.category}
                    </p>

                </div>

                <div class="col-md-3 col-6 mt-3 mt-md-0">

                    <div class="d-flex align-items-center">

                        <button class="btn btn-outline-dark btn-sm"
                            onclick="changeQuantity('${item.id}', -1)">
                            -
                        </button>

                        <span class="mx-3 fw-bold">
                            ${item.quantity}
                        </span>

                        <button class="btn btn-outline-dark btn-sm"
                            onclick="changeQuantity('${item.id}', 1)">
                            +
                        </button>

                    </div>

                </div>

                <div class="col-md-3 col-6 text-end mt-3 mt-md-0">

                    <h5 class="text-danger fw-bold">
                        ₹${total.toLocaleString("en-IN")}
                    </h5>

                    <button class="btn btn-sm text-danger"
                        onclick="removeFromCart('${item.id}')">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </div>

        </div>
        
        `;
    });

    cartItems.innerHTML = itemsHTML;

    cartSummary.innerHTML = `
    
    <div class="card shadow-sm border-0 p-4">

        <h4 class="fw-bold mb-4">
            Order Summary
        </h4>

        <div class="d-flex justify-content-between mb-2">

            <span>Subtotal</span>

            <span>
                ₹${subtotal.toLocaleString("en-IN")}
            </span>

        </div>

        <div class="d-flex justify-content-between mb-3">

            <span>Shipping</span>

            <span class="text-success">
                FREE
            </span>

        </div>

        <hr>

        <div class="d-flex justify-content-between">

            <h5>Total</h5>

            <h5 class="text-danger fw-bold">
                ₹${subtotal.toLocaleString("en-IN")}
            </h5>

        </div>

        <button class="btn btn-danger w-100 mt-4">
            Proceed To Checkout
        </button>

    </div>
    
    `;
}

// ===============================
// PRODUCT BUTTON EVENTS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    updateCartBadge();

    // PRODUCT PAGE
    const cards =
        document.querySelectorAll(".sh-product-card");

    cards.forEach((card, index) => {

        const btn =
            card.querySelector(".btn-coral");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const name =
                card.querySelector("h6").innerText;

            const category =
                card.querySelector(".small").innerText;

            const priceText =
                card.querySelector(".text-danger").innerText;

            const price =
                parseInt(
                    priceText.replace(/[^\d]/g, "")
                );

            const img =
                card.querySelector("img").src;

            const product = {

                id: "product_" + index,

                name,

                category,

                price,

                img
            };

            addToCart(product);
        });

    });

    // CART PAGE
    if (
        window.location.pathname.includes("cart.html")
    ) {
        renderCartPage();
    }

});