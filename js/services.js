// js/services.js
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
});

function initializeServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // إضافة تأخير متدرج للكروت (بدون انيميشن انزلاق)
    serviceCards.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        
        // تأثير عند الظهور (فقط fade-in)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(card);
    });
}