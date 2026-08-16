const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

// Admin Telegram ID ro'yxati yoki tekshiruvi
const userTelegramId = tg?.initDataUnsafe?.user?.id;
const ADMIN_IDS = [7771150533]; // O'zingizning Telegram ID'ingizni qo'ying
const isAdmin = ADMIN_IDS.includes(userTelegramId);

// Dastlabki mebellar ro'yxati
let state = {
    products: [
        {
            id: 1,
            title: "Zamonaviy Divan",
            category: "living",
            price: 3500000,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
            dimensions: "200 × 90 cm",
            color: "Kulrang",
            material: "MDF / Matro"
        },
        {
            id: 2,
            title: "Yotoqxona Garnituri",
            category: "bedroom",
            price: 7200000,
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
            dimensions: "220 × 200 cm",
            color: "Yong'oq",
            material: "Laminat"
        }
    ],
    selectedCategory: "all"
};

document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) lucide.createIcons();
    
    // Admin tugmasini ko'rsatish
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
    // Kategoriyalar
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
            image: document.getElementById("newProdMediaUrl").value,
            dimensions: `${document.getElementById("newProdWidth").value || '-'} × ${document.getElementById("newProdHeight").value || '-'}`,
            color: document.getElementById("newProdColor").value,
            material: document.getElementById("newProdMaterial").value || 'MDF',
            description: document.getElementById("newProdDesc").value,
            isCustom: document.getElementById("newProdIsCustom").checked
        };

        state.products.unshift(newProduct);
        renderProducts();
        modal.classList.add("hidden");
        e.target.reset();
        alert("Yangi mebel katalogga qo'shildi!");
    });
}

function deleteProduct(id) {
    if (confirm("Haqiqatan ham ushbu mebelni o'chirmoqchimisiz?")) {
        state.products = state.products.filter(p => p.id !== id);
        renderProducts();
    }
}
