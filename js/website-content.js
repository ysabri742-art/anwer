// js/website-content.js
class WebsiteContent {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Website Content...');
        await this.loadContent();
        this.setupRealtimeUpdates();
    }

    async loadContent() {
        try {
            console.log('📥 Loading website content from Firebase...');
            
            // تحميل محتوى Hero
            const heroDoc = await db.collection('content').doc('hero').get();
            if (heroDoc.exists) {
                this.updateHeroContent(heroDoc.data());
            } else {
                console.log('⚠️ No hero data found in Firebase');
            }

            // تحميل المميزات
            const featuresDoc = await db.collection('content').doc('features').get();
            if (featuresDoc.exists) {
                this.updateFeaturesContent(featuresDoc.data());
            }

            // تحميل الخدمات
            await this.loadServices();

            // تحميل المشاريع
            await this.loadProjects();

            console.log('✅ Website content loaded successfully');

        } catch (error) {
            console.error('❌ Error loading website content:', error);
            // إذا فشل الاتصال، استخدم المحتوى الافتراضي
            this.useDefaultContent();
        }
    }

    updateHeroContent(data) {
        console.log('🎯 Updating hero content:', data);
        
        // تحديث العنوان الرئيسي
        const titleElement = document.querySelector('.hero-title .title-line');
        if (titleElement && data.title1) {
            titleElement.textContent = data.title1;
            console.log('✅ Updated hero title:', data.title1);
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

        div.innerHTML = `
            <div class="service-icon">
                <i class="fas fa-layer-group"></i>
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

    async loadProjects() {
        try {
            const projectsSnapshot = await db.collection('projects')
                .orderBy('date', 'desc')
                .limit(6)
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

            projectsSnapshot.forEach(doc => {
                const project = doc.data();
                const projectElement = this.createProjectElement(project);
                projectsContainer.appendChild(projectElement);
            });

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
                }
            });

        // تحديث تلقائي للخدمات
        db.collection('services')
            .onSnapshot((snapshot) => {
                console.log('🔄 Services updated in real-time');
                this.loadServices();
            });

        // تحديث تلقائي للمشاريع
        db.collection('projects')
            .onSnapshot((snapshot) => {
                console.log('🔄 Projects updated in real-time');
                this.loadProjects();
            });
    }

    useDefaultContent() {
        console.log('🔄 Using default content (fallback)');
        // يمكنك إضافة محتوى افتراضي هنا إذا فشل الاتصال
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing website content...');
    
    // انتظر حتى يتم تحميل Firebase
    const initWebsite = setInterval(() => {
        if (typeof db !== 'undefined') {
            clearInterval(initWebsite);
            console.log('✅ Firebase ready, initializing WebsiteContent...');
            window.websiteContent = new WebsiteContent();
        } else {
            console.log('⏳ Waiting for Firebase...');
        }
    }, 100);
});

// دالة مساعدة للتجربة
window.testWebsiteUpdate = async function() {
    console.log('🧪 Testing website update...');
    
    if (!window.websiteContent) {
        console.log('❌ WebsiteContent not initialized');
        return;
    }
    
    await window.websiteContent.loadContent();
    console.log('✅ Website content reloaded manually');
};
