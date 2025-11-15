import firebaseDB from '../firebase/database.js';

async function renderCalculatorPage() {
    try {
        const pricing = await firebaseDB.getPricing();
        
        contentDiv.innerHTML = `
            <section class="container mx-auto px-6 py-12 md:py-20 max-w-3xl">
                <h2 class="text-4xl font-bold text-center text-indigo-700 mb-4">احسب مشروعك التقديري</h2>
                <p class="text-center text-xl text-gray-600 mb-10">
                    ادخل المقاسات لتحصل على سعر تقريبي خلال ثوانٍ. (السعر المعتمد للمتر هو ${formatNumber(pricing.pricePerMeter)} دينار).
                </p>

                <div class="bg-white rounded-xl shadow-2xl p-8 md:p-10">
                    <!-- حقول الإدخال -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label for="length" class="block text-lg font-medium text-gray-700 mb-2">الطول (بالمتر)</label>
                            <input type="number" id="length" min="0" value="0" placeholder="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg" oninput="calculateCost()">
                        </div>
                        <div>
                            <label for="width" class="block text-lg font-medium text-gray-700 mb-2">العرض (بالمتر)</label>
                            <input type="number" id="width" min="0" value="0" placeholder="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg" oninput="calculateCost()">
                        </div>
                    </div>

                    <!-- نتيجة الحساب -->
                    <div class="bg-indigo-700 p-6 rounded-lg text-center mb-8 border-4 border-amber-500 text-white">
                        <h3 class="text-xl font-semibold mb-2 text-indigo-200">السعر التقريبي للمشروع:</h3>
                        <p id="estimated-cost" class="text-6xl font-black text-white">0</p>
                        <span class="text-2xl font-bold text-amber-500">دينار عراقي</span>
                    </div>

                    <!-- زر الإجراء النهائي -->
                    <a id="whatsapp-link" href="https://wa.me/009647XXXXXXXXX" target="_blank" class="block w-full text-center bg-green-500 text-white text-xl font-bold px-6 py-4 rounded-xl hover:bg-green-600 transition duration-300 transform hover:scale-[1.01] shadow-lg">
                        احصل على حساب دقيق عبر واتساب
                    </a>
                    
                    <p class="text-sm text-gray-500 mt-4 text-center">السعر التقديري لا يشمل الصبغ والمعجون، ويخضع للمراجعة بعد الكشف الميداني.</p>
                </div>
            </section>
        `;
        
        // يجب استدعاء calculateCost لتعيين القيمة الأولية ورابط الواتساب
        calculateCost();
    } catch (error) {
        console.error('Error loading calculator:', error);
        contentDiv.innerHTML = `
            <section class="container mx-auto px-6 py-12 md:py-20 max-w-3xl">
                <h2 class="text-4xl font-bold text-center text-indigo-700 mb-4">احسب مشروعك التقديري</h2>
                <div class="text-center py-12">
                    <p class="text-red-500 text-lg">حدث خطأ في تحميل الآلة الحاسبة</p>
                    <button onclick="renderCalculatorPage()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                        إعادة المحاولة
                    </button>
                </div>
            </section>
        `;
    }
}

// دالة منطق حساب التكلفة
async function calculateCost() {
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    
    if (!lengthInput || !widthInput) return;

    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    
    try {
        const pricing = await firebaseDB.getPricing();
        const pricePerMeter = pricing.pricePerMeter || 23000;
        const area = length * width;
        const cost = area * pricePerMeter;

        const costDisplay = document.getElementById('estimated-cost');
        if (costDisplay) {
            costDisplay.textContent = formatNumber(cost);
        }

        // تحديث رابط الواتساب بالبيانات
        const whatsappLink = document.getElementById('whatsapp-link');
        if (whatsappLink) {
            const message = encodeURIComponent(`أرغب في الحصول على حساب دقيق لمشروع جبس بورد. المقاسات التقريبية: الطول ${length} م والعرض ${width} م. الإجمالي التقديري: ${formatNumber(cost)} دينار.`);
            whatsappLink.href = `https://wa.me/009647XXXXXXXXX?text=${message}`;
        }
    } catch (error) {
        console.error('Error calculating cost:', error);
    }
}