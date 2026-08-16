const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

// Telegram admin ID tekshiruvi (O'zingizning Telegram ID'ingizni yozing)
const userTelegramId = tg?.initDataUnsafe?.user?.id;
const ADMIN_IDS = [7771150533]; 
const isAdmin = ADMIN_IDS.includes(userTelegramId) || true; // Sinash uchun true (ishga tushgach || true qismini olib tashlang)

let state = {
    products: [
        {
            id: 1,
            title: "Zamonaviy Divan",
            category: "living",
            price: 3500000,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"
        },
        {
            id: 2,
            title: "Yotoqxona Garnituri",
            category: "bedroom",
            price: 7200000,
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500"
        }
    ],
    selectedCategory: "all"
};

document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) lucide.createIcons();
    
    // Adminda + tugmasini ko'rsatish[cite: 8]
    if (isAdmin) {
        document.getElementById("adminAddProductBtn")?.classList.remove("hidden");
    }

    renderProducts();
    setupEvents();
});

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = "";

    const filtered = state.selectedCategory === "all" 
        ? state.products 
        : state.products.filter(p => p.category === state.selectedCategory);

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${p.id})">✕</button>` : ''}
            <img src="${p.image}" alt="${p.title}">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${p.price.toLocaleString()} so'm</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupEvents() {
    // Kategoriya tanlash
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            state.selectedCategory = e.target.dataset.cat;
            renderProducts();
        });
    });

    // Modal
    const modal = document.getElementById("adminProductModalOverlay");
    document.getElementById("adminAddProductBtn")?.addEventListener("click", () => modal.classList.remove("hidden"));
    document.getElementById("closeAdminModalBtn")?.addEventListener("click", () => modal.classList.add("hidden"));

    // Form submission
    document.getElementById("adminAddProductForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newProduct = {
            id: Date.now(),
            title: document.getElementById("newProdTitle").value,
            category: document.getElementById("newProdCategory").value,
            price: parseFloat(document.getElementById("newProdPrice").value),
            image: document.getElementById("newProdMediaUrl").value
        };

        state.products.unshift(newProduct);
        renderProducts();
        modal.classList.add("hidden");
        e.target.reset();
    });
}

function deleteProduct(id) {
    if (confirm("Ushbu mebelni o'chirmoqchimisiz?")) {
        state.products = state.products.filter(p => p.id !== id);
        renderProducts();
    }
}
