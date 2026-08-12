/**
 * SHOD MEBEL — TELEGRAM MINI APP FRONTEND SCRIPT
 * Vanilla JavaScript implementation
 */

// ==========================================
// 1. PRODUCT DATASET
// ==========================================
const PRODUCTS = [
    {
        id: 1,
        name: "Modern Bedroom Set",
        category: "bedroom",
        categoryLabel: "Yotoqxona",
        price: 4500000,
        priceType: "fixed",
        isCustom: true,
        material: "MDF + LDSP",
        dimensions: "240 × 220 × 60 cm",
        mechanism: "Soft-close (Sukunatli)",
        warranty: "12 oy",
        productionTime: "7–10 kun",
        description: "Zamonaviy va shinam yotoqxona to'plami. Keng sig'imli shkaf, qulay ikki kishilik karavot va ikkita tumba o'z ichiga oladi.",
        images: [
            "https://images.unsplash.com/photo-1540518614846-7ede433c5173?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
        ],
        video: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-41555-large.mp4",
        isNew: true
    },
    {
        id: 2,
        name: "Kitchen Cabinet Premium",
        category: "kitchen",
        categoryLabel: "Oshxona",
        price: 8200000,
        priceType: "fixed",
        isCustom: true,
        material: "Akril + MDF Blum",
        dimensions: "320 × 240 × 60 cm",
        mechanism: "Blum Aventos HK",
        warranty: "24 oy",
        productionTime: "10–14 kun",
        description: "Premium toifasidagi zamonaviy oshxona mebeli. Namlik va issiqqa chidamli akril qoplama va Germaniya furniturasidan foydalanilgan.",
        images: [
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: false
    },
    {
        id: 3,
        name: "Minimal Office Desk",
        category: "office",
        categoryLabel: "Ofis",
        price: 1800000,
        priceType: "fixed",
        isCustom: false,
        material: "Metal karkas + LDSP",
        dimensions: "140 × 75 × 70 cm",
        mechanism: "Kabel-kanal va tokcha",
        warranty: "12 oy",
        productionTime: "Tayyor (Bugun yetkazish)",
        description: "Minimalistik uslubdagi mustahkam ish stoli. Uy va ofis sharoitida qulay ishlash uchun maxsus mo'ljallangan.",
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: true
    },
    {
        id: 4,
        name: "Luxury Corner Sofa",
        category: "soft",
        categoryLabel: "Yumshoq mebel",
        price: 6500000,
        priceType: "fixed",
        isCustom: true,
        material: "Mato Velur + Qayishqoq porolon",
        dimensions: "300 × 180 × 85 cm",
        mechanism: "Transformer (Ochiladigan)",
        warranty: "18 oy",
        productionTime: "5–7 kun",
        description: "Luks darajadagi burchak divan. Suv va kir yuqmaydigan zamonaviy velur matosi bilan qoplangan.",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80"
        ],
        video: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-41554-large.mp4",
        isNew: false
    },
    {
        id: 5,
        name: "Modern Wardrobe Sliding",
        category: "bedroom",
        categoryLabel: "Yotoqxona",
        price: 3900000,
        priceType: "fixed",
        isCustom: false,
        material: "MDF + Oyna",
        dimensions: "200 × 220 × 60 cm",
        mechanism: "Kupe (Sirpanuvchi)",
        warranty: "12 oy",
        productionTime: "Tayyor",
        description: "Keng oyna fasadli kupe shkafi. Kiyimlar va uy anjomlarini tartibli saqlash uchun ideal yechim.",
        images: [
            "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: false
    },
    {
        id: 6,
        name: "Scandinavian Dining Table",
        category: "kitchen",
        categoryLabel: "Oshxona",
        price: 2400000,
        priceType: "fixed",
        isCustom: false,
        material: "Tabiiy Emanning yog'ochi",
        dimensions: "160 × 90 × 75 cm",
        mechanism: "Statsionar",
        warranty: "24 oy",
        productionTime: "Tayyor",
        description: "Skandinaviya uslubidagi ovqatlanish stoli. Tabiiy eman yog'ochidan tayyorlangan va ekologik toza lak bilan qoplangan.",
        images: [
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: true
    },
    {
        id: 7,
        name: "Comfort Ergonomic Armchair",
        category: "soft",
        categoryLabel: "Yumshoq mebel",
        price: 1500000,
        priceType: "fixed",
        isCustom: false,
        material: "Buk yog'ochi + Bukle mato",
        dimensions: "85 × 90 × 95 cm",
        mechanism: "Statsionar",
        warranty: "12 oy",
        productionTime: "Tayyor",
        description: "Dam olish va mutolaa uchun o'ta qulay kreslo. Ergonomik shakl va yumshoq suyanchiqqa ega.",
        images: [
            "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: false
    },
    {
        id: 8,
        name: "Executive Office Cabinet",
        category: "office",
        categoryLabel: "Ofis",
        price: null,
        priceType: "negotiable",
        isCustom: true,
        material: "Shpon + Metal",
        dimensions: "Loyiha bo'yicha",
        mechanism: "Premium italiyan",
        warranty: "36 oy",
        productionTime: "12–15 kun",
        description: "Rhbarlar kabineti uchun eksklyuziv mebel to'plami. Individuallik va nufuzni ta'kidlaydi.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: true
    },
    {
        id: 9,
        name: "Custom Soft Bed Frame",
        category: "bedroom",
        categoryLabel: "Yotoqxona",
        price: null,
        priceType: "size",
        isCustom: true,
        material: "Mato Zamsh + Yog'och",
        dimensions: "O'lchamga qarab",
        mechanism: "Ko'taruvchi mehanizm (Podyom)",
        warranty: "18 oy",
        productionTime: "7–10 kun",
        description: "Yumshoq bosh qismli karavot. Tagida keng buyumlar saqlash qutisi mavjud.",
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540518614846-7ede433c5173?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: false
    },
    {
        id: 10,
        name: "Compact Modular Sofa",
        category: "soft",
        categoryLabel: "Yumshoq mebel",
        price: 3200000,
        priceType: "fixed",
        isCustom: false,
        material: "Mato Shemill",
        dimensions: "210 × 95 × 80 cm",
        mechanism: "Modulli",
        warranty: "12 oy",
        productionTime: "Tayyor",
        description: "Kichik xonadonlar uchun ixcham modulli divan. Qismlarini osongina ajratib ko'chirish mumkin.",
        images: [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: false
    }
];

// CATEGORIES CONSTANT
const CATEGORIES = [
    { id: 'all', name: 'Barchasi', label: 'All' },
    { id: 'bedroom', name: 'Yotoqxona', label: 'Bedroom' },
    { id: 'kitchen', name: 'Oshxona', label: 'Kitchen' },
    { id: 'office', name: 'Ofis', label: 'Office' },
    { id: 'soft', name: 'Yumshoq mebel', label: 'Soft Furniture' }
];

// STATE APP
const state = {
    cart: JSON.parse(localStorage.getItem('shod_cart') || '[]'),
    favorites: JSON.parse(localStorage.getItem('shod_favs') || '[]'),
    activeCategory: 'all',
    searchQuery: '',
    filters: {
        category: 'all',
        availability: 'all',
        material: 'all',
        sort: 'recommended'
    },
    selectedProduct: null,
    selectedQuantity: 1,
    galleryIndex: 0
};

// ==========================================
// 2. TELEGRAM WEBAPP INTEGRATION HELPERS
// ==========================================
const tg = window.Telegram?.WebApp;

function initTelegramWebApp() {
    if (!tg) return;

    try {
        tg.ready();
        tg.expand();

        // Theme colors sync
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        tg.onEvent('themeChanged', () => {
            if (tg.colorScheme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });

        // MainButton Click Handler
        tg.MainButton.onClick(() => {
            submitOrder();
        });

        // BackButton Click Handler
        tg.BackButton.onClick(() => {
            handleTelegramBack();
        });

    } catch (e) {
        console.warn("Telegram WebApp API Error:", e);
    }
}

function triggerHaptic(type = 'light') {
    if (tg?.HapticFeedback) {
        try {
            if (type === 'success') {
                tg.HapticFeedback.notificationOccurred('success');
            } else {
                tg.HapticFeedback.impactOccurred(type);
            }
        } catch (e) {
            // Ignore if not supported
        }
    }
}

function updateTelegramMainButton() {
    const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);

    if (!tg) return;

    if (totalCount > 0) {
        tg.MainButton.setText(`Buyurtma berish (${totalCount})`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

function updateTelegramBackButton() {
    if (!tg) return;

    const isAnyModalOpen = !document.getElementById('productModalOverlay').classList.contains('hidden') ||
        !document.getElementById('cartModalOverlay').classList.contains('hidden') ||
        !document.getElementById('filterModalOverlay').classList.contains('hidden') ||
        !document.getElementById('favoritesModalOverlay').classList.contains('hidden') ||
        !document.getElementById('searchBarContainer').classList.contains('hidden');

    if (isAnyModalOpen) {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
}

function handleTelegramBack() {
    const modals = [
        'productModalOverlay',
        'cartModalOverlay',
        'filterModalOverlay',
        'favoritesModalOverlay',
        'successModalOverlay'
    ];

    for (const mId of modals) {
        const el = document.getElementById(mId);
        if (el && !el.classList.contains('hidden')) {
            closeModal(mId);
            return;
        }
    }

    const searchBar = document.getElementById('searchBarContainer');
    if (searchBar && !searchBar.classList.contains('hidden')) {
        searchBar.classList.add('hidden');
        state.searchQuery = '';
        document.getElementById('searchInput').value = '';
        renderProducts();
        updateTelegramBackButton();
    }
}

// ==========================================
// 3. UTILITY FUNCTIONS
// ==========================================
function formatPrice(price, priceType) {
    if (priceType === 'negotiable') {
        return "Kelishiladi";
    }
    if (priceType === 'size') {
        return "Narx o'lchamga qarab";
    }
    if (typeof price === 'number') {
        return new Intl.NumberFormat('fr-FR').format(price) + " so'm";
    }
    return "Kelishiladi";
}

function saveState() {
    localStorage.setItem('shod_cart', JSON.stringify(state.cart));
    localStorage.setItem('shod_favs', JSON.stringify(state.favorites));
}

function updateBadges() {
    const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (totalCartCount > 0) {
        cartBadge.textContent = totalCartCount;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }

    const favCount = state.favorites.length;
    const favBadge = document.getElementById('favoritesBadge');
    if (favCount > 0) {
        favBadge.textContent = favCount;
        favBadge.classList.remove('hidden');
    } else {
        favBadge.classList.add('hidden');
    }

    updateTelegramMainButton();
    updateTelegramBackButton();
}

// ==========================================
// 4. CATEGORIES & PRODUCT RENDERERS
// ==========================================
function renderCategories() {
    const categoryNav = document.getElementById('categoryNav');
    const filterCategoriesContainer = document.getElementById('filterCategories');

    if (!categoryNav) return;

    categoryNav.innerHTML = CATEGORIES.map(cat => `
        <button class="cat-chip ${state.activeCategory === cat.id ? 'active' : ''}" data-id="${cat.id}">
            <span>${cat.name}</span>
        </button>
    `).join('');

    if (filterCategoriesContainer) {
        filterCategoriesContainer.innerHTML = CATEGORIES.map(cat => `
            <button class="filter-chip ${state.filters.category === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                ${cat.name}
            </button>
        `).join('');
    }

    // Attach click listeners to category chips
    categoryNav.querySelectorAll('.cat-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catId = e.currentTarget.getAttribute('data-id');
            state.activeCategory = catId;
            state.filters.category = catId;
            triggerHaptic('light');
            renderCategories();
            renderProducts();
        });
    });
}

function getFilteredProducts() {
    return PRODUCTS.filter(product => {
        // Category filter
        if (state.activeCategory !== 'all' && product.category !== state.activeCategory) {
            return false;
        }

        // Availability filter
        if (state.filters.availability === 'ready' && product.isCustom) return false;
        if (state.filters.availability === 'custom' && !product.isCustom) return false;

        // Material filter
        if (state.filters.material !== 'all' && !product.material.toLowerCase().includes(state.filters.material.toLowerCase())) {
            return false;
        }

        // Search Query filter
        if (state.searchQuery.trim() !== '') {
            const q = state.searchQuery.toLowerCase();
            const matchName = product.name.toLowerCase().includes(q);
            const matchCategory = product.categoryLabel.toLowerCase().includes(q);
            const matchMaterial = product.material.toLowerCase().includes(q);
            const matchDesc = product.description.toLowerCase().includes(q);

            if (!matchName && !matchCategory && !matchMaterial && !matchDesc) {
                return false;
            }
        }

        return true;
    }).sort((a, b) => {
        if (state.filters.sort === 'price-low') {
            return (a.price || 0) - (b.price || 0);
        }
        if (state.filters.sort === 'price-high') {
            return (b.price || 0) - (a.price || 0);
        }
        if (state.filters.sort === 'newest') {
            return b.isNew ? 1 : -1;
        }
        return 0; // recommended
    });
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const countLabel = document.getElementById('productCount');
    const sectionTitle = document.getElementById('sectionTitle');
    const emptyState = document.getElementById('emptyState');

    if (!grid) return;

    const filtered = getFilteredProducts();

    // Section title update
    const activeCatObj = CATEGORIES.find(c => c.id === state.activeCategory);
    sectionTitle.textContent = activeCatObj ? `${activeCatObj.name} Mebellari` : 'Barcha Mebellar';
    countLabel.textContent = `${filtered.length} ta mahsulot`;

    // Filter indicator bar
    const activeFiltersBar = document.getElementById('activeFiltersBar');
    const filterStatusText = document.getElementById('filterStatusText');
    const isFilterActive = state.filters.availability !== 'all' || state.filters.material !== 'all' || state.filters.sort !== 'recommended';

    if (activeFiltersBar) {
        if (isFilterActive) {
            activeFiltersBar.classList.remove('hidden');
            filterStatusText.textContent = `Saralash: ${state.filters.sort}, Material: ${state.filters.material}`;
        } else {
            activeFiltersBar.classList.add('hidden');
        }
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    grid.innerHTML = filtered.map(product => {
        const isFav = state.favorites.includes(product.id);
        const formattedPrice = formatPrice(product.price, product.priceType);
        const badgeText = product.isCustom ? 'ZAKAZGA' : 'TAYYOR';
        const badgeClass = product.isCustom ? 'custom-badge' : 'ready-badge';

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-media">
                    <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                    <span class="card-badge ${badgeClass}">${badgeText}</span>
                    ${product.video ? `
                        <div class="video-tag-indicator" title="Video mavjud">
                            <i data-lucide="play"></i>
                        </div>
                    ` : ''}
                    <button class="fav-card-btn ${isFav ? 'active' : ''}" data-fav-id="${product.id}" aria-label="Saralangan">
                        <i data-lucide="heart" ${isFav ? 'fill="currentColor"' : ''}></i>
                    </button>
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <span class="product-price-tag">${formattedPrice}</span>
                    <button class="btn-card-add" data-add-id="${product.id}">
                        <i data-lucide="shopping-bag"></i>
                        <span>Savatga</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Re-initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Attach click events
    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore if heart or add button clicked
            if (e.target.closest('.fav-card-btn') || e.target.closest('.btn-card-add')) {
                return;
            }
            const productId = parseInt(card.getAttribute('data-id'));
            openProductDetailModal(productId);
        });
    });

    grid.querySelectorAll('.fav-card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-fav-id'));
            toggleFavorite(productId);
        });
    });

    grid.querySelectorAll('.btn-card-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-add-id'));
            addToCart(productId, 1, btn);
        });
    });
}

