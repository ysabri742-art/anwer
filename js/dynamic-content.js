// js/dynamic-content.js - النسخة النهائية الموحدة للموقع (SPA + محتوى ديناميكي كامل)

class DynamicContent {
    constructor() {
        console.log('🔄 DynamicContent initialized for Single Page Application');
        // تهيئة مصفوفة المشاريع الأصلية (للحركة اللانهائية والفلترة)
        window.originalProjects = []; 
    }

    // === 0. تهيئة جميع المحتويات في الصفحة الواحدة ===
    async initializePageContent() {
        console.log('🔄 Initializing ALL dynamic content...');

        // عرض Spinner تحميل عام قبل كل شيء (اختياري)
        this.showGlobalLoading();

        try {
            await Promise.all([
                this.loadHomeContent(),     // HERO + FEATURES + STATS
                this.loadServices(),        // الخدمات
                this.loadProjects(),        // المشاريع (مهم جداً يتم تحميله أولاً)
                this.loadPricing(),         // الأسعار
                this.loadTestimonials(),    // آراء العملاء
                this.loadContactInfo(),     // معلومات الاتصال (فوتر + كونتاكت)
            ]);

            // إعداد الفلترة وبدء الحركة بعد تحميل المشاريع
            this.setupProjectFilters();

            // إعداد تحديثات الـ Real-time
            this.setupRealtimeUpdates();

            console.log('✅ All dynamic content loaded for SPA.');

        } catch (error) {
            console.error('❌ FATAL ERROR during content initialization:', error);
            const main = document.querySelector('.admin-main') || document.body;
            main.innerHTML = `
                <div class="error-state" style="padding: 10rem; text-align:center">
                    <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;"></i>
                    <p style="margin-top:1rem;">حدث خطأ فادح أثناء تحميل محتوى الموقع. يرجى مراجعة Console.</p>
                </div>
            `;
        } finally {
            this.hideGlobalLoading();
        }
    }

    // === Helper: تحميل عام (Spinner) ===
    showGlobalLoading() {
        if (document.getElementById('globalLoadingOverlay')) return;

        const spinner = document.createElement('div');
        spinner.id = 'globalLoadingOverlay';
        spinner.innerHTML = `
            <div class="loading-spinner" style="z-index: 9999; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
                <div class="spinner"></div>
                <p style="margin-top:1rem;">جاري تحميل الموقع...</p>
            </div>
        `;
        spinner.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(255,255,255,0.8);
            z-index: 9999;
        `;
        document.body.appendChild(spinner);
    }

    hideGlobalLoading() {
        const spinner = document.getElementById('globalLoadingOverlay');
        if (spinner) spinner.remove();
    }

    // === 1. تحميل الخدمات ===
    async loadServices() {
        try {
            console.log('📥 Loading services from Firebase...');
            const servicesGrid =
                document.getElementById('servicesGrid') ||
                document.querySelector('.services-grid');

            const snapshot = await db.collection('services')
                .orderBy('order', 'asc')
                .get();

            if (!servicesGrid) {
                console.log('⚠️ Services container not found');
                return;
            }

            if (snapshot.empty) {
                servicesGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-concierge-bell"></i>
                        <p>لا توجد خدمات متاحة حالياً</p>
                    </div>
                `;
                return;
            }

            let servicesHTML = '';
            snapshot.forEach(doc => {
                const service = doc.data();
                servicesHTML += this.createServiceHTML(service);
            });

