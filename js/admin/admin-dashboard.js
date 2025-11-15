import firebaseDB from '../firebase/database.js';
import firebaseAuth from '../firebase/auth.js';

async function renderAdminDashboard() {
    if (!firebaseAuth.requireAuth()) return;

    const contentDiv = document.getElementById('app-content');
    
    try {
        const projects = await firebaseDB.getProjects();
        const pricing = await firebaseDB.getPricing();

        contentDiv.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- شريط الأدوات -->
                <div class="bg-white shadow-sm border-b">
                    <div class="container mx-auto px-6 py-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <h1 class="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
                                <p class="text-gray-600">أنور الراجح للديكور</p>
                            </div>
                            <div class="flex space-x-3 space-x-reverse">
                                <a href="../index.html" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                                    العودة للموقع
                                </a>
                                <button onclick="firebaseAuth.logout()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                    تسجيل الخروج
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container mx-auto px-6 py-8">
                    <!-- إحصائيات سريعة -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="admin-card p-6 text-center">
                            <div class="text-3xl font-bold text-indigo-600 mb-2">${projects.length}</div>
                            <div class="text-gray-600">عدد المشاريع</div>
                        </div>
                        <div class="admin-card p-6 text-center">
                            <div class="text-3xl font-bold text-green-600 mb-2">${pricing.pricePerMeter ? pricing.pricePerMeter.toLocaleString() : '0'}</div>
                            <div class="text-gray-600">سعر المتر الحالي</div>
                        </div>
                        <div class="admin-card p-6 text-center">
                            <div class="text-3xl font-bold text-purple-600 mb-2">${new Date().toLocaleDateString('ar-EG')}</div>
                            <div class="text-gray-600">آخر تحديث</div>
                        </div>
                    </div>

                    <!-- قائمة الأدوات -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- إدارة المشاريع -->
                        <div class="admin-card p-6">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-semibold text-gray-800">إدارة المشاريع</h3>
                            </div>
                            <p class="text-gray-600 mb-4">إضافة، تعديل، أو حذف صور المشاريع المنفذة</p>
                            <button onclick="navigateTo('projects-manager')" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                                إدارة المشاريع
                            </button>
                        </div>

                        <!-- إدارة الأسعار -->
                        <div class="admin-card p-6">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-semibold text-gray-800">إدارة الأسعار</h3>
                            </div>
                            <p class="text-gray-600 mb-4">تحديث أسعار الخدمات والعروض الخاصة</p>
                            <button onclick="navigateTo('pricing-manager')" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                                إدارة الأسعار
                            </button>
                        </div>

                        <!-- إدارة المحتوى -->
                        <div class="admin-card p-6">
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-semibold text-gray-800">إدارة المحتوى</h3>
                            </div>
                            <p class="text-gray-600 mb-4">تعديل النصوص والصور الرئيسية في الموقع</p>
                            <button onclick="navigateTo('content-manager')" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                                إدارة المحتوى
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        contentDiv.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 text-lg">حدث خطأ في تحميل اللوحة</p>
                <button onclick="renderAdminDashboard()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

export { renderAdminDashboard };