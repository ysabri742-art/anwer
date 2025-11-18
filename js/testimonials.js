// js/testimonials.js
document.addEventListener('DOMContentLoaded', function() {
    loadTestimonials();
});

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
            noTestimonials.classList.remove('hidden');
            totalTestimonials.textContent = '0';
            averageRating.textContent = '0';
            return;
        }

        noTestimonials.classList.add('hidden');
        
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
            
            totalRating += testimonial.rating;
            testimonialCount++;
        });

        // تحديث الإحصائيات
        totalTestimonials.textContent = testimonialCount;
        averageRating.textContent = (totalRating / testimonialCount).toFixed(1);

    } catch (error) {
        console.error('Error loading testimonials:', error);
        document.getElementById('testimonialsContainer').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل التقييمات</p>
            </div>
        `;
    }
}

function createTestimonialElement(testimonial) {
    const div = document.createElement('div');
    div.className = 'testimonial-card';
    
    const stars = '⭐'.repeat(testimonial.rating);
    const date = testimonial.date ? new Date(testimonial.date.seconds * 1000) : new Date();
    const formattedDate = date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    div.innerHTML = `
        <div class="testimonial-header">
            <div class="customer-info">
                <h4>${testimonial.name}</h4>
                <div class="project-type">${testimonial.project}</div>
            </div>
            <div class="rating-stars">${stars}</div>
        </div>
        
        <div class="testimonial-text">
            ${testimonial.message}
        </div>
        
        <div class="testimonial-footer">
            <div class="testimonial-date">${formattedDate}</div>
            ${testimonial.recommend === 'نعم' ? '<div class="recommendation">ينصح بالتعامل</div>' : ''}
        </div>
    `;
    
    return div;
}

// إضافة style للخطأ إذا احتجت
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .error-state {
        text-align: center;
        padding: 3rem;
        grid-column: 1 / -1;
        color: #e74c3c;
    }
    
    .error-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(errorStyle);