// js/testimonial-form.js
document.addEventListener('DOMContentLoaded', function() {
    const testimonialForm = document.getElementById('testimonialForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = testimonialForm.querySelector('.submit-btn');

    testimonialForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // التحقق من صحة البيانات
        if (!validateForm()) {
            return;
        }

        try {
            // تعطيل الزر أثناء الحفظ
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

            // جمع البيانات من النموذج
            const formData = {
                name: document.getElementById('customerName').value.trim(),
                phone: document.getElementById('customerPhone').value.trim() || 'غير مذكور',
                job: document.getElementById('projectType').value,
                rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
                text: document.getElementById('testimonialText').value.trim(),
                recommend: document.querySelector('input[name="recommend"]:checked').value,
                status: 'pending', // يمكن الموافقة عليه لاحقاً
                createdAt: new Date(),
                approved: false // يحتاج موافقة من الإدارة
            };

            // حفظ البيانات في Firebase
            await saveTestimonialToFirebase(formData);
            
            // إظهار رسالة النجاح
            showSuccessMessage();
            
            // إعادة تعيين النموذج
            testimonialForm.reset();
            
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('حدث خطأ أثناء حفظ التقييم. يرجى المحاولة مرة أخرى.');
        } finally {
            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال التقييم';
        }
    });

    // دالة التحقق من صحة البيانات
    function validateForm() {
        const name = document.getElementById('customerName').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked');
        const text = document.getElementById('testimonialText').value.trim();
        const recommend = document.querySelector('input[name="recommend"]:checked');
        const projectType = document.getElementById('projectType').value;

        if (!name) {
            alert('يرجى إدخال الاسم');
            return false;
        }

        if (!projectType) {
            alert('يرجى اختيار نوع المشروع');
            return false;
        }

        if (!rating) {
            alert('يرجى اختيار التقييم');
            return false;
        }

        if (!text) {
            alert('يرجى كتابة التقييم');
            return false;
        }

        if (!recommend) {
            alert('يرجى الإجابة على سؤال التوصية');
            return false;
        }

        if (text.length < 10) {
            alert('يرجى كتابة تقييم مفصل أكثر (10 أحرف على الأقل)');
            return false;
        }

        return true;
    }

    // دالة حفظ البيانات في Firebase
    async function saveTestimonialToFirebase(data) {
        try {
            await firebase.firestore().collection('testimonials').add(data);
            console.log('Testimonial saved successfully');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            throw error;
        }
    }

    // دالة إظهار رسالة النجاح
    function showSuccessMessage() {
        testimonialForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // تمرير سلس للرسالة
        successMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }

    // تحسين تجربة النجوم
    const starLabels = document.querySelectorAll('.star-label');
    starLabels.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            highlightStars(index);
        });
    });

    document.querySelector('.rating-stars').addEventListener('mouseleave', function() {
        const checkedStar = document.querySelector('input[name="rating"]:checked');
        if (checkedStar) {
            highlightStars(parseInt(checkedStar.value) - 1);
        } else {
            resetStars();
        }
    });

    function highlightStars(upToIndex) {
        starLabels.forEach((star, index) => {
            if (index <= upToIndex) {
                star.style.opacity = '1';
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.opacity = '0.3';
                star.style.transform = 'scale(1)';
            }
        });
    }

    function resetStars() {
        starLabels.forEach(star => {
            star.style.opacity = '0.3';
            star.style.transform = 'scale(1)';
        });
    }
});