// js/team.js - Sửa lỗi click danh mục sidebar trái
document.addEventListener('DOMContentLoaded', function() {
    if (typeof PRODUCTS === 'undefined') {
        document.getElementById('productGrid').innerHTML = '<div class="no-results">Lỗi dữ liệu sản phẩm</div>';
        return;
    }

    // DOM elements
    const productGrid = document.getElementById('productGrid');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const productsCountLabel = document.getElementById('productsCountLabel');
    const teamTabs = document.getElementById('teamTabs');
    const priceRange = document.getElementById('priceRange');
    const priceRangeVal = document.getElementById('priceRangeVal');
    const filterTags = document.querySelectorAll('.filter-tag');

    // State
    let currentTeam = 'all';
    let currentCategory = 'all';
    let currentSort = 'default';
    let currentSearch = '';
    let currentMaxPrice = 10000000;

    // Lấy params từ URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('team')) currentTeam = urlParams.get('team');
    if (urlParams.get('category')) currentCategory = urlParams.get('category');

    // Lọc sản phẩm
    function getFilteredProducts() {
        let filtered = [...PRODUCTS];
        if (currentTeam !== 'all') filtered = filtered.filter(p => p.team === currentTeam);
        if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
        if (currentSearch.trim()) {
            const searchLower = currentSearch.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower) || p.brand.toLowerCase().includes(searchLower));
        }
        filtered = filtered.filter(p => p.price <= currentMaxPrice);
        switch(currentSort) {
            case 'price-asc': filtered.sort((a,b) => a.price - b.price); break;
            case 'price-desc': filtered.sort((a,b) => b.price - a.price); break;
            case 'rating': filtered.sort((a,b) => b.rating - a.rating); break;
            case 'newest': filtered.sort((a,b) => b.id - a.id); break;
        }
        return filtered;
    }

    // Render sản phẩm
    function renderProducts() {
        const products = getFilteredProducts();
        if (!productGrid) return;
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>Không tìm thấy sản phẩm phù hợp.</p></div>';
            if (productsCountLabel) productsCountLabel.innerHTML = 'Không có kết quả';
            return;
        }
        productGrid.innerHTML = products.map(p => window.renderProductCard(p, { showWishlistBtn: true, showCartBtn: true })).join('');
        if (productsCountLabel) productsCountLabel.innerHTML = `Hiển thị <strong>${products.length}</strong> sản phẩm`;
        if (typeof syncAllWishlistButtons === 'function') syncAllWishlistButtons();
    }

    // Render thanh đội đua
    function renderTeamTabs() {
        if (!teamTabs) return;
        const teams = window.TEAMS || [];
        const countMap = {};
        PRODUCTS.forEach(p => { countMap[p.team] = (countMap[p.team] || 0) + 1; });
        let html = `<div class="team-tab ${currentTeam === 'all' ? 'active' : ''}" data-team="all">🏁 Tất cả (${PRODUCTS.length})</div>`;
        teams.forEach(t => {
            const cnt = countMap[t.id] || 0;
            if (cnt === 0) return;
            html += `<div class="team-tab ${currentTeam === t.id ? 'active' : ''}" data-team="${t.id}"><img src="${t.logo}" alt="${t.name}"> ${t.name} (${cnt})</div>`;
        });
        teamTabs.innerHTML = html;
        document.querySelectorAll('.team-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const teamId = tab.dataset.team;
                currentTeam = teamId;
                currentCategory = 'all';
                updateUrl();
                renderAll();
            });
        });
    }

    // Hàm xử lý click danh mục
    function handleCategoryClick(e) {
        e.preventDefault();
        const catId = this.dataset.category;
        if (catId) {
            currentCategory = catId;
            currentTeam = 'all';
            updateUrl();
            renderAll();
            // Đánh dấu active
            document.querySelectorAll('.submenu a').forEach(a => a.style.color = '');
            this.style.color = 'var(--red)';
        }
    }

    // Gắn sự kiện cho các link danh mục (gọi sau mỗi lần render nếu cần, nhưng các link này tĩnh nên chỉ gắn một lần)
    function initCategoryLinks() {
        const categoryLinks = document.querySelectorAll('.submenu a');
        categoryLinks.forEach(link => {
            link.removeEventListener('click', handleCategoryClick);
            link.addEventListener('click', handleCategoryClick);
        });
        // Đánh dấu active ban đầu
        document.querySelectorAll('.submenu a').forEach(a => {
            if (a.dataset.category === currentCategory) a.style.color = 'var(--red)';
            else a.style.color = '';
        });
    }

    // Cập nhật URL
    function updateUrl() {
        const params = new URLSearchParams();
        if (currentTeam !== 'all') params.set('team', currentTeam);
        if (currentCategory !== 'all') params.set('category', currentCategory);
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        history.replaceState(null, '', newUrl);
    }

    // Render toàn bộ
    function renderAll() {
        renderTeamTabs();
        renderProducts();
        // Cập nhật active cho danh mục (do render lại có thể thay đổi currentCategory)
        document.querySelectorAll('.submenu a').forEach(a => {
            if (a.dataset.category === currentCategory) a.style.color = 'var(--red)';
            else a.style.color = '';
        });
    }

    // Sự kiện sort
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            renderProducts();
        });
    }

    // Sự kiện search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentSearch = searchInput.value;
            renderProducts();
        });
    }

    // Price range
    if (priceRange) {
        priceRange.addEventListener('input', () => {
            currentMaxPrice = parseInt(priceRange.value);
            priceRangeVal.textContent = currentMaxPrice.toLocaleString('vi-VN') + '₫';
            filterTags.forEach(t => t.classList.remove('active'));
            renderProducts();
        });
    }
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentMaxPrice = parseInt(tag.dataset.max);
            if (priceRange) {
                priceRange.value = currentMaxPrice;
                priceRangeVal.textContent = currentMaxPrice.toLocaleString('vi-VN') + '₫';
            }
            renderProducts();
        });
    });

    // Accordion menu cho sidebar
    document.querySelectorAll('.menu-main').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.menu-group');
            const isActive = group.classList.contains('active');
            document.querySelectorAll('.menu-group').forEach(g => g.classList.remove('active'));
            if (!isActive) group.classList.add('active');
        });
    });

    // Mobile filter toggle (nếu có)
    const filterBtn = document.getElementById('filterToggleBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    if (filterBtn && filterSidebar) {
        filterBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('mobile-closed');
            filterBtn.innerHTML = filterSidebar.classList.contains('mobile-closed')
                ? '<i class="fas fa-sliders-h"></i> Lọc &amp; Đội đua ▼'
                : '<i class="fas fa-times"></i> Đóng bộ lọc ▲';
        });
    }

    // Khởi tạo
    renderAll();
    initCategoryLinks();
});