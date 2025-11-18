// js/calculator.js
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const serviceTypeSelect = document.getElementById('serviceType');
    const resultContent = document.querySelector('.result-content');
    const placeholder = document.querySelector('.result-placeholder');
    const discountItem = document.querySelector('.discount-item');
    const discountNote = document.getElementById('discountNote');

    // دالة جلب أسعار الآلة الحاسبة من Firebase
    async function getCalculatorPrices() {
        try {
            const doc = await firebase.firestore().collection('calculatorSettings').doc('prices').get();
            if (doc.exists) {
                return doc.data();
            } else {
                // الأسعار الافتراضية إذا لم توجد في Firebase
                return {
                    prices: {
                        'standard': 23000,
                        'walls': 25000,
                        'tv': 35000,
                        'custom': 40000
                    },
                    discount: {
                        enabled: true,
                        threshold: 200,
                        percentage: 15
                    }
                };
            }
        } catch (error) {
            return {
                prices: {
                    'standard': 23000,
                    'walls': 25000,
                    'tv': 35000,
                    'custom': 40000
                },
                discount: {
                    enabled: true,
                    threshold: 200,
                    percentage: 15
                }
            };
        }
    }

    // إعداد الحساب التلقائي
    function setupAutoCalculate() {
        const inputs = [lengthInput, widthInput, serviceTypeSelect];
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(window.calculateTimeout);
                window.calculateTimeout = setTimeout(calculateIfValid, 500);
            });
            
            input.addEventListener('change', calculateIfValid);
        });
    }
    
    async function calculateIfValid() {
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);
        
        if (length && width && length > 0 && width > 0) {
            await calculatePrice();
        }
    }
    
    async function calculatePrice() {
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);
        const serviceType = serviceTypeSelect.value;

        if (!length || !width || length <= 0 || width <= 0) {
            return;
        }

        // جلب إعدادات الأسعار والخصم من Firebase
        const calculatorSettings = await getCalculatorPrices();
        const servicePrices = calculatorSettings.prices;
        const discountSettings = calculatorSettings.discount;
        
        const area = length * width;
        const basePrice = servicePrices[serviceType];
        let totalPrice = area * basePrice;
        let discountAmount = 0;

        // تطبيق الخصم إذا كان مفعل وتحققت الشروط
        if (discountSettings.enabled && area > discountSettings.threshold) {
            discountAmount = totalPrice * (discountSettings.percentage / 100);
            totalPrice = totalPrice - discountAmount;
            
            // عرض معلومات الخصم
            discountItem.classList.remove('hidden');
            discountNote.classList.remove('hidden');
            document.getElementById('discountLabel').textContent = `الخصم (${discountSettings.percentage}%):`;
        } else {
            discountItem.classList.add('hidden');
            discountNote.classList.add('hidden');
        }

        // عرض النتائج
        displayResults(area, basePrice, totalPrice, discountAmount, discountSettings);
    }

    function displayResults(area, meterPrice, totalPrice, discountAmount, discountSettings) {
        const basePriceValue = area * meterPrice;
        
        document.getElementById('totalArea').textContent = `${area.toFixed(2)} م²`;
        document.getElementById('meterPrice').textContent = `${meterPrice.toLocaleString()} دينار`;
        document.getElementById('basePrice').textContent = `${basePriceValue.toLocaleString()} دينار`;
        document.getElementById('discountAmount').textContent = `-${discountAmount.toLocaleString()} دينار`;
        document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString()} دينار`;

        // تحديث ملاحظة الخصم
        if (discountSettings.enabled) {
            document.getElementById('discountNote').innerHTML = 
                `<i class="fas fa-star"></i> خصم ${discountSettings.percentage}% للمساحات فوق ${discountSettings.threshold} متر`;
        }

        placeholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
        
        // تحديث عنوان النتيجة
        const resultTitle = resultContent.querySelector('h3');
        resultTitle.innerHTML = `التقدير المبدئي <small style="color: #28a745; font-size: 0.8em;">(تم الحساب تلقائياً)</small>`;

        // تحديث رابط الواتساب
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        const serviceName = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text;
        let message = `مساء الخير! أريد استفسار عن سعر دقيق للمشروع:\nالمساحة: ${area.toFixed(2)} م²\nنوع الخدمة: ${serviceName}\nالسعر التقريبي: ${totalPrice.toLocaleString()} دينار`;
        
        if (discountAmount > 0) {
            message += `\n(يشمل خصم ${discountSettings.percentage}% للمساحات الكبيرة)`;
        }
        
        whatsappBtn.href = `https://wa.me/9647825044606?text=${encodeURIComponent(message)}`;
    }

    // دالة عامة يمكن استدعاؤها من HTML
    window.calculateAuto = function() {
        calculateIfValid();
    };

    // استبدال دالة الزر بالدالة الجديدة
    calculateBtn.addEventListener('click', function() {
        calculatePrice();
    });
    
    // تفعيل الحساب التلقائي
    setupAutoCalculate();
});