// js/main.js - Bản sửa lỗi nút giỏ hàng và yêu thích (có log để debug)

// ========== HÀM TOÀN CỤC (luôn hoạt động ngay cả khi DOM chưa load) ==========
window.openCartSidebar = function() {
    console.log("openCartSidebar clicked");
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) {
        sidebar.classList.add('active');
        console.log("Cart sidebar opened");
    } else {
        console.error("Không tìm thấy #cartSidebar");
    }
    if (overlay) overlay.classList.add('active');
    // Cập nhật nội dung nếu hàm đã sẵn sàng
    if (typeof window.updateCartSidebarUI === 'function') {
        window.updateCartSidebarUI();
    }
};

window.openWishlistPanel = function() {
    console.log("openWishlistPanel clicked");
    const panel = document.getElementById('wishlistPanel');
    const overlay = document.getElementById('wishlistOverlay');
    if (panel) {
        panel.classList.add('active');
        console.log("Wishlist panel opened");
    } else {
        console.error("Không tìm thấy #wishlistPanel");
    }
    if (overlay) overlay.classList.add('active');
    if (typeof window.updateWishlistPanelUI === 'function') {
        window.updateWishlistPanelUI();
    }
};

// Hàm đóng an toàn
window.closeCartSidebar = function() {
    document.getElementById('cartSidebar')?.classList.remove('active');
    document.getElementById('cartOverlay')?.classList.remove('active');
};
window.closeWishlistPanel = function() {
    document.getElementById('wishlistPanel')?.classList.remove('active');
    document.getElementById('wishlistOverlay')?.classList.remove('active');
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM ready - main.js khởi tạo");

    // ========== CART SIDEBAR UI ==========
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotalValue');
    
    window.updateCartSidebarUI = function() {
        if (!cartItemsContainer) return;
        // Kiểm tra utils đã load chưa
        if (typeof getCart !== 'function') {
            console.warn("getCart() chưa sẵn sàng, thử lại sau 100ms");
            setTimeout(window.updateCartSidebarUI, 100);
            return;
        }
        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, idx) => {
            total += item.price * (item.quantity || 1);
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${escapeHtml(item.img || '')}" alt="${escapeHtml(item.name)}">
                    <div>
                        <h4>${escapeHtml(item.name)}</h4>
                        <p>${formatPrice(item.price)} × ${item.quantity || 1}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${idx})"><i class="fas fa-trash"></i></button>
                </div>`;
        });
        if (!cart.length) cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Giỏ hàng trống.</div>';
        if (cartTotalDisplay) cartTotalDisplay.innerText = formatPrice(total);
        if (typeof updateCartBadge === 'function') updateCartBadge();
    };

    // ========== WISHLIST PANEL UI ==========
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    
    window.updateWishlistPanelUI = function() {
        if (!wishlistItemsContainer) return;
        if (typeof getWishlist !== 'function') {
            console.warn("getWishlist() chưa sẵn sàng, thử lại sau 100ms");
            setTimeout(window.updateWishlistPanelUI, 100);
            return;
        }
        const wishlist = getWishlist();
        wishlistItemsContainer.innerHTML = '';
        if (!wishlist.length) {
            wishlistItemsContainer.innerHTML = '<div class="empty-wish-msg"><i class="far fa-heart"></i><p>Chưa có sản phẩm yêu thích</p></div>';
            return;
        }
        wishlist.forEach(item => {
            wishlistItemsContainer.innerHTML += `
                <div class="wish-item">
                    <img src="${escapeHtml(item.img || '')}" alt="${escapeHtml(item.name)}">
                    <div class="wish-item-info">
                        <h4>${escapeHtml(item.name)}</h4>
                        <span class="wish-price">${formatPrice(item.price)}</span>
                        <button class="wish-add-cart" onclick="addToCart('${escapeHtml(item.name)}', ${item.price}, '${escapeHtml(item.img)}')"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                    </div>
                    <button class="wish-remove" onclick="removeFromWishlist('${escapeHtml(item.name)}')"><i class="fas fa-times"></i></button>
                </div>`;
        });
        if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Gắn sự kiện đóng cho nút close và overlay
    const closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    if (closeCartBtn) closeCartBtn.onclick = window.closeCartSidebar;
    if (cartOverlay) cartOverlay.onclick = window.closeCartSidebar;

    const closeWishlistBtn = document.getElementById('closeWishlist');
    const wishlistOverlay = document.getElementById('wishlistOverlay');
    if (closeWishlistBtn) closeWishlistBtn.onclick = window.closeWishlistPanel;
    if (wishlistOverlay) wishlistOverlay.onclick = window.closeWishlistPanel;

    // Lắng nghe sự kiện cập nhật từ utils
    window.addEventListener('cartUpdated', () => {
        if (window.updateCartSidebarUI) window.updateCartSidebarUI();
        if (typeof updateCartBadge === 'function') updateCartBadge();
    });
    window.addEventListener('wishlistUpdated', () => {
        if (window.updateWishlistPanelUI) window.updateWishlistPanelUI();
        if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
        if (typeof syncAllWishlistButtons === 'function') syncAllWishlistButtons();
    });

    // Cập nhật lần đầu (đợi utils ready)
    setTimeout(() => {
        window.updateCartSidebarUI();
        window.updateWishlistPanelUI();
    }, 100);

    // Các phần khác giữ nguyên (accordion, mobile menu, slider, price filter, scroll top, auth modal)
    // ... (giữ nguyên code từ main.js cũ, chỉ thêm phần trên)

    // ========== GIỮ NGUYÊN CÁC PHẦN KHÁC TỪ FILE CŨ (accordion, mobile, slider, price, ...) ==========
    // (Bạn có thể chép phần còn lại của main.js cũ vào đây, nhưng tôi khuyên dùng toàn bộ file mới này)
});

document.addEventListener('DOMContentLoaded', () => {

    // ========== ACCORDION MENU (SIDEBAR) ==========
    document.querySelectorAll('.menu-main').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.menu-group');
            const isActive = group.classList.contains('active');
            document.querySelectorAll('.menu-group').forEach(g => g.classList.remove('active'));
            if (!isActive) group.classList.add('active');
        });
    });

    // ========== MOBILE MENU DRAWER ==========
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            mobileNav.classList.toggle('open', !isOpen);
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        });
        mobileNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // ========== SIDEBAR TOGGLE (mobile) ==========
    const sidebar = document.querySelector('.sidebar');
    const pageLayout = document.querySelector('.page-layout');
    if (sidebar && pageLayout) {
        let toggleBtn = document.getElementById('sidebarToggle');
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.id = 'sidebarToggle';
            pageLayout.insertBefore(toggleBtn, sidebar);
        }
        toggleBtn.textContent = '☰  Danh mục sản phẩm ▼';
        toggleBtn.addEventListener('click', () => {
            const open = sidebar.classList.toggle('mobile-open');
            toggleBtn.textContent = open ? '✕  Đóng danh mục ▲' : '☰  Danh mục sản phẩm ▼';
        });
    }

    // ========== PRICE RANGE FILTER (chỉ trên index.html có các thẻ này) ==========
    const priceRange = document.getElementById('priceRange');
    const priceRangeVal = document.getElementById('priceRangeVal');
    const filterTags = document.querySelectorAll('.filter-tag');

    function applyPriceFilter(max) {
        document.querySelectorAll('.product-card').forEach(card => {
            const btn = card.querySelector('.btn-add-cart');
            if (!btn) return;
            const onclickStr = btn.getAttribute('onclick') || '';
            const priceMatch = onclickStr.match(/,\s*(\d+)/);
            if (!priceMatch) return;
            const price = parseInt(priceMatch[1]);
            card.style.display = price <= max ? '' : 'none';
        });
    }

    if (priceRange) {
        priceRange.addEventListener('input', () => {
            const val = parseInt(priceRange.value);
            priceRangeVal.textContent = val.toLocaleString('vi-VN') + '₫';
            filterTags.forEach(t => t.classList.remove('active'));
            applyPriceFilter(val);
        });
    }

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            const max = parseInt(tag.dataset.max);
            if (priceRange) {
                priceRange.value = max;
                priceRangeVal.textContent = max.toLocaleString('vi-VN') + '₫';
            }
            applyPriceFilter(max);
        });
    });

    // ========== SLIDER ==========
    window.initSlider = function initSlider(sectionEl) {
        const track = sectionEl.querySelector('.slider-track');
        const btnPrev = sectionEl.querySelector('.btn-prev');
        const btnNext = sectionEl.querySelector('.btn-next');
        if (!track || !btnPrev || !btnNext) return;
        const cards = track.querySelectorAll('.product-card');
        let currentIdx = 0;

        function getVisible() {
            const vw = sectionEl.querySelector('.slider-viewport').offsetWidth;
            const cardW = cards[0].offsetWidth;
            return Math.max(1, Math.round(vw / (cardW + 14)));
        }
        function update() {
            const cardW = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 14;
            track.style.transform = `translateX(-${currentIdx * (cardW + gap)}px)`;
            btnPrev.disabled = currentIdx === 0;
            btnNext.disabled = currentIdx >= cards.length - getVisible();
        }
        btnPrev.onclick = () => { if (currentIdx > 0) { currentIdx--; update(); } };
        btnNext.onclick = () => { if (currentIdx < cards.length - getVisible()) { currentIdx++; update(); } };
        window.addEventListener('resize', () => { currentIdx = 0; update(); });
        update();
    }
    document.querySelectorAll('.slider-section').forEach(initSlider);

    // ========== GIỎ HÀNG (CART SIDEBAR) - Dùng localStorage qua utils ==========
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotalValue');

    const closeCart = () => { 
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
    };
    if (closeCartBtn) closeCartBtn.onclick = closeCart;
    if (cartOverlay) cartOverlay.onclick = closeCart;

    window.updateCartSidebarUI = function() {
        if (!cartItemsContainer) return;
        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div>
                        <h4>${escapeHtmlStatic(item.name)}</h4>
                        <p>${formatPrice(item.price)} × ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${idx})"><i class="fas fa-trash"></i></button>
                </div>`;
        });
        if (!cart.length) cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Giỏ hàng trống.</div>';
        if (cartTotalDisplay) cartTotalDisplay.innerText = formatPrice(total);
        if (window.updateCartBadge) window.updateCartBadge();
    };

    function escapeHtmlStatic(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    window.addEventListener('cartUpdated', () => {
        if (window.updateCartSidebarUI) window.updateCartSidebarUI();
        if (window.updateCartBadge) window.updateCartBadge();
    });
    window.updateCartSidebarUI();

    // ========== WISHLIST PANEL ==========
    const wishlistPanel = document.getElementById('wishlistPanel');
    const wishlistOverlay = document.getElementById('wishlistOverlay');
    const closeWishlistBtn = document.getElementById('closeWishlist');
    const wishlistItemsContainer = document.getElementById('wishlistItems');

    const closeWishlistFn = () => {
        if (wishlistPanel) wishlistPanel.classList.remove('active');
        if (wishlistOverlay) wishlistOverlay.classList.remove('active');
    };
    if (closeWishlistBtn) closeWishlistBtn.onclick = closeWishlistFn;
    if (wishlistOverlay) wishlistOverlay.onclick = closeWishlistFn;

    window.updateWishlistPanelUI = function() {
        if (!wishlistItemsContainer) return;
        const wishlist = getWishlist();
        wishlistItemsContainer.innerHTML = '';
        if (!wishlist.length) {
            wishlistItemsContainer.innerHTML = '<div class="empty-wish-msg"><i class="far fa-heart"></i><p>Chưa có sản phẩm yêu thích</p></div>';
            return;
        }
        wishlist.forEach(item => {
            wishlistItemsContainer.innerHTML += `
                <div class="wish-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="wish-item-info">
                        <h4>${escapeHtmlStatic(item.name)}</h4>
                        <span class="wish-price">${formatPrice(item.price)}</span>
                        <button class="wish-add-cart" onclick="addToCart('${escapeHtmlStatic(item.name)}', ${item.price}, '${item.img}')"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                    </div>
                    <button class="wish-remove" onclick="removeFromWishlist('${escapeHtmlStatic(item.name)}')"><i class="fas fa-times"></i></button>
                </div>`;
        });
        if (window.updateWishlistBadge) window.updateWishlistBadge();
    };

    window.addEventListener('wishlistUpdated', () => {
        if (window.updateWishlistPanelUI) window.updateWishlistPanelUI();
        if (window.updateWishlistBadge) window.updateWishlistBadge();
        if (window.syncAllWishlistButtons) window.syncAllWishlistButtons();
    });
    window.updateWishlistPanelUI();

    // ========== SCROLL TO TOP ==========
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ========== AUTH MODAL (chỉ trên login.html) ==========
    const authContainer = document.getElementById('authContainer');
    const authSignUpBtn = document.getElementById('authSignUp');
    const authSignInBtn = document.getElementById('authSignIn');
    if (authSignUpBtn) authSignUpBtn.onclick = () => authContainer.classList.add('right-panel-active');
    if (authSignInBtn) authSignInBtn.onclick = () => authContainer.classList.remove('right-panel-active');

});