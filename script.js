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
    const mobileNav     = document.getElementById('mobileNav');
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
    const sidebar    = document.querySelector('.sidebar');
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
 
    /* =========================================
       PRICE RANGE FILTER
    ========================================= */
    const priceRange    = document.getElementById('priceRange');
    const priceRangeVal = document.getElementById('priceRangeVal');
    const filterTags    = document.querySelectorAll('.filter-tag');
 
    function applyPriceFilter(max) {
        document.querySelectorAll('.product-card').forEach(card => {
            const btn         = card.querySelector('.btn-add-cart');
            if (!btn) return;
            const onclickStr  = btn.getAttribute('onclick') || '';
            const priceMatch  = onclickStr.match(/,\s*(\d+)/);
            if (!priceMatch) return;
            const price       = parseInt(priceMatch[1]);
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
 
    /* =========================================
       SLIDER
    ========================================= */
    function initSlider(sectionEl) {
        const track   = sectionEl.querySelector('.slider-track');
        const btnPrev = sectionEl.querySelector('.btn-prev');
        const btnNext = sectionEl.querySelector('.btn-next');
        if (!track || !btnPrev || !btnNext) return;
        const cards   = track.querySelectorAll('.product-card');
        let currentIdx = 0;
 
        function getVisible() {
            const vw    = sectionEl.querySelector('.slider-viewport').offsetWidth;
            const cardW = cards[0].offsetWidth;
            return Math.max(1, Math.round(vw / (cardW + 14)));
        }
        function update() {
            const cardW = cards[0].offsetWidth;
            const gap   = parseFloat(getComputedStyle(track).gap) || 14;
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
       GIỎ HÀNG
    ========================================= */
    const cartSidebar        = document.getElementById('cartSidebar');
    const cartOverlay        = document.getElementById('cartOverlay');
    const cartIcon           = document.querySelector('.icon-btn .fa-shopping-cart')?.parentElement;
    const closeCartBtn       = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay   = document.getElementById('cartTotalValue');
    const cartCountBadge     = document.querySelector('.cart-count');
    let cart = [];
 
    const openCart  = () => { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); };
    const closeCart = () => { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); };
 
    cartIcon     && (cartIcon.onclick     = e => { e.preventDefault(); openCart(); });
    closeCartBtn && (closeCartBtn.onclick  = closeCart);
    cartOverlay  && (cartOverlay.onclick   = closeCart);
 
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
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString('vi-VN')}₫ × ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${idx})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        });
        if (!cart.length) {
            cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Giỏ hàng trống. Hãy chọn xe đua của bạn!</div>`;
        }
        cartTotalDisplay.innerText = total.toLocaleString('vi-VN') + '₫';
        if (cartCountBadge) cartCountBadge.innerText = count;
    }
 
    window.removeItem = idx => { cart.splice(idx, 1); updateCartUI(); };
 
    /* =========================================
       WISHLIST (lưu đủ thông tin sản phẩm)
    ========================================= */
    let wishlist = []; // mảng object: { name, price, img }
 
    const wishlistBtn      = document.getElementById('wishlistBtn');
    const wishlistPanel    = document.getElementById('wishlistPanel');
    const wishlistOverlay  = document.getElementById('wishlistOverlay');
    const closeWishlistBtn = document.getElementById('closeWishlist');
    const wishlistCountEl  = document.getElementById('wishlistCount');
    const wishlistItems    = document.getElementById('wishlistItems');
 
    function updateWishlistBadge() {
        if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
    }
 
    function updateWishlistUI() {
        if (!wishlistItems) return;
        wishlistItems.innerHTML = '';
        if (!wishlist.length) {
            wishlistItems.innerHTML = `<div class="empty-wish-msg"><i class="far fa-heart"></i><p>Chưa có sản phẩm yêu thích</p></div>`;
            return;
        }
        wishlist.forEach((item, idx) => {
            wishlistItems.innerHTML += `
                <div class="wish-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="wish-item-info">
                        <h4>${item.name}</h4>
                        <span class="wish-price">${item.price.toLocaleString('vi-VN')}₫</span>
                        <button class="wish-add-cart" onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                    <button class="wish-remove" onclick="removeWishItem(${idx})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>`;
        });
        updateWishlistBadge();
    }
 
    window.removeWishItem = function(idx) {
        const name = wishlist[idx].name;
        wishlist.splice(idx, 1);
        // sync lại nút tim trên card
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            const cardName = btn.closest('.product-card')?.querySelector('h4')?.textContent?.trim();
            if (cardName === name) {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
        updateWishlistBadge();
        updateWishlistUI();
    };
 
    const openWishlist  = () => { wishlistPanel?.classList.add('active'); wishlistOverlay?.classList.add('active'); };
    const closeWishlist = () => { wishlistPanel?.classList.remove('active'); wishlistOverlay?.classList.remove('active'); };
 
    wishlistBtn     && (wishlistBtn.onclick     = e => { e.preventDefault(); openWishlist(); });
    closeWishlistBtn && (closeWishlistBtn.onclick = closeWishlist);
    wishlistOverlay && (wishlistOverlay.onclick  = closeWishlist);
 
    window.toggleWishlist = function(btn) {
        const card  = btn.closest('.product-card');
        const name  = card.querySelector('h4')?.textContent?.trim() || '';
        const img   = card.querySelector('img')?.src || '';
        // lấy giá từ onclick của btn-add-cart
        const addBtn     = card.querySelector('.btn-add-cart');
        const onclickStr = addBtn?.getAttribute('onclick') || '';
        const priceMatch = onclickStr.match(/,\s*(\d+)/);
        const price      = priceMatch ? parseInt(priceMatch[1]) : 0;
 
        const idx = wishlist.findIndex(i => i.name === name);
        if (idx === -1) {
            wishlist.push({ name, price, img });
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            showToast(`❤️ Đã thêm vào yêu thích: ${name}`);
        } else {
            wishlist.splice(idx, 1);
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
        updateWishlistBadge();
        updateWishlistUI();
    };
 
    /* =========================================
       QUICK VIEW MODAL
    ========================================= */
    const qvModal = document.getElementById('quickviewModal');
    const qvClose = document.getElementById('quickviewClose');
    let qvCurrentName = '', qvCurrentPrice = 0, qvCurrentImg = '';
 
    window.openQuickView = function(btn) {
        const card      = btn.closest('.product-card');
        const img       = card.querySelector('img')?.src || '';
        const brand     = card.querySelector('.brand')?.textContent || '';
        const name      = card.querySelector('h4')?.textContent?.trim() || '';
        const oldPriceEl = card.querySelector('.old-price');
        const addBtn    = card.querySelector('.btn-add-cart');
        const onclickStr = addBtn?.getAttribute('onclick') || '';
        const priceMatch = onclickStr.match(/,\s*(\d+)/);
        const price     = priceMatch ? parseInt(priceMatch[1]) : 0;
 
        qvCurrentName = name; qvCurrentPrice = price; qvCurrentImg = img;
 
        document.getElementById('qvImg').src    = img;
        document.getElementById('qvBrand').textContent = brand;
        document.getElementById('qvName').textContent  = name;
        document.getElementById('qvPrice').textContent = price.toLocaleString('vi-VN') + '₫';
        document.getElementById('qvQty').value = 1;
 
        const oldPriceOut = document.getElementById('qvOldPrice');
        if (oldPriceEl) {
            oldPriceOut.textContent    = oldPriceEl.textContent;
            oldPriceOut.style.display  = '';
        } else {
            oldPriceOut.style.display = 'none';
        }
 
        const qvWishBtn = document.getElementById('qvWishlist');
        const inWish    = wishlist.some(i => i.name === name);
        qvWishBtn.innerHTML       = inWish ? '<i class="fas fa-heart"></i> Đã yêu thích' : '<i class="far fa-heart"></i> Yêu thích';
        qvWishBtn.style.background = inWish ? '#ff6b9d' : '';
        qvWishBtn.style.color      = inWish ? 'white' : '';
 
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
        const idx   = wishlist.findIndex(i => i.name === qvCurrentName);
        if (idx === -1) {
            wishlist.push({ name: qvCurrentName, price: qvCurrentPrice, img: qvCurrentImg });
            this.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
            this.style.background = '#ff6b9d'; this.style.color = 'white';
            showToast(`❤️ Đã thêm vào yêu thích: ${qvCurrentName}`);
        } else {
            wishlist.splice(idx, 1);
            this.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
            this.style.background = ''; this.style.color = '';
        }
        updateWishlistBadge();
        updateWishlistUI();
        // sync card button
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            const cardName = btn.closest('.product-card')?.querySelector('h4')?.textContent?.trim();
            if (cardName === qvCurrentName) {
                const inW = wishlist.some(i => i.name === qvCurrentName);
                btn.classList.toggle('active', inW);
                btn.innerHTML = inW ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            }
        });
    });
 
    window.changeQty = function(delta) {
        const inp = document.getElementById('qvQty');
        inp.value = Math.max(1, Math.min(99, parseInt(inp.value) + delta));
    };
 
    /* =========================================
       AUTH MODAL (giữ lại cho index.html)
    ========================================= */
    const authContainer = document.getElementById('authContainer');
    const authSignUpBtn = document.getElementById('authSignUp');
    const authSignInBtn = document.getElementById('authSignIn');
    const authModal     = document.getElementById('authModal');
    const userIcon      = document.querySelector('.icon-btn .fa-user')?.parentElement;
 
    if (authSignUpBtn) authSignUpBtn.onclick = () => authContainer?.classList.add('right-panel-active');
    if (authSignInBtn) authSignInBtn.onclick = () => authContainer?.classList.remove('right-panel-active');
    if (userIcon) userIcon.onclick = e => {
        e.preventDefault();
        // Nếu có login.html thì chuyển trang, không thì mở modal
        window.location.href = 'login.html';
    };
    document.querySelector('.auth-close')?.addEventListener('click', () => {
        if (authModal) authModal.style.display = 'none';
    });
 
    /* =========================================
       SCROLL TO TOP
    ========================================= */
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
 
    /* =========================================
       TOAST NOTIFICATION
    ========================================= */
    function showToast(msg) {
        let toast = document.getElementById('f1-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'f1-toast';
            Object.assign(toast.style, {
                position:   'fixed',
                bottom:     '24px',
                right:      '24px',
                background: '#111',
                color:      '#fff',
                padding:    '12px 20px',
                borderRadius: '10px',
                border:     '1px solid rgba(225,6,0,0.5)',
                opacity:    '0',
                transition: '0.3s',
                zIndex:     '9999',
                fontFamily: "'Titillium Web',sans-serif",
                fontSize:   '0.9rem',
                fontWeight: '600',
                boxShadow:  '0 8px 24px rgba(0,0,0,0.5)',
                maxWidth:   '300px',
                pointerEvents: 'none'
            });
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.opacity = '1';
        clearTimeout(toast._t);
        toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2400);
    }
 
});