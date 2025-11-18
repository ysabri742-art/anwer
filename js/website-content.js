// js/website-content.js
class WebsiteContent {
    constructor() {
        this.currentPage = this.detectPage();
        this.init();
    }

    detectPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/') return 'home';
        if (path.includes('services.html')) return 'services';
        if (path.includes('projects.html')) return 'projects';
        if (path.includes('why-us.html')) return 'why-us';
        if (path.includes('pricing.html')) return 'pricing';
        if (path.includes('calculator.html')) return 'calculator';
        if (path.includes('contact.html')) return 'contact';
        return 'home';
    }

    async init() {
        console.log(`🚀 Initializing Website Content for: ${this.currentPage}`);
        await this.loadPageSpecificContent();
        this.setupRealtimeUpdates();
    }

    async loadPageSpecificContent() {
        try {
            console.log('📥 Loading page-specific content...');
            
            // محتوى مشترك لكل الصفحات
            await this.loadCommonContent();
            
            // محتوى خاص بكل صفحة
            switch(this.currentPage) {
                case 'home':
                    await this.loadHomeContent();
                    break;
                case 'services':
                    await this.loadServicesContent();
                    break;
                case 'projects':
                    await this.loadProjectsContent();
                    break;
                case 'why-us':
                    await this.loadWhyUsContent();
                    break;
                case 'pricing':
                    await this.loadPricingContent();
                    break;
                case 'contact':
                    await this.loadContactContent();
                    break;
            }

            console.log('✅ Page content loaded successfully');

        } catch (error) {
            console.error('❌ Error loading page content:', error);
            this.useDefaultContent();
        }
    }

    async loadCommonContent() {
        // معلومات الاتصال المشتركة
        const contactDoc = await db.collection('content').doc('contact').get();
        if (contactDoc.exists) {
            this.updateContactInfo(contactDoc.data());
        }
    }

    async loadHomeContent() {
        console.log('🏠 Loading home page content...');
        
        // محتوى الصفحة الرئيسية
        const heroDoc = await db.collection('content').doc('hero').get();
        if (heroDoc.exists) {
            this.updateHeroContent(heroDoc.data());
        }

        const featuresDoc = await db.collection('content').doc('features').get();
        if (featuresDoc.exists) {
            this.updateFeaturesContent(featuresDoc.data());
        }

        await this.loadServices();
        await this.loadProjects();
    }

    async loadServicesContent() {
        console.log('🛠️ Loading services page content...');
        await this.loadServices();
    }

    async loadProjectsContent() {
        console.log('📁 Loading projects page content...');
        await this.loadProjects();
    }

    async loadWhyUsContent() {
        const featuresDoc = await db.collection('content').doc('features').get();
        if (featuresDoc.exists) {
            this.updateWhyUsFeatures(featuresDoc.data());
        }
    }

    async loadPricingContent() {
        // يمكن إضافة محتوى خاص بصفحة الأسعار هنا
    }

    async loadContactContent() {
        const contactDoc = await db.collection('content').doc('contact').get();
        if (contactDoc.exists) {
            this.updateContactPage(contactDoc.data());
        }
    }

    updateHeroContent(data) {
        
        // تحديث العنوان الرئيسي
        const titleElement = document.querySelector('.hero-title .title-line');
        if (titleElement && data.title1) {
            titleElement.textContent = data.title1;
        }

        // تحديث العنوان الفرعي
        const subtitleElement = document.querySelector('.hero-title .title-subline');
        if (subtitleElement && data.title2) {
            subtitleElement.textContent = data.title2;
            console.log('✅ Updated hero subtitle:', data.title2);
        }

        // تحديث الوصف
        const descriptionElement = document.querySelector('.hero-description');
        if (descriptionElement && data.description) {
            descriptionElement.textContent = data.description;
            console.log('✅ Updated hero description');
        }

        // تحديث الإحصائيات
        if (data.stats) {
            this.updateStats(data.stats);
        }
    }

    updateStats(stats) {
        console.log('📊 Updating stats:', stats);
        const statElements = document.querySelectorAll('.stat-number');
        
        if (statElements.length >= 3 && stats) {
            // المشاريع
            if (statElements[0] && stats.projects) {
                statElements[0].textContent = `+${stats.projects}`;
            }
            // الخبرة
            if (statElements[1] && stats.experience) {
                statElements[1].textContent = `+${stats.experience}`;
            }
            // رضا العملاء
            if (statElements[2] && stats.satisfaction) {
                statElements[2].textContent = stats.satisfaction;
            }
            console.log('✅ Stats updated successfully');
        }
    }

    updateFeaturesContent(data) {
        console.log('⭐ Updating features content:', data);
        const featureCards = document.querySelectorAll('.feature-card');
        
        if (featureCards.length >= 4 && data) {
            // المميزة 1 - السرعة
            if (featureCards[0] && data.feature1) {
                this.updateFeatureCard(featureCards[0], data.feature1);
            }
            // المميزة 2 - المواد
            if (featureCards[1] && data.feature2) {
                this.updateFeatureCard(featureCards[1], data.feature2);
            }
            // المميزة 3 - الجودة
            if (featureCards[2] && data.feature3) {
                this.updateFeatureCard(featureCards[2], data.feature3);
            }
            // المميزة 4 - الضمان
            if (featureCards[3] && data.feature4) {
                this.updateFeatureCard(featureCards[3], data.feature4);
            }
            console.log('✅ Features updated successfully');
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

    updateWhyUsFeatures(data) {
        console.log('🌟 Updating why-us features:', data);
        
        // تحديث قائمة المميزات في صفحة "لماذا نحن"
        const featureItems = document.querySelectorAll('.feature-item');
        
        if (featureItems.length >= 6 && data) {
            // المميزة 1 - هيكل مدروس
            if (featureItems[0] && data.feature1) {
                this.updateWhyUsFeatureItem(featureItems[0], data.feature1);
            }
            // المميزة 2 - حديد حقيقي
            if (featureItems[1] && data.feature2) {
                this.updateWhyUsFeatureItem(featureItems[1], data.feature2);
            }
            // يمكنك إضافة المزيد من المميزات حسب الحاجة
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

    async loadServices() {
        try {
            const servicesSnapshot = await db.collection('services')
                .orderBy('order')
                .get();
            
            const servicesContainer = document.querySelector('.services-grid');
            if (!servicesContainer) {
                console.log('⚠️ Services container not found');
                return;
            }

            // مسح المحتوى القديم
            servicesContainer.innerHTML = '';

            servicesSnapshot.forEach(doc => {
                const service = doc.data();
                const serviceElement = this.createServiceElement(service);
                servicesContainer.appendChild(serviceElement);
            });

            console.log('✅ Services loaded:', servicesSnapshot.size);

        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    createServiceElement(service) {
        const div = document.createElement('div');
        div.className = 'service-card';
        
        let featuresHTML = '';
        if (service.features && Array.isArray(service.features)) {
            featuresHTML = service.features.map(feature => 
                `<span><i class="fas fa-check"></i> ${feature}</span>`
            ).join('');
        }

        // اختيار أيقونة مناسبة حسب نوع الخدمة
        const iconClass = this.getServiceIcon(service.title);

        div.innerHTML = `
            <div class="service-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="service-content">
                <h3>${service.title || 'خدمة'}</h3>
                <p>${service.description || 'وصف الخدمة'}</p>
                <div class="service-features">
                    ${featuresHTML}
                </div>
                <a href="https://wa.me/9647825044606?text=مساء الخير! أريد استفسار عن خدمة ${service.title}" 
                   class="btn btn-primary whatsapp-service-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> اطلب عرض سعر
                </a>
            </div>
        `;

        return div;
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

    async loadProjects() {
        try {
            const projectsSnapshot = await db.collection('projects')
                .orderBy('date', 'desc')
                .get();
            
            const projectsContainer = document.getElementById('projectsGrid');
            if (!projectsContainer) {
                console.log('⚠️ Projects container not found');
                return;
            }

            // إذا كان فيه عنصر تحميل، نخفيه
            const loadingElement = projectsContainer.querySelector('.projects-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            projectsContainer.innerHTML = '';

            projectsSnapshot.forEach(doc => {
                const project = doc.data();
                const projectElement = this.createProjectElement(project);
                projectsContainer.appendChild(projectElement);
            });

            // إعادة تفعيل الـ filter بعد تحميل المشاريع
            this.setupProjectFilter();

            console.log('✅ Projects loaded:', projectsSnapshot.size);

        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.setAttribute('data-category', project.category || 'all');

        div.innerHTML = `
            <div class="project-image">
                <img src="${project.imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'}" 
                     alt="${project.title || 'مشروع'}" 
                     onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7'">
                <div class="project-overlay">
                    <h4>${project.title || 'مشروع'}</h4>
                    <p>${project.description || 'وصف المشروع'}</p>
                </div>
            </div>
        `;

        return div;
    }
    

    setupProjectFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة النشط من كل الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة النشط للزر المضغوط
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    updateContactInfo(data) {
        console.log('📞 Updating contact info...');
        
        // تحديث معلومات الاتصال في الفوتر
        this.updateFooterContact(data);
        
        // تحديث معلومات الاتصال في صفحة Contact إذا كانت مفتوحة
        this.updateContactPage(data);
    }

    updateFooterContact(data) {
        // تحديث رقم الهاتف في الفوتر
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

        // تحديث أزرار الواتساب في كل الصفحات
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
        whatsappButtons.forEach(button => {
            if (data.whatsapp) {
                const currentHref = button.getAttribute('href');
                const newHref = currentHref.replace(/wa\.me\/[^?]+/, `wa.me/${data.whatsapp}`);
                button.href = newHref;
            }
        });

        console.log('✅ Footer contact info updated');
    }

    updateContactPage(data) {
        // إذا كنا في صفحة الاتصال
        if (document.querySelector('.contact-section')) {
            console.log('📄 Updating contact page...');

            // تحديث رقم الهاتف
            const phoneInput = document.getElementById('contactPhone');
            if (phoneInput && data.phone) {
                phoneInput.value = data.phone;
            }

            // تحديث الواتساب
            const whatsappLinks = document.querySelectorAll('.contact-link[href*="wa.me"]');
            whatsappLinks.forEach(link => {
                if (data.whatsapp) {
                    link.href = `https://wa.me/${data.whatsapp}`;
                    link.textContent = data.whatsapp;
                }
            });

            // تحديث البريد الإلكتروني
            const emailInput = document.getElementById('contactEmail');
            if (emailInput && data.email) {
                emailInput.value = data.email;
            }

            // تحديث أوقات العمل
            if (data.workHours) {
                const workHours1 = document.getElementById('workHours1');
                const workHours2 = document.getElementById('workHours2');
                const workHours3 = document.getElementById('workHours3');

                if (workHours1 && data.workHours.weekdays) workHours1.value = data.workHours.weekdays;
                if (workHours2 && data.workHours.friday) workHours2.value = data.workHours.friday;
                if (workHours3 && data.workHours.saturday) workHours3.value = data.workHours.saturday;
            }

            console.log('✅ Contact page updated');
        }
    }

    setupRealtimeUpdates() {
        console.log('🔄 Setting up real-time updates...');
        
        // تحديث تلقائي لمحتوى Hero
        db.collection('content').doc('hero')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log('🔄 Hero content updated in real-time');
                    this.updateHeroContent(doc.data());
                }
            });

        // تحديث تلقائي للمميزات
        db.collection('content').doc('features')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log('🔄 Features content updated in real-time');
                    this.updateFeaturesContent(doc.data());
                    
                    // إذا كنا في صفحة "لماذا نحن"، حدثها أيضاً
                    if (this.currentPage === 'why-us') {
                        this.updateWhyUsFeatures(doc.data());
                    }
                }
            });

        // تحديث تلقائي للخدمات
        db.collection('services')
            .onSnapshot((snapshot) => {
                console.log('🔄 Services updated in real-time');
                if (document.querySelector('.services-grid')) {
                    this.loadServices();
                }
            });

        // تحديث تلقائي للمشاريع
        db.collection('projects')
            .onSnapshot((snapshot) => {
                console.log('🔄 Projects updated in real-time');
                if (document.getElementById('projectsGrid')) {
                    this.loadProjects();
                }
            });

        // تحديث تلقائي لمعلومات الاتصال
        db.collection('content').doc('contact')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    console.log('🔄 Contact info updated in real-time');
                    this.updateContactInfo(doc.data());
                }
            });
    }

    useDefaultContent() {
        console.log('🔄 Using default content (fallback)');
        // يمكنك إضافة محتوى افتراضي هنا إذا فشل الاتصال
        // هذا يضمن أن الموقع يظل شغال حتى لو كان Firebase مش متاح
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing enhanced website content...');
    
    const initEnhanced = setInterval(() => {
        if (typeof db !== 'undefined') {
            clearInterval(initEnhanced);
            console.log('✅ Firebase ready, initializing Enhanced WebsiteContent...');
            window.websiteContent = new WebsiteContent();
        } else {
            console.log('⏳ Waiting for Firebase...');
        }
    }, 100);
});

// دالة مساعدة للتجربة والاختبار
window.testWebsiteUpdate = async function() {
    console.log('🧪 Testing website update...');
    
    if (!window.websiteContent) {
        console.log('❌ WebsiteContent not initialized');
        return;
    }
    
    await window.websiteContent.loadPageSpecificContent();
    console.log('✅ Website content reloaded manually');
};

// دالة لفحص حالة التحميل
window.checkContentStatus = function() {
    console.log('🔍 Checking content status...');
    console.log('Current page:', window.websiteContent?.currentPage);
    console.log('Firebase connected:', typeof db !== 'undefined');
    console.log('Auth user:', auth?.currentUser?.email || 'No user');
    
    // فحص العناصر المحملة
    console.log('Services loaded:', document.querySelectorAll('.service-card').length);
    console.log('Projects loaded:', document.querySelectorAll('.project-item').length);
    console.log('Features loaded:', document.querySelectorAll('.feature-card').length);
};