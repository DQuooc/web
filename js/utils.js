/* =============================================
   UTILS.JS — Các hàm dùng chung cho toàn bộ trang
   TRÁI TIM của dự án — KHÔNG phụ thuộc vào DOM cụ thể
   ============================================= */

// ==================== ĐỊNH DẠNG ====================
window.formatPrice = (price) => {
    if (price === undefined || price === null) return '0₫';
    return price.toLocaleString('vi-VN') + '₫';
};

window.formatNumber = (num) => {
    return num.toLocaleString('vi-VN');
};

// ==================== URL & QUERY PARAMETERS ====================
window.getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

window.getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
};

window.updateUrlParams = (params, replace = true) => {
    const urlParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all' && params[key] !== '') {
            urlParams.set(key, params[key]);
        } else {
            urlParams.delete(key);
        }
    });
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    if (replace) {
        history.replaceState(null, '', newUrl);
    } else {
        history.pushState(null, '', newUrl);
    }
};

// ==================== LOCAL STORAGE ====================
window.loadFromStorage = (key, defaultValue = []) => {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error(`Lỗi parse ${key} từ localStorage:`, e);
        return defaultValue;
    }
};

window.saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// ==================== TOAST NOTIFICATION ====================
let toastTimeout = null;
window.showToast = (message, type = 'info') => {
    let toast = document.getElementById('f1-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'f1-toast';
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#111',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(225,6,0,0.5)',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            zIndex: '9999',
            fontFamily: "'Titillium Web', sans-serif",
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            maxWidth: '300px',
            pointerEvents: 'none'
        });
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2400);
};

// ==================== GIỎ HÀNG (CART) ====================
window.getCart = () => loadFromStorage('f1_cart', []);
window.saveCart = (cart) => saveToStorage('f1_cart', cart);

window.addToCart = (name, price, img, quantity = 1) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
        cart.push({ name, price, img, quantity: quantity });
    }
    
    saveCart(cart);
    updateCartBadge();
    showToast(`✅ Đã thêm "${name}" vào giỏ hàng!`);
    window.dispatchEvent(new Event('cartUpdated'));
};

window.removeFromCart = (index) => {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartBadge();
    window.dispatchEvent(new Event('cartUpdated'));
};

window.updateCartItemQuantity = (index, quantity) => {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity = Math.max(1, Math.min(99, quantity));
        saveCart(cart);
        updateCartBadge();
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

window.getCartTotal = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
};

window.getCartItemCount = () => {
    const cart = getCart();
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
};

window.updateCartBadge = () => {
    const count = getCartItemCount();
    document.querySelectorAll('.cart-count, #cart-count').forEach(el => {
        el.textContent = count;
    });
};

// ==================== YÊU THÍCH (WISHLIST) ====================
window.getWishlist = () => loadFromStorage('f1_wishlist', []);
window.saveWishlist = (wishlist) => saveToStorage('f1_wishlist', wishlist);

window.addToWishlist = (name, price, img) => {
    const wishlist = getWishlist();
    if (!wishlist.some(item => item.name === name)) {
        wishlist.push({ name, price, img });
        saveWishlist(wishlist);
        updateWishlistBadge();
        showToast(`❤️ Đã thêm "${name}" vào danh sách yêu thích!`);
        window.dispatchEvent(new Event('wishlistUpdated'));
        return true;
    }
    return false;
};

window.removeFromWishlist = (name) => {
    const wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.name === name);
    if (index !== -1) {
        wishlist.splice(index, 1);
        saveWishlist(wishlist);
        updateWishlistBadge();
        showToast(`💔 Đã xóa "${name}" khỏi danh sách yêu thích!`);
        window.dispatchEvent(new Event('wishlistUpdated'));
        return true;
    }
    return false;
};

window.toggleWishlist = (name, price, img) => {
    const wishlist = getWishlist();
    const exists = wishlist.some(item => item.name === name);
    if (exists) {
        removeFromWishlist(name);
        return false;
    } else {
        addToWishlist(name, price, img);
        return true;
    }
};

window.isInWishlist = (name) => {
    const wishlist = getWishlist();
    return wishlist.some(item => item.name === name);
};

window.updateWishlistBadge = () => {
    const count = getWishlist().length;
    document.querySelectorAll('#wishlistCount, .wishlist-count').forEach(el => {
        el.textContent = count;
    });
};

