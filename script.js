/**
 * SHOD MEBEL — TELEGRAM MINI APP FRONTEND SCRIPT
 */

const ADMIN_TELEGRAM_ID = 7771150533;
const currentUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
const isAdmin = currentUserId === ADMIN_TELEGRAM_ID;

// ==========================================
// 1. PRODUCT DATASET & CATEGORIES
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
        video: null,
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
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
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
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"
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
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
        ],
        video: null,
        isNew: false
    }
];

const CATEGORIES = [
    { id: 'all', name: 'Barchasi' },
    { id: 'bedroom', name: 'Yotoqxona' },
    { id: 'kitchen', name: 'Oshxona' },
    { id: 'office', name: 'Ofis' },
    { id: 'soft', name: 'Yumshoq mebel' }
];

// APP STATE
const state = {
    products: [...PRODUCTS],
    cart: safeLoadJSON('shod_cart', []),
    favorites: safeLoadJSON('shod_favs', []),
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
    location: null,
    galleryIndex: 0
};

// BUG FIX: localStorage.getItem() can return malformed/corrupted JSON (e.g.
// from a previous app version, or a value edited by hand). The original
// code called JSON.parse() directly with no try/catch, which would throw
// and stop the whole script from ever running, leaving a blank screen.
function safeLoadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
        console.warn(`Saqlangan '${key}' ma'lumotini o'qib bo'lmadi, tozalanmoqda.`, e);
        return fallback;
    }
}

// ==========================================
// 2. TELEGRAM WEBAPP INTEGRATION
// ==========================================
const tg = window.Telegram?.WebApp;

function initTelegramWebApp() {
    if (!tg) return;

    try {
        tg.ready();
        tg.expand();

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

        tg.MainButton.onClick(() => openCheckoutSheet());
        tg.BackButton.onClick(() => handleTelegramBack());

    } catch (e) {
        console.warn("Telegram WebApp API Error:", e);
    }
}

function triggerHaptic(type = 'light') {
    if (tg?.HapticFeedback) {
        try {
            if (type === 'success' || type === 'error' || type === 'warning') {
                tg.HapticFeedback.notificationOccurred(type);
            } else {
                tg.HapticFeedback.impactOccurred(type);
            }
        } catch (e) { }
    }
}