// ==========================================
// 5. CART & FAVORITES MANAGERS
// ==========================================
function toggleFavorite(productId) {
    const index = state.favorites.indexOf(productId);
    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push(productId);
    }
    triggerHaptic('light');
    saveState();
    updateBadges();
    renderProducts();
    renderFavorites();

    // Sync modal fav btn if open
    if (state.selectedProduct && state.selectedProduct.id === productId) {
        const modalFavBtn = document.getElementById('modalFavBtn');
        if (modalFavBtn) {
            const isFav = state.favorites.includes(productId);
            modalFavBtn.classList.toggle('active', isFav);
        }
    }
}

function addToCart(productId, quantity = 1, buttonElement = null) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(i => i.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            priceType: product.priceType,
            image: product.images[0],
            isCustom: product.isCustom,
            quantity: quantity
        });
    }

    triggerHaptic('light');
    saveState();
    updateBadges();
    renderCart();

    // Animate button feedback
    if (buttonElement) {
        const span = buttonElement.querySelector('span');
        const originalText = span ? span.textContent : 'Savatga';
        buttonElement.classList.add('added');
        if (span) span.textContent = "✓ Qo'shildi";

        setTimeout(() => {
            buttonElement.classList.remove('added');
            if (span) span.textContent = originalText;
        }, 1200);
    }
}
window.addToCart = addToCart;

function updateCartQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== productId);
    }

    triggerHaptic('light');
    saveState();
    updateBadges();
    renderCart();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    triggerHaptic('light');
    saveState();
    updateBadges();
    renderCart();
}

function calculateCartTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    state.cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += (item.price || 0) * item.quantity;
    });

    return { totalItems, totalPrice };
}

function renderCart() {
    const listContainer = document.getElementById('cartItemsList');
    const emptyView = document.getElementById('emptyCartView');
    const footer = document.getElementById('cartFooter');
    const subtitle = document.getElementById('cartSubtitle');
    const summaryCount = document.getElementById('cartSummaryCount');
    const summaryTotal = document.getElementById('cartSummaryTotal');

    if (!listContainer) return;

    const { totalItems, totalPrice } = calculateCartTotals();
    subtitle.textContent = `${totalItems} ta mahsulot`;

    if (state.cart.length === 0) {
        listContainer.innerHTML = '';
        emptyView.classList.remove('hidden');
        footer.classList.add('hidden');
        return;
    }

    emptyView.classList.add('hidden');
    footer.classList.remove('hidden');

    summaryCount.textContent = `${totalItems} ta`;
    summaryTotal.textContent = new Intl.NumberFormat('fr-FR').format(totalPrice) + " so'm";

    listContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item-card">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price, item.priceType)}</div>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${item.id}, -1)">
                            <i data-lucide="minus"></i>
                        </button>
                        <span class="cart-qty-val">${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${item.id}, 1)">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                    <button class="cart-remove-btn" onclick="removeFromCart(${item.id})" aria-label="O'chirish">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderFavorites() {
    const favList = document.getElementById('favItemsList');
    const emptyFavView = document.getElementById('emptyFavView');
    const favSubtitle = document.getElementById('favSubtitle');

    if (!favList) return;

    const favProducts = PRODUCTS.filter(p => state.favorites.includes(p.id));
    favSubtitle.textContent = `${favProducts.length} ta saqlangan`;

    if (favProducts.length === 0) {
        favList.innerHTML = '';
        emptyFavView.classList.remove('hidden');
        return;
    }

    emptyFavView.classList.add('hidden');

    favList.innerHTML = favProducts.map(p => `
        <div class="cart-item-card" onclick="openProductDetailModal(${p.id})">
            <img src="${p.images[0]}" alt="${p.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${p.name}</h4>
                <div class="cart-item-price">${formatPrice(p.price, p.priceType)}</div>
                <div style="font-size:0.75rem; color: var(--tg-theme-hint-color);">${p.categoryLabel}</div>
            </div>
            <button class="cart-remove-btn" onclick="event.stopPropagation(); toggleFavorite(${p.id});" aria-label="O'chirish">
                <i data-lucide="heart" fill="currentColor"></i>
            </button>
        </div>
    `).join('');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Make functions global for inline onclick and external calls
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.toggleFavorite = toggleFavorite;
window.openProductDetailModal = openProductDetailModal;
window.submitOrder = submitOrder;

// ==========================================
// 6. PRODUCT DETAIL MODAL & CAROUSEL
// ==========================================
function openProductDetailModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    state.selectedProduct = product;
    state.selectedQuantity = 1;
    state.galleryIndex = 0;

    // Fill Modal elements
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalBadge').textContent = product.isCustom ? 'ZAKAZGA' : 'TAYYOR';
    document.getElementById('modalBadge').className = `badge-tag ${product.isCustom ? 'card-badge custom-badge' : 'card-badge ready-badge'}`;
    document.getElementById('modalCategory').textContent = product.categoryLabel;
    document.getElementById('modalPrice').textContent = formatPrice(product.price, product.priceType);
    document.getElementById('modalDimensions').textContent = product.dimensions;
    document.getElementById('modalMaterial').textContent = product.material;
    document.getElementById('modalMechanism').textContent = product.mechanism;
    document.getElementById('modalWarranty').textContent = product.warranty;
    document.getElementById('modalProduction').textContent = product.productionTime;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalQtyVal').textContent = '1';

    // Favorite button status
    const modalFavBtn = document.getElementById('modalFavBtn');
    const isFav = state.favorites.includes(product.id);
    modalFavBtn.classList.toggle('active', isFav);

    // Gallery Render
    renderGallery(product);

    openModal('productModalOverlay');
}

