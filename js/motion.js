// js/motion.js - Advanced Motion Effects
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeAdvancedAnimations();
    initializeScrollEffects();
});

// Particles.js Background
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#d4af37" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#d4af37",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            }
        });
    }
}

// Advanced Animations
function initializeAdvancedAnimations() {
    // Staggered animations for features
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    featureCards.forEach(card => observer.observe(card));

    // Stats animation
    const stats = document.querySelectorAll('.stat-item');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 300);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

// Parallax Effect


// Scroll-triggered animations
function initializeScrollEffects() {
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        scrollObserver.observe(el);
    });
}