function updateTelegramMainButton() {
    if (!tg) return;
    const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);

    if (totalCount > 0 && !isAnyOverlayOpen()) {
        tg.MainButton.setText(`Buyurtma berish (${totalCount})`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

const MODAL_IDS = [
    'productModalOverlay',
    'cartModalOverlay',
    'filterModalOverlay',
    'favoritesModalOverlay',
    'checkoutModalOverlay',
    'successModalOverlay',
    'adminProductModalOverlay'
];

function isAnyOverlayOpen() {
    return MODAL_IDS.some(id => !document.getElementById(id)?.classList.contains('hidden'));
}

function updateTelegramBackButton() {
    if (!tg) return;
    if (isAnyOverlayOpen()) {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
    updateTelegramMainButton();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        updateTelegramBackButton();
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        updateTelegramBackButton();
    }
}

function handleTelegramBack() {
    // BUG FIX: 'successModalOverlay' was missing from this list, so if a
    // person opened it (once wired up) the hardware/Telegram back button
    // would skip straight past it to whatever sheet was behind it.
    for (const mId of MODAL_IDS) {
        const el = document.getElementById(mId);
        if (el && !el.classList.contains('hidden')) {
            closeModal(mId);
            return;
        }
    }
}

// ==========================================
// 3. UTILITIES & STORAGE
// ==========================================
function formatPrice(price) {
    if (typeof price === 'number' && !Number.isNaN(price)) {
        return new Intl.NumberFormat('fr-FR').format(price) + " so'm";
    }
    return "Kelishiladi";
}

function saveState() {
    try {
        localStorage.setItem('shod_cart', JSON.stringify(state.cart));
        localStorage.setItem('shod_favs', JSON.stringify(state.favorites));
    } catch (e) {
        console.warn("Saqlashda xatolik (localStorage to'lgan bo'lishi mumkin):", e);
    }
}

function slugify(text) {
    return (text || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0400-\u04FF']+/g, '-')
        .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
}

// ==========================================
// TOAST NOTIFICATIONS (replaces alert())
// ==========================================
// BUG FIX: the original code used the browser's blocking alert() for every
// validation message. Inside the Telegram in-app browser this either looks
// out of place or is silently suppressed depending on the client, so
// errors like "location is required" could pass unnoticed. A small toast
// is visible everywhere and never blocks the UI thread.
function ensureToastStack() {
    let stack = document.getElementById('toastStack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'toastStack';
        stack.className = 'toast-stack';
        document.body.appendChild(stack);
    }
    return stack;
}

function toast(message, type = 'default', duration = 2600) {
    const stack = ensureToastStack();
    const el = document.createElement('div');
    el.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`.trim();
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity .2s ease';
        setTimeout(() => el.remove(), 220);
    }, duration);
}

// ==========================================
// 4. RENDERERS
// ==========================================
function renderCategories() {
    const categoryNav = document.getElementById('categoryNav');
    if (!categoryNav) return;

    categoryNav.innerHTML = CATEGORIES.map(cat => `
        <button class="cat-chip ${state.activeCategory === cat.id ? 'active' : ''}" data-id="${cat.id}">
            <span>${cat.name}</span>
        </button>
    `).join('');

    categoryNav.querySelectorAll('.cat-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catId = e.currentTarget.getAttribute('data-id');
            setActiveCategory(catId);
            triggerHaptic('light');
        });
    });
}

function setActiveCategory(catId) {
    state.activeCategory = catId;
    state.filters.category = catId;
    renderCategories();
    renderProducts();
    updateActiveFiltersBar();
}

function getFilteredProducts() {
    return state.products.filter(product => {
        if (state.activeCategory !== 'all' && product.category !== state.activeCategory) return false;
        if (state.filters.availability === 'ready' && product.isCustom) return false;
        if (state.filters.availability === 'custom' && !product.isCustom) return false;

        // BUG FIX: the material filter chips existed in the UI (data-material
        // attributes) but getFilteredProducts() never actually read
        // state.filters.material, so choosing a material never filtered anything.
        if (state.filters.material !== 'all') {
            const mat = (product.material || '').toLowerCase();
            if (!mat.includes(state.filters.material.toLowerCase())) return false;
        }

        if (state.searchQuery.trim() !== '') {
            const q = state.searchQuery.toLowerCase();
            const matchName = product.name?.toLowerCase().includes(q);
            const matchDesc = product.description?.toLowerCase().includes(q);
            const matchMaterial = product.material?.toLowerCase().includes(q);
            const matchCategory = product.categoryLabel?.toLowerCase().includes(q);
            if (!matchName && !matchDesc && !matchMaterial && !matchCategory) return false;
        }

        return true;
    }).sort((a, b) => {
        if (state.filters.sort === 'price-low') return (a.price || 0) - (b.price || 0);
        if (state.filters.sort === 'price-high') return (b.price || 0) - (a.price || 0);
        // BUG FIX: "Yangi kelganlar" (newest) was a selectable sort chip in the
        // filter sheet, but there was no branch handling it, so it behaved
        // identically to "Tavsiya etilgan" (no sort at all).
        if (state.filters.sort === 'newest') return (b.isNew === a.isNew) ? 0 : (a.isNew ? -1 : 1);
        return 0;
    });
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const filtered = getFilteredProducts();
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = `${filtered.length} ta mahsulot`;

    document.getElementById('errorState')?.classList.add('hidden');

    if (filtered.length === 0) {
        grid.innerHTML = '';
        document.getElementById('emptyState')?.classList.remove('hidden');
        return;
    } else {
        document.getElementById('emptyState')?.classList.add('hidden');
    }

    grid.innerHTML = filtered.map(p => {
        const isFav = state.favorites.includes(p.id);
        const formattedPrice = formatPrice(p.price);
        const imageSrc = (p.images && p.images[0]) ? p.images[0] : (p.media_file_id || 'https://via.placeholder.com/300');

        return `
            <div class="product-card" data-id="${p.id}">
                <div class="product-media">
                    <img src="${imageSrc}" alt="${p.name || p.title}" loading="lazy">
                    <span class="card-badge ${p.isCustom ? 'custom-badge' : 'ready-badge'}">
                        ${p.isCustom ? 'ZAKAZGA' : 'TAYYOR'}
                    </span>
                    <button class="fav-card-btn ${isFav ? 'active' : ''}" data-fav-id="${p.id}" aria-label="Saralash">
                        <i data-lucide="heart" ${isFav ? 'fill="currentColor"' : ''}></i>
                    </button>
                </div>
                <div class="product-info">
                    <h4 class="product-name">${p.name || p.title}</h4>
                    <span class="product-price-tag price-tag price-tag--chip">${formattedPrice}</span>
                    <button data-add-id="${p.id}" class="btn-card-add">
                        <i data-lucide="shopping-bag"></i> <span>Savatga</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const pId = parseInt(card.getAttribute('data-id'));
            openProductDetailModal(pId);
        });
    });

    grid.querySelectorAll('[data-fav-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.getAttribute('data-fav-id')));
        });
    });

    grid.querySelectorAll('[data-add-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.getAttribute('data-add-id')), 1, btn);
        });
    });
}

