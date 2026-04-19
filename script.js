document.addEventListener('DOMContentLoaded', () => {
 
    /* =========================================
       SIDEBAR MENU ACCORDION
    ========================================= */
    document.querySelectorAll('.menu-main').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.menu-group');
            const isActive = group.classList.contains('active');
            document.querySelectorAll('.menu-group').forEach(g => g.classList.remove('active'));
            if (!isActive) group.classList.add('active');
        });
    });
 
    /* =========================================
       MOBILE MENU DRAWER
    ========================================= */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            mobileNav.classList.toggle('open', !isOpen);
            mobileMenuBtn.innerHTML = isOpen
                ? '<i class="fas fa-bars"></i>'
                : '<i class="fas fa-times"></i>';
        });
        mobileNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
 
    /* =========================================
       SIDEBAR TOGGLE (tablet/mobile)
    ========================================= */
    // Tự tạo nút toggle nếu chưa có
    const sidebar = document.querySelector('.sidebar');
    const pageLayout = document.querySelector('.page-layout');
    if (sidebar && pageLayout) {
        const existing = document.getElementById('sidebarToggle');
        let toggleBtn = existing;
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.id = 'sidebarToggle';
            toggleBtn.style.cssText = 'display:none;width:100%;padding:11px 16px;background:rgba(225,6,0,0.12);border:1px solid rgba(225,6,0,0.3);color:white;border-radius:10px;font-family:\'Titillium Web\',sans-serif;font-weight:700;font-size:0.92rem;cursor:pointer;text-align:left;margin-bottom:8px;';
            pageLayout.insertBefore(toggleBtn, sidebar);
        }
        toggleBtn.textContent = '☰  Danh mục sản phẩm ▼';
        toggleBtn.addEventListener('click', () => {
            const open = sidebar.classList.toggle('mobile-open');
            toggleBtn.textContent = open ? '✕  Đóng danh mục ▲' : '☰  Danh mục sản phẩm ▼';
        });
    }
 
    /* =========================================
       PRICE RANGE FILTER
    ========================================= */
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
            if (priceRange) { priceRange.value = max; priceRangeVal.textContent = max.toLocaleString('vi-VN') + '₫'; }
            applyPriceFilter(max);
        });
    });
 
    /* =========================================
       SLIDER
    ========================================= */
    function initSlider(sectionEl) {
        const track = sectionEl.querySelector('.slider-track');
        const btnPrev = sectionEl.querySelector('.btn-prev');
        const btnNext = sectionEl.querySelector('.btn-next');
        if (!track || !btnPrev || !btnNext) return;
        const cards = track.querySelectorAll('.product-card');
        let currentIdx = 0;
 
        function getVisible() {
            const vw = sectionEl.querySelector('.slider-viewport').offsetWidth;
            const cardW = cards[0].offsetWidth;
            return Math.max(1, Math.round(vw / (cardW + 19)));
        }
        function update() {
            const cardW = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 19;
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
 
    /* =========================================
       AUTH MODAL
    ========================================= */
    const authContainer = document.getElementById('authContainer');
    const authSignUpBtn = document.getElementById('authSignUp');
    const authSignInBtn = document.getElementById('authSignIn');
    const authModal = document.getElementById('authModal');
    const userIcon = document.querySelector('.icon-btn .fa-user')?.parentElement;
 
    if (authSignUpBtn) authSignUpBtn.onclick = () => authContainer.classList.add('right-panel-active');
    if (authSignInBtn) authSignInBtn.onclick = () => authContainer.classList.remove('right-panel-active');
    if (userIcon) userIcon.onclick = e => { e.preventDefault(); authModal.style.display = 'block'; };
    document.querySelector('.auth-close')?.addEventListener('click', () => { authModal.style.display = 'none'; });
    window.onclick = e => { if (e.target === authModal) authModal.style.display = 'none'; };
 
    /* =========================================
       GIỎ HÀNG
    ========================================= */
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartIcon = document.querySelector('.icon-btn .fa-shopping-cart')?.parentElement;
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotalValue');
    const cartCountBadge = document.querySelector('.cart-count');
    let cart = [];
 
    const openCart = () => { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); };
    const closeCartFunc = () => { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); };
    cartIcon && (cartIcon.onclick = e => { e.preventDefault(); openCart(); });
    closeCartBtn && (closeCartBtn.onclick = closeCartFunc);
    cartOverlay && (cartOverlay.onclick = closeCartFunc);
 
    window.addToCart = function(name, price, img, qty = 1) {
        const existing = cart.find(i => i.name === name);
        if (existing) existing.quantity += qty;
        else cart.push({ name, price, img: img || 'img/default.jpg', quantity: qty });
        updateCartUI();
        showToast(`✅ Đã thêm: ${name}`);
    };
 
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0, count = 0;
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            count += item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div><h4>${item.name}</h4><p>${item.price.toLocaleString('vi-VN')}₫ × ${item.quantity}</p></div>
                    <button class="remove-btn" onclick="removeItem(${idx})"><i class="fas fa-trash"></i></button>
                </div>`;
        });
        if (!cart.length) cartItemsContainer.innerHTML = `<p style="color:#777;text-align:center;padding:2rem 0">Giỏ hàng trống. Hãy chọn xe đua của bạn!</p>`;
        cartTotalDisplay.innerText = total.toLocaleString('vi-VN') + '₫';
        if (cartCountBadge) cartCountBadge.innerText = count;
    }
    window.removeItem = idx => { cart.splice(idx, 1); updateCartUI(); };
 
    /* =========================================
       WISHLIST
    ========================================= */
    let wishlist = [];
    const wishlistCountEl = document.getElementById('wishlistCount');
 
    function updateWishlistBadge() {
        if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
    }
 
    window.toggleWishlist = function(btn) {
        const card = btn.closest('.product-card');
        const name = card.querySelector('h4')?.textContent?.trim() || '';
        const idx = wishlist.indexOf(name);
        if (idx === -1) {
            wishlist.push(name);
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            showToast(`❤️ Đã thêm vào yêu thích: ${name}`);
        } else {
            wishlist.splice(idx, 1);
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
        updateWishlistBadge();
    };
 
    /* =========================================
       QUICK VIEW MODAL
    ========================================= */
    const qvModal = document.getElementById('quickviewModal');
    const qvClose = document.getElementById('quickviewClose');
    let qvCurrentName = '', qvCurrentPrice = 0, qvCurrentImg = '';
 
    window.openQuickView = function(btn) {
        const card = btn.closest('.product-card');
        const img  = card.querySelector('img')?.src || '';
        const brand = card.querySelector('.brand')?.textContent || '';
        const name  = card.querySelector('h4')?.textContent?.trim() || '';
        const priceEl = card.querySelector('.price');
        const oldPriceEl = card.querySelector('.old-price');
        const addBtn = card.querySelector('.btn-add-cart');
        const onclickStr = addBtn?.getAttribute('onclick') || '';
        const priceMatch = onclickStr.match(/,\s*(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;
 
        qvCurrentName = name; qvCurrentPrice = price; qvCurrentImg = img;
 
        document.getElementById('qvImg').src = img;
        document.getElementById('qvBrand').textContent = brand;
        document.getElementById('qvName').textContent = name;
        document.getElementById('qvPrice').textContent = price.toLocaleString('vi-VN') + '₫';
        document.getElementById('qvQty').value = 1;
 
        const oldPriceOut = document.getElementById('qvOldPrice');
        if (oldPriceEl) {
            oldPriceOut.textContent = oldPriceEl.textContent;
            oldPriceOut.style.display = '';
        } else {
            oldPriceOut.style.display = 'none';
        }
 
        // Check wishlist state
        const qvWishBtn = document.getElementById('qvWishlist');
        if (wishlist.includes(name)) {
            qvWishBtn.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
            qvWishBtn.style.background = '#ff6b9d';
            qvWishBtn.style.color = 'white';
        } else {
            qvWishBtn.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
            qvWishBtn.style.background = '';
            qvWishBtn.style.color = '';
        }
 
        qvModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
 
    qvClose?.addEventListener('click', closeQV);
    qvModal?.addEventListener('click', e => { if (e.target === qvModal) closeQV(); });
    function closeQV() { qvModal.classList.remove('open'); document.body.style.overflow = ''; }
 
    document.getElementById('qvAddCart')?.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('qvQty').value) || 1;
        addToCart(qvCurrentName, qvCurrentPrice, qvCurrentImg, qty);
        closeQV();
    });
 
    document.getElementById('qvWishlist')?.addEventListener('click', function() {
        const idx = wishlist.indexOf(qvCurrentName);
        if (idx === -1) {
            wishlist.push(qvCurrentName);
            this.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
            this.style.background = '#ff6b9d'; this.style.color = 'white';
            showToast(`❤️ Đã thêm vào yêu thích: ${qvCurrentName}`);
        } else {
            wishlist.splice(idx, 1);
            this.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
            this.style.background = ''; this.style.color = '';
        }
        updateWishlistBadge();
        // Sync card button
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            const cardName = btn.closest('.product-card')?.querySelector('h4')?.textContent?.trim();
            if (cardName === qvCurrentName) {
                btn.classList.toggle('active', wishlist.includes(qvCurrentName));
                btn.innerHTML = wishlist.includes(qvCurrentName)
                    ? '<i class="fas fa-heart"></i>'
                    : '<i class="far fa-heart"></i>';
            }
        });
    });
 
    window.changeQty = function(delta) {
        const inp = document.getElementById('qvQty');
        const val = Math.max(1, Math.min(99, parseInt(inp.value) + delta));
        inp.value = val;
    };
 
    /* =========================================
       SCROLL TO TOP
    ========================================= */
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
 
    /* =========================================
       TOAST
    ========================================= */
    function showToast(msg) {
        let toast = document.getElementById('f1-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'f1-toast';
            Object.assign(toast.style, {
                position: 'fixed', bottom: '24px', right: '24px',
                background: '#111', color: '#fff',
                padding: '12px 22px', borderRadius: '10px',
                border: '1px solid rgba(225,6,0,0.5)',
                opacity: '0', transition: '0.3s', zIndex: '9999',
                fontFamily: "'Titillium Web',sans-serif",
                fontSize: '0.93rem', fontWeight: '600',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                maxWidth: '300px'
            });
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.opacity = '1';
        clearTimeout(toast._t);
        toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2400);
    }
 
});