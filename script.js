// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000";  // Change this to your backend URL in production

// ============================================================
// TELEGRAM WEBAPP INITIALIZATION
// ============================================================

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setBackgroundColor("#ffffff");
    tg.setHeaderColor("#ffffff");
}

// Get Telegram user data
const telegramUser = tg?.initDataUnsafe?.user;
const telegramInitData = tg?.initData;

// Admin IDs (can be fetched from backend)
const ADMIN_IDS = [7771150533];
const isAdmin = telegramUser && ADMIN_IDS.includes(telegramUser.id);

// ============================================================
// GLOBAL STATE
// ============================================================

let products = [];
let cart = [];
let selectedCategory = "all";
let isLoading = false;

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
    await initializeApp();
});

async function initializeApp() {
    // Show/hide admin button
    if (isAdmin) {
        document.getElementById("adminPanelBtn").classList.remove("hidden");
    }

    // Load products
    await loadProducts();

    // Setup event listeners
    setupEventListeners();

    // Load cart from localStorage
    loadCartFromLocalStorage();
}

// ============================================================
// API FUNCTIONS
// ============================================================

async function apiCall(endpoint, method = "GET", body = null) {
    // """
    // Make API call with Telegram authentication.
    // Telegram initData is sent in X-Telegram-Init-Data header.
    // """
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-Telegram-Init-Data": telegramInitData || "",
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

async function loadProducts() {
    // """Load products from API"""
    try {
        showLoading();
        products = await apiCall("/api/products");
        renderProducts();
        hideLoading();
    } catch (error) {
        showError(`Mebellarni yuklab bo'lmadi: ${error.message}`);
        hideLoading();
    }
}

// ============================================================
// PRODUCT RENDERING & FILTERING
// ============================================================

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    const emptyState = document.getElementById("emptyState");

    grid.innerHTML = "";

    const filtered = selectedCategory === "all"
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (filtered.length === 0) {
        grid.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    grid.classList.remove("hidden");
    emptyState.classList.add("hidden");

    filtered.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <div class="product-card-image">
            <img src="${product.media_url}" alt="${product.title}" 
                 onerror="this.src='https://via.placeholder.com/200?text=Mebel'" 
                 loading="lazy">
        </div>
        <div class="product-card-info">
            <div class="product-category">${product.category}</div>
            <div class="product-title">${product.title}</div>
            <div class="product-price">${formatPrice(product.price)}</div>
        </div>
        ${isAdmin ? `<button class="product-card-delete" onclick="deleteProduct(${product.id})">✕</button>` : ""}
    `;

    card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("product-card-delete")) {
            showProductDetailModal(product);
        }
    });

    return card;
}

// ============================================================
// PRODUCT DETAIL MODAL
// ============================================================

function showProductDetailModal(product) {
    const content = document.getElementById("productDetailContent");
    content.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.media_url}" alt="${product.title}" 
                 onerror="this.src='https://via.placeholder.com/300?text=Mebel'">
        </div>
        <div class="product-detail-info">
            <div class="product-detail-category">${product.category}</div>
            <h2 class="product-detail-title">${product.title}</h2>
            <div class="product-detail-price">${formatPrice(product.price)}</div>
            
            <div class="product-detail-description">
                ${product.description || "Tavsif yo'q"}
            </div>

            <div class="product-detail-specs">
                ${product.height ? `<div><strong>Balandligi:</strong> ${product.height}</div>` : ""}
                ${product.width ? `<div><strong>Eni:</strong> ${product.width}</div>` : ""}
                ${product.material ? `<div><strong>Materiali:</strong> ${product.material}</div>` : ""}
                ${product.color ? `<div><strong>Rangi:</strong> ${product.color}</div>` : ""}
            </div>
        </div>
    `;

    // Store product ID for add to cart
    document.getElementById("addToCartBtn").dataset.productId = product.id;

    document.getElementById("productDetailModal").classList.remove("hidden");
}

function closeProductDetailModal() {
    document.getElementById("productDetailModal").classList.add("hidden");
}

document.getElementById("addToCartBtn")?.addEventListener("click", () => {
    const productId = parseInt(document.getElementById("addToCartBtn").dataset.productId);
    addToCart(productId);
    closeProductDetailModal();
});

// ============================================================
// CART MANAGEMENT
// ============================================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product_id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product_id: productId,
            title: product.title,
            price: product.price,
            quantity: 1,
        });
    }

    saveCartToLocalStorage();
    updateCartBadge();
    showToast(`"${product.title}" savatga qo'shildi`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    saveCartToLocalStorage();
    updateCartBadge();
    renderCartModal();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.product_id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCartToLocalStorage();
        updateCartBadge();
        renderCartModal();
    }
}