// ==========================================
// 5. CART & FAVORITES LOGIC
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
    syncModalFavButton();
}

function addToCart(productId, quantity = 1, btnElement = null) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(i => i.id === productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        state.cart.push({
            id: product.id,
            title: product.name || product.title,
            price: product.price,
            isCustom: product.isCustom,
            image: (product.images && product.images[0]) || product.media_file_id,
            quantity: quantity
        });
    }

    triggerHaptic('light');
    saveState();
    updateBadges();
    toast(`"${product.name || product.title}" savatga qo'shildi`, 'success', 1600);

    if (btnElement) {
        const span = btnElement.querySelector('span');
        if (span) {
            const oldText = span.textContent;
            span.textContent = "✓ Qo'shildi";
            setTimeout(() => { span.textContent = oldText; }, 1200);
        }
    }
}

function updateBadges() {
    const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = totalCartCount;
        cartBadge.classList.toggle('hidden', totalCartCount === 0);
    }

    const favCount = state.favorites.length;
    const favBadge = document.getElementById('favoritesBadge');
    if (favBadge) {
        favBadge.textContent = favCount;
        favBadge.classList.toggle('hidden', favCount === 0);
    }

    updateTelegramMainButton();
    updateTelegramBackButton();
}

function openCartSheet() {
    renderCartItems();
    openModal('cartModalOverlay');
}

