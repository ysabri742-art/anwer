// js/dynamic-content.js - النسخة النهائية الكاملة المصححة

class DynamicContent {
    constructor() {
        console.log('🔄 DynamicContent initialized for Single Page Application');
        window.originalProjects = []; 
        window.projectsData = [];
    }

    // === 0. تهيئة جميع المحتويات في الصفحة الواحدة ===
    async initializePageContent() {
        console.log('🔄 Initializing ALL dynamic content...');
        this.showGlobalLoading();

        try {
            await Promise.all([
                this.loadHomeContent(),
                this.loadServices(),
                this.loadProjects(),
                this.loadPricing(),
                this.loadTestimonials(),
                this.loadContactInfo(),
            ]);

            this.setupProjectFilters();
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
            const servicesGrid = document.getElementById('servicesGrid') || document.querySelector('.services-grid');

            const snapshot = await db.collection('services').orderBy('order', 'asc').get();

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

        const iconClass = this.getServiceIcon(service.title || '');

        return `
            <div class="service-card">
                <div class="service-icon glow-intense">
                    <i class="${iconClass}"></i>
                </div>
                <div class="service-content">
                    <h3>${service.title || 'خدمة'}</h3>
                    <p>${service.description || 'وصف الخدمة'}</p>
                    <div class="service-features">
                        ${featuresHTML}
                    </div>
                    <a href="https://wa.me/9647825044606?text=مساء الخير! أريد استفسار عن خدمة ${encodeURIComponent(service.title || '')}" 
                       class="whatsapp-service-btn" 
                       target="_blank">
                        <i class="fab fa-whatsapp"></i> احصل على استشارة مجانية
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
            'فنادق': 'fas fa-hotel',
            'جبس': 'fas fa-palette',
            'ديكور': 'fas fa-paint-roller',
            'بلازما': 'fas fa-tv',
            'قواطع': 'fas fa-columns'
        };

        for (const [keyword, icon] of Object.entries(icons)) {
            if (serviceTitle.includes(keyword)) {
                return icon;
            }
        }

        return 'fas fa-concierge-bell';
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
            
            projectsGrid.innerHTML = '';

            const snapshot = await db.collection('projects').orderBy('date', 'desc').get();

            if (projectsLoading) projectsLoading.style.display = 'none';
            
            window.originalProjects = [];
            window.projectsData = [];
            
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
                    window.projectsData.push(project);
                    const itemHTML = this.createProjectHTML(project);
                    
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = itemHTML.trim();
                    const projectElement = tempDiv.firstChild;
                    window.originalProjects.push(projectElement);
                });
            }

            console.log(`✅ ${snapshot.size} projects loaded successfully`);

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

        const imageUrl = project.imageUrl && !project.imageUrl.includes('null')
            ? project.imageUrl
            : 'images/placeholder.jpg';

        return `
            <div class="project-item" data-category="${project.category || 'all'}" data-image="${imageUrl}" data-title="${project.title || 'مشروع'}">
                <div class="project-image">
                    <img src="${imageUrl}" 
                         alt="${project.title || 'مشروع'}" 
                         class="project-main-img">
                    <div class="image-overlay">
                        <div class="image-actions">
                            <button class="preview-btn" data-image="${imageUrl}">
                                <i class="fas fa-eye"></i> معاينة
                            </button>
                            
                        </div>
                    </div>
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

    // === دوال المعاينة والتحميل ===
    previewImage(imageUrl) {
        if (!imageUrl || imageUrl.includes('placeholder')) {
            alert('لا توجد صورة متاحة للمعاينة');
            return;
        }
        window.open(imageUrl, '_blank');
    }

   

    setupImageActions() {
        const previewButtons = document.querySelectorAll('.preview-btn');
        const downloadButtons = document.querySelectorAll('.download-btn');
        
        previewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const imageUrl = e.target.closest('.preview-btn').getAttribute('data-image');
                this.previewImage(imageUrl);
            });
        });
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const imageUrl = e.target.closest('.download-btn').getAttribute('data-image');
                const fileName = e.target.closest('.download-btn').getAttribute('data-filename');
                this.downloadImage(imageUrl, fileName);
            });
        });
    }

    // === إعداد الفلترة ===
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                this.initializeCarouselScroll(filterValue); 
            });
        });

        const defaultBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (defaultBtn) defaultBtn.click();
    }
    
    // === دالة العرض مع أزرار المعاينة والتحميل ===
    initializeCarouselScroll(filter = 'all') {
        const projectsGrid = document.getElementById('projectsGrid');
        const prevBtn = document.getElementById('prevProjectBtn');
        const nextBtn = document.getElementById('nextProjectBtn');
        
        projectsGrid.innerHTML = '';
        
        if (!window.originalProjects || window.originalProjects.length === 0) return;

        const visibleItems = window.originalProjects.filter(item => {
            return filter === 'all' || item.getAttribute('data-category') === filter;
        });
        
        if (visibleItems.length === 0) {
            projectsGrid.innerHTML = `<div class="empty-state">لا توجد أعمال في هذا التصنيف</div>`;
            return;
        }
        
        visibleItems.forEach((item) => {
            projectsGrid.appendChild(item.cloneNode(true));
        });
        
        this.setupImageActions();
        this.setupManualScroll();
    }

    setupManualScroll() {
        const projectsGrid = document.getElementById('projectsGrid');
        const prevBtn = document.getElementById('prevProjectBtn');
        const nextBtn = document.getElementById('nextProjectBtn');
        
        if (!projectsGrid || !prevBtn || !nextBtn) return;
        
        const scrollAmount = 450 + 32;
        
        nextBtn.addEventListener('click', () => {
            projectsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            projectsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // === 3. تحميل التسعير ===
    async loadPricing() {
        try {
            console.log('📥 Loading pricing from Firebase...');
            const pricingCards = document.getElementById('pricingCards');

            const snapshot = await db.collection('pricing').orderBy('order', 'asc').get();

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
            ? pricing.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')
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
                <ul class="pricing-features">${featuresHTML}</ul>
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

            const snapshot = await db.collection('testimonials').where('approved', '==', true).get();

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

            testimonials.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || a.date?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || b.date?.toDate?.() || new Date(0);
                return dateB - dateA;
            });

            // 🛑 تم إزالة سطر قص القائمة (slice(0, 6)) للسماح بظهور التمرير الأفقي 🛑

            let testimonialsHTML = '';
            testimonials.forEach(t => {
                testimonialsHTML += this.createTestimonialHTML(t);
            });

            testimonialsContainer.innerHTML = testimonialsHTML;

            const totalElement = document.getElementById('totalTestimonials');
            const avgElement = document.getElementById('averageRating');
            if (totalElement) totalElement.textContent = testimonials.length;
            if (avgElement && testimonials.length > 0) {
                avgElement.textContent = (totalRating / testimonials.length).toFixed(1);
            }

            console.log(`✅ ${testimonials.length} testimonials loaded successfully`);
            
            // 🎯 استدعاء الدالة لتفعيل Scroll Buttons
            this.setupTestimonialsManualScroll(); 

        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.showError('testimonialsContainer', 'حدث خطأ في تحميل التقييمات');
        }
    }
    setupTestimonialsManualScroll() {
        const testimonialsGrid = document.getElementById('testimonialsContainer');
        const prevBtn = document.getElementById('prevTestimonialBtn');
        const nextBtn = document.getElementById('nextTestimonialBtn');
        
        if (!testimonialsGrid || !prevBtn || !nextBtn) return;
        
        // مسافة التمرير (بناءً على عرض الكارت في CSS)
        const scrollAmount = 450 + 40; // 450px عرض الكارت + 40px Gap (أو 2.5rem)
        
        nextBtn.addEventListener('click', () => {
            // التمرير في اتجاه اليسار في تصميم RTL
            testimonialsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            // التمرير في اتجاه اليمين في تصميم RTL
            testimonialsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        console.log('✅ Testimonials scroll buttons activated.');
    }


    // ... (تعديلات على دالة createTestimonialHTML) ...
    createTestimonialHTML(testimonial) {
        const stars = '⭐'.repeat(testimonial.rating || 5);
        const dateObj = testimonial.date ? new Date(testimonial.date.seconds * 1000) : new Date();
        const formattedDate = dateObj.toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="customer-info">
                        <h4>${testimonial.name || 'عميل كريم'}</h4>
                        </div>
                    <div class="rating-stars">${stars}</div>
                </div>
                <div class="testimonial-text">
                    ${testimonial.text || testimonial.message || 'لا يوجد تعليق.'}
                </div>
                <div class="testimonial-footer">
                    <div class="testimonial-date">${formattedDate}</div>
                    ${testimonial.recommend === 'نعم' ? '<div class="recommendation">ينصح بالتعامل</div>' : ''}
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

        const titleLine = document.querySelector('.hero-title .title-line');
        const titleSubline = document.querySelector('.hero-title .title-subline');
        const heroDescription = document.querySelector('.hero-description');

        if (titleLine && data.title1) titleLine.textContent = data.title1;
        if (titleSubline && data.title2) titleSubline.textContent = data.title2;
        if (heroDescription && data.description) heroDescription.textContent = data.description;

        if (data.title1 && document.getElementById('heroTitle1')) {
            document.getElementById('heroTitle1').textContent = data.title1;
        }
        if (data.title2 && document.getElementById('heroTitle2')) {
            document.getElementById('heroTitle2').textContent = data.title2;
        }
        if (data.description && document.getElementById('heroDescription')) {
            document.getElementById('heroDescription').textContent = data.description;
        }

        if (data.stats) this.updateStats(data.stats);
    }

    updateStats(stats) {
        console.log('📊 Updating stats:', stats);

        if (stats.projects && document.getElementById('statProjects')) {
            document.getElementById('statProjects').textContent = stats.projects;
        }
        if (stats.experience && document.getElementById('statExperience')) {
            document.getElementById('statExperience').textContent = stats.experience;
        }
        if (stats.satisfaction && document.getElementById('statSatisfaction')) {
            document.getElementById('statSatisfaction').textContent = stats.satisfaction;
        }
    }

    updateFeaturesContent(heroData, featuresData) {
        const data = featuresData || heroData?.features || {};
        console.log('⭐ Updating features content:', data);

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

        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length >= 4) {
            if (featureCards[0] && data.feature1) this.updateFeatureCard(featureCards[0], data.feature1);
            if (featureCards[1] && data.feature2) this.updateFeatureCard(featureCards[1], data.feature2);
            if (featureCards[2] && data.feature3) this.updateFeatureCard(featureCards[2], data.feature3);
            if (featureCards[3] && data.feature4) this.updateFeatureCard(featureCards[3], data.feature4);
        }

        const featureItems = document.querySelectorAll('.feature-item');
        if (featureItems.length >= 2) {
            if (featureItems[0] && data.feature1) this.updateWhyUsFeatureItem(featureItems[0], data.feature1);
            if (featureItems[1] && data.feature2) this.updateWhyUsFeatureItem(featureItems[1], data.feature2);
        }
    }

    updateFeatureCard(card, featureData) {
        const titleElement = card.querySelector('h3');
        const descriptionElement = card.querySelector('p');

        if (titleElement && featureData.title) titleElement.textContent = featureData.title;
        if (descriptionElement && featureData.description) descriptionElement.textContent = featureData.description;
    }

    updateWhyUsFeatureItem(item, featureData) {
        const titleElement = item.querySelector('h4');
        const descriptionElement = item.querySelector('p');

        if (titleElement && featureData.title) titleElement.textContent = featureData.title;
        if (descriptionElement && featureData.description) descriptionElement.textContent = featureData.description;
    }

    // === 6. تحميل وتحديث معلومات الاتصال ===
    async loadContactInfo() {
        try {
            console.log('📥 Loading contact info...');
            const contactDoc = await db.collection('content').doc('contact').get();
            if (contactDoc.exists) this.updateContactInfo(contactDoc.data());
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
        const phoneElements = document.querySelectorAll('.footer-section p:has(.fa-phone)');
        phoneElements.forEach(element => {
            if (data.phone) element.innerHTML = `<i class="fas fa-phone"></i> ${data.phone}`;
        });

        const whatsappElements = document.querySelectorAll('.footer-section p:has(.fa-whatsapp)');
        whatsappElements.forEach(element => {
            if (data.whatsapp) element.innerHTML = `<i class="fab fa-whatsapp"></i> ${data.whatsapp}`;
        });

        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
        whatsappButtons.forEach(button => {
            if (data.whatsapp) {
                const currentHref = button.getAttribute('href');
                const newHref = currentHref.replace(/wa\.me\/[^?]+/, `wa.me/${data.whatsapp.replace(/\+/g, '')}`);
                button.href = newHref;
            }
        });

        console.log('✅ Footer contact info updated');
    }

    updateContactPage(data) {
        if (!document.querySelector('.contact-section')) return;
        console.log('📄 Updating contact page...');

        const whatsappLinks = document.querySelectorAll('.contact-link[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            if (data.whatsapp) {
                const whatsappNumber = data.whatsapp.replace(/\+/g, '');
                link.href = `https://wa.me/${whatsappNumber}`;
            }
        });
        
        const hoursList = document.querySelector('.working-hours .hours-list');
        if(hoursList && data.workHours) {
             const items = hoursList.querySelectorAll('.hour-item');
             if(items.length >= 3) {
                 items[0].querySelector('span:last-child').textContent = data.workHours.weekdays || 'غير محدد';
                 items[1].querySelector('span:last-child').textContent = data.workHours.friday || 'غير محدد';
                 items[2].querySelector('span:last-child').textContent = data.workHours.saturday || 'غير محدد';
             }
        }
        console.log('✅ Contact page updated');
    }
    setupTestimonialsManualScroll() {
        const testimonialsGrid = document.getElementById('testimonialsContainer');
        
        // إذا لم يتم العثور على الحاوية أو لم يكن العرض flex (كما في CSS) فلا تفعل شيئاً
        if (!testimonialsGrid || testimonialsGrid.style.display !== 'flex') return; 
        
        console.log('🔄 Setting up manual scroll for testimonials...');
        
       
        testimonialsGrid.style.paddingLeft = '20px';
        testimonialsGrid.style.paddingRight = '20px';
        
    }

    // === 7. Real-time Updates من Firebase ===
    setupRealtimeUpdates() {
        console.log('🔄 Setting up real-time updates...');

        db.collection('content').doc('hero').onSnapshot((doc) => {
            if (doc.exists) {
                console.log('🔄 Hero content updated in real-time');
                this.updateHeroContent(doc.data());
            }
        });

        db.collection('content').doc('features').onSnapshot((doc) => {
            if (doc.exists) {
                console.log('🔄 Features content updated in real-time');
                this.updateFeaturesContent(null, doc.data());
            }
        });

        db.collection('services').onSnapshot(() => {
            console.log('🔄 Services updated in real-time');
            this.loadServices();
        });

        db.collection('projects').onSnapshot(() => {
            console.log('🔄 Projects updated in real-time');
            this.loadProjects().then(() => this.setupProjectFilters());
        });

        db.collection('content').doc('contact').onSnapshot((doc) => {
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
        return 'index';
    }
}

// تهيئة المحتوى الديناميكي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM loaded, initializing DynamicContent...');

    const initContent = setInterval(() => {
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