function updateCartBadge() {
    const badge = document.getElementById("cartCount");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

function saveCartToLocalStorage() {
    localStorage.setItem("shod_mebel_cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem("shod_mebel_cart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCartBadge();
        } catch (e) {
            console.error("Error loading cart:", e);
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ============================================================
// CART MODAL
// ============================================================

function showCartModal() {
    renderCartModal();
    document.getElementById("cartModal").classList.remove("hidden");
}

function closeCartModal() {
    document.getElementById("cartModal").classList.add("hidden");
}

function renderCartModal() {
    const cartItemsDiv = document.getElementById("cartItems");
    const emptyDiv = document.getElementById("cartEmpty");
    const summaryDiv = document.getElementById("cartSummary");

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "";
        emptyDiv.classList.remove("hidden");
        summaryDiv.classList.add("hidden");
    } else {
        emptyDiv.classList.add("hidden");
        summaryDiv.classList.remove("hidden");

        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.product_id}, ${item.quantity - 1})" 
                            class="qty-btn">−</button>
                    <input type="number" value="${item.quantity}" readonly class="qty-input">
                    <button onclick="updateCartQuantity(${item.product_id}, ${item.quantity + 1})" 
                            class="qty-btn">+</button>
                </div>
                <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
                <button onclick="removeFromCart(${item.product_id})" class="cart-item-delete">✕</button>
            </div>
        `).join("");

        document.getElementById("cartTotal").textContent = formatPrice(getCartTotal());
    }
}

document.getElementById("cartBtn")?.addEventListener("click", showCartModal);

document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    closeCartModal();
    showOrderModal();
});

// ============================================================
// ORDER MODAL & SUBMISSION
// ============================================================

function showOrderModal() {
    document.getElementById("orderItemCount").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("orderTotalPrice").textContent = formatPrice(getCartTotal());
    document.getElementById("orderModal").classList.remove("hidden");
}

function closeOrderModal() {
    document.getElementById("orderModal").classList.add("hidden");
}

document.getElementById("orderForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
        showToast("Savatcha bo'sh!", "error");
        return;
    }

    const orderData = {
        customer_name: document.getElementById("orderName").value,
        customer_phone: document.getElementById("orderPhone").value,
        customer_address: document.getElementById("orderAddress").value,
        items: cart,
        total_price: getCartTotal(),
    };

    try {
        showLoading();
        const result = await apiCall("/api/orders", "POST", orderData);
        showToast(`Buyurtma qabul qilindi! ID: #${result.order_id}`, "success");
        
        // Clear cart
        cart = [];
        saveCartToLocalStorage();
        updateCartBadge();
        
        closeOrderModal();
        hideLoading();

        // Show confirmation
        setTimeout(() => {
            alert(`Buyurtmangiz qabul qilindi!\nBuyurtma raqami: #${result.order_id}`);
        }, 500);
    } catch (error) {
        showToast(`Buyurtmani yuborishda xatolik: ${error.message}`, "error");
        hideLoading();
    }
});

// ============================================================
// CUSTOM FURNITURE ORDER
// ============================================================

document.getElementById("customOrderForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const orderData = {
        customer_name: document.getElementById("customName").value,
        customer_phone: document.getElementById("customPhone").value,
        furniture_type: document.getElementById("customFurnitureType").value,
        width: document.getElementById("customWidth").value,
        height: document.getElementById("customHeight").value,
        depth: document.getElementById("customDepth").value || "",
        material: document.getElementById("customMaterial").value,
        color: document.getElementById("customColor").value,
        quantity: parseInt(document.getElementById("customQuantity").value),
        description: document.getElementById("customDescription").value,
    };

    try {
        showLoading();
        const result = await apiCall("/api/custom-orders", "POST", orderData);
        showToast(`Buyurtma qabul qilindi! ID: #${result.order_id}`, "success");
        
        document.getElementById("customOrderForm").reset();
        closeCustomOrderModal();
        hideLoading();

        setTimeout(() => {
            alert(`Buyurtmangiz qabul qilindi!\nBuyurtma raqami: #${result.order_id}\nTez orada siz bilan bog'lanamiz.`);
        }, 500);
    } catch (error) {
        showToast(`Buyurtmani yuborishda xatolik: ${error.message}`, "error");
        hideLoading();
    }
});

function closeCustomOrderModal() {
    document.getElementById("customOrderModal").classList.add("hidden");
}

// ============================================================
// ADMIN PANEL
// ============================================================