function renderCartItems() {
    const list = document.getElementById('cartItemsList');
    const emptyView = document.getElementById('emptyCartView');
    const footer = document.getElementById('cartFooter');
    const subtitle = document.getElementById('cartSubtitle');
    if (!list) return;

    if (state.cart.length === 0) {
        list.innerHTML = '';
        emptyView?.classList.remove('hidden');
        footer?.classList.add('hidden');
        if (subtitle) subtitle.textContent = "0 ta mahsulot";
        return;
    }

    emptyView?.classList.add('hidden');
    footer?.classList.remove('hidden');

    let totalSum = 0;
    let totalQty = 0;

    list.innerHTML = state.cart.map(item => {
        const sum = item.price * item.quantity;
        totalSum += sum;
        totalQty += item.quantity;

        return `
            <div class="cart-item-card">
                <img src="${item.image || 'https://via.placeholder.com/150'}" class="cart-item-img" alt="${item.title}">
                <div class="cart-item-info">
                    <h5 class="cart-item-title">${item.title}</h5>
                    <div class="cart-item-price price-tag">${formatPrice(item.price)}</div>
                    <div class="cart-item-actions">
                        <div class="cart-item-qty">
                            <button class="cart-qty-btn" data-qty-id="${item.id}" data-delta="-1" aria-label="Kamaytirish">-</button>
                            <span class="cart-qty-val">${item.quantity}</span>
                            <button class="cart-qty-btn" data-qty-id="${item.id}" data-delta="1" aria-label="Oshirish">+</button>
                        </div>
                        <button class="cart-remove-btn" data-remove-id="${item.id}" aria-label="O'chirish">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    list.querySelectorAll('[data-qty-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            updateCartQty(parseInt(btn.getAttribute('data-qty-id')), parseInt(btn.getAttribute('data-delta')));
        });
    });
    list.querySelectorAll('[data-remove-id]').forEach(btn => {
        btn.addEventListener('click', () => removeCartItem(parseInt(btn.getAttribute('data-remove-id'))));
    });

    if (subtitle) subtitle.textContent = `${totalQty} ta mahsulot`;
    document.getElementById('cartSummaryCount').textContent = `${totalQty} ta`;
    document.getElementById('cartSummaryTotal').textContent = formatPrice(totalSum);
}

function updateCartQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeCartItem(id);
    } else {
        saveState();
        updateBadges();
        renderCartItems();
    }
}

function removeCartItem(id) {
    state.cart = state.cart.filter(i => i.id !== id);
    saveState();
    updateBadges();
    renderCartItems();
}

// BUG FIX: there used to be no code at all rendering the favorites sheet —
// tapping the heart icon in the header always opened an empty modal, even
// after favoriting products, because #favItemsList was never populated and
// #emptyFavView stayed hidden by default.
function renderFavorites() {
    const list = document.getElementById('favItemsList');
    const emptyView = document.getElementById('emptyFavView');
    const subtitle = document.getElementById('favSubtitle');
    if (!list) return;

    // Some favorited ids may point at products that no longer exist
    // (e.g. removed from the catalog) — filter those out defensively.
    const favProducts = state.favorites
        .map(id => state.products.find(p => p.id === id))
        .filter(Boolean);

    if (subtitle) subtitle.textContent = `${favProducts.length} ta saqlangan`;

    if (favProducts.length === 0) {
        list.innerHTML = '';
        emptyView?.classList.remove('hidden');
        return;
    }
    emptyView?.classList.add('hidden');

    list.innerHTML = favProducts.map(p => {
        const imageSrc = (p.images && p.images[0]) ? p.images[0] : (p.media_file_id || 'https://via.placeholder.com/150');
        return `
            <div class="fav-item-card" data-open-id="${p.id}">
                <img src="${imageSrc}" class="cart-item-img" alt="${p.name}">
                <div class="cart-item-info">
                    <h5 class="cart-item-title">${p.name}</h5>
                    <div class="cart-item-price price-tag">${formatPrice(p.price)}</div>
                    <div class="fav-item-actions">
                        <button class="btn-card-add" data-fav-add-id="${p.id}" style="flex:1">
                            <i data-lucide="shopping-bag"></i><span>Savatga</span>
                        </button>
                        <button class="fav-remove-btn" data-fav-remove-id="${p.id}" aria-label="Saralanganlardan olib tashlash">
                            <i data-lucide="heart-off"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    list.querySelectorAll('[data-open-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            openProductDetailModal(parseInt(card.getAttribute('data-open-id')));
        });
    });
    list.querySelectorAll('[data-fav-add-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.getAttribute('data-fav-add-id')), 1, btn);
        });
    });
    list.querySelectorAll('[data-fav-remove-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.getAttribute('data-fav-remove-id')));
        });
    });
}

function openFavoritesSheet() {
    renderFavorites();
    openModal('favoritesModalOverlay');
}

// ==========================================
// 6. PRODUCT DETAIL MODAL
// ==========================================
function openProductDetailModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.selectedProduct = product;
    state.selectedQuantity = 1;
    state.galleryIndex = 0;

    document.getElementById('modalTitle').textContent = product.name || product.title;
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    document.getElementById('modalDimensions').textContent = product.dimensions || 'Standart';
    document.getElementById('modalMaterial').textContent = product.material || 'MDF';
    document.getElementById('modalMechanism').textContent = product.mechanism || 'Standart';
    document.getElementById('modalWarranty').textContent = product.warranty || '12 oy';
    document.getElementById('modalProduction').textContent = product.productionTime || '3-5 kun';
    document.getElementById('modalDescription').textContent = product.description || 'Tavsif berilmagan.';
    document.getElementById('modalQtyVal').textContent = '1';

    // BUG FIX: #modalBadge and #modalCategory were declared in the HTML
    // with hardcoded placeholder text ("TAYYOR" / "Yotoqxona") and were
    // never updated by JS, so every product's detail sheet showed the same
    // badge and category regardless of what was actually selected.
    const badgeEl = document.getElementById('modalBadge');
    if (badgeEl) {
        badgeEl.textContent = product.isCustom ? 'ZAKAZGA' : 'TAYYOR';
        badgeEl.classList.toggle('is-custom', !!product.isCustom);
    }
    const categoryEl = document.getElementById('modalCategory');
    if (categoryEl) categoryEl.textContent = product.categoryLabel || '';

    renderGallery(product);
    syncModalFavButton();

    openModal('productModalOverlay');
}

