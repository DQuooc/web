// Đảm bảo code chạy sau khi HTML đã tải xong
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Xử lý video banner (nếu có)
    const vid = document.querySelector(".banner-video video");
    if (vid) {
        document.addEventListener('click', () => {
            vid.muted = false;
            vid.play();
        }, { once: true });
    }

    // 2. Xử lý đóng/mở menu Sidebar
    // Phải khai báo biến này thì mới dùng forEach được
    const menuTitles = document.querySelectorAll('.menu-main');

    menuTitles.forEach(title => {
        title.addEventListener('click', () => {
            const parent = title.parentElement;
            
            // Toggle class active để đóng/mở
            parent.classList.toggle('active');
            
            // (Tùy chọn) Đóng các mục khác khi mở mục mới
            /*
            document.querySelectorAll('.menu-group').forEach(group => {
                if (group !== parent) group.classList.remove('active');
            });
            */
        });
    });
});
let currentPos = 0;

function updateButtonStatus() {
    const slider = document.getElementById('productSlider');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');
    const maxScroll = slider.scrollWidth - slider.parentElement.offsetWidth;

    // Ẩn nút Prev nếu đang ở vị trí đầu tiên (0)
    if (currentPos >= 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    // Ẩn nút Next nếu đã trượt đến cuối cùng
    if (Math.abs(currentPos) >= maxScroll) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }
}

function moveSlide(direction) {
    const slider = document.getElementById('productSlider');
    const cards = document.querySelectorAll('.product-grid-slider .product-card');
    const moveAmount = cards[0].offsetWidth + 20; 
    const maxScroll = slider.scrollWidth - slider.parentElement.offsetWidth;

    currentPos -= (direction * moveAmount);

    // Chặn giới hạn
    if (currentPos > 0) currentPos = 0;
    if (Math.abs(currentPos) > maxScroll) currentPos = -maxScroll;

    slider.style.transform = `translateX(${currentPos}px)`;
    
    // Cập nhật lại ẩn hiện nút sau khi trượt
    updateButtonStatus();
}

// Gọi hàm này ngay khi trang web vừa load để ẩn nút trái lúc đầu
document.addEventListener('DOMContentLoaded', updateButtonStatus);