// js/animations.js - Simple & Stable
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleAnimations();
    initializeScrollAnimations();
    initializeCounterAnimation();
    initializeWhyUsAnimation(); 
    initializeFeaturesAnimation(); 
    initializeHoverEffects();
});

function initializeSimpleAnimations() {
    // العناصر الأساسية متعملهاش حاجة - لأن CSS هتهتم بيها
}

function initializeScrollAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // تأخير متدرج للكروت
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }, 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    featureCards.forEach(card => {
        observer.observe(card);
    });
}

function initializeCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                startCounters();
            }
        });
    });

    if (counters.length > 0) {
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }

    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', '').replace('%', ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (counter.textContent.includes('+')) {
                    counter.textContent = `+${Math.floor(current)}`;
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = `${Math.floor(current)}%`;
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
}

// 💥 الدالة التي تعمل بالتأخير الزمني والتناوب (النسخة المفضلة لديك) 💥
function initializeWhyUsAnimation() {
    const featureItems = document.querySelectorAll('.why-us-section .feature-item');
    
    // 1. تطبيق كلاسات الاتجاه أولاً
    featureItems.forEach((item, index) => {
        // إذا كان الفهرس زوجي (0, 2, 4...)، يبدأ من اليسار (كارت يسار)
        if (index % 2 === 0) {
            item.classList.add('slide-left');
        } 
        // إذا كان الفهرس فردي (1, 3, 5...)، يبدأ من اليمين (كارت يمين)
        else {
            item.classList.add('slide-right');
        }
    });

    // 2. إعداد Intersection Observer لتشغيل الحركة عند ظهور القسم
    const whyUsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 🛑 هذا الجزء يضمن الحركة المتتالية (كارت بعد كارت) 🛑
                featureItems.forEach((item, index) => {
                    // تطبيق كلاس 'animated' لتشغيل الحركة المحددة مسبقًا (slideInLeft/slideInRight)
                    setTimeout(() => {
                        item.classList.add('animated'); 
                    }, index * 150); // تأخير 150 ملي ثانية بين كل عنصر
                });
                
                // إيقاف المراقبة بعد تشغيل الحركة لمرة واحدة
                whyUsObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // تشغيل الحركة عندما يكون 10% من القسم مرئيًا
    });

    const whyUsSection = document.getElementById('whyUsSection');
    if (whyUsSection) {
        whyUsObserver.observe(whyUsSection);
    }
}

// Hover effects only - no conflicts
function initializeHoverEffects() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}
function initializeFeaturesAnimation() {
    const featureCards = document.querySelectorAll('.feature-card.animated-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = card.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, parseInt(delay));
                
                // نتوقف عن مراقبة الكارت بعد ظهوره
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // نبدأ مراقبة كل الكروت
    featureCards.forEach(card => {
        observer.observe(card);
    });
}


// Initialize hover effects
document.addEventListener('DOMContentLoaded', initializeHoverEffects);