document.addEventListener('DOMContentLoaded', () => {
 
    /* =========================================
       SIDEBAR MENU (Category accordion)
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
       MOBILE MENU (Hamburger nav drawer)
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
 
        // Close when a link is clicked
        mobileNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
 
    /* =========================================
       MOBILE SIDEBAR TOGGLE
    ========================================= */
    const sidebarToggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
 
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            sidebarToggleBtn.textContent = sidebar.classList.contains('mobile-open')
                ? 'Ẩn danh mục ▲'
                : 'Danh mục sản phẩm ▼';
        });
    }
 
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
            return Math.round(vw / (cardW + 22)) || 1;
        }
 
        function update() {
            const cardW = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 22;
            const offset = currentIdx * (cardW + gap);
            track.style.transform = `translateX(-${offset}px)`;
            const visible = getVisible();
            btnPrev.disabled = currentIdx === 0;
            btnNext.disabled = currentIdx >= cards.length - visible;
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
    const authContainer = document.getElementById("authContainer");
    const authSignUpBtn = document.getElementById("authSignUp");
    const authSignInBtn = document.getElementById("authSignIn");
    const authModal = document.getElementById("authModal");
    const userIcon = document.querySelector(".icon-btn .fa-user")?.parentElement;
 
    if (authSignUpBtn) authSignUpBtn.onclick = () => authContainer.classList.add("right-panel-active");
    if (authSignInBtn) authSignInBtn.onclick = () => authContainer.classList.remove("right-panel-active");
 
    if (userIcon) {
        userIcon.onclick = (e) => {
            e.preventDefault();
            authModal.style.display = "block";
        };
    }
    document.querySelector(".auth-close")?.addEventListener("click", () => {
        authModal.style.display = "none";
    });
    window.onclick = (e) => {
        if (e.target == authModal) authModal.style.display = "none";
    };
 
    /* =========================================
       GIỎ HÀNG
    ========================================= */
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartIcon = document.querySelector(".icon-btn .fa-shopping-cart")?.parentElement;
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotalValue');
    const cartCountBadge = document.querySelector('.cart-count');
 
    let cart = [];
 
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }
    function closeCartFunc() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
 
    cartIcon && (cartIcon.onclick = (e) => { e.preventDefault(); openCart(); });
    closeCart && (closeCart.onclick = closeCartFunc);
    cartOverlay && (cartOverlay.onclick = closeCartFunc);
 
    window.addToCart = function(name, price, img) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, img: img || 'img/default.jpg', quantity: 1 });
        }
        updateCartUI();
        showToast(`✅ Đã thêm: ${name}`);
    };
 
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0, count = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()}₫ × ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="color:#777;text-align:center;padding:2rem 0">Giỏ hàng trống. Hãy chọn xe đua của bạn!</p>`;
        }
        cartTotalDisplay.innerText = total.toLocaleString() + '₫';
        if (cartCountBadge) cartCountBadge.innerText = count;
    }
 
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };
 
    function showToast(msg) {
        let toast = document.getElementById('f1-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'f1-toast';
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '24px',
                right: '20px',
                background: '#111',
                color: '#fff',
                padding: '12px 22px',
                borderRadius: '10px',
                border: '1px solid rgba(225,6,0,0.5)',
                opacity: '0',
                transition: '0.3s',
                zIndex: '9999',
                fontFamily: "'Titillium Web', sans-serif",
                fontSize: '0.95rem',
                fontWeight: '600',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            });
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 2200);
    }
 
});
 