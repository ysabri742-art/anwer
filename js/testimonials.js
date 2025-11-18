// js/testimonials.js - النسخة المحسنة
document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonials();
});

async function initializeTestimonials() {
    await loadTestimonials();
    setupTestimonialsCarousel();
}

async function loadTestimonials() {
    try {
        let snapshot;
        
        try {
            // المحاولة الأولى - مع الفهرس
            snapshot = await firebase.firestore()
                .collection('testimonials')
                .where('approved', '==', true)
                .orderBy('date', 'desc')
                .get();
        } catch (indexError) {
            // إذا فشل الاستعلام بسبب الفهرس
            console.log('Index not ready, using alternative query...');
            
            // استعلام بديل بدون فرز
            snapshot = await firebase.firestore()
                .collection('testimonials')
                .where('approved', '==', true)
                .get();
        }

        const container = document.getElementById('testimonialsContainer');
        const noTestimonials = document.getElementById('noTestimonials');
        const totalTestimonials = document.getElementById('totalTestimonials');
        const averageRating = document.getElementById('averageRating');

        // إخفاء spinner التحميل
        container.innerHTML = '';

        if (snapshot.empty) {
            if (noTestimonials) noTestimonials.classList.remove('hidden');
            if (totalTestimonials) totalTestimonials.textContent = '0';
            if (averageRating) averageRating.textContent = '0';
            return;
        }

        if (noTestimonials) noTestimonials.classList.add('hidden');
        
        let totalRating = 0;
        let testimonialCount = 0;

        // إذا لم يكن الاستعلام مرتباً، نقوم بالفرز يدوياً
        let testimonials = [];
        snapshot.forEach(doc => {
            testimonials.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // إذا كان الاستعلام بدون فرز، نقوم بالفرز يدوياً
        if (!snapshot.query._query || !snapshot.query._query.orderBy || snapshot.query._query.orderBy.length === 0) {
            testimonials.sort((a, b) => {
                const dateA = a.date?.seconds || 0;
                const dateB = b.date?.seconds || 0;
                return dateB - dateA; // تنازلي
            });
        }

        // عرض التقييمات
        testimonials.forEach(testimonial => {
            const testimonialElement = createTestimonialElement(testimonial);
            container.appendChild(testimonialElement);
            
            totalRating += testimonial.rating || 5;
            testimonialCount++;
        });

        // تحديث الإحصائيات
        if (totalTestimonials) totalTestimonials.textContent = testimonialCount;
        if (averageRating) averageRating.textContent = (totalRating / testimonialCount).toFixed(1);

    } catch (error) {
        console.error('Error loading testimonials:', error);
        const container = document.getElementById('testimonialsContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>حدث خطأ في تحميل التقييمات</p>
                    <button onclick="loadTestimonials()" class="btn btn-primary">
                        <i class="fas fa-redo"></i> إعادة المحاولة
                    </button>
                </div>
            `;
        }
    }
}

function createTestimonialElement(testimonial) {
    const div = document.createElement('div');
    div.className = 'testimonial-card';
    
    const stars = '⭐'.repeat(testimonial.rating || 5);
    const date = testimonial.date ? new Date(testimonial.date.seconds * 1000) : new Date();
    const formattedDate = date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    div.innerHTML = `
        <div class="testimonial-header">
            <div class="customer-info">
                <h4>${testimonial.name || 'عميل كريم'}</h4>
                <div class="project-type">${testimonial.project || testimonial.projectType || 'مشروع'}</div>
            </div>
            <div class="rating-stars">${stars}</div>
        </div>
        
        <div class="testimonial-text">
            ${testimonial.message || testimonial.text || 'لا يوجد تعليق.'}
        </div>
        
        <div class="testimonial-footer">
            <div class="testimonial-date">${formattedDate}</div>
            ${(testimonial.recommend === 'نعم' || testimonial.recommend === true) ? '<div class="recommendation">ينصح بالتعامل</div>' : ''}
        </div>
    `;
    
    return div;
}

// 🔥 دالة إعداد الكاروسيل 🔥
function setupTestimonialsCarousel() {
    const container = document.getElementById('testimonialsContainer');
    const prevBtn = document.getElementById('prevTestimonialBtn');
    const nextBtn = document.getElementById('nextTestimonialBtn');
    
    if (container && prevBtn && nextBtn) {
        const scrollAmount = 450 + 40; // عرض الكارت + المسافة
        
        // التمرير إلى اليسار (السابق)
        prevBtn.addEventListener('click', function() {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // التمرير إلى اليمين (التالي)
        nextBtn.addEventListener('click', function() {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        console.log('✅ Testimonials carousel initialized');
    }
}

// Real-time updates
if (typeof firebase !== 'undefined') {
    firebase.firestore()
        .collection('testimonials')
        .where('approved', '==', true)
        .onSnapshot(() => {
            console.log('🔄 Testimonials updated in real-time');
            loadTestimonials();
        });
}