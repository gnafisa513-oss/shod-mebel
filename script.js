const API_BASE_URL = "http://127.0.0.1:8000";

const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

const userTelegramId = tg?.initDataUnsafe?.user?.id;
const ADMIN_IDS = [123456789];
const isAdmin = ADMIN_IDS.includes(userTelegramId) || true; // Sinash uchun

let products = [];
let selectedCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) lucide.createIcons();
    
    if (isAdmin) {
        document.getElementById("adminAddProductBtn")?.classList.remove("hidden");
    }

    await loadProductsFromAPI();
    setupEvents();
});

// Baza va API'dan mebellarni yuklab olish
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        products = await response.json();
        renderProducts();
    } catch (err) {
        console.error("API xatosi:", err);
    }
}

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = "";

    const filtered = selectedCategory === "all" 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${p.id})">✕</button>` : ''}
            <img src="${p.media_url}" alt="${p.title}">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${Number(p.price).toLocaleString()} so'm</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupEvents() {
    // Kategoriya filteri
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedCategory = e.target.dataset.cat;
            renderProducts();
        });
    });

    const modal = document.getElementById("adminProductModalOverlay");
    document.getElementById("adminAddProductBtn")?.addEventListener("click", () => modal.classList.remove("hidden"));
    document.getElementById("closeAdminModalBtn")?.addEventListener("click", () => modal.classList.add("hidden"));

    // FastAPI'ga YANGI MEBEL QO'SHISH (POST)
    document.getElementById("adminAddProductForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const payload = {
            title: document.getElementById("newProdTitle").value,
            category: document.getElementById("newProdCategory").value,
            price: parseFloat(document.getElementById("newProdPrice").value),
            description: document.getElementById("newProdDesc").value || "",
            height: document.getElementById("newProdHeight").value || "",
            width: document.getElementById("newProdWidth").value || "",
            color: document.getElementById("newProdColor").value || "",
            material: document.getElementById("newProdMaterial").value || "",
            is_custom: document.getElementById("newProdIsCustom").checked,
            media_url: document.getElementById("newProdMediaUrl").value
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await loadProductsFromAPI();
                modal.classList.add("hidden");
                e.target.reset();
            }
        } catch (err) {
            alert("Xatolik yuz berdi!");
        }
    });
}

// FastAPI orqali MEBELNI O'CHIRISH (DELETE)
async function deleteProduct(id) {
    if (confirm("Ushbu mebelni bazadan o'chirmoqchimisiz?")) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                await loadProductsFromAPI();
            }
        } catch (err) {
            alert("O'chirishda xatolik!");
        }
    }
}
