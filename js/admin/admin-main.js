import firebaseAuth from '../firebase/auth.js';

const adminPages = {
    'admin-login': renderAdminLoginPage,
    'admin-dashboard': renderAdminDashboard,
    'projects-manager': renderProjectsManager,
    'pricing-manager': renderPricingManager,
    'content-manager': renderContentManager
};

function navigateTo(page) {
    const contentDiv = document.getElementById('app-content');
    
    if (adminPages[page]) {
        contentDiv.innerHTML = '';
        adminPages[page]();
        window.scrollTo(0, 0);
    } else {
        contentDiv.innerHTML = `
            <section class="p-12 text-center text-red-600">
                <h2 class="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
                <button onclick="navigateTo('admin-dashboard')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    العودة للوحة التحكم
                </button>
            </section>
        `;
    }
}

function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'admin-login';
    navigateTo(hash);
}

window.addEventListener('load', () => {
    if (firebaseAuth.isLoggedIn && window.location.hash === '#admin-login') {
        navigateTo('admin-dashboard');
    } else {
        handleHashChange();
    }
});

window.addEventListener('hashchange', handleHashChange);
window.navigateTo = navigateTo;
window.firebaseAuth = firebaseAuth;