            servicesGrid.innerHTML = servicesHTML;
            console.log(`✅ ${snapshot.size} services loaded successfully`);

        } catch (error) {
            console.error('Error loading services:', error);
            this.showError('servicesGrid', 'حدث خطأ في تحميل الخدمات');
        }
    }

    createServiceHTML(service) {
        const featuresHTML = service.features && Array.isArray(service.features)
            ? service.features.map(feature =>
                `<span><i class="fas fa-check"></i> ${feature}</span>`
            ).join('')
            : '';

        // اختيار أيقونة مناسبة حسب نوع الخدمة (من منطق WebsiteContent القديم)
        const iconClass = this.getServiceIcon(service.title || '');

        return `
            <div class="service-card">
                <div class="service-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="service-content">
                    <h3>${service.title || 'خدمة'}</h3>
                    <p>${service.description || 'وصف الخدمة'}</p>
                    <div class="service-features">
                        ${featuresHTML}
                    </div>
                    <a href="https://wa.me/9647825044606?text=مساء الخير! أريد استفسار عن خدمة ${encodeURIComponent(service.title || '')}" 
                       class="btn btn-primary whatsapp-service-btn" 
                       target="_blank">
                        <i class="fab fa-whatsapp"></i> اطلب عرض سعر
                    </a>
                </div>
            </div>
        `;
    }

    getServiceIcon(serviceTitle) {
        const icons = {
            'أسقف': 'fas fa-layer-group',
            'جدران': 'fas fa-wall',
            'شاشة': 'fas fa-tv',
            'مكتبات': 'fas fa-book',
            'مطاعم': 'fas fa-utensils',
            'فنادق': 'fas fa-hotel'
        };

        for (const [keyword, icon] of Object.entries(icons)) {
            if (serviceTitle.includes(keyword)) {
                return icon;
            }
        }

        return 'fas fa-concierge-bell'; // أيقونة افتراضية
    }

    // === 2. تحميل المشاريع ===
    async loadProjects() {
        try {
            console.log('📥 Loading projects from Firebase...');
            const projectsGrid = document.getElementById('projectsGrid');
            const projectsLoading = document.querySelector('.projects-loading');

            if (!projectsGrid) {
                console.log('⚠️ Projects container not found (#projectsGrid)');
                if (projectsLoading) projectsLoading.style.display = 'none';
                return;
            }
            
            // 🛑 تنظيف الـ Grid أولاً
            projectsGrid.innerHTML = '';

            const snapshot = await db.collection('projects')
                .orderBy('date', 'desc')
                .get();

            if (projectsLoading) {
                projectsLoading.style.display = 'none';
            }
            
            // 🛑 تفريغ مصفوفة المشاريع الأصلية
            window.originalProjects = [];
            
            if (snapshot.empty) {
                projectsGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-project-diagram"></i>
                        <p>لا توجد أعمال معروضة حالياً</p>
                    </div>
                `;
            } else {
                snapshot.forEach(doc => {
                    const project = doc.data();
                    const itemHTML = this.createProjectHTML(project);
                    
                    // إنشاء العنصر من الـ HTML وحفظه
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = itemHTML.trim();
                    const projectElement = tempDiv.firstChild;
                    
                    // 🛑 حفظ العناصر الأصلية فقط في مصفوفة الـ Window
                    window.originalProjects.push(projectElement);
                });
            }

            console.log(`✅ ${snapshot.size} projects loaded successfully and stored as originals.`);

        } catch (error) {
            console.error('Error loading projects:', error);
            const projectsLoading = document.querySelector('.projects-loading');
            if (projectsLoading) projectsLoading.style.display = 'none';
            this.showError('projectsGrid', 'حدث خطأ في تحميل الأعمال');
        }
    }

    createProjectHTML(project) {
        const date = project.date
            ? new Date(project.date.seconds * 1000).toLocaleDateString('ar-EG')
            : 'غير محدد';

        const imageUrl =
            project.imageUrl && !project.imageUrl.includes('null')
                ? project.imageUrl
                : 'images/placeholder.jpg';

        return `
            <div class="project-item" data-category="${project.category || 'all'}">
                <div class="project-image">
                    <img src="${imageUrl}" 
                         alt="${project.title || 'مشروع'}" 
                         class="project-main-img" 
                         onerror="this.src='images/placeholder.jpg'; this.style.opacity='1';">
                </div>
                <div class="project-content">
                    <span class="project-category">${project.category || 'غير مصنف'}</span>
                    <h3>${project.title || 'مشروع'}</h3>
                    <p class="project-description">${project.description || ''}</p>
                    <div class="project-meta">
                        <span class="project-date">${date}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // === إعداد الفلترة وبدء الحركة الدوارة للمشاريع ===
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // تفعيل الفلترة أولاً
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // إعادة تهيئة الحركة بالفلتر الجديد
                this.initializeCarouselScroll(filterValue); 
            });
        });

        // تشغيل الحركة بالفلتر الافتراضي (الكل) عند التحميل
        const defaultBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (defaultBtn) defaultBtn.click();
    }
    
