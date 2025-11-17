// js/animations.js - Simple & Stable
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleAnimations();
    initializeScrollAnimations();
    initializeCounterAnimation();
});

function initializeSimpleAnimations() {
    // العناصر الأساسية متعملهاش حاجة - لأن CSS هتهتم بيها
    console.log('Simple animations initialized');
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

// Initialize hover effects
document.addEventListener('DOMContentLoaded', initializeHoverEffects);