// ==================== RENDER PRODUCT CARD (DÙNG CHUNG) ====================
window.renderProductCard = (product, options = {}) => {
    const { layout = 'grid', showWishlistBtn = true, showCartBtn = true } = options;
    const salePercent = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
    const badgeLabel = product.badge === 'sale' && salePercent ? `SALE -${salePercent}%` : (product.badge ? product.badge.toUpperCase() : '');
    
    // Kiểm tra trạng thái yêu thích
    const isWishlisted = isInWishlist(product.name);
    const wishlistIcon = isWishlisted ? 'fas fa-heart' : 'far fa-heart';
    
    const priceHTML = product.oldPrice ? `
        <div class="price-row-sale">
            <div class="price-group">
                <span class="old-price">${formatPrice(product.oldPrice)}</span>
                <span class="price">${formatPrice(product.price)}</span>
            </div>
            <div class="btn-row">
                ${showCartBtn ? `<button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${escapeHtml(product.name)}', ${product.price}, '${escapeHtml(product.img)}')">
                    <i class="fas fa-shopping-cart"></i> Thêm giỏ
                </button>` : ''}
                ${showWishlistBtn ? `<button class="btn-wish-inline" onclick="event.stopPropagation(); toggleWishlist('${escapeHtml(product.name)}', ${product.price}, '${escapeHtml(product.img)}'); updateWishlistButton(this, '${escapeHtml(product.name)}');">
                    <i class="${wishlistIcon}"></i>
                </button>` : ''}
            </div>
        </div>
    ` : `
        <div class="price-row">
            <span class="price">${formatPrice(product.price)}</span>
            <div class="btn-row">
                ${showCartBtn ? `<button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${escapeHtml(product.name)}', ${product.price}, '${escapeHtml(product.img)}')">
                    <i class="fas fa-shopping-cart"></i> Thêm giỏ
                </button>` : ''}
                ${showWishlistBtn ? `<button class="btn-wish-inline" onclick="event.stopPropagation(); toggleWishlist('${escapeHtml(product.name)}', ${product.price}, '${escapeHtml(product.img)}'); updateWishlistButton(this, '${escapeHtml(product.name)}');">
                    <i class="${wishlistIcon}"></i>
                </button>` : ''}
            </div>
        </div>
    `;
    
    const specsJson = JSON.stringify(product.specs || []).replace(/"/g, '&quot;');
    const teamObj = window.TEAMS ? window.TEAMS.find(t => t.id === product.team) : null;
    
    // (ĐÃ XÓA nút yêu thích trên ảnh)
    return `
        <div class="product-card" data-id="${product.id}" data-product-name="${escapeHtml(product.name)}"
             data-specs="${specsJson}"
             data-desc="${escapeHtml(product.desc || '')}"
             data-rating="${product.rating}"
             data-reviews="${product.reviews}"
             data-badge="${product.badge || ''}"
             data-price="${product.price}"
             data-img="${escapeHtml(product.img)}"
             data-brand="${escapeHtml(product.brand)}"
             onclick="openProductModalFromCard(this)">
            ${badgeLabel ? `<span class="badge ${product.badge}">${badgeLabel}</span>` : ''}
            <div class="img-container">
                <img src="${escapeHtml(product.img)}" alt="${escapeHtml(product.name)}" loading="lazy">
                <!-- KHÔNG còn nút wishlist trên ảnh nữa -->
            </div>
            ${teamObj ? `<div class="team-chip" style="--chip-color:${teamObj.color}">
                <img src="${teamObj.logo}" alt="${teamObj.name}"> ${teamObj.name}
            </div>` : ''}
            <p class="brand">${escapeHtml(product.brand)}</p>
            <h4>${escapeHtml(product.name)}</h4>
            ${priceHTML}
        </div>
    `;
};

// Helper: escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Cập nhật trạng thái nút wishlist
window.updateWishlistButton = (btn, productName) => {
    if (!btn) return;
    const isActive = isInWishlist(productName);
    if (isActive) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
    }
};

// Đồng bộ tất cả nút wishlist trên trang
window.syncAllWishlistButtons = () => {
    document.querySelectorAll('.product-card').forEach(card => {
        const productName = card.dataset.productName;
        if (productName) {
            const wishlistBtn = card.querySelector('.btn-wishlist, .btn-wish-inline');
            if (wishlistBtn) {
                updateWishlistButton(wishlistBtn, productName);
            }
        }
    });
};

// ==================== MODAL CHI TIẾT SẢN PHẨM ====================
let currentModalProduct = null;

window.openProductModalFromCard = (cardElement) => {
    // Lấy dữ liệu từ dataset của card
    const product = {
        id: parseInt(cardElement.dataset.id),
        name: cardElement.dataset.productName,
        brand: cardElement.dataset.brand,
        price: parseInt(cardElement.dataset.price),
        img: cardElement.dataset.img,
        desc: cardElement.dataset.desc,
        rating: parseFloat(cardElement.dataset.rating),
        reviews: parseInt(cardElement.dataset.reviews),
        badge: cardElement.dataset.badge,
        specs: JSON.parse(cardElement.dataset.specs || '[]')
    };
    
    // Tìm oldPrice từ card (nếu có)
    const oldPriceEl = cardElement.querySelector('.old-price');
    if (oldPriceEl) {
        const oldPriceText = oldPriceEl.textContent.replace(/[^0-9]/g, '');
        product.oldPrice = parseInt(oldPriceText);
    }
    
    openProductModal(product);
};

