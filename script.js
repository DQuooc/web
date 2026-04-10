document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       SIDEBAR MENU
    ========================================= */
    document.querySelectorAll('.menu-main').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.menu-group');
            const isActive = group.classList.contains('active');

            document.querySelectorAll('.menu-group')
                .forEach(g => g.classList.remove('active'));

            if (!isActive) group.classList.add('active');
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

        btnPrev.onclick = () => {
            if (currentIdx > 0) {
                currentIdx--;
                update();
            }
        };

        btnNext.onclick = () => {
            if (currentIdx < cards.length - getVisible()) {
                currentIdx++;
                update();
            }
        };

        window.addEventListener('resize', () => {
            currentIdx = 0;
            update();
        });

        update();
    }

    function login() {
    window.location.href = "index.html";
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

    if (authSignUpBtn) {
        authSignUpBtn.onclick = () => authContainer.classList.add("right-panel-active");
    }

    if (authSignInBtn) {
        authSignInBtn.onclick = () => authContainer.classList.remove("right-panel-active");
    }

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

    cartIcon && (cartIcon.onclick = (e) => {
        e.preventDefault();
        openCart();
    });

    closeCart && (closeCart.onclick = closeCartFunc);
    cartOverlay && (cartOverlay.onclick = closeCartFunc);

    /* ADD TO CART */
    window.addToCart = function(name, price, img) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name,
                price,
                img: img || 'img/default.jpg',
                quantity: 1
            });
        }

        updateCartUI();
        
        showToast(`✅ Đã thêm: ${name}`);
    };

    /* UPDATE UI */
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';

        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()}₫ x ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})">
    <i class="fas fa-trash"></i>
</button>
                   
                </div>
            `;
        });

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `Giỏ hàng trống`;
        }

        cartTotalDisplay.innerText = total.toLocaleString() + '₫';
        cartCountBadge.innerText = count;
    }

    /* REMOVE ITEM */
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    /* TOAST */
    function showToast(msg) {
        let toast = document.getElementById('f1-toast');

        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'f1-toast';

            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#000',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                opacity: '0',
                transition: '0.3s'
            });

            document.body.appendChild(toast);
        }

        toast.innerText = msg;
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }

});