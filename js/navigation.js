function formatNumber(num) {
    if (num === 0) return '0';
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
window.formatNumber = formatNumber;


// دالة تبديل القائمة في الموبايل
function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
}

// تهيئة التنقل
function initializeNavigation() {
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuButton = document.querySelector('.menu-button');
        
        if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.style.display = 'none';
        }
    });
}

// تحميل الهيدر
function loadHeader() {
    const header = document.getElementById('header');
    if (header) {
        header.innerHTML = `
            <div class="bg-white shadow-lg sticky top-0 z-50">
                <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                    <!-- الشعار (Logo/Title) -->
                    <div class="text-2xl font-extrabold text-indigo-700">أنور الراجح للديكور</div>
                    
                    <!-- قائمة التنقل (Desktop) -->
                    <nav class="hidden lg:flex space-x-6 space-x-reverse font-semibold">
                        <a href="#home" onclick="navigate('home')" class="text-gray-700 hover:text-indigo-700 transition duration-300">الرئيسية</a>
                        <a href="#services" onclick="navigate('services')" class="text-gray-700 hover:text-indigo-700 transition duration-300">الخدمات</a>
                        <a href="#projects" onclick="navigate('projects')" class="text-gray-700 hover:text-indigo-700 transition duration-300">الأعمال</a>
                        <a href="#why-us" onclick="navigate('why-us')" class="text-gray-700 hover:text-indigo-700 transition duration-300">لماذا نحن</a>
                        <a href="#pricing" onclick="navigate('pricing')" class="text-gray-700 hover:text-indigo-700 transition duration-300">الأسعار</a>
                        <a href="#calculator" onclick="navigate('calculator')" class="text-gray-700 hover:text-indigo-700 transition duration-300">احسب مشروعك</a>
                        <a href="#contact" onclick="navigate('contact')" class="bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition duration-300 shadow-md">اتصل بنا</a>
                    </nav>

                    <!-- زر القائمة (Mobile) -->
                    <button id="menu-button" class="lg:hidden text-indigo-700 focus:outline-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>

                <!-- قائمة التنقل (Mobile Menu) -->
                <nav id="mobile-menu" class="lg:hidden hidden bg-white shadow-xl py-2">
                    <a href="#home" onclick="navigate('home')" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">الرئيسية</a>
                    <a href="#services" onclick="navigate('services')" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">الخدمات</a>
                    <a href="#projects" onclick="navigate('projects')" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">الأعمال</a>
                    <a href="#why-us" onclick="navigate('why-us')" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">لماذا نحن</a>
                    <a href="#pricing" onclick="navigate('pricing')" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">الأسعار</a>
                    <a href="#calculator" onclick="navigate('calculator')" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">احسب مشروعك</a>
                    <a href="#contact" onclick="navigate('contact')" class="block px-4 py-2 text-white bg-amber-500 hover:bg-amber-600">اتصل بنا</a>
                </nav>
            </div>
        `;
        
        // إعادة إرفاق مستمع الحدث بعد تحميل الهيدر
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', toggleMenu);
        }
    }
}

// تحميل الفوتر
function loadFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.innerHTML = `
            <div class="bg-indigo-900 text-white mt-12 py-8">
                <div class="container mx-auto px-4 text-center">
                    <h3 class="text-3xl font-bold mb-3 text-amber-400">أنور الراجح للديكور</h3>
                    <p class="mb-4">قوتنا في الهيكل و جمالنا في التفاصيل.</p>
                    <nav class="flex justify-center space-x-4 space-x-reverse text-sm mb-4">
                        <a href="#home" onclick="navigate('home')" class="hover:text-amber-400 transition duration-300">الرئيسية</a>
                        <a href="#about" onclick="navigate('about')" class="hover:text-amber-400 transition duration-300">من نحن</a>
                        <a href="#contact" onclick="navigate('contact')" class="hover:text-amber-400 transition duration-300">تواصل معنا</a>
                        <a href="admin.html" target="_blank" class="hover:text-amber-400 transition duration-300">لوحة التحكم</a>
                    </nav>
                    <p class="text-sm text-indigo-300">&copy; 2024 جميع الحقوق محفوظة لأنور الراجح للديكور.</p>
                </div>
            </div>
        `;
    }
}