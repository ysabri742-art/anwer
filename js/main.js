// js/main.js - Fixed Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeScrollEffects();
});

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
    const backdrop = document.createElement("div");

    // إنشاء خلفية شفافة عند فتح المينيو
    backdrop.classList.add("mobile-menu-backdrop");
    document.body.appendChild(backdrop);

    // فتح/غلق المينيو
    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        backdrop.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    // عند الضغط على أي لينك في الموبايل مينيو
   mobileLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    // السماح بالتنقل الطبيعي
    mobileMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
});

    backdrop.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.classList.remove("menu-open");
    });

    // تغيير شكل الهيدر عند الـ scroll
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
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
        
        // تغيير أيقونة القائمة - بدون Font Awesome
        menuButton.innerHTML = '✕'; // أيقونة X بدل ☰
        
        // إزالة تأثير البلر
        menuButton.style.background = 'var(--accent-gold)';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        backdrop.classList.remove('active');
        body.classList.remove('menu-open');
        
        // إعادة أيقونة القائمة - بدون Font Awesome
        menuButton.innerHTML = '☰'; // أيقونة القائمة
        
        // إرجاع الخلفية الأصلية
        menuButton.style.background = 'rgba(212, 175, 55, 0.15)';
    }

    // إغلاق القائمة عند تغيير حجم النافذة (اختياري)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023) {
            closeMobileMenu();
        }
    });


function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'var(--primary-dark)';
            } else {
                header.style.backgroundColor = 'var(--primary-dark)';
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