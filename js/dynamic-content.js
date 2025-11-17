// js/dynamic-content.js - النسخة الكاملة المحدثة
class DynamicContent {
    constructor() {
        console.log('🔄 DynamicContent initialized');
    }

    // تحميل الخدمات من Firebase وعرضها
    async loadServices() {
        try {
            console.log('📥 Loading services from Firebase...');
            const servicesGrid = document.getElementById('servicesGrid');
            const servicesLoading = document.getElementById('servicesLoading');
            
            if (servicesLoading) {
                servicesLoading.style.display = 'block';
            }

            const snapshot = await db.collection('services')
                .orderBy('order', 'asc')
                .get();

            if (snapshot.empty) {
                if (servicesGrid) {
                    servicesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-concierge-bell"></i>
                            <p>لا توجد خدمات متاحة حالياً</p>
                        </div>
                    `;
                }
                return;
            }

            let servicesHTML = '';
            snapshot.forEach(doc => {
                const service = doc.data();
                servicesHTML += this.createServiceHTML(service);
            });

            if (servicesGrid) {
                servicesGrid.innerHTML = servicesHTML;
            }

            if (servicesLoading) {
                servicesLoading.style.display = 'none';
            }

            console.log(`✅ ${snapshot.size} services loaded successfully`);

        } catch (error) {
            console.error('Error loading services:', error);
            this.showError('servicesGrid', 'حدث خطأ في تحميل الخدمات');
        }
    }

    createServiceHTML(service) {
        const featuresHTML = service.features ? service.features.map(feature => 
            `<span><i class="fas fa-check"></i> ${feature}</span>`
        ).join('') : '';

        return `
            <div class="service-card">
                <div class="service-icon">
                    <i class="${service.icon || 'fas fa-cog'}"></i>
                </div>
                <div class="service-content">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <div class="service-features">
                        ${featuresHTML}
                    </div>
                    <a href="https://wa.me/9647825044606?text=مساء الخير! أريد استفسار عن خدمة ${encodeURIComponent(service.title)}" 
                       class="btn btn-primary whatsapp-service-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> اطلب عرض سعر
                    </a>
                </div>
            </div>
        `;
    }

    // تحميل المشاريع من Firebase وعرضها
    async loadProjects() {
        try {
            console.log('📥 Loading projects from Firebase...');
            const projectsGrid = document.getElementById('projectsGrid');
            const projectsLoading = document.querySelector('.projects-loading');
            
            if (projectsLoading) {
                projectsLoading.style.display = 'block';
            }

            const snapshot = await db.collection('projects')
                .orderBy('date', 'desc')
                .get();

            if (snapshot.empty) {
                if (projectsGrid) {
                    projectsGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-project-diagram"></i>
                            <p>لا توجد أعمال معروضة حالياً</p>
                        </div>
                    `;
                }
                return;
            }

            let projectsHTML = '';
            snapshot.forEach(doc => {
                const project = doc.data();
                projectsHTML += this.createProjectHTML(project);
            });

            if (projectsGrid) {
                projectsGrid.innerHTML = projectsHTML;
                this.setupProjectFilters();
                this.fixProjectImages(); // إصلاح الصور بعد التحميل
            }

            if (projectsLoading) {
                projectsLoading.style.display = 'none';
            }

            console.log(`✅ ${snapshot.size} projects loaded successfully`);

        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('projectsGrid', 'حدث خطأ في تحميل الأعمال');
        }
    }

 createProjectHTML(project) {
    const date = project.date ? new Date(project.date.seconds * 1000).toLocaleDateString('ar-EG') : 'غير محدد';
    
    let imageUrl = project.imageUrl || '../images/placeholder.jpg';
    if (!imageUrl || imageUrl.includes('undefined') || imageUrl.includes('null')) {
        imageUrl = '../images/placeholder.jpg';
    }
    
    return `
        <div class="project-item" data-category="${project.category || 'غير مصنف'}" style="
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        ">
            <div class="project-image" style="
                height: 250px;
                background: #f8f9fa;
                overflow: hidden;
            ">
                <img src="${imageUrl}" 
                     alt="${project.title}" 
                     style="
                         width: 100%;
                         height: 100%;
                         object-fit: cover;
                     "
                     onerror="this.src='../images/placeholder.jpg'">
            </div>
            <div class="project-content" style="
                padding: 20px;
                background: white;
            ">
                <h3 style="
                    color: #1a1f36;
                    font-size: 1.3rem;
                    margin: 0 0 10px 0;
                    font-weight: bold;
                ">${project.title}</h3>
                <span class="project-category" style="
                    background: #d4af37;
                    color: #1a1f36;
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    display: inline-block;
                    margin-bottom: 10px;
                ">${project.category || 'غير مصنف'}</span>
                <p class="project-description" style="
                    color: #6c757d;
                    line-height: 1.6;
                    margin: 10px 0;
                ">${project.description}</p>
                <div class="project-meta" style="
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #f1f3f4;
                ">
                    <span class="project-date" style="
                        color: #6c757d;
                        font-size: 0.85rem;
                    ">${date}</span>
                </div>
            </div>
        </div>
    `;
}