// BUG FIX: the gallery only ever rendered the first image, and the
// indicator dots (#galleryIndicators) and the floating favorite button
// (#modalFavBtn) inside the product sheet were never wired up at all.
function renderGallery(product) {
    const track = document.getElementById('galleryTrack');
    const indicators = document.getElementById('galleryIndicators');
    if (!track) return;

    const images = (product.images && product.images.length > 0)
        ? product.images
        : [product.media_file_id || 'https://via.placeholder.com/600'];

    track.innerHTML = images.map(src => `
        <div class="gallery-item"><img src="${src}" alt="${product.name || 'Mahsulot'}" loading="lazy"></div>
    `).join('');

    if (indicators) {
        indicators.innerHTML = images.length > 1
            ? images.map((_, i) => `<span class="gallery-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></span>`).join('')
            : '';
    }

    if (images.length > 1) {
        track.onscroll = () => {
            const idx = Math.round(track.scrollLeft / track.clientWidth);
            indicators?.querySelectorAll('.gallery-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
        };
    } else {
        track.onscroll = null;
    }
}

function syncModalFavButton() {
    const btn = document.getElementById('modalFavBtn');
    if (!btn || !state.selectedProduct) return;
    const isFav = state.favorites.includes(state.selectedProduct.id);
    btn.classList.toggle('active', isFav);
    const icon = btn.querySelector('i');
    if (icon) {
        if (isFav) icon.setAttribute('fill', 'currentColor');
        else icon.removeAttribute('fill');
    }
}

// ==========================================
// 7. FILTER SHEET LOGIC
// ==========================================
// BUG FIX: none of the filter/sort chips (#sortOptions, #filterCategories,
// #filterAvailability, #filterMaterials) had any click listeners, and
// #filterCategories was never populated at all, so the entire filter sheet
// was inert — every chip in the markup was purely decorative.
function renderFilterCategories() {
    const wrap = document.getElementById('filterCategories');
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(cat => `
        <button class="filter-chip ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">${cat.name}</button>
    `).join('');
}

function setupFilterChipGroup(containerId, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip || !container.contains(chip)) return;
        container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        onSelect(chip);
        triggerHaptic('light');
    });
}

function syncFilterSheetUI() {
    renderFilterCategories();

    document.querySelectorAll('#sortOptions .filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.sort === state.filters.sort);
    });
    document.querySelectorAll('#filterAvailability .filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.availability === state.filters.availability);
    });
    document.querySelectorAll('#filterMaterials .filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.material === state.filters.material);
    });
}

function updateActiveFiltersBar() {
    const bar = document.getElementById('activeFiltersBar');
    const label = document.getElementById('filterStatusText');
    const filterBtn = document.getElementById('openFilterBtn');
    if (!bar) return;

    const activeParts = [];
    if (state.filters.availability !== 'all') activeParts.push(state.filters.availability === 'ready' ? 'Tayyor' : 'Zakazga');
    if (state.filters.material !== 'all') activeParts.push(state.filters.material);
    if (state.filters.sort !== 'recommended') activeParts.push('Saralangan');

    const hasActive = activeParts.length > 0;
    bar.classList.toggle('hidden', !hasActive);
    filterBtn?.classList.toggle('has-active', hasActive);
    if (label && hasActive) label.textContent = `Filtr: ${activeParts.join(' · ')}`;
}

function resetAllFilters(keepCategory = false) {
    state.filters.availability = 'all';
    state.filters.material = 'all';
    state.filters.sort = 'recommended';
    if (!keepCategory) {
        state.activeCategory = 'all';
        state.filters.category = 'all';
    }
}

