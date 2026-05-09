// =============================================
//   F1 STORE — DATA SOURCE (products.js)
//   Tất cả JS đều import từ file này
// =============================================

const PRODUCTS = [
    // ─── RED BULL ────────────────────────────────────────────────────
    {
        id: 1,
        name: "Xe đua F1® Oracle Red Bull Racing RB20",
        brand: "RED BULL",
        team: "redbull",
        price: 699000,
        oldPrice: null,
        badge: "new",
        category: "lego-speed",
        img: "assets/images/lego/redbull/speed1.png",
        rating: 4.8,
        reviews: 127,
        desc: "Mô hình LEGO Speed Champions chính hãng. Tái hiện chiếc xe Oracle Red Bull Racing RB20 — cỗ máy vô địch của Max Verstappen mùa 2024. Gồm 238 mảnh, kèm mini-figure tay đua.",
        specs: [
            ["Mã SP",   "76925"],
            ["Tỷ lệ",   "1:17 Speed Champions"],
            ["Số mảnh", "238 mảnh"],
            ["Tay đua", "Max Verstappen"],
            ["Năm",     "2024"]
        ]
    },
    {
        id: 2,
        name: "Red Bull RB20 1:8 Scale",
        brand: "RED BULL",
        team: "redbull",
        price: 4250000,
        oldPrice: 5000000,
        badge: "sale",
        category: "lego-technic",
        img: "https://www.lego.com/cdn/cs/set/assets/blt2847611d46bfd9e7/42206_boxprod_v39_en-gb.png?format=webply&fit=bounds&quality=70&width=800&height=800&dpr=1.5",
        rating: 4.9,
        reviews: 88,
        desc: "LEGO Technic Red Bull RB20 tỷ lệ 1:8 — kiệt tác kỹ thuật với đầy đủ chi tiết cơ học, hộp số và cánh DRS. Bộ sưu tập đỉnh cao.",
        specs: [
            ["Mã SP",      "42206"],
            ["Tỷ lệ",      "1:8 Technic"],
            ["Số mảnh",    "1.580 mảnh"],
            ["Tay đua",    "Max Verstappen"],
            ["Chiều dài",  "55 cm"]
        ]
    },

    // ─── McLAREN ──────────────────────────────────────────────────────
    {
        id: 3,
        name: "Xe đua McLaren F1® Team MCL38",
        brand: "McLAREN",
        team: "mclaren",
        price: 699000,
        oldPrice: null,
        badge: "new",
        category: "lego-speed",
        img: "https://www.lego.com/cdn/cs/set/assets/bltaefe7da97d921e16/77251_boxprod_v39_en-gb.png?format=webply&fit=bounds&quality=70&width=800&height=800&dpr=1.5",
        rating: 4.8,
        reviews: 102,
        desc: "LEGO Speed Champions McLaren MCL38 — màu cam rực rỡ đặc trưng Papaya. Gồm 245 mảnh, kèm mini-figure Lando Norris.",
        specs: [
            ["Mã SP",   "77251"],
            ["Tỷ lệ",   "1:17 Speed Champions"],
            ["Số mảnh", "245 mảnh"],
            ["Tay đua", "Lando Norris"],
            ["Năm",     "2024"]
        ]
    },
    {
        id: 4,
        name: "Xe đua F1® McLaren MCL39",
        brand: "McLAREN",
        team: "mclaren",
        price: 6200000,
        oldPrice: 7750000,
        badge: "sale",
        category: "lego-technic",
        img: "https://www.lego.com/cdn/cs/set/assets/blt4d73eeeba610152c/blt94fedcc1daf48b2a-42228_boxprod_v39_en-us.png?format=webply&fit=bounds&quality=70&width=1200&height=1200&dpr=1.5",
        rating: 4.9,
        reviews: 209,
        desc: "LEGO Technic McLaren MCL39 tỷ lệ 1:8 — siêu mô hình 1.432 mảnh, động cơ V6 hybrid chuyển động, hộp số 8 cấp và cánh DRS điều chỉnh được. Trưng bày đẳng cấp.",
        specs: [
            ["Mã SP",      "42228"],
            ["Tỷ lệ",      "1:8 Technic"],
            ["Số mảnh",    "1.432 mảnh"],
            ["Tay đua",    "Norris / Piastri"],
            ["Chiều dài",  "58 cm"]
        ]
    },
    {
        id: 5,
        name: "McLaren Team Cap",
        brand: "McLAREN",
        team: "mclaren",
        price: 850000,
        oldPrice: null,
        badge: "hot",
        category: "fashion",
        img: "https://via.placeholder.com/600x420/111/ff8000?text=McLaren+Cap",
        rating: 4.6,
        reviews: 54,
        desc: "Mũ lưỡi trai chính hãng McLaren F1 Team 2026, chất liệu cao cấp, logo thêu nổi. Unisex, điều chỉnh được size.",
        specs: [
            ["Mã SP",     "MCL-CAP-26"],
            ["Chất liệu", "100% Cotton"],
            ["Size",      "Unisex - có chỉnh"],
            ["Màu",       "Papaya / Black"]
        ]
    },

    // ─── FERRARI ─────────────────────────────────────────────────────
    {
        id: 6,
        name: "Xe đua F1® Ferrari SF-24",
        brand: "FERRARI",
        team: "ferrari",
        price: 699000,
        oldPrice: null,
        badge: "new",
        category: "lego-speed",
        img: "https://www.lego.com/cdn/cs/set/assets/bltd193d7c8cfbfc4cd/77242_boxprod_v39_en-gb.png?format=webply&fit=bounds&quality=70&width=800&height=800&dpr=1.5",
        rating: 4.9,
        reviews: 143,
        desc: "Ferrari SF-24 trong thiết kế đỏ rực đặc trưng Scuderia Ferrari. Bộ lắp ráp LEGO chính hãng 239 mảnh, kèm mini-figure Leclerc và vô lăng tháo rời.",
        specs: [
            ["Mã SP",   "77242"],
            ["Tỷ lệ",   "1:17 Speed Champions"],
            ["Số mảnh", "239 mảnh"],
            ["Tay đua", "Charles Leclerc"],
            ["Năm",     "2024"]
        ]
    },
    {
        id: 7,
        name: "Ferrari Official Hoodie 2026",
        brand: "FERRARI",
        team: "ferrari",
        price: 1890000,
        oldPrice: null,
        badge: "hot",
        category: "fashion",
        img: "https://via.placeholder.com/600x420/dc0000/fff?text=Ferrari+Hoodie",
        rating: 4.7,
        reviews: 76,
        desc: "Áo hoodie chính hãng Scuderia Ferrari 2026, logo thêu nổi, vải cotton nỉ cao cấp. Limited edition mùa giải mới.",
        specs: [
            ["Mã SP",     "SF-HOOD-26"],
            ["Chất liệu", "80% Cotton / 20% Polyester"],
            ["Size",      "S / M / L / XL / XXL"],
            ["Màu",       "Ferrari Red / Black"]
        ]
    },

    // ─── MERCEDES ────────────────────────────────────────────────────
    {
        id: 8,
        name: "Xe đua Mercedes-AMG F1® W15",
        brand: "MERCEDES-AMG",
        team: "mercedes",
        price: 699000,
        oldPrice: null,
        badge: "new",
        category: "lego-speed",
        img: "https://www.lego.com/cdn/cs/set/assets/bltdebbd34296f1ce78/77244_boxprod_v39_en-gb.png?format=webply&fit=bounds&quality=70&width=800&height=800&dpr=1.5",
        rating: 4.7,
        reviews: 95,
        desc: "Mercedes-AMG F1 W15 màu xanh bạc hà huyền thoại. 236 mảnh LEGO Speed Champions, kèm mini-figure Lewis Hamilton.",
        specs: [
            ["Mã SP",   "77244"],
            ["Tỷ lệ",   "1:17 Speed Champions"],
            ["Số mảnh", "236 mảnh"],
            ["Tay đua", "Lewis Hamilton"],
            ["Năm",     "2024"]
        ]
    },

    // ─── AUDI ────────────────────────────────────────────────────────
    {
        id: 9,
        name: "Xe đua Audi Revolut F1® Team R26",
        brand: "AUDI",
        team: "audi",
        price: 699000,
        oldPrice: null,
        badge: "new",
        category: "lego-speed",
        img: "https://www.lego.com/cdn/cs/set/assets/bltabd8d686bcca8fca/blt480f8e3525715603-77259_boxprod_v39_en-gb.png?format=webply&fit=bounds&quality=70&width=800&height=800&dpr=1.5",
        rating: 4.6,
        reviews: 41,
        desc: "Ra mắt lần đầu! Xe đua Audi F1 Team R26 — LEGO Speed Champions 2026, 240 mảnh, thiết kế quattro đặc trưng.",
        specs: [
            ["Mã SP",   "77259"],
            ["Tỷ lệ",   "1:17 Speed Champions"],
            ["Số mảnh", "240 mảnh"],
            ["Năm",     "2026"]
        ]
    },

    // ─── ASTON MARTIN ────────────────────────────────────────────────
    {
        id: 10,
        name: "Aston Martin AMR24 Speed Champions",
        brand: "ASTON MARTIN",
        team: "astonmartin",
        price: 699000,
        oldPrice: null,
        badge: "new",
        category: "lego-speed",
        img: "https://via.placeholder.com/800x800/358c75/fff?text=AMR24",
        rating: 4.5,
        reviews: 33,
        desc: "LEGO Speed Champions Aston Martin AMR24 — màu xanh British Racing Green sang trọng, kèm mini-figure Fernando Alonso.",
        specs: [
            ["Mã SP",   "77248"],
            ["Tỷ lệ",   "1:17 Speed Champions"],
            ["Số mảnh", "233 mảnh"],
            ["Tay đua", "Fernando Alonso"],
            ["Năm",     "2024"]
        ]
    },

    // ─── WILLIAMS ────────────────────────────────────────────────────
    {
        id: 11,
        name: "Williams Racing FW46 Cap",
        brand: "WILLIAMS",
        team: "williams",
        price: 750000,
        oldPrice: null,
        badge: "new",
        category: "fashion",
        img: "https://via.placeholder.com/600x420/64c4ff/000?text=Williams+Cap",
        rating: 4.4,
        reviews: 28,
        desc: "Mũ lưỡi trai chính hãng Williams Racing 2026, thiết kế retro hiện đại, logo thêu nổi.",
        specs: [
            ["Mã SP",     "WR-CAP-26"],
            ["Chất liệu", "100% Cotton"],
            ["Size",      "Unisex - có chỉnh"],
            ["Màu",       "Blue / White"]
        ]
    },

    // ─── HAAS ────────────────────────────────────────────────────────
    {
        id: 12,
        name: "Haas F1 Team T-Shirt 2026",
        brand: "HAAS",
        team: "haas",
        price: 650000,
        oldPrice: 820000,
        badge: "sale",
        category: "fashion",
        img: "https://via.placeholder.com/600x420/333/fff?text=Haas+Tee",
        rating: 4.3,
        reviews: 19,
        desc: "Áo thun chính hãng Haas F1 Team 2026, mẫu mới nhất, chất liệu thể thao thoáng mát.",
        specs: [
            ["Mã SP",     "HAAS-TEE-26"],
            ["Chất liệu", "Polyester Sport"],
            ["Size",      "S / M / L / XL"],
            ["Màu",       "White / Red / Black"]
        ]
    },
];
window.PRODUCTS = PRODUCTS;