    // دالة مساعدة لمعالجة أخطاء الصور
    handleImageError(img) {
        console.warn('❌ Failed to load image:', img.src);
        img.src = '../images/placeholder.jpg';
        img.style.opacity = '1';
    }

    // إصلاح مشاكل الصور بعد التحميل
    fixProjectImages() {
        const projectImages = document.querySelectorAll('.project-image');
        
        projectImages.forEach(container => {
            const img = container.querySelector('img');
            
            if (img && img.src && !img.src.includes('undefined') && !img.src.includes('null')) {
                container.classList.add('has-image');
            } else {
                container.classList.remove('has-image');
            }
        });
    }

    // إعداد الفلترة للمشاريع
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة النشاط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة النشاط للزر المختار
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // إضافة أنيميشن للعناصر الظاهرة
                        item.style.animation = 'cardEntrance 0.6s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // تحميل باقات الأسعار من Firebase
    async loadPricing() {
        try {
            console.log('📥 Loading pricing from Firebase...');
            const pricingCards = document.getElementById('pricingCards');
            const pricingNote = document.getElementById('pricingNote');

            const snapshot = await db.collection('pricing')
                .orderBy('order', 'asc')
                .get();

            if (snapshot.empty) {
                if (pricingCards) {
                    pricingCards.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-tags"></i>
                            <p>لا توجد باقات أسعار متاحة حالياً</p>
                        </div>
                    `;
                }
                return;
            }

            let pricingHTML = '';
            snapshot.forEach(doc => {
                const pricing = doc.data();
                pricingHTML += this.createPricingHTML(pricing);
            });

            if (pricingCards) {
                pricingCards.innerHTML = pricingHTML;
            }

            // تحميل الملاحظات
            await this.loadPricingNotes();

            console.log(`✅ ${snapshot.size} pricing packages loaded successfully`);

        } catch (error) {
            console.error('Error loading pricing:', error);
            this.showError('pricingCards', 'حدث خطأ في تحميل الأسعار');
        }
    }

    createPricingHTML(pricing) {
        const featuresHTML = pricing.features ? pricing.features.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('') : '';

        const isFeatured = pricing.type === 'featured';
        const featuredClass = isFeatured ? 'featured' : '';

        return `
            <div class="pricing-card ${featuredClass}">
                ${isFeatured ? '<div class="pricing-badge">عرض خاص</div>' : ''}
                <div class="pricing-header">
                    <h3>${pricing.title}</h3>
                    <div class="price">
                        <span class="amount">${this.formatPrice(pricing.price)}</span>
                        <span class="currency">${pricing.period || 'دينار/م²'}</span>
                    </div>
                    ${pricing.discountNote ? `<p class="discount-note">${pricing.discountNote}</p>` : ''}
                </div>
                <ul class="pricing-features">
                    ${featuresHTML}
                </ul>
                <a href="https://wa.me/9647825044606?text=مساء الخير! أريد استفسار عن باقة ${encodeURIComponent(pricing.title)}" 
                   class="btn btn-primary" target="_blank">
                    <i class="fab fa-whatsapp"></i> ${isFeatured ? 'اطلب عرض سعر' : 'استشارة مجانية'}
                </a>
            </div>
        `;
    }

    // تحميل ملاحظات الأسعار
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

    // تحميل آراء العملاء
    async loadTestimonials() {
        try {
            console.log('📥 Loading testimonials from Firebase...');
            const testimonialsContainer = document.getElementById('testimonialsContainer');

            const snapshot = await db.collection('testimonials')
                .orderBy('createdAt', 'desc')
                .limit(6)
                .get();

            if (snapshot.empty) {
                if (testimonialsContainer) {
                    testimonialsContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-comments"></i>
                            <p>لا توجد آراء عملاء متاحة حالياً</p>
                        </div>
                    `;
                }
                return;
            }

            let testimonialsHTML = '';
            snapshot.forEach(doc => {
                const testimonial = doc.data();
                testimonialsHTML += this.createTestimonialHTML(testimonial);
            });

            if (testimonialsContainer) {
                testimonialsContainer.innerHTML = testimonialsHTML;
            }

            console.log(`✅ ${snapshot.size} testimonials loaded successfully`);

        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.showError('testimonialsContainer', 'حدث خطأ في تحميل آراء العملاء');
        }
    }