window.openProductModal = (product) => {
    currentModalProduct = product;
    const overlay = document.getElementById('productModalOverlay');
    if (!overlay) return;
    
    const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
    const inWishlist = isInWishlist(product.name);
    
    // Điền thông tin
    document.getElementById('pmImg').src = product.img;
    document.getElementById('pmBrand').textContent = product.brand;
    document.getElementById('pmName').textContent = product.name;
    document.getElementById('pmPrice').textContent = formatPrice(product.price);
    document.getElementById('pmQty').value = 1;
    document.getElementById('pmStars').innerHTML = `<span style="color:#ffaa00">${stars}</span> <span>${product.rating}/5 (${product.reviews} đánh giá)</span>`;
    document.getElementById('pmDesc').textContent = product.desc || 'Sản phẩm chính hãng, bảo hành 12 tháng. Giao hàng toàn quốc.';
    
    // Badge
    const pmBadge = document.getElementById('pmBadge');
    if (product.badge) {
        const salePercent = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
        const badgeText = product.badge === 'sale' && salePercent ? `SALE -${salePercent}%` : product.badge.toUpperCase();
        pmBadge.textContent = badgeText;
        pmBadge.className = `pm-badge ${product.badge}`;
        pmBadge.style.display = 'inline-block';
    } else {
        pmBadge.style.display = 'none';
    }
    
    // Old price
    const pmOldPrice = document.getElementById('pmOldPrice');
    if (product.oldPrice) {
        pmOldPrice.textContent = formatPrice(product.oldPrice);
        pmOldPrice.style.display = '';
    } else {
        pmOldPrice.style.display = 'none';
    }
    
    // Specs
    const specsEl = document.getElementById('pmSpecs');
    specsEl.innerHTML = (product.specs || []).map(([label, val]) => `
        <div class="pm-spec-row">
            <span class="pm-spec-label">${escapeHtml(label)}</span>
            <span class="pm-spec-value">${escapeHtml(val)}</span>
        </div>
    `).join('');
    
    // Wishlist button
    const pmWishBtn = document.getElementById('pmBtnWish');
    pmWishBtn.className = `pm-btn-wish${inWishlist ? ' active' : ''}`;
    pmWishBtn.innerHTML = inWishlist ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    
    // Cart button handler
    document.getElementById('pmBtnCart').onclick = () => {
        const qty = parseInt(document.getElementById('pmQty').value) || 1;
        addToCart(product.name, product.price, product.img, qty);
        closeProductModal();
    };
    
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeProductModal = (e) => {
    // Nếu được gọi từ onclick overlay, chỉ đóng khi click đúng vào overlay (không phải modal bên trong)
    if (e && e.target && e.target.id !== 'productModalOverlay') return;
    const overlay = document.getElementById('productModalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};

// Alias cho nút X (đóng trực tiếp, không cần kiểm tra event target)
window.closeProductModalDirect = () => {
    const overlay = document.getElementById('productModalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};

window.pmChangeQty = (delta) => {
    const input = document.getElementById('pmQty');
    if (input) {
        input.value = Math.max(1, Math.min(99, parseInt(input.value) + delta));
    }
};

window.pmToggleWishlist = () => {
    if (!currentModalProduct) return;
    toggleWishlist(currentModalProduct.name, currentModalProduct.price, currentModalProduct.img);
    const inWishlist = isInWishlist(currentModalProduct.name);
    const pmWishBtn = document.getElementById('pmBtnWish');
    pmWishBtn.className = `pm-btn-wish${inWishlist ? ' active' : ''}`;
    pmWishBtn.innerHTML = inWishlist ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    syncAllWishlistButtons();
};

// Alias — HTML dùng onclick="pmToggleWish()" (không có 'list')
window.pmToggleWish = window.pmToggleWishlist;

// ==================== RENDER PRODUCT GRID (DÙNG CHUNG) ====================
window.renderProductGrid = (products, containerId, options = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>Không tìm thấy sản phẩm phù hợp.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => renderProductCard(product, options)).join('');
    syncAllWishlistButtons();
};

// ==================== KHỞI TẠO & SỰ KIỆN TOÀN CỤC ====================
window.initUtils = () => {
    updateCartBadge();
    updateWishlistBadge();
    syncAllWishlistButtons();
    
    // Lắng nghe sự kiện từ localStorage (khi có tab khác thay đổi)
    window.addEventListener('storage', (e) => {
        if (e.key === 'f1_cart') {
            updateCartBadge();
            window.dispatchEvent(new Event('cartUpdated'));
        }
        if (e.key === 'f1_wishlist') {
            updateWishlistBadge();
            syncAllWishlistButtons();
            window.dispatchEvent(new Event('wishlistUpdated'));
        }
    });
    
    // Đóng modal khi nhấn ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProductModalDirect();
    });
};

// Tự động khởi tạo khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtils);
} else {
    initUtils();
}