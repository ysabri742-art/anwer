// js/admin.js - النسخة الكاملة المحدثة مع Cloudinary
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.editingServiceId = null;
        this.editingProjectId = null;
        this.editingPricingId = null;
        this.editingTestimonialId = null;

        // === إعدادات Cloudinary (تم تحديدها بناءً على المعلومات المرفقة) ===
        this.CLOUD_NAME = 'dobxzewej'; 
        this.UPLOAD_PRESET = 'anwar_raja_unsigned'; 
        // =======================================

        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    checkAuthState() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.showDashboard();
                this.loadContent();
            } else {
                this.showLogin();
            }
        });
    }

    setupEventListeners() {
        
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Navigation
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Save Buttons - الأساسية
        this.setupBasicSaveButtons();
        
        // الخدمات
        this.setupServicesListeners();
        
        // المشاريع
        this.setupProjectsListeners();
        
        // التسعير
        this.setupPricingListeners();
        
        // إعدادات الآلة الحاسبة
        this.setupCalculatorListeners();
        
        // التقييمات - لإظهار/إخفاء المحرر اليدوي
        this.setupTestimonialsListeners();

    }

    setupTestimonialsListeners() {
        const addTestimonialBtn = document.getElementById('addTestimonial');
        if (addTestimonialBtn) {
            addTestimonialBtn.addEventListener('click', () => {
                this.showTestimonialEditor();
            });
        }

        const saveTestimonialBtn = document.getElementById('saveTestimonial');
        if (saveTestimonialBtn) {
            saveTestimonialBtn.addEventListener('click', () => {
                this.saveTestimonial();
            });
        }

        const cancelTestimonialBtn = document.getElementById('cancelTestimonial');
        if (cancelTestimonialBtn) {
            cancelTestimonialBtn.addEventListener('click', () => {
                this.hideTestimonialEditor();
            });
        }
    }

    setupBasicSaveButtons() {
        const saveHeroBtn = document.getElementById('saveHero');
        if (saveHeroBtn) {
            saveHeroBtn.addEventListener('click', () => {
                this.saveHero();
            });
        }

        const saveFeaturesBtn = document.getElementById('saveFeatures');
        if (saveFeaturesBtn) {
            saveFeaturesBtn.addEventListener('click', () => {
                this.saveFeatures();
            });
        }

        const saveContactBtn = document.getElementById('saveContact');
        if (saveContactBtn) {
            saveContactBtn.addEventListener('click', () => {
                this.saveContact();
            });
        }
    }

    setupServicesListeners() {
        const addServiceBtn = document.getElementById('addService');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', () => {
                this.showServiceEditor();
            });
        }

        const saveServiceBtn = document.getElementById('saveService');
        if (saveServiceBtn) {
            saveServiceBtn.addEventListener('click', () => {
                this.saveService();
            });
        }

        const cancelServiceBtn = document.getElementById('cancelService');
        if (cancelServiceBtn) {
            cancelServiceBtn.addEventListener('click', () => {
                this.hideServiceEditor();
            });
        }
    }

    setupProjectsListeners() {
        const addProjectBtn = document.getElementById('addProject');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                this.showProjectEditor();
            });
        }

        const saveProjectBtn = document.getElementById('saveProject');
        if (saveProjectBtn) {
            saveProjectBtn.addEventListener('click', () => {
                this.saveProject();
            });
        }

        const cancelProjectBtn = document.getElementById('cancelProject');
        if (cancelProjectBtn) {
            cancelProjectBtn.addEventListener('click', () => {
                this.hideProjectEditor();
            });
        }

        // معاينة الصورة عند اختيار ملف أو كتابة اللينك
        const projectImageUrl = document.getElementById('projectImageUrl');
        if (projectImageUrl) {
            projectImageUrl.addEventListener('input', (e) => {
                this.previewImageFromUrl(e.target.value);
            });
        }
        
        const projectImageFile = document.getElementById('projectImageFile');
        if (projectImageFile) {
            projectImageFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.previewImageFromUrl(e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.removeImagePreview();
                }
            });
        }
    }

    setupPricingListeners() {
        const addPricingBtn = document.getElementById('addPricing');
        if (addPricingBtn) {
            addPricingBtn.addEventListener('click', () => {
                this.showPricingEditor();
            });
        }

        const savePricingBtn = document.getElementById('savePricing');
        if (savePricingBtn) {
            savePricingBtn.addEventListener('click', () => {
                this.savePricing();
            });
        }

        const cancelPricingBtn = document.getElementById('cancelPricing');
        if (cancelPricingBtn) {
            cancelPricingBtn.addEventListener('click', () => {
                this.hidePricingEditor();
            });
        }
    }

    setupCalculatorListeners() {
        const saveCalculatorBtn = document.getElementById('saveCalculatorSettings');
        if (saveCalculatorBtn) {
            saveCalculatorBtn.addEventListener('click', () => {
                this.saveCalculatorSettings();
            });
        }

        // إضافة مستمعين لتحديث معاينة السعر
        this.setupPricePreviewListeners();
    }

    // إعداد مستمعين لمعاينة السعر
    setupPricePreviewListeners() {
        const priceInputs = ['priceStandard', 'priceWalls', 'priceTV', 'priceCustom', 
                            'discountThreshold', 'discountPercentage'];
        
        priceInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updatePricePreview();
                });
            }
        });

        const discountCheckbox = document.getElementById('discountEnabled');
        if (discountCheckbox) {
            discountCheckbox.addEventListener('change', () => {
                this.updatePricePreview();
            });
        }
    }

    // تحديث معاينة السعر
    updatePricePreview() {
        const standardPrice = parseInt(document.getElementById('priceStandard').value) || 23000;
        const discountEnabled = document.getElementById('discountEnabled').checked;
        const discountThreshold = parseInt(document.getElementById('discountThreshold').value) || 200;
        const discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 15;

        // مثال: مساحة 250 متر
        const area = 250;
        const basePrice = area * standardPrice;
        
        // تحديث السعر الأساسي
        document.getElementById('previewStandard').textContent = `${basePrice.toLocaleString()} دينار`;
        document.getElementById('previewDiscountPercent').textContent = `${discountPercentage}%`;

        let finalPrice = basePrice;
        let discountAmount = 0;

        if (discountEnabled && area > discountThreshold) {
            discountAmount = basePrice * (discountPercentage / 100);
            finalPrice = basePrice - discountAmount;
            
            // تحديث السعر بعد الخصم
            document.getElementById('previewAfterDiscount').textContent = `-${discountAmount.toLocaleString()} دينار`;
            document.getElementById('previewAfterDiscount').style.color = '#e74c3c';
        } else {
            document.getElementById('previewAfterDiscount').textContent = '0 دينار';
            document.getElementById('previewAfterDiscount').style.color = '#95a5a6';
        }

        // تحديث السعر النهائي
        document.getElementById('previewFinalPrice').textContent = `${finalPrice.toLocaleString()} دينار`;
    }

    // دالة معاينة الصورة من اللينك
    previewImageFromUrl(imageUrl) {
        if (!imageUrl || imageUrl.includes('undefined')) {
            this.removeImagePreview();
            return;
        }

        // تأكد إن اللينك صحيح
        const preview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        if (preview && previewImage) {
            previewImage.src = imageUrl;
            preview.classList.remove('hidden');
        }
    }

    // دالة إزالة معاينة الصورة
    removeImagePreview() {
        const preview = document.getElementById('imagePreview');
        if (preview) preview.classList.add('hidden');
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('loginMessage');


        try {
            this.showLoading();
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            this.currentUser = userCredential.user;
            
            // REMINDER: Add mechanism to force password change on first login.
            
            message.innerHTML = '<div class="message success">تم تسجيل الدخول بنجاح!</div>';
            
            setTimeout(() => {
                this.showDashboard();
                this.loadContent();
            }, 1500);
            
        } catch (error) {
            let errorMessage = 'خطأ في تسجيل الدخول';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'المستخدم غير موجود';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'كلمة المرور غير صحيحة';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'البريد الإلكتروني غير صالح';
            }
            
            message.innerHTML = `<div class="message error">${errorMessage}</div>`;
        } finally {
            this.hideLoading();
        }
    }

    async logout() {
        try {
            await auth.signOut();
        } catch (error) {
        }
    }

    showLogin() {
        const loginSection = document.getElementById('loginSection');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginSection) loginSection.classList.remove('hidden');
        if (adminDashboard) adminDashboard.classList.add('hidden');
    }

    showDashboard() {
        const loginSection = document.getElementById('loginSection');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginSection) loginSection.classList.add('hidden');
        if (adminDashboard) adminDashboard.classList.remove('hidden');
        this.showSection('projects');
    }

    showSection(sectionId) {
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Activate menu item
        const targetMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        }

        // تحميل المحتوى تلقائياً عند التنقل للأقسام
        this.loadSectionContent(sectionId);
    }

    // دالة جديدة لتحميل محتوى كل قسم
    async loadSectionContent(sectionId) {
        try {
            
            switch (sectionId) {
                case 'services':
                    await this.loadServices();
                    break;
                    
                case 'projects':
                    await this.loadProjects();
                    break;
                    
                case 'pricing':
                    await this.loadPricing();
                    break;
                    
                case 'testimonials':
                    await this.loadTestimonialsSection();
                    await this.loadTestimonialsList(); // تحميل القائمة اليدوية أيضاً
                    break;
                    
                case 'calculator':
                    await this.loadCalculatorSettings();
                    break;
                    
                case 'hero':
                    await this.loadHeroContent();
                    break;
                    
                case 'features':
                    await this.loadFeaturesContent();
                    break;
                    
                case 'contact':
                    await this.loadContactContent();
                    break;
            }
            
            
        } catch (error) {
        }
    }

    async loadContent() {
        try {
            this.showLoading();
            
            // تحميل جميع المحتويات تلقائياً
            await Promise.all([
                this.loadHeroContent(),
                this.loadFeaturesContent(),
                this.loadContactContent()
            ]);


        } catch (error) {
            this.showMessage('حدث خطأ في تحميل المحتوى', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // === دوال Cloudinary لرفع الصور ===

    async uploadImageToCloudinary(file) {
        if (!file || !this.CLOUD_NAME || !this.UPLOAD_PRESET) {
            this.showMessage('يرجى إعداد بيانات Cloudinary بشكل صحيح.', 'error');
            return null;
        }

        this.showMessage('جاري رفع الصورة مباشرة إلى Cloudinary...', 'info');
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.UPLOAD_PRESET);

            const url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                this.showMessage(`فشل رفع الصورة: ${errorData.error.message || response.statusText}`, 'error');
                return null;
            }

            const data = await response.json();
            this.showMessage('تم رفع الصورة بنجاح عبر Cloudinary!', 'success');
            return data.secure_url; 
            
        } catch (error) {
            this.showMessage('حدث خطأ غير متوقع أثناء الرفع.', 'error');
            return null;
        }
    }


    // === إدارة تقييمات العملاء ===
    async loadTestimonialsSection() {
        try {
            await this.loadPendingTestimonials();
            await this.updateTestimonialsStats();
        } catch (error) {
        }
    }
    
    // تحميل التقييمات المنتظرة
    async loadPendingTestimonials() {
        try {
            // استعلام بسيط بدون فرز لحين إنشاء الفهرس
            const snapshot = await db.collection('testimonials')
                .where('approved', '==', false)
                .get();

            const container = document.getElementById('pendingTestimonials');
            const noPending = document.getElementById('noPending');

            container.innerHTML = '';

            if (snapshot.empty) {
                noPending.classList.remove('hidden');
                return;
            }

            noPending.classList.add('hidden');

            // فرز يدوي حسب التاريخ
            const testimonials = [];
            snapshot.forEach(doc => {
                testimonials.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // فرز تنازلي حسب التاريخ
            testimonials.sort((a, b) => {
                const dateA = a.date?.seconds || a.createdAt?.seconds || 0;
                const dateB = b.date?.seconds || b.createdAt?.seconds || 0;
                return dateB - dateA; // الأحدث أولاً
            });

            // عرض التقييمات بعد الفرز
            testimonials.forEach(testimonial => {
                const testimonialElement = this.createPendingTestimonialElement(testimonial.id, testimonial);
                container.appendChild(testimonialElement);
            });

        } catch (error) {
            this.showMessage('حدث خطأ في تحميل التقييمات', 'error');
        }
    }

    // ... (داخل كلاس AdminPanel في ملف admin.js) ...

    createPendingTestimonialElement(id, testimonial) {
        const div = document.createElement('div');
        div.className = 'pending-testimonial';
        div.id = `testimonial-${id}`;
        
        const stars = '⭐'.repeat(testimonial.rating);
        // تم استخدام حقل createdAt أو date حسب المتوفر
        const dateObject = testimonial.createdAt?.toDate() || testimonial.date?.toDate() || new Date();
        const formattedDate = dateObject.toLocaleDateString('ar-EG');
        
        // استخدام حقول النموذج: name, text
        const customerName = testimonial.name || 'عميل مجهول';
        const testimonialText = testimonial.text || testimonial.message || 'لم يتم كتابة نص للتقييم.';
        const recommendation = testimonial.recommend || 'غير معروف';
        
        // قيمة غير مذكورة تظهر في حال عدم وجود رقم هاتف
        const phoneDisplay = testimonial.phone && testimonial.phone !== 'غير مذكور' ? testimonial.phone : 'غير مذكور';


        div.innerHTML = `
            <div class="testimonial-header">
                <div class="customer-info">
                    <h4>${customerName}</h4>
                    <div class="project-info">
                        <span><i class="fas fa-phone-alt"></i> ${phoneDisplay}</span>
                    </div>
                </div>
                <div class="rating-stars">${stars}</div>
            </div>
            
            <div class="testimonial-content">
                <div class="testimonial-text">${testimonialText}</div>
                <div class="testimonial-meta">
                    <span>التاريخ: ${formattedDate}</span>
                    <span>التوصية: ${recommendation === 'نعم' ? 'ينصح ✅' : 'لا ينصح ❌'}</span>
                </div>
            </div>
            
            <div class="testimonial-actions">
                <button class="btn btn-approve" onclick="window.admin.approveTestimonial('${id}')">
                    <i class="fas fa-check"></i> الموافقة
                </button>
                <button class="btn btn-reject" onclick="window.admin.rejectTestimonial('${id}')">
                    <i class="fas fa-times"></i> رفض
                </button>
            </div>
        `;
        
        return div;
    }


    async approveTestimonial(testimonialId) {
        if (confirm('هل تريد الموافقة على هذا التقييم وعرضه في الموقع؟')) {
            try {
                this.showLoading();
                
                await db.collection('testimonials').doc(testimonialId).update({
                    approved: true,
                    approvedAt: new Date(),
                    approvedBy: this.currentUser.email
                });

                // إزالة التقييم من القائمة
                const testimonialElement = document.getElementById(`testimonial-${testimonialId}`);
                if (testimonialElement) {
                    testimonialElement.remove();
                }

                // تحديث الإحصائيات
                await this.updateTestimonialsStats();
                
                this.showMessage('تمت الموافقة على التقييم بنجاح!', 'success');
                
                // التحقق إذا لم يتبقى تقييمات
                const container = document.getElementById('pendingTestimonials');
                if (container.children.length === 0) {
                    document.getElementById('noPending').classList.remove('hidden');
                }
                await this.loadTestimonialsList(); // إعادة تحميل قائمة العرض اليدوية
                
            } catch (error) {
                this.showMessage('حدث خطأ في الموافقة على التقييم', 'error');
            } finally {
                this.hideLoading();
            }
        }
    }

    async rejectTestimonial(testimonialId) {
        if (confirm('هل تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.')) {
            try {
                this.showLoading();
                
                await db.collection('testimonials').doc(testimonialId).delete();

                // إزالة التقييم من القائمة
                const testimonialElement = document.getElementById(`testimonial-${testimonialId}`);
                if (testimonialElement) {
                    testimonialElement.remove();
                }

                // تحديث الإحصائيات
                await this.updateTestimonialsStats();
                
                this.showMessage('تم حذف التقييم بنجاح!', 'success');
                
                // التحقق إذا لم يتبقى تقييمات
                const container = document.getElementById('pendingTestimonials');
                if (container.children.length === 0) {
                    document.getElementById('noPending').classList.remove('hidden');
                }
                await this.loadTestimonialsList(); // إعادة تحميل قائمة العرض اليدوية
                
            } catch (error) {
                this.showMessage('حدث خطأ في حذف التقييم', 'error');
            } finally {
                this.hideLoading();
            }
        }
    }

    async updateTestimonialsStats() {
    try {
        // عدد التقييمات المنتظرة
        const pendingSnapshot = await db.collection('testimonials')
            .where('approved', '==', false)
            .get();
        
        // عدد التقييمات المعتمدة
        const approvedSnapshot = await db.collection('testimonials')
            .where('approved', '==', true)
            .get();

        document.getElementById('pendingCount').textContent = pendingSnapshot.size;
        document.getElementById('approvedCount').textContent = approvedSnapshot.size;
        
    } catch (error) {
    }
}
    
    async loadTestimonialsList() {
        try {
            const testimonialsSnapshot = await db.collection('testimonials').orderBy('date', 'desc').get();
            const testimonialsList = document.getElementById('testimonialsList');
            if (testimonialsList) {
                testimonialsList.innerHTML = '';

                if (testimonialsSnapshot.empty) {
                    testimonialsList.innerHTML = '<div class="empty-state">لا توجد آراء مضافة بعد</div>';
                    return;
                }

                testimonialsSnapshot.forEach(doc => {
                    const testimonial = doc.data();
                    const testimonialElement = this.createTestimonialListElement(doc.id, testimonial);
                    testimonialsList.appendChild(testimonialElement);
                });
            }
        } catch (error) {
        }
    }
    
    createTestimonialListElement(id, testimonial) {
        const div = document.createElement('div');
        div.className = 'testimonial-item';
        
        const stars = '⭐'.repeat(testimonial.rating || 5);
        const approvedStatus = testimonial.approved ? 'معتمد ✅' : 'بانتظار الموافقة ⏳';
        
        div.innerHTML = `
            <div class="testimonial-item-header">
                ${testimonial.imageUrl ? `<img src="${testimonial.imageUrl}" alt="${testimonial.name}" class="testimonial-image-preview">` : ''}
                <div class="testimonial-info">
                    <h4>${testimonial.name || 'عميل'}</h4>
                    <p class="testimonial-text-preview">${testimonial.text || testimonial.message || 'لا يوجد رأي.'}</p>
                    <div class="testimonial-meta">
                        <span class="testimonial-rating">${stars}</span>
                        <span class="testimonial-status">${approvedStatus}</span>
                    </div>
                </div>
            </div>
            <div class="testimonial-actions">
                <button class="btn btn-primary" onclick="window.admin.editTestimonial('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="window.admin.rejectTestimonial('${id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        return div;
    }

    showTestimonialEditor(testimonialId = null) {
        const editor = document.getElementById('testimonialEditor');
        const title = document.getElementById('testimonialEditorTitle');
        
        if (testimonialId) {
            title.textContent = 'تعديل رأي العميل';
            this.editingTestimonialId = testimonialId;
            this.loadTestimonialData(testimonialId);
        } else {
            title.textContent = 'إضافة رأي جديد';
            this.editingTestimonialId = null;
            this.resetTestimonialForm();
        }
        
        editor.classList.remove('hidden');
    }

    hideTestimonialEditor() {
        const editor = document.getElementById('testimonialEditor');
        editor.classList.add('hidden');
        this.editingTestimonialId = null;
    }
    
    editTestimonial(testimonialId) {
        this.showTestimonialEditor(testimonialId);
    }
    
    // S-594
    async loadTestimonialData(testimonialId) {
        try {
            const doc = await db.collection('testimonials').doc(testimonialId).get();
            if (doc.exists) {
                const testimonial = doc.data();
                document.getElementById('testimonialName').value = testimonial.name || '';
                // تم حذف تحميل حقل testimonialJob بناءً على طلب المستخدم
                document.getElementById('testimonialRating').value = testimonial.rating || '5';
                document.getElementById('testimonialText').value = testimonial.text || testimonial.message || '';
                document.getElementById('testimonialImage').value = testimonial.imageUrl || '';
            }
        } catch (error) {
            this.showMessage('حدث خطأ في تحميل بيانات الرأي', 'error');
        }
    }
    // E-610

    resetTestimonialForm() {
        document.getElementById('testimonialName').value = '';
        // تم حذف حقل testimonialJob بناءً على طلب المستخدم
        document.getElementById('testimonialRating').value = '5';
        document.getElementById('testimonialText').value = '';
        document.getElementById('testimonialImage').value = '';
    }

    async saveTestimonial() {
        try {
            this.showLoading();
            
            const testimonialData = {
                name: document.getElementById('testimonialName').value,
                // تم حذف حقل testimonialJob بناءً على طلب المستخدم
                rating: parseInt(document.getElementById('testimonialRating').value) || 5,
                text: document.getElementById('testimonialText').value,
                imageUrl: document.getElementById('testimonialImage').value,
                approved: true, // الافتراضي أن الإدارة توافق على الرأي عند إضافته من الخلفية
                lastUpdated: new Date()
            };

            if (!testimonialData.name || !testimonialData.text) {
                this.showMessage('يرجى إدخال اسم العميل والرأي', 'error');
                this.hideLoading();
                return;
            }

            if (this.editingTestimonialId) {
                // تعديل رأي موجود
                await db.collection('testimonials').doc(this.editingTestimonialId).update(testimonialData);
                this.showMessage('تم تحديث الرأي بنجاح!', 'success');
            } else {
                // إضافة رأي جديد
                testimonialData.createdAt = new Date();
                await db.collection('testimonials').add(testimonialData);
                this.showMessage('تم إضافة الرأي بنجاح!', 'success');
            }

            this.hideTestimonialEditor();
            await this.loadTestimonialsList();
            
        } catch (error) {
            this.showMessage('حدث خطأ في حفظ الرأي', 'error');
        } finally {
            this.hideLoading();
        }
    }
    // E-673

    // دالة جديدة لتحميل محتوى الهيرو
    async loadHeroContent() {
        try {
            const heroDoc = await db.collection('content').doc('hero').get();
            if (heroDoc.exists) {
                const data = heroDoc.data();
                const heroTitle1 = document.getElementById('heroTitle1');
                const heroTitle2 = document.getElementById('heroTitle2');
                const heroDescription = document.getElementById('heroDescription');
                const statProjects = document.getElementById('statProjects');
                const statExperience = document.getElementById('statExperience');
                const statSatisfaction = document.getElementById('statSatisfaction');
                
                if (heroTitle1) heroTitle1.value = data.title1 || '';
                if (heroTitle2) heroTitle2.value = data.title2 || '';
                if (heroDescription) heroDescription.value = data.description || '';
                if (statProjects) statProjects.value = data.stats?.projects || '';
                if (statExperience) statExperience.value = data.stats?.experience || '';
                if (statSatisfaction) statSatisfaction.value = data.stats?.satisfaction || '';
                
            }
        } catch (error) {
        }
    }

    // دالة جديدة لتحميل المميزات
    async loadFeaturesContent() {
        try {
            const featuresDoc = await db.collection('content').doc('features').get();
            if (featuresDoc.exists) {
                const data = featuresDoc.data();
                const feature1Title = document.getElementById('feature1Title');
                const feature1Desc = document.getElementById('feature1Desc');
                const feature2Title = document.getElementById('feature2Title');
                const feature2Desc = document.getElementById('feature2Desc');
                
                if (feature1Title) feature1Title.value = data.feature1?.title || '';
                if (feature1Desc) feature1Desc.value = data.feature1?.description || '';
                if (feature2Title) feature2Title.value = data.feature2?.title || '';
                if (feature2Desc) feature2Desc.value = data.feature2?.description || '';
                
            }
        } catch (error) {
        }
    }

    // دالة جديدة لتحميل معلومات الاتصال
    async loadContactContent() {
        try {
            const contactDoc = await db.collection('content').doc('contact').get();
            if (contactDoc.exists) {
                const data = contactDoc.data();
                const contactPhone = document.getElementById('contactPhone');
                const contactWhatsapp = document.getElementById('contactWhatsapp');
                const contactEmail = document.getElementById('contactEmail');
                const workHours1 = document.getElementById('workHours1');
                const workHours2 = document.getElementById('workHours2');
                const workHours3 = document.getElementById('workHours3');
                
                if (contactPhone) contactPhone.value = data.phone || '';
                if (contactWhatsapp) contactWhatsapp.value = data.whatsapp || '';
                if (contactEmail) contactEmail.value = data.email || '';
                if (workHours1) workHours1.value = data.workHours?.weekdays || '';
                if (workHours2) workHours2.value = data.workHours?.friday || '';
                if (workHours3) workHours3.value = data.workHours?.saturday || '';
                
            }
        } catch (error) {
        }
    }

    // === إعدادات الآلة الحاسبة ===
    async loadCalculatorSettings() {
        try {
            const doc = await db.collection('calculatorSettings').doc('prices').get();
            if (doc.exists) {
                const data = doc.data();
                const prices = data.prices || {};
                const discount = data.discount || {};
                
                // تعبئة حقول الأسعار
                document.getElementById('priceStandard').value = prices.standard || '';
                document.getElementById('priceWalls').value = prices.walls || '';
                document.getElementById('priceTV').value = prices.tv || '';
                document.getElementById('priceCustom').value = prices.custom || '';
                
                // تعبئة إعدادات الخصم
                document.getElementById('discountEnabled').checked = discount.enabled || false;
                document.getElementById('discountThreshold').value = discount.threshold || '';
                document.getElementById('discountPercentage').value = discount.percentage || '';
                
                
                // تحديث معاينة السعر بعد التحميل
                this.updatePricePreview();
            }
        } catch (error) {
        }
    }

    async saveCalculatorSettings() {
        try {
            this.showLoading();
            
            const calculatorData = {
                prices: {
                    'standard': parseInt(document.getElementById('priceStandard').value) || 0,
                    'walls': parseInt(document.getElementById('priceWalls').value) || 0,
                    'tv': parseInt(document.getElementById('priceTV').value) || 0,
                    'custom': parseInt(document.getElementById('priceCustom').value) || 0
                },
                discount: {
                    enabled: document.getElementById('discountEnabled').checked,
                    threshold: parseInt(document.getElementById('discountThreshold').value) || 0,
                    percentage: parseFloat(document.getElementById('discountPercentage').value) || 0
                },
                lastUpdated: new Date()
            };

            // التحقق من صحة البيانات
            if (!calculatorData.prices.standard || !calculatorData.prices.walls) {
                this.showMessage('يرجى إدخال جميع الأسعار الأساسية', 'error');
                return;
            }

            await db.collection('calculatorSettings').doc('prices').set(calculatorData);
            this.showMessage('تم حفظ إعدادات الآلة الحاسبة بنجاح!', 'success');
            
        } catch (error) {
            this.showMessage('حدث خطأ في حفظ الإعدادات', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // === الخدمات ===
    async loadServices() {
        try {
            const servicesSnapshot = await db.collection('services').orderBy('order', 'asc').get();
            const servicesList = document.getElementById('servicesList');
            if (servicesList) {
                servicesList.innerHTML = '';

                if (servicesSnapshot.empty) {
                    servicesList.innerHTML = '<div class="empty-state">لا توجد خدمات مضافة بعد</div>';
                    return;
                }

                servicesSnapshot.forEach(doc => {
                    const service = doc.data();
                    const serviceElement = this.createServiceElement(doc.id, service);
                    servicesList.appendChild(serviceElement);
                });
            }
        } catch (error) {
        }
    }

    createServiceElement(id, service) {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <div class="service-item-header">
                <div class="service-icon-preview">
                    <i class="${service.icon || 'fas fa-cog'}"></i>
                </div>
                <div class="service-info">
                    <h4>${service.title}</h4>
                    <p class="service-desc">${service.description.substring(0, 100)}...</p>
                    <div class="service-meta">
                        <span class="service-order">ترتيب: ${service.order || 1}</span>
                        <span class="service-features-count">${service.features ? service.features.length : 0} ميزة</span>
                    </div>
                </div>
            </div>
            <div class="service-actions">
                <button class="btn btn-primary" onclick="window.admin.editService('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="window.admin.deleteService('${id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        return div;
    }

    showServiceEditor(serviceId = null) {
        const editor = document.getElementById('serviceEditor');
        const title = document.getElementById('serviceEditorTitle');
        
        if (serviceId) {
            title.textContent = 'تعديل الخدمة';
            this.editingServiceId = serviceId;
            this.loadServiceData(serviceId);
        } else {
            title.textContent = 'إضافة خدمة جديدة';
            this.editingServiceId = null;
            this.resetServiceForm();
        }
        
        editor.classList.remove('hidden');
    }

    hideServiceEditor() {
        const editor = document.getElementById('serviceEditor');
        editor.classList.add('hidden');
        this.editingServiceId = null;
    }

    async loadServiceData(serviceId) {
        try {
            const doc = await db.collection('services').doc(serviceId).get();
            if (doc.exists) {
                const service = doc.data();
                document.getElementById('serviceTitle').value = service.title || '';
                document.getElementById('serviceDescription').value = service.description || '';
                document.getElementById('serviceFeatures').value = service.features ? service.features.join('\n') : '';
                document.getElementById('serviceIcon').value = service.icon || 'fas fa-cog';
                document.getElementById('serviceOrder').value = service.order || 1;
            }
        } catch (error) {
            this.showMessage('حدث خطأ في تحميل بيانات الخدمة', 'error');
        }
    }

    resetServiceForm() {
        document.getElementById('serviceTitle').value = '';
        document.getElementById('serviceDescription').value = '';
        document.getElementById('serviceFeatures').value = '';
        document.getElementById('serviceIcon').value = 'fas fa-cog';
        document.getElementById('serviceOrder').value = 1;
    }

    async saveService() {
        try {
            this.showLoading();
            
            const serviceData = {
                title: document.getElementById('serviceTitle').value,
                description: document.getElementById('serviceDescription').value,
                features: document.getElementById('serviceFeatures').value.split('\n').filter(f => f.trim()),
                icon: document.getElementById('serviceIcon').value,
                order: parseInt(document.getElementById('serviceOrder').value) || 1,
                lastUpdated: new Date()
            };

            if (!serviceData.title) {
                this.showMessage('يرجى إدخال عنوان الخدمة', 'error');
                return;
            }

            if (this.editingServiceId) {
                // تعديل خدمة موجودة
                await db.collection('services').doc(this.editingServiceId).update(serviceData);
                this.showMessage('تم تحديث الخدمة بنجاح!', 'success');
            } else {
                // إضافة خدمة جديدة
                serviceData.createdAt = new Date();
                await db.collection('services').add(serviceData);
                this.showMessage('تم إضافة الخدمة بنجاح!', 'success');
            }

            this.hideServiceEditor();
            await this.loadServices();
            
        } catch (error) {
            this.showMessage('حدث خطأ في حفظ الخدمة', 'error');
        } finally {
            this.hideLoading();
        }
    }

    editService(serviceId) {
        this.showServiceEditor(serviceId);
    }

    async deleteService(serviceId) {
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            try {
                await db.collection('services').doc(serviceId).delete();
                this.showMessage('تم حذف الخدمة بنجاح!', 'success');
                await this.loadServices();
            } catch (error) {
                this.showMessage('حدث خطأ في حذف الخدمة', 'error');
            }
        }
    }

    // === المشاريع ===
    async loadProjects() {
        try {
            const projectsSnapshot = await db.collection('projects').orderBy('date', 'desc').get();
            const projectsList = document.getElementById('projectsList');
            if (projectsList) {
                projectsList.innerHTML = '';

                if (projectsSnapshot.empty) {
                    projectsList.innerHTML = '<div class="empty-state">لا توجد أعمال مضافة بعد</div>';
                    return;
                }

                projectsSnapshot.forEach(doc => {
                    const project = doc.data();
                    const projectElement = this.createProjectElement(doc.id, project);
                    projectsList.appendChild(projectElement);
                });
            }
        } catch (error) {
        }
    }

    createProjectElement(id, project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <div class="project-item-header">
                ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image-preview">` : ''}
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p class="project-desc">${project.description.substring(0, 100)}...</p>
                    <div class="project-meta">
                        <span class="project-category">${project.category || 'غير مصنف'}</span>
                        <span class="project-date">${project.date ? new Date(project.date.seconds * 1000).toLocaleDateString('ar-EG') : 'غير محدد'}</span>
                    </div>
                </div>
            </div>
            <div class="project-actions">
                <button class="btn btn-primary" onclick="window.admin.editProject('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="window.admin.deleteProject('${id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        return div;
    }

    showProjectEditor(projectId = null) {
        const editor = document.getElementById('projectEditor');
        const title = document.getElementById('projectEditorTitle');
        
        if (projectId) {
            title.textContent = 'تعديل العمل';
            this.editingProjectId = projectId;
            this.loadProjectData(projectId);
        } else {
            title.textContent = 'إضافة عمل جديد';
            this.editingProjectId = null;
            this.resetProjectForm();
        }
        
        if (editor) {
            editor.classList.remove('hidden');
        }
    }

    hideProjectEditor() {
        const editor = document.getElementById('projectEditor');
        if (editor) {
            editor.classList.add('hidden');
        }
        this.editingProjectId = null;
    }

    async loadProjectData(projectId) {
        try {
            const doc = await db.collection('projects').doc(projectId).get();
            if (doc.exists) {
                const project = doc.data();
                document.getElementById('projectTitle').value = project.title || '';
                document.getElementById('projectDescription').value = project.description || '';
                document.getElementById('projectCategory').value = project.category || 'أسقف';
                
                // تعبئة حقل الرابط القديم لضمان حفظه عند التعديل إذا لم يرفع ملفاً جديداً
                const projectImageUrl = document.getElementById('projectImageUrl');
                if(projectImageUrl) projectImageUrl.value = project.imageUrl || ''; 

                if (project.imageUrl) {
                    this.previewImageFromUrl(project.imageUrl);
                } else {
                    this.removeImagePreview();
                }
                
                // مسح حقل الملف عند التحميل لتجنب تحميل ملف قديم
                const projectImageFile = document.getElementById('projectImageFile');
                if(projectImageFile) projectImageFile.value = '';

                if (project.date) {
                    const date = new Date(project.date.seconds * 1000);
                    document.getElementById('projectDate').value = date.toISOString().split('T')[0];
                } else {
                    document.getElementById('projectDate').value = '';
                }
            }
        } catch (error) {
            this.showMessage('حدث خطأ في تحميل بيانات العمل', 'error');
        }
    }

    resetProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectCategory').value = 'أسقف';
        document.getElementById('projectImageUrl').value = '';
        const projectImageFile = document.getElementById('projectImageFile');
        if(projectImageFile) projectImageFile.value = '';
        document.getElementById('projectDate').value = '';
        this.removeImagePreview();
    }

    async saveProject() {
        try {
            this.showLoading();
            
            // قراءة الملف من الحقل الجديد
            const imageFile = document.getElementById('projectImageFile')?.files[0]; 
            // حقل مخفي أو رابط قديم للتعديل
            let finalImageUrl = document.getElementById('projectImageUrl').value; 

            // 1. التعامل مع الرفع المباشر إذا اختار المستخدم ملفاً
            if (imageFile) {
                const uploadedUrl = await this.uploadImageToCloudinary(imageFile);
                
                if (!uploadedUrl) {
                    this.hideLoading();
                    return; // فشل الرفع
                }
                finalImageUrl = uploadedUrl; // استخدام رابط Cloudinary الجديد
                
                // تنظيف حقل الملف بعد الرفع لتجنب الرفع المتكرر
                document.getElementById('projectImageFile').value = ''; 
            } 
            
            // 2. التحقق من وجود رابط نهائي
            if (!finalImageUrl) {
                this.showMessage('يرجى اختيار ملف أو التأكد من تحميل الصورة.', 'error');
                this.hideLoading();
                return;
            }
            
            const projectData = {
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDescription').value,
                category: document.getElementById('projectCategory').value,
                imageUrl: finalImageUrl, 
                date: document.getElementById('projectDate').value ? new Date(document.getElementById('projectDate').value) : new Date(),
                lastUpdated: new Date()
            };

            if (!projectData.title) {
                this.showMessage('يرجى إدخال عنوان العمل', 'error');
                this.hideLoading();
                return;
            }

            if (this.editingProjectId) {
                // تعديل عمل موجود
                await db.collection('projects').doc(this.editingProjectId).update(projectData);
                this.showMessage('تم تحديث العمل بنجاح!', 'success');
            } else {
                // إضافة عمل جديد
                projectData.createdAt = new Date();
                await db.collection('projects').add(projectData);
                this.showMessage('تم إضافة العمل بنجاح!', 'success');
            }

            this.hideProjectEditor();
            await this.loadProjects();
            
        } catch (error) {
            this.showMessage('حدث خطأ في حفظ العمل', 'error');
        } finally {
            this.hideLoading();
        }
    }


    editProject(projectId) {
        this.showProjectEditor(projectId);
    }

    async deleteProject(projectId) {
        if (confirm('هل أنت متأكد من حذف هذا العمل؟')) {
            try {
                await db.collection('projects').doc(projectId).delete();
                this.showMessage('تم حذف العمل بنجاح!', 'success');
                await this.loadProjects();
            } catch (error) {
                this.showMessage('حدث خطأ في حذف العمل', 'error');
            }
        }
    }

    // === التسعير ===
    async loadPricing() {
        try {
            const pricingSnapshot = await db.collection('pricing').orderBy('order', 'asc').get();
            const pricingList = document.getElementById('pricingList');
            if (pricingList) {
                pricingList.innerHTML = '';

                if (pricingSnapshot.empty) {
                    pricingList.innerHTML = '<div class="empty-state">لا توجد باقات أسعار مضافة بعد</div>';
                    return;
                }

                pricingSnapshot.forEach(doc => {
                    const pricing = doc.data();
                    const pricingElement = this.createPricingElement(doc.id, pricing);
                    pricingList.appendChild(pricingElement);
                });
            }
        } catch (error) {
        }
    }

    createPricingElement(id, pricing) {
        const div = document.createElement('div');
        div.className = `pricing-item ${pricing.type || 'standard'}`;
        div.innerHTML = `
            <div class="pricing-item-header">
                <h4>${pricing.title}</h4>
                <div class="pricing-price">
                    <span class="amount">${this.formatPrice(pricing.price)}</span>
                    <span class="currency">${pricing.period || 'دينار/م²'}</span>
                </div>
                <div class="pricing-type">${this.getPricingTypeText(pricing.type)}</div>
            </div>
            <div class="pricing-features-preview">
                ${pricing.features ? pricing.features.slice(0, 3).map(feature => `<span>✓ ${feature}</span>`).join('') : ''}
                ${pricing.features && pricing.features.length > 3 ? `<span>+ ${pricing.features.length - 3} أكثر</span>` : ''}
            </div>
            <div class="pricing-actions">
                <button class="btn btn-primary" onclick="window.admin.editPricing('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="window.admin.deletePricing('${id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        return div;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ar-EG').format(price);
    }

    getPricingTypeText(type) {
        const types = {
            'standard': 'عادي',
            'featured': 'مميز',
            'premium': 'بريميوم'
        };
        return types[type] || 'عادي';
    }

    showPricingEditor(pricingId = null) {
        const editor = document.getElementById('pricingEditor');
        const title = document.getElementById('pricingEditorTitle');
        
        if (pricingId) {
            title.textContent = 'تعديل باقة الأسعار';
            this.editingPricingId = pricingId;
            this.loadPricingData(pricingId);
        } else {
            title.textContent = 'إضافة باقة أسعار';
            this.editingPricingId = null;
            this.resetPricingForm();
        }
        
        editor.classList.remove('hidden');
    }

    hidePricingEditor() {
        const editor = document.getElementById('pricingEditor');
        editor.classList.add('hidden');
        this.editingPricingId = null;
    }

    async loadPricingData(pricingId) {
        try {
            const doc = await db.collection('pricing').doc(pricingId).get();
            if (doc.exists) {
                const pricing = doc.data();
                document.getElementById('pricingTitle').value = pricing.title || '';
                document.getElementById('pricingPrice').value = pricing.price || '';
                document.getElementById('pricingPeriod').value = pricing.period || 'دينار/م²';
                document.getElementById('pricingFeatures').value = pricing.features ? pricing.features.join('\n') : '';
                document.getElementById('pricingType').value = pricing.type || 'standard';
            }
        } catch (error) {
            this.showMessage('حدث خطأ في تحميل بيانات الباقة', 'error');
        }
    }

    resetPricingForm() {
        document.getElementById('pricingTitle').value = '';
        document.getElementById('pricingPrice').value = '';
        document.getElementById('pricingPeriod').value = 'دينار/م²';
        document.getElementById('pricingFeatures').value = '';
        document.getElementById('pricingType').value = 'standard';
    }

    async savePricing() {
        try {
            this.showLoading();
            
            const pricingData = {
                title: document.getElementById('pricingTitle').value,
                price: parseInt(document.getElementById('pricingPrice').value) || 0,
                period: document.getElementById('pricingPeriod').value,
                features: document.getElementById('pricingFeatures').value.split('\n').filter(f => f.trim()),
                type: document.getElementById('pricingType').value,
                order: this.getNextPricingOrder(),
                lastUpdated: new Date()
            };

            if (!pricingData.title) {
                this.showMessage('يرجى إدخال اسم الباقة', 'error');
                return;
            }

            if (this.editingPricingId) {
                // تعديل باقة موجودة
                await db.collection('pricing').doc(this.editingPricingId).update(pricingData);
                this.showMessage('تم تحديث الباقة بنجاح!', 'success');
            } else {
                // إضافة باقة جديدة
                pricingData.createdAt = new Date();
                await db.collection('pricing').add(pricingData);
                this.showMessage('تم إضافة الباقة بنجاح!', 'success');
            }

            this.hidePricingEditor();
            await this.loadPricing();
            
        } catch (error) {
            this.showMessage('حدث خطأ في حفظ الباقة', 'error');
        } finally {
            this.hideLoading();
        }
    }

    getNextPricingOrder() {
        return Date.now();
    }

    editPricing(pricingId) {
        this.showPricingEditor(pricingId);
    }

    async deletePricing(pricingId) {
        if (confirm('هل أنت متأكد من حذف هذه الباقة؟')) {
            try {
                await db.collection('pricing').doc(pricingId).delete();
                this.showMessage('تم حذف الباقة بنجاح!', 'success');
                await this.loadPricing();
            } catch (error) {
                this.showMessage('حدث خطأ في حذف الباقة', 'error');
            }
        }
    }

    // === الدوال الأساسية ===
    async saveHero() {
        try {
            this.showLoading();
            
            const heroData = {
                title1: document.getElementById('heroTitle1').value,
                title2: document.getElementById('heroTitle2').value,
                description: document.getElementById('heroDescription').value,
                stats: {
                    projects: document.getElementById('statProjects').value,
                    experience: document.getElementById('statExperience').value,
                    satisfaction: document.getElementById('statSatisfaction').value
                },
                lastUpdated: new Date()
            };

            await db.collection('content').doc('hero').set(heroData);
            this.showMessage('تم حفظ القسم الرئيسي بنجاح!', 'success');
            
        } catch (error) {
            this.showMessage('حدث خطأ في الحفظ', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async saveFeatures() {
        try {
            this.showLoading();
            
            const featuresData = {
                feature1: {
                    title: document.getElementById('feature1Title').value,
                    description: document.getElementById('feature1Desc').value
                },
                feature2: {
                    title: document.getElementById('feature2Title').value,
                    description: document.getElementById('feature2Desc').value
                },
                lastUpdated: new Date()
            };

            await db.collection('content').doc('features').set(featuresData);
            this.showMessage('تم حفظ المميزات بنجاح!', 'success');
            
        } catch (error) {
            this.showMessage('حدث خطأ في الحفظ', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async saveContact() {
        try {
            this.showLoading();
            
            const contactData = {
                phone: document.getElementById('contactPhone').value,
                whatsapp: document.getElementById('contactWhatsapp').value,
                email: document.getElementById('contactEmail').value,
                workHours: {
                    weekdays: document.getElementById('workHours1').value,
                    friday: document.getElementById('workHours2').value,
                    saturday: document.getElementById('workHours3').value
                },
                lastUpdated: new Date()
            };

            await db.collection('content').doc('contact').set(contactData);
            this.showMessage('تم حفظ معلومات الاتصال بنجاح!', 'success');
            
        } catch (error) {
            this.showMessage('حدث خطأ في الحفظ', 'error');
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.remove('hidden');
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('hidden');
    }

    showMessage(text, type = 'success') {
        const messageDiv = document.getElementById('successMessage');
        if (messageDiv) {
            messageDiv.className = `message ${type}`;
            const span = messageDiv.querySelector('span');
            if (span) span.textContent = text;
            messageDiv.classList.remove('hidden');

            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 3000);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // انتظر حتى يتم تحميل Firebase أولاً
    const initApp = setInterval(() => {
        if (typeof db !== 'undefined' && typeof auth !== 'undefined') {
            clearInterval(initApp);
            
            window.admin = new AdminPanel();
            
            // تحقق من حالة المستخدم الحالي
            setTimeout(() => {
                if (auth.currentUser) {
                } else {
                }
            }, 500);
            
        } else {
        }
    }, 100);
});