    createTestimonialHTML(testimonial) {
        const stars = '⭐'.repeat(testimonial.rating || 5);
        
        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    ${testimonial.image ? 
                        `<img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar">` : 
                        `<div class="testimonial-avatar-placeholder">
                            <i class="fas fa-user"></i>
                        </div>`
                    }
                    <div class="testimonial-info">
                        <h4>${testimonial.name}</h4>
                        <p class="testimonial-job">${testimonial.job || ''}</p>
                        <div class="testimonial-rating">${stars}</div>
                    </div>
                </div>
                <div class="testimonial-content">
                    <p>"${testimonial.text}"</p>
                </div>
            </div>
        `;
    }

    // تحميل محتوى الصفحة الرئيسية
    async loadHomeContent() {
        try {
            console.log('📥 Loading home content from Firebase...');
            
            // تحميل محتوى الهيرو
            const heroDoc = await db.collection('content').doc('hero').get();
            if (heroDoc.exists) {
                const data = heroDoc.data();
                this.updateHeroContent(data);
            }

            // تحميل المميزات
            const featuresDoc = await db.collection('content').doc('features').get();
            if (featuresDoc.exists) {
                const data = featuresDoc.data();
                this.updateFeaturesContent(data);
            }

            // تحميل الإحصائيات
            await this.loadStats();

            console.log('✅ Home content loaded successfully');

        } catch (error) {
            console.error('Error loading home content:', error);
        }
    }

    updateHeroContent(data) {
        const heroTitle1 = document.getElementById('heroTitle1');
        const heroTitle2 = document.getElementById('heroTitle2');
        const heroDescription = document.getElementById('heroDescription');

        if (heroTitle1 && data.title1) heroTitle1.textContent = data.title1;
        if (heroTitle2 && data.title2) heroTitle2.textContent = data.title2;
        if (heroDescription && data.description) heroDescription.textContent = data.description;
    }

    updateFeaturesContent(data) {
        const feature1Title = document.getElementById('feature1Title');
        const feature1Desc = document.getElementById('feature1Desc');
        const feature2Title = document.getElementById('feature2Title');
        const feature2Desc = document.getElementById('feature2Desc');

        if (feature1Title && data.feature1?.title) feature1Title.textContent = data.feature1.title;
        if (feature1Desc && data.feature1?.description) feature1Desc.textContent = data.feature1.description;
        if (feature2Title && data.feature2?.title) feature2Title.textContent = data.feature2.title;
        if (feature2Desc && data.feature2?.description) feature2Desc.textContent = data.feature2.description;
    }

    async loadStats() {
        try {
            const statsDoc = await db.collection('content').doc('hero').get();
            if (statsDoc.exists) {
                const data = statsDoc.data();
                const stats = data.stats;

                const statProjects = document.getElementById('statProjects');
                const statExperience = document.getElementById('statExperience');
                const statSatisfaction = document.getElementById('statSatisfaction');

                if (statProjects && stats?.projects) statProjects.textContent = stats.projects;
                if (statExperience && stats?.experience) statExperience.textContent = stats.experience;
                if (statSatisfaction && stats?.satisfaction) statSatisfaction.textContent = stats.satisfaction;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // تنسيق السعر
    formatPrice(price) {
        return new Intl.NumberFormat('ar-EG').format(price);
    }

    // عرض رسالة الخطأ
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        <i class="fas fa-redo"></i> إعادة المحاولة
                    </button>
                </div>
            `;
        }
    }

    // تهيئة جميع المحتويات بناءً على الصفحة الحالية
    async initializePageContent() {
        const currentPage = this.getCurrentPage();
        
        console.log(`🔄 Initializing content for: ${currentPage}`);

        switch (currentPage) {
            case 'index':
                await this.loadHomeContent();
                await this.loadServices();
                await this.loadTestimonials();
                break;
                
            case 'services':
                await this.loadServices();
                break;
                
            case 'projects':
                await this.loadProjects();
                break;
                
            case 'pricing':
                await this.loadPricing();
                break;
                
            case 'why-us':
                await this.loadTestimonials();
                await this.loadStats();
                break;
        }
    }

    // الحصول على الصفحة الحالية
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path.endsWith('/') || path.includes('/pages/../')) {
            return 'index';
        } else if (path.includes('services.html')) {
            return 'services';
        } else if (path.includes('projects.html')) {
            return 'projects';
        } else if (path.includes('pricing.html')) {
            return 'pricing';
        } else if (path.includes('why-us.html')) {
            return 'why-us';
        }
        return 'index';
    }
}

// جعل الدالة متاحة globally لمعالجة أخطاء الصور
window.handleImageError = function(img) {
    console.warn('❌ Failed to load image:', img.src);
    img.src = '../images/placeholder.jpg';
    img.style.opacity = '1';
};

// تحميل الصور وتحسين الأداء
function optimizeImages() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
        // تأكد من وجود src
        if (!img.src || img.src.includes('undefined') || img.src.includes('null')) {
            img.style.display = 'none';
            return;
        }
        
        // إضافة lazy loading
        img.setAttribute('loading', 'lazy');
        
        // تأثير التحميل
        img.addEventListener('load', function() {
            this.classList.add('loaded');
            this.style.opacity = '1';
        });
        
        // معالجة الأخطاء
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
}

// استدعاء الدالة بعد تحميل المشاريع
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(optimizeImages, 1000);
});

// تهيئة المحتوى الديناميكي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing dynamic content...');
    
    const initContent = setInterval(() => {
        if (typeof db !== 'undefined') {
            clearInterval(initContent);
            console.log('✅ Firebase ready, initializing DynamicContent...');
            
            window.dynamicContent = new DynamicContent();
            window.dynamicContent.initializePageContent();
            
        } else {
            console.log('⏳ Waiting for Firebase...');
        }
    }, 100);
});