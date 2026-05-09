// js/contact.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    
    if (!fullname || !email || !message) {
        showToast('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        showToast('❌ Email không hợp lệ!');
        return;
    }
    
    // Lưu vào localStorage (giả lập gửi)
    const contacts = JSON.parse(localStorage.getItem('f1_contacts') || '[]');
    contacts.push({
        id: Date.now(),
        fullname,
        email,
        phone,
        message,
        date: new Date().toISOString()
    });
    localStorage.setItem('f1_contacts', JSON.stringify(contacts));
    
    showToast('✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.');
    e.target.reset();
}