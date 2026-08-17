const API_BASE_URL = "http://127.0.0.1:8000";

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// Telegram ID yoki Admin tekshiruvi
const userTelegramId = tg?.initDataUnsafe?.user?.id;
// ADMIN ID laringizni shu massivga kiriting
const ADMIN_IDS = [7771150533]; 

// Test rejimida admin tugmasi ko'rinishi uchun true qilingan
const isAdmin = true; // Keyinchalik: ADMIN_IDS.includes(userTelegramId)

let products = [];
let selectedCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) lucide.createIcons();

    // Admin bo'lsa, tugmani ko'rsatish
    if (isAdmin) {
        const adminBtn = document.getElementById("adminAddProductBtn");
        if (adminBtn) adminBtn.classList.remove("hidden");
    }

    await loadProductsFromAPI();
    setupEvents();
});

// FastAPI'dan mahsulotlarni olish
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error("Server xatosi");
        
        products = await response.json();
        renderProducts();
    } catch (err) {
        console.error("API yuklashda xatolik:", err);
        const grid = document.getElementById("productsGrid");
        if (grid) {
            grid.innerHTML = `<p class="error-msg">Mebellarni yuklab bo'lmadi. Backend server yoqilganini tekshiring.</p>`;
        }
    }
}

// Katalogga chiqarish
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const filtered = selectedCategory === "all" 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="empty-msg">Ushbu bo'limda hozircha mebellar yo'q.</p>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${p.id})">✕</button>` : ''}
            <img src="${p.media_url}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/150'">
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <div class="product-title">${p.title}</div>
                <div class="product-price">${Number(p.price).toLocaleString()} so'm</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Hodisalarni ulash
function setupEvents() {
    // Kategoriya tugmalari
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedCategory = e.target.dataset.cat;
            renderProducts();
        });
    });

    // Admin modal elementlari
    const modal = document.getElementById("adminProductModalOverlay");
    const openBtn = document.getElementById("adminAddProductBtn");
    const closeBtn = document.getElementById("closeAdminModalBtn");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }

    // Formani FastAPI'ga yuborish
    const form = document.getElementById("adminAddProductForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const payload = {
                title: document.getElementById("newProdTitle").value,
                category: document.getElementById("newProdCategory").value,
                price: parseFloat(document.getElementById("newProdPrice").value),
                media_url: document.getElementById("newProdMediaUrl").value,
                description: document.getElementById("newProdDesc").value || "",
                height: document.getElementById("newProdHeight").value || "",
                width: document.getElementById("newProdWidth").value || "",
                color: document.getElementById("newProdColor").value || "",
                material: document.getElementById("newProdMaterial").value || "",
                is_custom: document.getElementById("newProdIsCustom").checked
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
                    form.reset();
                } else {
                    alert("Mebel qo'shishda xatolik yuz berdi!");
                }
            } catch (err) {
                alert("Server bilan aloqa yo'q!");
            }
        });
    }
}

// Mebelni o'chirish
async function deleteProduct(id) {
    if (confirm("Ushbu mebelni o'chirmoqchimisiz?")) {
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
