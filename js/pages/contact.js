import firebaseDB from '../firebase/database.js';

async function renderContactPage() {
    try {
        const content = await firebaseDB.getContent();
        const contactInfo = content.contactInfo || {};

        contentDiv.innerHTML = `
            <section class="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
                <h2 class="text-4xl font-bold text-center text-indigo-700 mb-4">تواصل معنا</h2>
                <p class="text-center text-xl text-gray-600 mb-10">
                    يسعدنا تواصلكم للاستفسار أو طلب زيارة ميدانية لضمان دقة العمل.
                </p>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <!-- وسائل الاتصال السريعة -->
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">وسائل التواصل المباشرة</h3>
                        
                        <!-- واتساب -->
                        <a href="https://wa.me/${contactInfo.whatsapp || '009647XXXXXXXXX'}" target="_blank" class="flex items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-r-4 border-green-500">
                            <svg class="w-8 h-8 text-green-500 ml-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.031 3.175c-4.992 0-9.043 4.051-9.043 9.043 0 1.956.635 3.766 1.728 5.253l-1.804 5.378 5.513-1.455c1.38 0.767 2.943 1.206 4.59 1.206h0.005c4.992 0 9.043-4.051 9.043-9.043s-4.051-9.043-9.043-9.043zm0 16.594c-1.464 0-2.888-0.384-4.135-1.112l-0.298-0.177-3.08 0.812 0.82-3.045-0.198-0.315c-0.814-1.294-1.25-2.784-1.25-4.322 0-4.053 3.3-7.353 7.353-7.353s7.353 3.3 7.353 7.353-3.3 7.353-7.353 7.353zm3.743-5.266c-0.203-0.1-1.2-0.592-1.385-0.658-0.185-0.066-0.318-0.098-0.45 0.098-0.132 0.197-0.51 0.658-0.625 0.79-0.115 0.132-0.23 0.148-0.424 0.049-0.194-0.098-0.815-0.3-1.554-0.957-0.575-0.518-0.963-1.155-1.078-1.348-0.115-0.194-0.012-0.3-0.098-0.45-0.086-0.148-0.194-0.385-0.292-0.575-0.098-0.194-0.797-1.488-1.09-2.032-0.292-0.544-0.59-0.468-0.81-0.477-0.219-0.009-0.472-0.009-0.724-0.009s-0.62 0.098-0.945 0.44c-0.326 0.342-1.248 1.222-1.248 2.978 0 1.756 1.276 3.456 1.455 3.69 0.179 0.234 2.508 3.824 6.04 5.372 3.532 1.548 3.532 1.033 4.184 0.967 0.652-0.066 1.948-0.793 2.227-1.564 0.279-0.771 0.279-1.436 0.194-1.568-0.086-0.132-0.317-0.203-0.662-0.395z"></path></svg>
                            <div>
                                <p class="font-bold text-gray-800">تواصل عبر الواتساب</p>
                                <p class="text-sm text-gray-500">للحصول على أسرع رد</p>
                            </div>
                        </a>

                        <!-- اتصال مباشر -->
                        <a href="tel:${contactInfo.phone || '009647XXXXXXXXX'}" class="flex items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-r-4 border-indigo-500">
                            <svg class="w-8 h-8 text-indigo-500 ml-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.75A2.75 2.75 0 015.75 4h12.5A2.75 2.75 0 0121 6.75v10.5A2.75 2.75 0 0118.25 20H5.75A2.75 2.75 0 013 17.25V6.75zM12 17a1 1 0 100-2 1 1 0 000 2zM5.75 6h12.5c.69 0 1.25.56 1.25 1.25v2.5H4.5v-2.5c0-.69.56-1.25 1.25-1.25z"></path></svg>
                            <div>
                                <p class="font-bold text-gray-800">اتصال مباشر</p>
                                <p class="text-sm text-gray-500">للاستفسارات العاجلة</p>
                            </div>
                        </a>

                        <!-- تلغرام -->
                        <a href="https://t.me/${contactInfo.telegram || 'AnwarAlRajih'}" target="_blank" class="flex items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-r-4 border-blue-500">
                            <svg class="w-8 h-8 text-blue-500 ml-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.89 5.86c-0.54-0.19-1.63 0.35-2.28 0.69l-1.66 0.86c-0.14 0.07-0.3 0.1-0.45 0.08l-5.6-0.8c-0.43-0.06-0.81 0.22-0.88 0.65l-0.3 2.1c-0.01 0.11-0.07 0.2-0.15 0.26l-3.3 2.37c-0.29 0.21-0.35 0.61-0.14 0.9l2.84 3.7c0.23 0.3 0.66 0.38 0.98 0.19l1.6-1.07c0.16-0.11 0.36-0.14 0.54-0.08l5.6 1.77c0.41 0.13 0.83-0.12 0.89-0.55l1.04-5.9c0.07-0.41-0.16-0.8-0.57-0.89l-5.74-1.21c-0.18-0.04-0.35-0.01-0.5 0.07l-3.1 1.63c-0.15 0.08-0.33 0.06-0.46-0.03l-1.32-0.95c-0.24-0.17-0.29-0.52-0.12-0.77l1.05-1.39c0.18-0.24 0.53-0.3 0.78-0.12l4.8 2.6c0.11 0.06 0.23 0.06 0.34 0l4.3-2.3c0.41-0.22 0.91-0.09 1.13 0.32l1.6 2.8c0.17 0.29 0.13 0.66-0.1 0.91l-3.5 3.65c-0.31 0.32-0.35 0.8-0.09 1.16l2.12 2.92c0.26 0.36 0.72 0.44 1.05 0.22l5.12-3.33c0.44-0.28 0.67-0.77 0.56-1.25l-1.04-5.9c-0.07-0.41-0.39-0.73-0.8-0.8l-5.74-1.21z"></path></svg>
                            <div>
                                <p class="font-bold text-gray-800">قناة تلغرام</p>
                                <p class="text-sm text-gray-500">تابع جديد أعمالنا وتصاميمنا</p>
                            </div>
                        </a>
                    </div>

                    <!-- نموذج الاتصال (Form) -->
                    <div class="bg-indigo-50 p-6 rounded-xl shadow-xl">
                        <h3 class="text-2xl font-bold text-indigo-700 mb-4">أرسل لنا رسالة</h3>
                        <form onsubmit="handleFormSubmit(event)">
                            <div class="mb-4">
                                <label for="name" class="block text-sm font-medium text-gray-700">الاسم كاملاً</label>
                                <input type="text" id="name" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                            </div>
                            <div class="mb-4">
                                <label for="phone" class="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                                <input type="tel" id="phone" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                            </div>
                            <div class="mb-4">
                                <label for="message" class="block text-sm font-medium text-gray-700">رسالتك (نوع المشروع)</label>
                                <textarea id="message" rows="4" required class="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-indigo-700 text-white font-bold py-3 rounded-xl hover:bg-indigo-800 transition duration-300 shadow-md">
                                إرسال الرسالة
                            </button>
                            <div id="form-message" class="mt-4 text-center text-sm font-semibold hidden"></div>
                        </form>
                    </div>
                </div>
                
                <!-- خريطة الموقع (اختياري) -->
                <div class="mt-12">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">موقعنا التقريبي (اختياري)</h3>
                    <div class="bg-gray-300 h-64 rounded-xl flex items-center justify-center text-gray-600 shadow-inner">
                        مكان مخصص لعرض خريطة جوجل التفاعلية للموقع
                    </div>
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error loading contact page:', error);
        contentDiv.innerHTML = `
            <section class="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
                <h2 class="text-4xl font-bold text-center text-indigo-700 mb-4">تواصل معنا</h2>
                <div class="text-center py-12">
                    <p class="text-red-500 text-lg">حدث خطأ في تحميل صفحة الاتصال</p>
                    <button onclick="renderContactPage()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                        إعادة المحاولة
                    </button>
                </div>
            </section>
        `;
    }
}

// دالة لمعالجة إرسال النموذج
function handleFormSubmit(event) {
    event.preventDefault();
    const formMessage = document.getElementById('form-message');
    formMessage.classList.remove('hidden', 'text-red-500');
    formMessage.classList.add('text-green-600');
    formMessage.textContent = 'تم استلام رسالتك بنجاح! سنتواصل معك في أقرب وقت.';

    // Reset form fields after 3 seconds for better UX
    setTimeout(() => {
        event.target.reset();
        formMessage.classList.add('hidden');
    }, 3000);
}