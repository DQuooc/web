// js/news.js
document.addEventListener('DOMContentLoaded', () => {
    renderNewsList();
});

function renderNewsList() {
    const container = document.getElementById('newsGrid');
    if (!container) return;
    
    const news = window.NEWS || [];
    if (news.length === 0) {
        container.innerHTML = '<p>Chưa có tin tức nào.</p>';
        return;
    }
    
    container.innerHTML = news.map(item => `
        <div class="news-card" onclick="openNewsDetail(${item.id})">
            <div class="news-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/600x400/333/fff?text=News'">
            </div>
            <div class="news-content">
                <div class="news-date"><i class="far fa-calendar-alt"></i> ${formatDate(item.date)}</div>
                <h3 class="news-title">${escapeHtml(item.title)}</h3>
                <p class="news-summary">${escapeHtml(item.summary)}</p>
                <a href="#" class="news-readmore" onclick="event.stopPropagation(); openNewsDetail(${item.id})">Đọc tiếp →</a>
            </div>
        </div>
    `).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

function openNewsDetail(id) {
    const news = window.NEWS || [];
    const item = news.find(n => n.id === id);
    if (!item) return;
    // Hiển thị modal hoặc chuyển trang - tạm thời dùng alert
    alert(`📰 ${item.title}\n\n${item.content}`);
    // Bạn có thể mở modal chi tiết ở đây nếu muốn
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}