function showAdminPanelModal() {
    if (!isAdmin) {
        showToast("Faqat administratorlar uchun!", "error");
        return;
    }
    document.getElementById("adminPanelModal").classList.remove("hidden");
    loadAdminProducts();
}

function closeAdminPanelModal() {
    document.getElementById("adminPanelModal").classList.add("hidden");
}

async function loadAdminProducts() {
    try {
        const adminProducts = await apiCall("/api/products");
        const list = document.getElementById("adminProductsList");

        list.innerHTML = adminProducts.map(product => `
            <div class="admin-product-item">
                <img src="${product.media_url}" alt="${product.title}" class="admin-product-image">
                <div class="admin-product-info">
                    <div class="admin-product-title">${product.title}</div>
                    <div class="admin-product-category">${product.category}</div>
                    <div class="admin-product-price">${formatPrice(product.price)}</div>
                </div>
                <button onclick="deleteProduct(${product.id})" class="admin-product-delete">🗑️</button>
            </div>
        `).join("");
    } catch (error) {
        showToast(`Mebellarni yuklashda xatolik: ${error.message}`, "error");
    }
}

async function deleteProduct(productId) {
    if (!isAdmin) {
        showToast("Faqat administratorlar o'chira oladi!", "error");
        return;
    }

    if (!confirm("Ushbu mebelni o'chirmoqchimisiz?")) return;

    try {
        await apiCall(`/api/products/${productId}`, "DELETE");
        showToast("Mebel o'chirildi", "success");
        await loadProducts();
        loadAdminProducts();
    } catch (error) {
        showToast(`O'chirishda xatolik: ${error.message}`, "error");
    }
}

document.getElementById("adminPanelBtn")?.addEventListener("click", showAdminPanelModal);

document.getElementById("adminAddProductBtn")?.addEventListener("click", () => {
    document.getElementById("adminAddProductModal").classList.remove("hidden");
});

function closeAdminAddProductModal() {
    document.getElementById("adminAddProductModal").classList.add("hidden");
}

document.getElementById("adminAddProductForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
        title: document.getElementById("adminProdTitle").value,
        category: document.getElementById("adminProdCategory").value,
        price: parseFloat(document.getElementById("adminProdPrice").value),
        media_url: document.getElementById("adminProdImageUrl").value,
        description: document.getElementById("adminProdDescription").value,
        height: document.getElementById("adminProdHeight").value,
        width: document.getElementById("adminProdWidth").value,
        material: document.getElementById("adminProdMaterial").value,
        color: document.getElementById("adminProdColor").value,
        is_custom: false,
    };

    try {
        showLoading();
        await apiCall("/api/products", "POST", productData);
        showToast("Mebel qo'shildi", "success");
        document.getElementById("adminAddProductForm").reset();
        closeAdminAddProductModal();
        await loadProducts();
        loadAdminProducts();
        hideLoading();
    } catch (error) {
        showToast(`Mahsulot qo'shishda xatolik: ${error.message}`, "error");
        hideLoading();
    }
});

// Admin tabs
document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".admin-tab-content").forEach(t => t.classList.add("hidden"));
        
        e.target.classList.add("active");
        const tabId = e.target.dataset.tab + "Tab";
        document.getElementById(tabId).classList.remove("hidden");
    });
});

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    // Category buttons
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedCategory = e.target.dataset.cat;
            renderProducts();
        });
    });

    // Search
    document.getElementById("searchBtn")?.addEventListener("click", performSearch);
    document.getElementById("searchInput")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

function performSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    
    if (!query) {
        renderProducts();
        return;
    }

    const filtered = products.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    const grid = document.getElementById("productsGrid");
    const emptyState = document.getElementById("emptyState");

    if (filtered.length === 0) {
        grid.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    grid.classList.remove("hidden");
    emptyState.classList.add("hidden");
    grid.innerHTML = filtered.map(p => createProductCard(p)).map(el => el.outerHTML).join("");
}

// ============================================================
// UI UTILITIES
// ============================================================

function showLoading() {
    const grid = document.getElementById("productsGrid");
    if (grid && !grid.classList.contains("loading")) {
        grid.classList.add("loading");
    }
    isLoading = true;
}

function hideLoading() {
    const grid = document.getElementById("productsGrid");
    if (grid) {
        grid.classList.remove("loading");
    }
    isLoading = false;
}

function showError(message) {
    const errorState = document.getElementById("errorState");
    const errorMessage = document.getElementById("errorMessage");
    const grid = document.getElementById("productsGrid");

    grid.classList.add("hidden");
    errorMessage.textContent = message;
    errorState.classList.remove("hidden");
}

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}
