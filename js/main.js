// دالة لعرض محتوى كل صفحة
const contentDiv = document.getElementById('app-content');

const pages = {
    'home': renderHomePage,
    'services': renderServicesPage,
    'projects': renderProjectsPage,
    'why-us': renderWhyUsPage,
    'pricing': renderPricingPage,
    'calculator': renderCalculatorPage,
    'contact': renderContactPage,
    'about': renderAboutUsPage
};

// دالة الملاحة الرئيسية
function navigate(page) {
    if (pages[page]) {
        contentDiv.innerHTML = ''; // تفريغ المحتوى
        pages[page](); // استدعاء دالة عرض الصفحة المطلوبة
        window.scrollTo(0, 0); // العودة لأعلى الصفحة
        
        // إغلاق قائمة الموبايل بعد التنقل
        const mobileMenu = document.getElementById('mobile-menu');
        if (window.innerWidth < 1024 && mobileMenu && !mobileMenu.classList.contains('hidden')) { 
             mobileMenu.classList.add('hidden');
        }
    } else {
        contentDiv.innerHTML = `
            <section class="p-12 text-center text-red-600">
                <h2 class="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
                <button onclick="navigate('home')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    العودة للرئيسية
                </button>
            </section>
        `;
    }
}

// عند تحميل الصفحة، اذهب إلى الرئيسية
window.onload = () => {
    initializeNavigation();
    navigate('home');
};