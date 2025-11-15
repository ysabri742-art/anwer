import firebaseAuth from '../firebase/auth.js';

function renderAdminLoginPage() {
    const contentDiv = document.getElementById('app-content');
    
    contentDiv.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">أنور الراجح للديكور</h1>
                    <h2 class="text-xl text-gray-600 mt-2">لوحة التحكم - تسجيل الدخول</h2>
                </div>
                
                <form id="login-form" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input type="email" id="email" required 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                               placeholder="admin@anwar.com">
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                        <input type="password" id="password" required 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                               placeholder="كلمة المرور">
                    </div>
                    
                    <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold">
                        تسجيل الدخول
                    </button>
                </form>
                
                <div id="login-message" class="mt-4 text-center text-sm hidden"></div>
                
                <div class="mt-6 text-center">
                    <a href="../index.html" class="text-indigo-600 hover:text-indigo-800 text-sm">
                        ← العودة للموقع الرئيسي
                    </a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'جاري تسجيل الدخول...';

        await firebaseAuth.login(email, password);
        
        messageDiv.classList.remove('hidden', 'text-red-500');
        messageDiv.classList.add('text-green-600');
        messageDiv.textContent = 'تم تسجيل الدخول بنجاح!';
        
        setTimeout(() => navigateTo('admin-dashboard'), 1000);
        
    } catch (error) {
        messageDiv.classList.remove('hidden', 'text-green-600');
        messageDiv.classList.add('text-red-500');
        messageDiv.textContent = error;
        
        submitButton.disabled = false;
        submitButton.textContent = 'تسجيل الدخول';
    }
}

export { renderAdminLoginPage };