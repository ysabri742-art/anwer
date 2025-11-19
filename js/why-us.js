// js/why-us.js
document.addEventListener('DOMContentLoaded', function() {
    // تأثير العدّاد للإحصائيات
    const counters = document.querySelectorAll('.stat-item h3');
    let animated = false; // لمنع التشغيل التلقائي المتكرر عند التمرير

   function startCounters(forceRestart = false) {
        // يتم منع التشغيل إذا كانت الحركة قيد التشغيل بالفعل، إلا إذا تم فرض إعادة التشغيل
        if (animated && !forceRestart) return;

        const counters = document.querySelectorAll('.stat-item h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            // 🔥 إضافة الكلاس 'is-counting' للإظهار 🔥
            counter.classList.add('is-counting');
            
            // إعادة تعيين النص للقيمة الصفرية قبل بدء العد لمنع ظهور القيمة النهائية لحظياً
            counter.textContent = '0'; 
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                // تنسيق الرقم (مهم لاستخدام toLocaleString)
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
        animated = true; // تم تشغيل الحركة
    }
    
    window.startStatsCounters = startCounters;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters(false);
                observer.disconnect(); 
            }
        });
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
         observer.observe(statsSection);
    }
});
