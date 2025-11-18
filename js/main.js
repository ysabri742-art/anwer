// js/main.js - النسخة النهائية لـ Single Page Application (SPA)

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded - initializing global scripts...');
    
    // التهيئة المنطقية
    initializeMobileMenuLogic();
    setupSmoothScrolling();
    initializeScrollEffects();
});

// منطق فتح/غلق القائمة
function initializeMobileMenuLogic() {
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    
    if (!menuButton || !mobileMenu) return; 
    
    const mobileLinks = mobileMenu.querySelectorAll("a");
    let backdrop = document.querySelector(".mobile-menu-backdrop");

    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.classList.add("mobile-menu-backdrop");
        document.body.appendChild(backdrop);
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.classList.remove("menu-open");
        
        // إعادة أيقونة القائمة (إذا كانت تستخدم Font Awesome)
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    }

    menuButton.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("active");
        backdrop.classList.toggle("active");
        document.body.classList.toggle("menu-open");
        
        menuButton.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // يتم إغلاق القائمة عند النقر
            closeMobileMenu();
            // يتم التعامل مع التمرير بواسطة دالة setupSmoothScrolling
        });
    });

    backdrop.addEventListener("click", closeMobileMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // إغلاق القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023) {
            closeMobileMenu();
        }
    });
}

// التمرير الناعم إلى الـ IDs (مهم لـ SPA)
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // تعويض ارتفاع الهيدر الثابت
                const offset = 80; 
                
                window.scrollTo({
                    top: targetElement.offsetTop - offset, 
                    behavior: 'smooth'
                });
                
                // تحديث الـ active class (لتلوين الرابط في الشريط العلوي)
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                
                // التأكد من أن الرابط الذي تم الضغط عليه هو الرابط النشط
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
            }
        });
    });
}

// تغيير شكل الهيدر عند الـ scroll
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
                // header.style.backgroundColor = 'var(--primary-dark)'; // تم إزالة هذا التعديل ليعتمد على main-styles.css
            } else {
                header.classList.remove("scrolled");
            }
        });
    }
}

// إضافة مستمع لتغيير حجم النافذة لتحسين أداء الحركة
window.addEventListener('resize', () => {
    // إعادة حساب سرعة الحركة عند تغيير حجم النافذة
    if (window.dynamicContent && typeof window.dynamicContent.initializeCarouselScroll === 'function') {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        window.dynamicContent.initializeCarouselScroll(activeFilter);
    }
});