// ==========================================
// 8. CHECKOUT LOGIC
// ==========================================
function openCheckoutSheet() {
    if (state.cart.length === 0) {
        toast("Savatingiz bo'sh. Avval mahsulot tanlang.", 'error');
        return;
    }
    closeModal('cartModalOverlay');
    openModal('checkoutModalOverlay');
    checkFormValidity();
}

function handleLocation() {
    const btn = document.getElementById('getLocationBtn');
    const btnText = document.getElementById('locationBtnText');

    if (!navigator.geolocation) {
        toast("Brauzeringizda Geolocation qo'llab-quvvatlanmaydi.", 'error');
        return;
    }

    if (btnText) btnText.textContent = 'Aniqlanmoqda...';
    if (btn) btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            state.location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            document.getElementById('custLat').value = pos.coords.latitude;
            document.getElementById('custLng').value = pos.coords.longitude;
            document.getElementById('locationStatus')?.classList.remove('hidden');
            if (btnText) btnText.textContent = 'Lokatsiya yangilash';
            if (btn) btn.disabled = false;
            triggerHaptic('success');
            checkFormValidity();
        },
        (err) => {
            if (btnText) btnText.textContent = 'Joriy lokatsiyani aniqlash';
            if (btn) btn.disabled = false;
            toast("Lokatsiyani aniqlashda xatolik ro'y berdi. Ruxsat berilganini tekshiring.", 'error');
        }
    );
}

// BUG FIX: confirmOrderBtn was only ever enabled/disabled based on the
// name+phone inputs (checkFormValidity), completely ignoring whether a
// location had actually been captured. Because getLocationBtn separately
// force-set `disabled = false` on success, and checkFormValidity ran again
// on every keystroke and would happily re-enable the button from
// name/phone alone, a customer could submit an order with no delivery
// location at all despite the field being marked required (*) in the UI.
function checkFormValidity() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const confirmBtn = document.getElementById('confirmOrderBtn');
    if (confirmBtn) {
        confirmBtn.disabled = !(name.length > 2 && phone.length > 7 && !!state.location);
    }
}

function submitOrder() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();

    if (!name || name.length <= 2) {
        toast("Iltimos, to'liq ismingizni kiriting.", 'error');
        return;
    }
    if (!phone || phone.length <= 7) {
        toast("Iltimos, telefon raqamingizni to'liq kiriting.", 'error');
        return;
    }
    if (!state.location) {
        toast("Iltimos, yetkazib berish uchun lokatsiyani aniqlang.", 'error');
        return;
    }
    if (state.cart.length === 0) {
        toast("Savatingiz bo'sh.", 'error');
        return;
    }

    const totalSum = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    const payload = {
        customer: {
            name: name,
            phone: phone,
            address: "Telegram Orqali Lokatsiya",
            location: state.location
        },
        items: state.cart,
        summary: {
            total_price: totalSum
        }
    };

    const confirmBtn = document.getElementById('confirmOrderBtn');
    if (confirmBtn) confirmBtn.disabled = true;

    showOrderSuccess(totalSum, totalQty);

    if (tg && tg.sendData) {
        // NOTE: tg.sendData() closes the Mini App immediately (Telegram
        // platform behavior) and the bot sends its own confirmation message
        // in the chat — the success sheet above is a brief, friendly beat
        // before that handoff.
        try {
            tg.sendData(JSON.stringify(payload));
        } catch (e) {
            console.warn('tg.sendData xatosi:', e);
        }
    } else {
        toast("Buyurtmangiz qabul qilindi! (Demo rejim — botga ulanmagan)", 'success', 3200);
    }

    state.cart = [];
    state.location = null;
    saveState();
    updateBadges();
}

