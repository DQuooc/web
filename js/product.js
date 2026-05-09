/* =============================================
   PRODUCT.JS — Logic cho product.html
   Đọc ?id=... từ URL, render chi tiết sản phẩm
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
    const params  = new URLSearchParams(window.location.search);
    const id      = parseInt(params.get("id"));
    const wrapper = document.getElementById("pdWrapper");
    const notFound = document.getElementById("pdNotFound");

    if (!id || !window.PRODUCTS) {
        notFound.style.display = "block";
        return;
    }

    const p = PRODUCTS.find(x => x.id === id);
    if (!p) {
        notFound.style.display = "block";
        return;
    }

    // ── Breadcrumb ──
    document.getElementById("bcProductName").textContent = p.name;
    document.title = p.name + " — F1 Store";

    // ── Team info ──
    const team = TEAMS.find(t => t.id === p.team);

    // ── Tính sale % ──
    const salePct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

    // ── Stars ──
    const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));

    // ── Specs HTML ──
    const specsHtml = (p.specs || []).map(([label, val]) => `
        <div class="pd-spec-row">
            <span class="pd-spec-label">${label}</span>
            <span class="pd-spec-value">${val}</span>
        </div>`).join("");

    // ── Team link ──
    const teamHtml = team ? `
        <a class="pd-team-link" href="team.html?team=${team.id}">
            <img src="${team.logo}" alt="${team.name}">
            Xem tất cả sản phẩm ${team.name}
        </a>` : "";

    // ── Badge ──
    let badgeHtml = "";
    if (p.badge) {
        const label = p.badge === "sale" && salePct
            ? `SALE -${salePct}%`
            : p.badge.toUpperCase();
        badgeHtml = `<span class="pd-badge ${p.badge}">${label}</span>`;
    }

    // ── Old price ──
    const oldPriceHtml = p.oldPrice
        ? `<span class="pd-old-price">${p.oldPrice.toLocaleString("vi-VN")}₫</span>`
        : "";

    // ── Render ──
    wrapper.innerHTML = `
        <!-- Gallery (trái) -->
        <div class="pd-gallery">
            <img id="pdMainImg" src="${p.img}" alt="${p.name}">
        </div>

        <!-- Info (phải) -->
        <div class="pd-info">
            ${badgeHtml}
            <p class="pd-brand">${p.brand}</p>
            <h1 class="pd-name">${p.name}</h1>

            <div class="pd-rating">
                <span style="color:#ffaa00">${stars}</span>
                <span>${p.rating}/5 <span>(${p.reviews} đánh giá)</span></span>
            </div>

            <div class="pd-price-row">
                <span class="pd-price">${p.price.toLocaleString("vi-VN")}₫</span>
                ${oldPriceHtml}
            </div>

            <div class="pd-divider"></div>

            <p class="pd-desc">${p.desc || ""}</p>

            ${specsHtml ? `<div class="pd-specs">${specsHtml}</div>` : ""}

            <div class="pd-divider"></div>

            ${teamHtml}

            <div class="pd-qty-row">
                <span class="pd-qty-label">Số lượng:</span>
                <div class="pd-qty-controls">
                    <button class="pd-qty-btn" id="pdQtyMinus">−</button>
                    <input class="pd-qty-input" type="number" id="pdQty" value="1" min="1" max="99" readonly>
                    <button class="pd-qty-btn" id="pdQtyPlus">+</button>
                </div>
            </div>

            <div class="pd-actions">
                <button class="pd-btn-cart" id="pdBtnCart">
                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                </button>
                <button class="pd-btn-wish" id="pdBtnWish">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>`;

    // ── Qty controls ──
    const qtyInput = document.getElementById("pdQty");
    document.getElementById("pdQtyMinus").addEventListener("click", () => {
        qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    });
    document.getElementById("pdQtyPlus").addEventListener("click", () => {
        qtyInput.value = Math.min(99, parseInt(qtyInput.value) + 1);
    });

    // ── Cart button ──
    document.getElementById("pdBtnCart").addEventListener("click", () => {
        const qty = parseInt(qtyInput.value) || 1;
        if (typeof addToCart === "function") {
            addToCart(p.name, p.price, p.img, qty);
        }
    });

    // ── Wishlist button ──
    const wishBtn = document.getElementById("pdBtnWish");
    function syncWishBtn() {
        const inWish = isInWishlist(p.name);
        wishBtn.className = "pd-btn-wish" + (inWish ? " active" : "");
        wishBtn.innerHTML = inWish
            ? '<i class="fas fa-heart"></i>'
            : '<i class="far fa-heart"></i>';
    }
    syncWishBtn();

    wishBtn.addEventListener("click", () => {
        toggleWishlist(p.name, p.price, p.img);
        syncWishBtn();
        if (typeof updateWishlistPanelUI === "function") updateWishlistPanelUI();
    });

    // ── Sản phẩm liên quan (cùng team, loại bỏ chính nó) ──
    renderRelated(p);
});

/* ── Render sản phẩm liên quan ── */
function renderRelated(p) {
    const related = PRODUCTS
        .filter(x => x.id !== p.id && (x.team === p.team || x.category === p.category))
        .slice(0, 4);

    if (!related.length) return;

    const section = document.createElement("section");
    section.style.cssText = "max-width:1100px;margin:0 auto;padding:0 var(--pad) 60px";
    section.innerHTML = `
        <div class="section-header" style="margin-bottom:1.2rem">
            <h3>SẢN PHẨM LIÊN QUAN</h3>
            <a href="team.html?team=${p.team}" class="view-all">Xem thêm →</a>
        </div>
        <div class="product-grid-static" id="relatedGrid"></div>`;
    document.querySelector(".pd-wrapper")?.after(section);

    const grid = section.querySelector("#relatedGrid");
    grid.innerHTML = related.map(rp => {
        const salePct = rp.oldPrice ? Math.round((1 - rp.price / rp.oldPrice) * 100) : null;
        const badgeLabel = rp.badge === "sale" && salePct
            ? `SALE -${salePct}%`
            : (rp.badge ? rp.badge.toUpperCase() : "");

        const priceHtml = rp.oldPrice
            ? `<div class="price-row-sale">
                   <div class="price-group">
                       <span class="old-price">${rp.oldPrice.toLocaleString("vi-VN")}₫</span>
                       <span class="price">${rp.price.toLocaleString("vi-VN")}₫</span>
                   </div>
                   <div class="btn-row">
                       <button class="btn-add-cart" onclick="event.stopPropagation();addToCart('${rp.name}',${rp.price},'${rp.img}')">
                           <i class="fas fa-shopping-cart"></i> Thêm giỏ
                       </button>
                   </div>
               </div>`
            : `<div class="price-row">
                   <span class="price">${rp.price.toLocaleString("vi-VN")}₫</span>
                   <div class="btn-row">
                       <button class="btn-add-cart" onclick="event.stopPropagation();addToCart('${rp.name}',${rp.price},'${rp.img}')">
                           <i class="fas fa-shopping-cart"></i> Thêm giỏ
                       </button>
                   </div>
               </div>`;

        return `
            <div class="product-card" style="cursor:pointer"
                 onclick="window.location.href='product.html?id=${rp.id}'">
                ${badgeLabel ? `<span class="badge ${rp.badge}">${badgeLabel}</span>` : ""}
                <div class="img-container">
                    <img src="${rp.img}" alt="${rp.name}" loading="lazy">
                </div>
                <p class="brand">${rp.brand}</p>
                <h4>${rp.name}</h4>
                ${priceHtml}
            </div>`;
    }).join("");
}