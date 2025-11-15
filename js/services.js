// js/services.js
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
    initializeServiceModal();
});

function initializeServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // إضافة تأخير متدرج للكروت
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        // تأثير عند الظهور
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(card);
    });
}

function initializeServiceModal() {
    const serviceCards = document.querySelectorAll('.service-card');
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <div id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // إغلاق المودال
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // إضافة حدث لكل كارد
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('h3').textContent;
            const serviceDescription = this.querySelector('p').textContent;
            const serviceFeatures = Array.from(this.querySelectorAll('.service-features span'))
                .map(span => span.textContent.trim());
            
            showServiceDetails(serviceTitle, serviceDescription, serviceFeatures);
        });
    });

    function showServiceDetails(title, description, features) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="service-details">
                <h4>المميزات:</h4>
                <ul>
                    ${features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-actions">
                <a href="contact.html" class="btn btn-primary">اطلب هذه الخدمة</a>
                <a href="calculator.html" class="btn btn-secondary">احسب سعر الخدمة</a>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // إغلاق بالزر ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// تأثيرات إضافية عند التمرير
function initializeScrollEffects() {
    const ctaSection = document.querySelector('.cta-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.3 });

    if (ctaSection) {
        observer.observe(ctaSection);
    }
}

// تهيئة تأثيرات التمرير
document.addEventListener('DOMContentLoaded', initializeScrollEffects);