function showOrderSuccess(totalSum, totalQty) {
    const orderNumber = `#SM-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('orderNumberRef').textContent = orderNumber;
    document.getElementById('orderSuccessTotal').textContent = formatPrice(totalSum);
    document.getElementById('orderSuccessCount').textContent = `${totalQty} ta`;
    closeModal('checkoutModalOverlay');
    openModal('successModalOverlay');
}

// ==========================================
// 9. ADMIN — ADD PRODUCT (local/session only)
// ==========================================
// NOTE: this storefront is a static site (no server of its own), so it has
// no way to persist a new product beyond this browser session. The
// Telegram bot's own "➕ Yangi tovar qo'shish" flow is the real, persisted
// way to add catalog products (saved to the bot's database). This form is
// left functional for quick local/demo previews, but is explicit about
// that limitation so nobody mistakes it for a real save.
function setupAdminProductForm() {
    const form = document.getElementById('adminAddProductForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('newProdTitle').value.trim();
        const categoryInput = document.getElementById('newProdCategory').value.trim();
        const priceRaw = document.getElementById('newProdPrice').value.trim();
        const desc = document.getElementById('newProdDesc').value.trim();
        const mediaUrl = document.getElementById('newProdMediaUrl').value.trim();
        const isCustom = document.getElementById('newProdIsCustom').checked;

        if (!title || !categoryInput || !priceRaw || !mediaUrl) {
            toast("Iltimos, barcha majburiy maydonlarni to'ldiring.", 'error');
            return;
        }

        const price = parseFloat(priceRaw.replace(/[^\d.]/g, ''));
        if (!price || price <= 0) {
            toast("Narxni to'g'ri kiriting (masalan: 2 500 000).", 'error');
            return;
        }

        const categoryId = slugify(categoryInput);
        if (!CATEGORIES.some(c => c.id === categoryId)) {
            CATEGORIES.push({ id: categoryId, name: categoryInput });
        }

        const newId = state.products.length > 0
            ? Math.max(...state.products.map(p => p.id)) + 1
            : 1;

        state.products.push({
            id: newId,
            name: title,
            category: categoryId,
            categoryLabel: categoryInput,
            price: price,
            priceType: 'fixed',
            isCustom: isCustom,
            material: 'Ko\'rsatilmagan',
            dimensions: 'Ko\'rsatilmagan',
            mechanism: 'Standart',
            warranty: '12 oy',
            productionTime: '—',
            description: desc || "Tavsif berilmagan.",
            images: [mediaUrl],
            video: null,
            isNew: true
        });

        form.reset();
        closeModal('adminProductModalOverlay');
        renderCategories();
        renderProducts();
        toast("Mahsulot qo'shildi (faqat shu qurilma/sessiya uchun).", 'success', 3200);
    });
}

// ==========================================
// 10. GENERIC MODAL WIRING (close buttons, overlay click, etc.)
// ==========================================
// BUG FIX: the admin modal's "&times;" button had a `data-close-modal`
// attribute in the HTML, but nothing in JS ever read that attribute —
// clicking it did nothing. Same generic behavior is used for tap-outside-
// to-close on every sheet/modal overlay, which also wasn't implemented.
function setupGenericModalClosers() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
    });

    document.querySelectorAll('.sheet-overlay, .modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });
}

// ==========================================
// 11. EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTelegramWebApp();
    renderCategories();
    renderProducts();
    updateBadges();
    setupGenericModalClosers();
    setupAdminProductForm();

    // Show the admin-only header button if this Telegram user is the admin.
    const adminBtn = document.getElementById('adminAddProductBtn');
    if (adminBtn) {
        adminBtn.classList.toggle('hidden', !isAdmin);
        adminBtn.addEventListener('click', () => openModal('adminProductModalOverlay'));
    }

    // ---- Search ----
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    document.getElementById('searchToggleBtn')?.addEventListener('click', () => {
        const bar = document.getElementById('searchBarContainer');
        bar?.classList.toggle('hidden');
        if (bar && !bar.classList.contains('hidden')) searchInput?.focus();
    });

    searchInput?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        searchClearBtn?.classList.toggle('hidden', state.searchQuery.length === 0);
        renderProducts();
    });

    searchClearBtn?.addEventListener('click', () => {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        searchClearBtn.classList.add('hidden');
        renderProducts();
        searchInput?.focus();
    });

    // ---- Hero CTA ----
    document.getElementById('heroCtaBtn')?.addEventListener('click', () => {
        document.getElementById('categoryNav')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ---- Cart Modal ----
    document.getElementById('cartToggleBtn')?.addEventListener('click', openCartSheet);
    document.getElementById('closeCartSheetBtn')?.addEventListener('click', () => closeModal('cartModalOverlay'));
    document.getElementById('browseFromCartBtn')?.addEventListener('click', () => {
        closeModal('cartModalOverlay');
        document.getElementById('productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ---- Favorites Sheet ----
    document.getElementById('favoritesToggleBtn')?.addEventListener('click', openFavoritesSheet);
    document.getElementById('closeFavSheetBtn')?.addEventListener('click', () => closeModal('favoritesModalOverlay'));

    // ---- Filter Sheet ----
    document.getElementById('openFilterBtn')?.addEventListener('click', () => {
        syncFilterSheetUI();
        openModal('filterModalOverlay');
    });
    document.getElementById('closeFilterSheetBtn')?.addEventListener('click', () => closeModal('filterModalOverlay'));

    setupFilterChipGroup('sortOptions', (chip) => { state.filters.sort = chip.dataset.sort; });
    setupFilterChipGroup('filterCategories', (chip) => {
        state.activeCategory = chip.dataset.category;
        state.filters.category = chip.dataset.category;
    });
    setupFilterChipGroup('filterAvailability', (chip) => { state.filters.availability = chip.dataset.availability; });
    setupFilterChipGroup('filterMaterials', (chip) => { state.filters.material = chip.dataset.material; });

    document.getElementById('applyFilterModalBtn')?.addEventListener('click', () => {
        closeModal('filterModalOverlay');
        renderCategories();
        renderProducts();
        updateActiveFiltersBar();
    });

    document.getElementById('resetFilterModalBtn')?.addEventListener('click', () => {
        resetAllFilters();
        syncFilterSheetUI();
        renderCategories();
        renderProducts();
        updateActiveFiltersBar();
    });

    document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        resetAllFilters(true);
        renderProducts();
        updateActiveFiltersBar();
    });

    // ---- Empty / Error states ----
    document.getElementById('emptyStateResetBtn')?.addEventListener('click', () => {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        searchClearBtn?.classList.add('hidden');
        resetAllFilters();
        renderCategories();
        renderProducts();
        updateActiveFiltersBar();
    });

    document.getElementById('retryBtn')?.addEventListener('click', () => {
        document.getElementById('errorState')?.classList.add('hidden');
        renderProducts();
    });

    // ---- Product Detail Modal ----
    document.getElementById('closeProductSheetBtn')?.addEventListener('click', () => closeModal('productModalOverlay'));

    document.getElementById('modalFavBtn')?.addEventListener('click', () => {
        if (state.selectedProduct) toggleFavorite(state.selectedProduct.id);
    });

    document.getElementById('modalQtyMinus')?.addEventListener('click', () => {
        if (state.selectedQuantity > 1) {
            state.selectedQuantity--;
            document.getElementById('modalQtyVal').textContent = state.selectedQuantity;
        }
    });

    document.getElementById('modalQtyPlus')?.addEventListener('click', () => {
        state.selectedQuantity++;
        document.getElementById('modalQtyVal').textContent = state.selectedQuantity;
    });

    document.getElementById('modalAddToCartBtn')?.addEventListener('click', () => {
        if (state.selectedProduct) {
            addToCart(state.selectedProduct.id, state.selectedQuantity);
            closeModal('productModalOverlay');
        }
    });

    // ---- Checkout Modal ----
    document.getElementById('closeCheckoutSheetBtn')?.addEventListener('click', () => closeModal('checkoutModalOverlay'));
    document.getElementById('getLocationBtn')?.addEventListener('click', handleLocation);
    document.getElementById('cartCheckoutBtn')?.addEventListener('click', openCheckoutSheet);
    document.getElementById('confirmOrderBtn')?.addEventListener('click', submitOrder);

    document.getElementById('custName')?.addEventListener('input', checkFormValidity);
    document.getElementById('custPhone')?.addEventListener('input', checkFormValidity);

    // ---- Success Modal ----
    document.getElementById('successContinueBtn')?.addEventListener('click', () => {
        closeModal('successModalOverlay');
        renderCartItems();
    });
});
