// js/main.js - Fixed Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeScrollEffects();
});

function initializeMobileMenu() {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if (!menuButton || !mobileMenu) {
        console.error('Menu elements not found!');
        return;
    }

    // إنشاء backdrop
    let backdrop = document.querySelector('.mobile-menu-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        document.body.appendChild(backdrop);
    }

    // حدث فتح/إغلاق القائمة
    menuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // إغلاق القائمة عند النقر على الـ backdrop
    backdrop.addEventListener('click', function() {
        closeMobileMenu();
    });

    // إغلاق القائمة عند النقر على الروابط
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // إغلاق القائمة عند الضغط على Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('active');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        backdrop.classList.add('active');
        body.classList.add('menu-open');
        
        // تغيير أيقونة القائمة
        const icon = menuButton.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
        }
        
        menuButton.style.background = 'rgba(212, 175, 55, 0.3)';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        backdrop.classList.remove('active');
        body.classList.remove('menu-open');
        
        // إعادة أيقونة القائمة
        const icon = menuButton.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        
        menuButton.style.background = 'rgba(212, 175, 55, 0.15)';
    }

    // إغلاق القائمة عند تغيير حجم النافذة (اختياري)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023) {
            closeMobileMenu();
        }
    });
}

function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(26, 31, 54, 0.98)';
            } else {
                header.style.backgroundColor = 'rgba(26, 31, 54, 0.95)';
            }
        });
    }
}

// وظيفة مساعدة للتحقق من العناصر
function checkElements() {
    const elements = {
        menuButton: document.getElementById('menuButton'),
        mobileMenu: document.getElementById('mobileMenu'),
        backdrop: document.querySelector('.mobile-menu-backdrop')
    };
    
    console.log('Elements check:', elements);
    return elements;
}

// تحقق عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - checking mobile menu...');
    checkElements();
});