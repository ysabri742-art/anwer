import firebaseDB from '../firebase/database.js';
import firebaseAuth from '../firebase/auth.js';

async function renderContentManager() {
    if (!firebaseAuth.requireAuth()) return;

    const contentDiv = document.getElementById('app-content');
    
    try {
        const content = await firebaseDB.getContent();

        contentDiv.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <div class="bg-white shadow-sm border-b">
                    <div class="container mx-auto px-6 py-4">
                        <div class="flex justify-between items-center">
                            <h1 class="text-2xl font-bold text-gray-800">إدارة المحتوى</h1>
                            <button onclick="navigateTo('admin-dashboard')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                                العودة للوحة التحكم
                            </button>
                        </div>
                    </div>
                </div>

                <div class="container mx-auto px-6 py-8">
                    <!-- صورة الهيدر الرئيسية -->
                    <div class="admin-card p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4">صورة الهيدر الرئيسية</h3>
                        <div class="flex flex-col md:flex-row gap-6 items-start">
                            <div class="flex-1">
                                <img src="${content.heroImage}" alt="صورة الهيدر الحالية" class="w-full h-48 object-cover rounded-lg">
                            </div>
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">رابط الصورة الجديدة</label>
                                <input type="url" id="hero-image-url" value="${content.heroImage}" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4" 
                                       placeholder="https://example.com/image.jpg">
                                <button onclick="updateHeroImage()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                                    تحديث الصورة
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- معلومات الاتصال -->
                    <div class="admin-card p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4">معلومات الاتصال</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                                <input type="tel" id="contact-phone" value="${content.contactInfo.phone}" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب</label>
                                <input type="tel" id="contact-whatsapp" value="${content.contactInfo.whatsapp}" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم في تلغرام</label>
                                <input type="text" id="contact-telegram" value="${content.contactInfo.telegram}" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>
                        <button onclick="updateContactInfo()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                            تحديث معلومات الاتصال
                        </button>
                    </div>

                    <!-- النص التعريفي -->
                    <div class="admin-card p-6">
                        <h3 class="text-xl font-semibold mb-4">النص التعريفي (من نحن)</h3>
                        <textarea id="about-text" rows="6" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">${content.aboutText}</textarea>
                        <button onclick="updateAboutText()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                            تحديث النص
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading content:', error);
        contentDiv.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 text-lg">حدث خطأ في تحميل المحتوى</p>
                <button onclick="renderContentManager()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

async function updateHeroImage() {
    const newImageUrl = document.getElementById('hero-image-url').value;
    if (newImageUrl) {
        try {
            await firebaseDB.updateContent({ heroImage: newImageUrl });
            alert('تم تحديث صورة الهيدر بنجاح!');
        } catch (error) {
            alert('حدث خطأ أثناء تحديث الصورة');
        }
    } else {
        alert('يرجى إدخال رابط الصورة');
    }
}

async function updateContactInfo() {
    const phone = document.getElementById('contact-phone').value;
    const whatsapp = document.getElementById('contact-whatsapp').value;
    const telegram = document.getElementById('contact-telegram').value;

    if (phone && whatsapp && telegram) {
        try {
            await firebaseDB.updateContent({
                contactInfo: { phone, whatsapp, telegram }
            });
            alert('تم تحديث معلومات الاتصال بنجاح!');
        } catch (error) {
            alert('حدث خطأ أثناء تحديث معلومات الاتصال');
        }
    } else {
        alert('يرجى ملء جميع حقول الاتصال');
    }
}

async function updateAboutText() {
    const aboutText = document.getElementById('about-text').value;
    if (aboutText) {
        try {
            await firebaseDB.updateContent({ aboutText });
            alert('تم تحديث النص التعريفي بنجاح!');
        } catch (error) {
            alert('حدث خطأ أثناء تحديث النص');
        }
    } else {
        alert('يرجى إدخال النص التعريفي');
    }
}

export { renderContentManager };