function renderGallery(product) {
    const track = document.getElementById('galleryTrack');
    const indicators = document.getElementById('galleryIndicators');

    if (!track) return;

    const items = [];
    if (product.video) {
        items.push({ type: 'video', url: product.video });
    }
    product.images.forEach(img => {
        items.push({ type: 'image', url: img });
    });

    track.innerHTML = items.map(item => {
        if (item.type === 'video') {
            return `
                <div class="gallery-item">
                    <video src="${item.url}" autoplay muted loop playsinline controls></video>
                </div>
            `;
        }
        return `
            <div class="gallery-item">
                <img src="${item.url}" alt="${product.name}">
            </div>
        `;
    }).join('');

    indicators.innerHTML = items.map((_, idx) => `
        <span class="indicator-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>
    `).join('');

    track.style.transform = 'translateX(0%)';

    // Indicators click
    indicators.querySelectorAll('.indicator-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-idx'));
            setGalleryIndex(idx, items.length);
        });
    });
}

function setGalleryIndex(idx, total) {
    state.galleryIndex = idx;
    const track = document.getElementById('galleryTrack');
    const indicators = document.getElementById('galleryIndicators');

    if (track) {
        track.style.transform = `translateX(-${idx * 100}%)`;
    }

    if (indicators) {
        indicators.querySelectorAll('.indicator-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    }
}

// ==========================================
// 7. CHECKOUT & ORDER SUBMISSION
// ==========================================
function submitOrder() {
    if (state.cart.length === 0) return;

    const { totalItems, totalPrice } = calculateCartTotals();

    // Prepare Checkout JSON
    const orderData = {
        user: {
            telegram_id: tg?.initDataUnsafe?.user?.id || "guest_browser_1024",
            first_name: tg?.initDataUnsafe?.user?.first_name || "Mijoz",
            username: tg?.initDataUnsafe?.user?.username || null
        },
        items: state.cart.map(i => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            priceType: i.priceType
        })),
        total_items: totalItems,
        total_price: totalPrice,
        created_at: new Date().toISOString()
    };

    console.log("SHOD MEBEL CHECKOUT JSON:", orderData);

    // Send data to Telegram WebApp if available
    if (tg?.sendData) {
        try {
            tg.sendData(JSON.stringify(orderData));
        } catch (e) {
            console.warn("Could not send data via WebApp sendData:", e);
        }
    }

    triggerHaptic('success');

    // Display Success Modal
    document.getElementById('orderNumberRef').textContent = `#SM-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('orderSuccessTotal').textContent = new Intl.NumberFormat('fr-FR').format(totalPrice) + " so'm";
    document.getElementById('orderSuccessCount').textContent = `${totalItems} ta`;

    closeModal('cartModalOverlay');
    openModal('successModalOverlay');

    // Clear Cart
    state.cart = [];
    saveState();
    updateBadges();
    renderCart();
}

// ==========================================
// 8. MODAL CONTROLLERS
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        triggerHaptic('light');
        updateTelegramBackButton();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHaptic('light');
        updateTelegramBackButton();
    }
}

// ==========================================
// 9. EVENT LISTENERS & INITIALIZATION
// ==========================================
function setupEventListeners() {
    // Header Buttons
    document.getElementById('searchToggleBtn').addEventListener('click', () => {
        const searchBar = document.getElementById('searchBarContainer');
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) {
            document.getElementById('searchInput').focus();
        }
        updateTelegramBackButton();
    });

    document.getElementById('favoritesToggleBtn').addEventListener('click', () => {
        renderFavorites();
        openModal('favoritesModalOverlay');
    });

    document.getElementById('cartToggleBtn').addEventListener('click', () => {
        renderCart();
        openModal('cartModalOverlay');
    });

    // Search Input listeners
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (state.searchQuery.length > 0) {
            searchClearBtn.classList.remove('hidden');
        } else {
            searchClearBtn.classList.add('hidden');
        }
        renderProducts();
    });

    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        searchClearBtn.classList.add('hidden');
        renderProducts();
    });

    // Filter Buttons
    document.getElementById('openFilterBtn').addEventListener('click', () => {
        openModal('filterModalOverlay');
    });

    document.getElementById('closeFilterSheetBtn').addEventListener('click', () => {
        closeModal('filterModalOverlay');
    });

    // Filter Modal Options Click Handlers
    document.getElementById('sortOptions').querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('sortOptions').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filters.sort = btn.getAttribute('data-sort');
        });
    });

    document.getElementById('filterAvailability').querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('filterAvailability').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filters.availability = btn.getAttribute('data-availability');
        });
    });

    document.getElementById('filterMaterials').querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('filterMaterials').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filters.material = btn.getAttribute('data-material');
        });
    });

    document.getElementById('applyFilterModalBtn').addEventListener('click', () => {
        closeModal('filterModalOverlay');
        renderProducts();
    });

    document.getElementById('resetFilterModalBtn').addEventListener('click', () => {
        state.filters = { category: state.activeCategory, availability: 'all', material: 'all', sort: 'recommended' };
        closeModal('filterModalOverlay');
        renderProducts();
    });

    document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        state.filters = { category: 'all', availability: 'all', material: 'all', sort: 'recommended' };
        state.activeCategory = 'all';
        renderCategories();
        renderProducts();
    });

    // Modal Close Buttons
    document.getElementById('closeProductSheetBtn').addEventListener('click', () => closeModal('productModalOverlay'));
    document.getElementById('closeCartSheetBtn').addEventListener('click', () => closeModal('cartModalOverlay'));
    document.getElementById('closeFavSheetBtn').addEventListener('click', () => closeModal('favoritesModalOverlay'));

    // Modal Overlay Tap Outside
    document.querySelectorAll('.sheet-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Product Detail Quantity
    document.getElementById('modalQtyMinus').addEventListener('click', () => {
        if (state.selectedQuantity > 1) {
            state.selectedQuantity--;
            document.getElementById('modalQtyVal').textContent = state.selectedQuantity;
        }
    });

    document.getElementById('modalQtyPlus').addEventListener('click', () => {
        state.selectedQuantity++;
        document.getElementById('modalQtyVal').textContent = state.selectedQuantity;
    });

    document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
        if (state.selectedProduct) {
            addToCart(state.selectedProduct.id, state.selectedQuantity, document.getElementById('modalAddToCartBtn'));
            setTimeout(() => {
                closeModal('productModalOverlay');
            }, 600);
        }
    });

    document.getElementById('modalFavBtn').addEventListener('click', () => {
        if (state.selectedProduct) {
            toggleFavorite(state.selectedProduct.id);
        }
    });

    // Cart Checkout & Browse
    document.getElementById('cartCheckoutBtn').addEventListener('click', submitOrder);
    document.getElementById('browseFromCartBtn').addEventListener('click', () => closeModal('cartModalOverlay'));
    document.getElementById('heroCtaBtn').addEventListener('click', () => {
        window.scrollTo({ top: 300, behavior: 'smooth' });
    });

    document.getElementById('successContinueBtn').addEventListener('click', () => {
        closeModal('successModalOverlay');
    });

    document.getElementById('emptyStateResetBtn').addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        state.filters = { category: 'all', availability: 'all', material: 'all', sort: 'recommended' };
        document.getElementById('searchInput').value = '';
        renderCategories();
        renderProducts();
    });
}

// ==========================================
// 10. INITIALIZATION
// ==========================================
function initApp() {
    initTelegramWebApp();
    renderCategories();
    renderProducts();
    renderCart();
    updateBadges();
    setupEventListeners();

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', initApp);
