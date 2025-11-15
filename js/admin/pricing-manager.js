import firebaseDB from '../firebase/database.js';
import firebaseAuth from '../firebase/auth.js';

async function renderPricingManager() {
    if (!firebaseAuth.requireAuth()) return;

    const contentDiv = document.getElementById('app-content');
    
    try {
        const pricing = await firebaseDB.getPricing();

        contentDiv.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <div class="bg-white shadow-sm border-b">
                    <div class="container mx-auto px-6 py-4">
                        <div class="flex justify-between items-center">
                            <h1 class="text-2xl font-bold text-gray-800">إدارة الأسعار</h1>
                            <button onclick="navigateTo('admin-dashboard')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                                العودة للوحة التحكم
                            </button>
                        </div>
                    </div>
                </div>

                <div class="container mx-auto px-6 py-8">
                    <!-- السعر الأساسي -->
                    <div class="admin-card p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4">السعر الأساسي للمتر المربع</h3>
                        <div class="flex items-end space-x-4 space-x-reverse">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">سعر المتر المربع (دينار عراقي)</label>
                                <input type="number" id="price-per-meter" value="${pricing.pricePerMeter}" 
                                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <button onclick="updatePrice()" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                                تحديث السعر
                            </button>
                        </div>
                        <p class="text-sm text-gray-500 mt-2">هذا السعر سيظهر في الآلة الحاسبة وصفحة الأسعار</p>
                    </div>

                    <!-- العروض الخاصة -->
                    <div class="admin-card p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-semibold">العروض الخاصة</h3>
                            <button onclick="showAddOfferModal()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                إضافة عرض جديد
                            </button>
                        </div>

                        <div id="offers-list" class="space-y-4">
                            ${pricing.specialOffers && pricing.specialOffers.length > 0 ? 
                                pricing.specialOffers.map(offer => `
                                    <div class="border border-gray-200 rounded-lg p-4">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="font-semibold">${offer.title}</h4>
                                                <p class="text-gray-600 text-sm">${offer.description}</p>
                                                <p class="text-green-600 font-bold mt-1">${offer.discount}</p>
                                            </div>
                                            <button onclick="deleteOffer('${offer.id}')" class="text-red-500 hover:text-red-700">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : 
                                '<p class="text-gray-500 text-center py-4">لا توجد عروض خاصة مضافة</p>'
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- نافذة إضافة عرض -->
            <div id="offer-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl w-full max-w-md">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-4">إضافة عرض خاص</h3>
                        
                        <form id="offer-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان العرض</label>
                                <input type="text" id="offer-title" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">وصف العرض</label>
                                <textarea id="offer-description" required rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">نسبة أو قيمة الخصم</label>
                                <input type="text" id="offer-discount" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="مثال: 10% خصم أو 5000 دينار">
                            </div>
                        </form>

                        <div class="flex space-x-3 space-x-reverse mt-6">
                            <button onclick="hideOfferModal()" class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition">
                                إلغاء
                            </button>
                            <button onclick="addOffer()" class="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                                إضافة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading pricing:', error);
        contentDiv.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 text-lg">حدث خطأ في تحميل الأسعار</p>
                <button onclick="renderPricingManager()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

async function updatePrice() {
    const newPrice = parseInt(document.getElementById('price-per-meter').value);
    if (newPrice && newPrice > 0) {
        try {
            const pricing = await firebaseDB.getPricing();
            pricing.pricePerMeter = newPrice;
            await firebaseDB.updatePricing(pricing);
            alert('تم تحديث السعر بنجاح!');
        } catch (error) {
            alert('حدث خطأ أثناء تحديث السعر');
        }
    } else {
        alert('يرجى إدخال سعر صحيح');
    }
}

function showAddOfferModal() {
    document.getElementById('offer-form').reset();
    document.getElementById('offer-modal').classList.remove('hidden');
}

function hideOfferModal() {
    document.getElementById('offer-modal').classList.add('hidden');
}

async function addOffer() {
    const title = document.getElementById('offer-title').value;
    const description = document.getElementById('offer-description').value;
    const discount = document.getElementById('offer-discount').value;

    if (!title || !description || !discount) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    try {
        const pricing = await firebaseDB.getPricing();
        if (!pricing.specialOffers) {
            pricing.specialOffers = [];
        }

        const newOffer = {
            id: Date.now().toString(),
            title,
            description,
            discount,
            createdAt: new Date().toISOString()
        };

        pricing.specialOffers.push(newOffer);
        await firebaseDB.updatePricing(pricing);

        hideOfferModal();
        renderPricingManager();
    } catch (error) {
        alert('حدث خطأ أثناء إضافة العرض');
    }
}

async function deleteOffer(offerId) {
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
        try {
            const pricing = await firebaseDB.getPricing();
            pricing.specialOffers = pricing.specialOffers.filter(offer => offer.id !== offerId);
            await firebaseDB.updatePricing(pricing);
            renderPricingManager();
        } catch (error) {
            alert('حدث خطأ أثناء حذف العرض');
        }
    }
}

export { renderPricingManager };