// js/dynamic-content.js

// ... (باقي الكلاس DynamicContent) ...

// === دالة التحكم في عرض المشاريع (عرض واحد فقط مع أنيميشن) ===
initializeCarouselScroll(filter = 'all') {
    const projectsGrid = document.getElementById('projectsGrid');
    
    // 1. تنظيف الحاوية: حذف كل العناصر الموجودة حالياً
    projectsGrid.innerHTML = '';
    
    // التأكد من أن المصفوفة الأصلية تم تحميلها
    if (!window.originalProjects || window.originalProjects.length === 0) return;

    // 2. جلب وتصفية العناصر الأصلية بناءً على الفلتر
    const visibleItems = window.originalProjects.filter(item => {
        return filter === 'all' || item.getAttribute('data-category') === filter;
    });
    
    if (visibleItems.length === 0) {
        projectsGrid.innerHTML = `<div class="empty-state" style="width:100%; grid-column: 1 / -1; text-align: center;">
            <i class="fas fa-search-minus"></i> <p>لا توجد أعمال في هذا التصنيف حالياً</p>
        </div>`;
        
        // 🛑 إعادة تفعيل تنسيق Gridbox إذا لم تكن هناك عناصر
        projectsGrid.style.display = 'grid'; 
        projectsGrid.style.overflowX = 'hidden'; 
        projectsGrid.style.width = '100%';
        
        return;
    }
    
    // 🛑 تفعيل تنسيق Gridbox مرة أخرى (للصفوف والأعمدة العادية) 🛑
    projectsGrid.style.display = 'grid'; 
    projectsGrid.style.overflowX = 'hidden';
    projectsGrid.style.width = '100%'; 
    projectsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
    projectsGrid.style.gap = '2rem';
    
    // 3. دمج العناصر الأصلية في الحاوية (مرة واحدة فقط)
    visibleItems.forEach((item, index) => {
        // إزالة كل كلاسات الحركة السابقة
        item.classList.remove('scroll-item', 'paused', 'cloned'); 
        
        // 🛑 تطبيق كلاس الأنيميشن البسيط الجديد
        item.classList.add('gentle-float-animation'); 
        item.style.animationDelay = `${index * 0.1}s`; // تأخير متدرج للظهور
        
        projectsGrid.appendChild(item);
    });
    
    // 🛑 لا حاجة لربط مستمعات Touch/Hover بعد الآن، الأنيميشن سيعمل تلقائياً
    console.log(`✅ Projects displayed once with floating animation for filter: ${filter}.`);
}


    // === 3. تحميل التسعير ===
    async loadPricing() {
        try {
            console.log('📥 Loading pricing from Firebase...');
            const pricingCards = document.getElementById('pricingCards');

            const snapshot = await db.collection('pricing')
                .orderBy('order', 'asc')
                .get();

            if (!pricingCards) {
                console.log('⚠️ Pricing container not found (#pricingCards)');
                return;
            }

            if (snapshot.empty) {
                pricingCards.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tags"></i>
                        <p>لا توجد باقات أسعار متاحة حالياً</p>
                    </div>
                `;
                return;
            }

            let pricingHTML = '';
            snapshot.forEach(doc => {
                pricingHTML += this.createPricingHTML(doc.data());
            });

            pricingCards.innerHTML = pricingHTML;

            await this.loadPricingNotes();
            console.log(`✅ ${snapshot.size} pricing packages loaded successfully`);

        } catch (error) {
            console.error('Error loading pricing:', error);
            this.showError('pricingCards', 'حدث خطأ في تحميل الأسعار');
        }
    }

    createPricingHTML(pricing) {
        const featuresHTML = pricing.features && Array.isArray(pricing.features)
            ? pricing.features.map(feature =>
                `<li><i class="fas fa-check"></i> ${feature}</li>`
            ).join('')
            : '';

        const isFeatured = pricing.type === 'featured';
        const featuredClass = isFeatured ? 'featured' : '';
        const whatsappMsg = `مساء الخير! أريد استفسار عن باقة ${encodeURIComponent(pricing.title || '')}`;

        return `
            <div class="pricing-card ${featuredClass}">
                ${isFeatured ? '<div class="pricing-badge">عرض خاص</div>' : ''}
                <div class="pricing-header">
                    <h3>${pricing.title || 'باقـة'}</h3>
                    <div class="price">
                        <span class="amount">${this.formatPrice(pricing.price || 0)}</span>
                        <span class="currency">${pricing.period || 'دينار/م²'}</span>
                    </div>
                    ${pricing.discountNote ? `<p class="discount-note">${pricing.discountNote}</p>` : ''}
                </div>
                <ul class="pricing-features">
                    ${featuresHTML}
                </ul>
                <a href="https://wa.me/9647825044606?text=${whatsappMsg}" 
                   class="btn btn-primary whatsapp-service-btn" 
                   target="_blank">
                    <i class="fab fa-whatsapp"></i> ${isFeatured ? 'اطلب عرض سعر' : 'استشارة مجانية'}
                </a>
            </div>
        `;
    }

    async loadPricingNotes() {
        try {
            const noteDoc = await db.collection('content').doc('pricing').get();
            if (noteDoc.exists) {
                const data = noteDoc.data();
                const pricingNote = document.getElementById('pricingNote');
                if (pricingNote && data.note) {
                    pricingNote.textContent = data.note;
                }
            }
        } catch (error) {
            console.error('Error loading pricing notes:', error);
        }
    }

    // === 4. تحميل آراء العملاء ===
    async loadTestimonials() {
        try {
            console.log('📥 Loading testimonials from Firebase...');
            const testimonialsContainer = document.getElementById('testimonialsContainer');

            const snapshot = await db.collection('testimonials')
                .where('approved', '==', true)
                .get();

            if (!testimonialsContainer) {
                console.log('⚠️ Testimonials container not found (#testimonialsContainer)');
                return;
            }

            if (snapshot.empty) {
                testimonialsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-comments"></i>
                        <h3>لا توجد تقييمات متاحة حالياً</h3>
                        <p>كن أول من يشارك تجربته مع خدماتنا</p>
                    </div>
                `;
                return;
            }

            let testimonials = [];
            let totalRating = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                testimonials.push({ id: doc.id, ...data });
                totalRating += data.rating || 5;
            });

            // فرز يدوي أحدث تقييم أولاً
            testimonials.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || a.date?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || b.date?.toDate?.() || new Date(0);
                return dateB - dateA;
            });

            // عرض آخر 6 فقط
            testimonials = testimonials.slice(0, 6);

            let testimonialsHTML = '';
            testimonials.forEach(t => {
                testimonialsHTML += this.createTestimonialHTML(t);
            });

            testimonialsContainer.innerHTML = testimonialsHTML;

            // تحديث الإحصائيات
            const totalElement = document.getElementById('totalTestimonials');
            const avgElement = document.getElementById('averageRating');
            if (totalElement) totalElement.textContent = testimonials.length;
            if (avgElement && testimonials.length > 0) {
                avgElement.textContent = (totalRating / testimonials.length).toFixed(1);
            }

            console.log(`✅ ${testimonials.length} testimonials loaded successfully`);

        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.showError('testimonialsContainer', 'حدث خطأ في تحميل التقييمات');
        }
    }

    createTestimonialHTML(testimonial) {
        const stars = '⭐'.repeat(testimonial.rating || 5);
        const dateObj = testimonial.date
            ? new Date(testimonial.date.seconds * 1000)
            : new Date();
        const formattedDate = dateObj.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="customer-info">
                        <h4>${testimonial.name || 'عميل كريم'}</h4>
                        <div class="project-type">${testimonial.project || testimonial.job || 'غير محدد'}</div>
                    </div>
                    <div class="rating-stars">${stars}</div>
                </div>
                <div class="testimonial-text">
                    ${testimonial.text || testimonial.message || 'لا يوجد تعليق.'}
                </div>
                <div class="testimonial-footer">
                    <div class="testimonial-date">${formattedDate}</div>
                    ${testimonial.recommend === 'نعم'
                        ? '<div class="recommendation">ينصح بالتعامل</div>'
                        : ''}
                </div>
            </div>
        `;
    }

    // === 5. تحميل المحتوى الأساسي (HERO + FEATURES + STATS) ===
    async loadHomeContent() {
        try {
            console.log('📥 Loading home content from Firebase...');

            const [heroDoc, featuresDoc] = await Promise.all([
                db.collection('content').doc('hero').get(),
                db.collection('content').doc('features').get()
            ]);

            if (heroDoc.exists) this.updateHeroContent(heroDoc.data());
            if (featuresDoc.exists) this.updateFeaturesContent(heroDoc.data(), featuresDoc.data());

            console.log('✅ Home content loaded successfully');

        } catch (error) {
            console.error('Error loading home content:', error);
        }
    }

    updateHeroContent(data) {
        console.log('🎯 Updating hero content:', data);

        // لو عندك عناصر جديدة بالـ classes
        const titleLine = document.querySelector('.hero-title .title-line');
        const titleSubline = document.querySelector('.hero-title .title-subline');
        const heroDescription = document.querySelector('.hero-description');

        if (titleLine && data.title1) {
            titleLine.textContent = data.title1;
        }
        if (titleSubline && data.title2) {
            titleSubline.textContent = data.title2;
        }
        if (heroDescription && data.description) {
            heroDescription.textContent = data.description;
        }

        // ولو عندك IDs قديمة للعنوانين
        if (data.title1 && document.getElementById('heroTitle1')) {
            document.getElementById('heroTitle1').textContent = data.title1;
        }
        if (data.title2 && document.getElementById('heroTitle2')) {
            document.getElementById('heroTitle2').textContent = data.title2;
        }
        if (data.description && document.getElementById('heroDescription')) {
            document.getElementById('heroDescription').textContent = data.description;
        }

        // إحصائيات
        if (data.stats) {
            this.updateStats(data.stats);
        }
    }

    updateStats(stats) {
        console.log('📊 Updating stats:', stats);

        // Version 1: IDs (مثلاً why-us section)
        if (stats.projects && document.getElementById('statProjects')) {
            document.getElementById('statProjects').textContent = stats.projects;
        }
        if (stats.experience && document.getElementById('statExperience')) {
            document.getElementById('statExperience').textContent = stats.experience;
        }
        if (stats.satisfaction && document.getElementById('statSatisfaction')) {
            document.getElementById('statSatisfaction').textContent = stats.satisfaction;
        }

        // Version 2: أرقام في كروت إحصائيات عامة
        const statElements = document.querySelectorAll('.stat-number');
        if (statElements.length >= 3) {
            // Note: This logic is tricky if counters.js is also running.
            // It might overwrite initial content before the counter animation starts.
            // We rely on data attributes in why-us.js for the counter.
            
            // Example for general stat element update
            // if (stats.projects && statElements[0]) {
            //     statElements[0].textContent = `+${stats.projects}`;
            // }
        }
    }

    updateFeaturesContent(heroData, featuresData) {
        // heroData مش محتاجه هنا، بس سايبها لو حبيت تستغلها
        const data = featuresData || heroData?.features || {};

        console.log('⭐ Updating features content:', data);

        // Version 1: IDs بسيطة
        if (data.feature1) {
            if (document.getElementById('feature1Title')) {
                document.getElementById('feature1Title').textContent = data.feature1.title;
            }
            if (document.getElementById('feature1Desc')) {
                document.getElementById('feature1Desc').textContent = data.feature1.description;
            }
        }
        if (data.feature2) {
            if (document.getElementById('feature2Title')) {
                document.getElementById('feature2Title').textContent = data.feature2.title;
            }
            if (document.getElementById('feature2Desc')) {
                document.getElementById('feature2Desc').textContent = data.feature2.description;
            }
        }

        // Version 2: Feature Cards (أربع كروت)
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length >= 4) {
            if (featureCards[0] && data.feature1) {
                this.updateFeatureCard(featureCards[0], data.feature1);
            }
            if (featureCards[1] && data.feature2) {
                this.updateFeatureCard(featureCards[1], data.feature2);
            }
            if (featureCards[2] && data.feature3) {
                this.updateFeatureCard(featureCards[2], data.feature3);
            }
            if (featureCards[3] && data.feature4) {
                this.updateFeatureCard(featureCards[3], data.feature4);
            }
        }

        // Version 3: why-us feature list
        const featureItems = document.querySelectorAll('.feature-item');
        if (featureItems.length >= 2) {
            if (featureItems[0] && data.feature1) {
                this.updateWhyUsFeatureItem(featureItems[0], data.feature1);
            }
            if (featureItems[1] && data.feature2) {
                this.updateWhyUsFeatureItem(featureItems[1], data.feature2);
            }
        }
    }

    updateFeatureCard(card, featureData) {
        const titleElement = card.querySelector('h3');
        const descriptionElement = card.querySelector('p');

        if (titleElement && featureData.title) {
            titleElement.textContent = featureData.title;
        }
        if (descriptionElement && featureData.description) {
            descriptionElement.textContent = featureData.description;
        }
    }

    updateWhyUsFeatureItem(item, featureData) {
        const titleElement = item.querySelector('h4');
        const descriptionElement = item.querySelector('p');

        if (titleElement && featureData.title) {
            titleElement.textContent = featureData.title;
        }
        if (descriptionElement && featureData.description) {
            descriptionElement.textContent = featureData.description;
        }
    }

    // === 6. تحميل وتحديث معلومات الاتصال ===
    async loadContactInfo() {
        try {
            console.log('📥 Loading contact info...');
            const contactDoc = await db.collection('content').doc('contact').get();
            if (contactDoc.exists) {
                this.updateContactInfo(contactDoc.data());
            }
        } catch (error) {
            console.error('Error loading contact info:', error);
        }
    }

    updateContactInfo(data) {
        console.log('📞 Updating contact info...', data);

        this.updateFooterContact(data);
        this.updateContactPage(data);
    }

    updateFooterContact(data) {
        // تحديث رقم الهاتف في الفوتر (حسب الـ HTML عندك)
        const phoneElements = document.querySelectorAll('.footer-section p:has(.fa-phone)');
        phoneElements.forEach(element => {
            if (data.phone) {
                element.innerHTML = `<i class="fas fa-phone"></i> ${data.phone}`;
            }
        });

        // تحديث الواتساب في الفوتر
        const whatsappElements = document.querySelectorAll('.footer-section p:has(.fa-whatsapp)');
        whatsappElements.forEach(element => {
            if (data.whatsapp) {
                element.innerHTML = `<i class="fab fa-whatsapp"></i> ${data.whatsapp}`;
            }
        });

        // تحديث جميع أزرار الواتساب في الموقع
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
        whatsappButtons.forEach(button => {
            if (data.whatsapp) {
                const currentHref = button.getAttribute('href');
                // تحديث رقم الواتساب فقط في الـ href
                const newHref = currentHref.replace(/wa\.me\/[^?]+/, `wa.me/${data.whatsapp.replace(/\+/g, '')}`);
                button.href = newHref;
            }
        });

        console.log('✅ Footer contact info updated');
    }

    updateContactPage(data) {
        if (!document.querySelector('.contact-section')) return;

        console.log('📄 Updating contact page...');

        // رقم الهاتف
        const contactPhone = document.getElementById('contactPhone');
        if (contactPhone && data.phone) {
            // ملاحظة: في الواجهة الأمامية نستخدم الـ <a href> وليس <input>
            // هذا الجزء يحتاج مراجعة الـ HTML للتأكد من تحديث الأماكن الصحيحة
        }

        // الواتساب
        const whatsappLinks = document.querySelectorAll('.contact-link[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            if (data.whatsapp) {
                const whatsappNumber = data.whatsapp.replace(/\+/g, '');
                link.href = `https://wa.me/${whatsappNumber}`;
                // هنا تفترض أن النص هو الرقم، ولكن يمكن أن يكون "ابدأ محادثة"
                // link.textContent = data.whatsapp; 
            }
        });
        
        // تحديث أوقات العمل
        const hoursList = document.querySelector('.working-hours .hours-list');
        if(hoursList && data.workHours) {
             const items = hoursList.querySelectorAll('.hour-item');
             if(items.length >= 3) {
                 // الأحد - الخميس
                 items[0].querySelector('span:last-child').textContent = data.workHours.weekdays || 'غير محدد';
                 // الجمعة
                 items[1].querySelector('span:last-child').textContent = data.workHours.friday || 'غير محدد';
                 // السبت
                 items[2].querySelector('span:last-child').textContent = data.workHours.saturday || 'غير محدد';
             }
        }

        console.log('✅ Contact page updated');
    }

    // === 7. Real-time Updates من Firebase ===
    setupRealtimeUpdates() {
        console.log('🔄 Setting up real-time updates...');

        // Hero
        db.collection('content').doc('hero')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log('🔄 Hero content updated in real-time');
                    this.updateHeroContent(doc.data());
                }
            });

        // Features
        db.collection('content').doc('features')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log('🔄 Features content updated in real-time');
                    this.updateFeaturesContent(null, doc.data());
                }
            });

        // Services
        db.collection('services')
            .onSnapshot(() => {
                console.log('🔄 Services updated in real-time');
                this.loadServices();
            });

        // Projects - تحديث المشاريع في الوقت الحقيقي
        db.collection('projects')
            .onSnapshot(() => {
                console.log('🔄 Projects updated in real-time');
                // إعادة تحميل المشاريع الأصلية ثم إعادة تشغيل الحركة
                this.loadProjects().then(() => {
                    this.setupProjectFilters();
                });
            });

        // Contact info
        db.collection('content').doc('contact')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log('🔄 Contact info updated in real-time');
                    this.updateContactInfo(doc.data());
                }
            });
    }

    // === دوال مساعدة عامة ===
    formatPrice(price) {
        return new Intl.NumberFormat('ar-EG').format(price || 0);
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        <i class="fas fa-redo"></i> إعادة المحاولة
                    </button>
                </div>
            `;
        }
    }

    getCurrentPage() {
        return 'index'; // متبقية لو حابب تستعملها في حاجة
    }
}

// تهيئة المحتوى الديناميكي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM loaded, initializing DynamicContent (Unified)...');

    const initContent = setInterval(() => {
        // ننتظر حتى يتم تعريف Firebase/Firestore في firebase-config.js
        if (typeof db !== 'undefined') {
            clearInterval(initContent);
            console.log('✅ Firebase ready, initializing DynamicContent...');
            window.dynamicContent = new DynamicContent();
            window.dynamicContent.initializePageContent();
        } else {
            console.log('⏳ Waiting for Firebase services...');
        }
    }, 100);
});
// js/dynamic-content.js (في نهاية الملف)

// js/dynamic-content.js (في نهاية الملف)

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('projectsGrid');
    const prevBtn = document.getElementById('prevProjectBtn');
    const nextBtn = document.getElementById('nextProjectBtn');

    // يجب التأكد من وجود هذه العناصر في الـ HTML
    if (!grid || !prevBtn || !nextBtn) return;
    
    // 🛑 العرض الذي سيتم تمريره (عرض بطاقة واحدة + الهامش)
    // نستخدم عرض تقديري لضمان سلاسة الحركة: 350px (عرض البطاقة) + 32px (الهامش 2rem)
    const SCROLL_AMOUNT = 350 + 32; 

    // دالة التمرير اليدوي
    function scrollProjects(direction) {
        // direction: 1 لليسار (Next)، -1 لليمين (Prev)
        
        // استخدام scrollBy للتمرير بمقدار محدد
        grid.scrollBy({
            left: direction * SCROLL_AMOUNT, 
            behavior: 'smooth'
        });
    }

    // ربط الأزرار
    // زر NEXT (السهم لليسار) يمرر إلى الأمام (عرض Flexbox)
    nextBtn.addEventListener('click', () => scrollProjects(1));
    
    // زر PREV (السهم لليمين) يمرر إلى الخلف
    prevBtn.addEventListener('click', () => scrollProjects(-1));
});

// هذا الكود يجب أن يكون مضافاً إلى ملف dynamic-content.js


// دوال مساعدة للاختبار من الـ Console
window.checkContentStatus = function () {
    console.log('🔍 Checking content status...');
    console.log('Firebase connected:', typeof db !== 'undefined');
    console.log('Services loaded:', document.querySelectorAll('.service-card').length);
    console.log('Projects originals:', window.originalProjects.length);
    console.log('Projects current in DOM:', document.querySelectorAll('#projectsGrid > .project-item').length);
    console.log('Features loaded:', document.querySelectorAll('.feature-card').length);
    console.log('Testimonials loaded:', document.querySelectorAll('.testimonial-card').length);
};