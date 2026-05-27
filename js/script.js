// ===============================
// SHOPHUB COMPLETE SYSTEM
// ===============================

// LOCAL STORAGE KEYS
const CART_KEY = "ShopHub_Cart";
const USER_KEY = "ShopHub_User";

// LOAD CART
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

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
// UPDATE CART BADGE
// ===============================
function updateCartBadge() {

    const badges =
        document.querySelectorAll("#cartBadge");

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    badges.forEach(badge => {

        badge.innerText = total;

        if (total <= 0) {

            badge.style.display = "none";

        } else {

            badge.style.display = "inline-block";
        }
    });
}

// ===============================
// ADD TO CART
// ===============================
function addToCart(product) {

    const existing =
        cart.find(item => item.id === product.id);

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
// REMOVE FROM CART
// ===============================
window.removeFromCart = function(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();

    renderCartPage();
};

// ===============================
// CHANGE QUANTITY
// ===============================
window.changeQuantity = function(id, amount) {

    const item =
        cart.find(product => product.id === id);

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
        
        <div class="card p-5 text-center border-0 shadow-sm">

            <i class="bi bi-cart-x display-1 text-muted"></i>

            <h3 class="fw-bold mt-3">
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
        
        <div class="card border-0 shadow-sm mb-3 p-3">

            <div class="row align-items-center">

                <div class="col-md-2 col-4">

                    <img src="${item.img}"
                         class="img-fluid rounded"
                         style="height:80px;width:100%;object-fit:cover;">

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
    
    <div class="card border-0 shadow-sm p-4">

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

       <button class="btn btn-danger w-100 mt-4"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#checkoutSection">

    Proceed To Checkout

</button>

<!-- CHECKOUT FORM -->
<div class="collapse mt-4" id="checkoutSection">

    <div class="card card-body border-0 bg-light">

        <h5 class="fw-bold mb-3">
            Delivery Details
        </h5>

        <form id="checkoutForm">

            <div class="mb-3">

                <label class="form-label">
                    Full Name
                </label>

                <input type="text"
                       id="customerName"
                       class="form-control"
                       placeholder="Enter your name">

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Phone Number
                </label>

                <input type="tel"
                       id="customerPhone"
                       class="form-control"
                       placeholder="Enter phone number">

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Address
                </label>

                <textarea id="customerAddress"
                          class="form-control"
                          rows="3"
                          placeholder="Enter delivery address"></textarea>

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Payment Method
                </label>

                <select id="paymentMethod"
                        class="form-select">

                    <option value="">
                        Select Payment
                    </option>

                    <option value="COD">
                        Cash On Delivery
                    </option>

                    <option value="UPI">
                        UPI
                    </option>

                    <option value="Card">
                        Debit/Credit Card
                    </option>

                </select>

            </div>

            <button type="submit"
                    class="btn btn-success w-100">

                Place Order

            </button>

        </form>

    </div>

</div>
    `;
}

// ===============================
// PRODUCT SEARCH + FILTER
// ===============================
function setupSearchAndFilter() {

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const cards =
        document.querySelectorAll(".col-xl-3");

    if (!searchInput || !categoryFilter) return;

    function filterProducts() {

        const search =
            searchInput.value.toLowerCase();

        const category =
            categoryFilter.value;

        cards.forEach(card => {

            const name =
                card.querySelector("h6")
                ?.innerText.toLowerCase();

            const cat =
                card.querySelector(".small")
                ?.innerText;

            const matchSearch =
                name.includes(search);

            const matchCategory =
                category === "all" ||
                cat === category;

            if (matchSearch && matchCategory) {

                card.style.display = "block";

            } else {

                card.style.display = "none";
            }
        });
    }

    searchInput.addEventListener(
        "keyup",
        filterProducts
    );

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );
}

// ===============================
// DARK MODE
// ===============================
function setupTheme() {

    const themeBtn =
        document.getElementById("themeBtn");

    if (!themeBtn) return;

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    });
}

// ===============================
// LOGIN SYSTEM
// ===============================
function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        // EMAIL VALIDATION
        if (email === "") {

            alert("Please enter email 📧");

            return;
        }

        // PASSWORD VALIDATION
        if (password.length !== 6) {

            alert("Password must be 6 digits 🔐");

            return;
        }

        // SAVE USER
        localStorage.setItem(
            USER_KEY,
            JSON.stringify({
                email: email
            })
        );

        alert("Login Successful ✅");

        // REDIRECT
        window.location.href = "index.html";

    });
}

// ===============================
// CHECKOUT SYSTEM
// ===============================
// ===============================
// CHECKOUT SYSTEM
// ===============================
document.addEventListener("submit", function(e) {

    if (e.target.id === "checkoutForm") {

        e.preventDefault();

        const user =
            JSON.parse(
                localStorage.getItem(USER_KEY)
            );

        // LOGIN CHECK
        if (!user) {

            alert("Please login first 🔐");

            window.location.href =
                "login.html";

            return;
        }

        // FORM DATA
        const name =
            document.getElementById("customerName").value;

        const phone =
            document.getElementById("customerPhone").value;

        const address =
            document.getElementById("customerAddress").value;

        const payment =
            document.getElementById("paymentMethod").value;

        // VALIDATION
        if (
            !name ||
            !phone ||
            !address ||
            !payment
        ) {

            alert(
                "Please fill all details ⚠️"
            );

            return;
        }

        // SUCCESS
        alert(
            "Order Placed Successfully 🎉"
        );

        // CLEAR CART
        cart = [];

        saveCart();

        renderCartPage();
    }
});

// ===============================
// DOM LOADED
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    () => {

    updateCartBadge();

    setupTheme();

    setupSearchAndFilter();

    setupLogin();

    // PRODUCT BUTTONS
    const cards =
        document.querySelectorAll(
            ".sh-product-card"
        );

    cards.forEach(card => {

        const btn =
            card.querySelector(".btn-coral");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const name =
                card.querySelector("h6")
                ?.innerText;

            const category =
                card.querySelector(".small")
                ?.innerText;

            const priceText =
                card.querySelector(".text-danger")
                ?.innerText;

            const price =
                parseInt(
                    priceText.replace(/[^\d]/g, "")
                );

            const img =
                card.querySelector("img").src;

            const product = {

                id: name
                    .replace(/\s+/g, "_")
                    .toLowerCase(),

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
        window.location.pathname.includes(
            "cart.html"
        )
    ) {

        renderCartPage();
    }
});