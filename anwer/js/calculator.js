// js/calculator.js
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const serviceTypeSelect = document.getElementById('serviceType');
    const resultContent = document.querySelector('.result-content');
    const placeholder = document.querySelector('.result-placeholder');

    // أسعار الخدمات (سيتم جلبها من Firebase لاحقاً)
    const servicePrices = {
        'standard': 23000,
        'walls': 25000,
        'tv': 35000,
        'custom': 40000
    };

    calculateBtn.addEventListener('click', function() {
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);
        const serviceType = serviceTypeSelect.value;

        if (!length || !width || length <= 0 || width <= 0) {
            alert('يرجى إدخال مقاسات صحيحة');
            return;
        }

        const area = length * width;
        const basePrice = servicePrices[serviceType];
        let totalPrice = area * basePrice;

        // تطبيق خصم المساحات الكبيرة
        if (area > 200) {
            totalPrice *= 0.85; // خصم 15%
        }

        // عرض النتائج
        displayResults(area, basePrice, totalPrice);
    });

    function displayResults(area, meterPrice, totalPrice) {
        document.getElementById('totalArea').textContent = `${area.toFixed(2)} م²`;
        document.getElementById('meterPrice').textContent = `${meterPrice.toLocaleString()} دينار`;
        document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString()} دينار`;

        placeholder.classList.add('hidden');
        resultContent.classList.remove('hidden');

        // تحديث رابط الواتساب
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        const message = `مساء الخير! أريد استفسار عن سعر دقيق للمشروع:\nالمساحة: ${area.toFixed(2)} م²\nنوع الخدمة: ${serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text}\nالسعر التقريبي: ${totalPrice.toLocaleString()} دينار`;
        whatsappBtn.href = `https://wa.me/your-number?text=${encodeURIComponent(message)}`;
    }
});