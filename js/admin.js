// js/admin.js - النسخة الكاملة المحدثة
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.editingServiceId = null;
        this.editingProjectId = null;
        this.editingPricingId = null;
        this.editingTestimonialId = null;
        console.log('🔧 AdminPanel constructor called');
        this.init();
    }

    init() {
        console.log('🔧 Initializing AdminPanel...');
        this.checkAuthState();
        this.setupEventListeners();
    }

    checkAuthState() {
        console.log('🔧 Setting up auth state listener...');
        auth.onAuthStateChanged((user) => {
            console.log('🔐 Auth state changed:', user ? user.email : 'No user');
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
        console.log('🔧 Setting up event listeners...');
        
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🔐 Login form submitted');
                this.login();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('🚪 Logout clicked');
                this.logout();
            });
        }

        // Navigation
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                console.log('📱 Navigation clicked:', section);
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
        
        // آراء العملاء
        this.setupTestimonialsListeners();

        console.log('✅ All event listeners setup successfully');
    }

    setupBasicSaveButtons() {
        const saveHeroBtn = document.getElementById('saveHero');
        if (saveHeroBtn) {
            saveHeroBtn.addEventListener('click', () => {
                console.log('💾 Saving hero...');
                this.saveHero();
            });
        }

        const saveFeaturesBtn = document.getElementById('saveFeatures');
        if (saveFeaturesBtn) {
            saveFeaturesBtn.addEventListener('click', () => {
                console.log('💾 Saving features...');
                this.saveFeatures();
            });
        }

        const saveContactBtn = document.getElementById('saveContact');
        if (saveContactBtn) {
            saveContactBtn.addEventListener('click', () => {
                console.log('💾 Saving contact...');
                this.saveContact();
            });
        }
    }

    setupServicesListeners() {
        const addServiceBtn = document.getElementById('addService');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', () => {
                console.log('➕ Adding service...');
                this.showServiceEditor();
            });
        }

        const saveServiceBtn = document.getElementById('saveService');
        if (saveServiceBtn) {
            saveServiceBtn.addEventListener('click', () => {
                console.log('💾 Saving service...');
                this.saveService();
            });
        }

        const cancelServiceBtn = document.getElementById('cancelService');
        if (cancelServiceBtn) {
            cancelServiceBtn.addEventListener('click', () => {
                console.log('❌ Canceling service edit...');
                this.hideServiceEditor();
            });
        }
    }

    setupProjectsListeners() {
        const addProjectBtn = document.getElementById('addProject');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                console.log('➕ Adding project...');
                this.showProjectEditor();
            });
        }

        const saveProjectBtn = document.getElementById('saveProject');
        if (saveProjectBtn) {
            saveProjectBtn.addEventListener('click', () => {
                console.log('💾 Saving project...');
                this.saveProject();
            });
        }

        const cancelProjectBtn = document.getElementById('cancelProject');
        if (cancelProjectBtn) {
            cancelProjectBtn.addEventListener('click', () => {
                console.log('❌ Canceling project edit...');
                this.hideProjectEditor();
            });
        }
    }

    setupPricingListeners() {
        const addPricingBtn = document.getElementById('addPricing');
        if (addPricingBtn) {
            addPricingBtn.addEventListener('click', () => {
                console.log('➕ Adding pricing...');
                this.showPricingEditor();
            });
        }

        const savePricingBtn = document.getElementById('savePricing');
        if (savePricingBtn) {
            savePricingBtn.addEventListener('click', () => {
                console.log('💾 Saving pricing...');
                this.savePricing();
            });
        }

        const cancelPricingBtn = document.getElementById('cancelPricing');
        if (cancelPricingBtn) {
            cancelPricingBtn.addEventListener('click', () => {
                console.log('❌ Canceling pricing edit...');
                this.hidePricingEditor();
            });
        }
    }

    setupTestimonialsListeners() {
        const addTestimonialBtn = document.getElementById('addTestimonial');
        if (addTestimonialBtn) {
            addTestimonialBtn.addEventListener('click', () => {
                console.log('➕ Adding testimonial...');
                this.showTestimonialEditor();
            });
        }

        const saveTestimonialBtn = document.getElementById('saveTestimonial');
        if (saveTestimonialBtn) {
            saveTestimonialBtn.addEventListener('click', () => {
                console.log('💾 Saving testimonial...');
                this.saveTestimonial();
            });
        }

        const cancelTestimonialBtn = document.getElementById('cancelTestimonial');
        if (cancelTestimonialBtn) {
            cancelTestimonialBtn.addEventListener('click', () => {
                console.log('❌ Canceling testimonial edit...');
                this.hideTestimonialEditor();
            });
        }
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('loginMessage');

        console.log('🔐 Attempting login with:', email);

        try {
            this.showLoading();
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            this.currentUser = userCredential.user;
            
            console.log('✅ Login successful:', this.currentUser.email);
            message.innerHTML = '<div class="message success">تم تسجيل الدخول بنجاح!</div>';
            
            setTimeout(() => {
                this.showDashboard();
                this.loadContent();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Login error:', error);
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
            console.log('🚪 Logging out...');
            await auth.signOut();
            console.log('✅ Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    showLogin() {
        console.log('👤 Showing login form');
        const loginSection = document.getElementById('loginSection');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginSection) loginSection.classList.remove('hidden');
        if (adminDashboard) adminDashboard.classList.add('hidden');
    }

    showDashboard() {
        console.log('🎛️ Showing dashboard');
        const loginSection = document.getElementById('loginSection');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginSection) loginSection.classList.add('hidden');
        if (adminDashboard) adminDashboard.classList.remove('hidden');
    }

    showSection(sectionId) {
        console.log('📁 Showing section:', sectionId);
        
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
    }

    async loadContent() {
        console.log('📥 Loading content from Firebase...');
        try {
            this.showLoading();
            
            // Load Hero Content
            const heroDoc = await db.collection('content').doc('hero').get();
            if (heroDoc.exists) {
                const data = heroDoc.data();
                document.getElementById('heroTitle1').value = data.title1 || '';
                document.getElementById('heroTitle2').value = data.title2 || '';
                document.getElementById('heroDescription').value = data.description || '';
                document.getElementById('statProjects').value = data.stats?.projects || '';
                document.getElementById('statExperience').value = data.stats?.experience || '';
                document.getElementById('statSatisfaction').value = data.stats?.satisfaction || '';
                console.log('✅ Hero content loaded');
            }

            // Load Features
            const featuresDoc = await db.collection('content').doc('features').get();
            if (featuresDoc.exists) {
                const data = featuresDoc.data();
                document.getElementById('feature1Title').value = data.feature1?.title || '';
                document.getElementById('feature1Desc').value = data.feature1?.description || '';
                document.getElementById('feature2Title').value = data.feature2?.title || '';
                document.getElementById('feature2Desc').value = data.feature2?.description || '';
                console.log('✅ Features content loaded');
            }

            // Load Contact Info
            const contactDoc = await db.collection('content').doc('contact').get();
            if (contactDoc.exists) {
                const data = contactDoc.data();
                document.getElementById('contactPhone').value = data.phone || '';
                document.getElementById('contactWhatsapp').value = data.whatsapp || '';
                document.getElementById('contactEmail').value = data.email || '';
                document.getElementById('workHours1').value = data.workHours?.weekdays || '';
                document.getElementById('workHours2').value = data.workHours?.friday || '';
                document.getElementById('workHours3').value = data.workHours?.saturday || '';
                console.log('✅ Contact content loaded');
            }

            // Load Services
            await this.loadServices();
            
            // Load Projects
            await this.loadProjects();

            // Load Pricing
            await this.loadPricing();

            // Load Testimonials
            await this.loadTestimonials();

            console.log('✅ All content loaded successfully');

        } catch (error) {
            console.error('Error loading content:', error);
            this.showMessage('حدث خطأ في تحميل المحتوى', 'error');
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
                console.log('✅ Services loaded:', servicesSnapshot.size);
            }
        } catch (error) {
            console.error('Error loading services:', error);
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
            console.error('Error loading service data:', error);
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
            console.error('Error saving service:', error);
            this.showMessage('حدث خطأ في حفظ الخدمة', 'error');
        } finally {
            this.hideLoading();
        }
    }

    editService(serviceId) {
        console.log('Edit service:', serviceId);
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
                console.log('✅ Projects loaded:', projectsSnapshot.size);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
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
        
        editor.classList.remove('hidden');
    }

    hideProjectEditor() {
        const editor = document.getElementById('projectEditor');
        editor.classList.add('hidden');
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
                document.getElementById('projectImageUrl').value = project.imageUrl || '';
                
                if (project.date) {
                    const date = new Date(project.date.seconds * 1000);
                    document.getElementById('projectDate').value = date.toISOString().split('T')[0];
                } else {
                    document.getElementById('projectDate').value = '';
                }
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            this.showMessage('حدث خطأ في تحميل بيانات العمل', 'error');
        }
    }

    resetProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectCategory').value = 'أسقف';
        document.getElementById('projectImageUrl').value = '';
        document.getElementById('projectDate').value = '';
    }

    async saveProject() {
        try {
            this.showLoading();
            
            const projectData = {
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDescription').value,
                category: document.getElementById('projectCategory').value,
                imageUrl: document.getElementById('projectImageUrl').value,
                date: document.getElementById('projectDate').value ? new Date(document.getElementById('projectDate').value) : new Date(),
                lastUpdated: new Date()
            };

            if (!projectData.title) {
                this.showMessage('يرجى إدخال عنوان العمل', 'error');
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
            console.error('Error saving project:', error);
            this.showMessage('حدث خطأ في حفظ العمل', 'error');
        } finally {
            this.hideLoading();
        }
    }

    editProject(projectId) {
        console.log('Edit project:', projectId);
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
                console.log('✅ Pricing loaded:', pricingSnapshot.size);
            }
        } catch (error) {
            console.error('Error loading pricing:', error);
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
            console.error('Error loading pricing data:', error);
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
            console.error('Error saving pricing:', error);
            this.showMessage('حدث خطأ في حفظ الباقة', 'error');
        } finally {
            this.hideLoading();
        }
    }

    getNextPricingOrder() {
        // يمكن تحسين هذا ليجلب الترتيب من قاعدة البيانات
        return Date.now();
    }

    editPricing(pricingId) {
        console.log('Edit pricing:', pricingId);
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

    // === آراء العملاء ===
    async loadTestimonials() {
        try {
            const testimonialsSnapshot = await db.collection('testimonials').orderBy('createdAt', 'desc').get();
            const testimonialsList = document.getElementById('testimonialsList');
            if (testimonialsList) {
                testimonialsList.innerHTML = '';

                if (testimonialsSnapshot.empty) {
                    testimonialsList.innerHTML = '<div class="empty-state">لا توجد آراء عملاء مضافة بعد</div>';
                    return;
                }

                testimonialsSnapshot.forEach(doc => {
                    const testimonial = doc.data();
                    const testimonialElement = this.createTestimonialElement(doc.id, testimonial);
                    testimonialsList.appendChild(testimonialElement);
                });
                console.log('✅ Testimonials loaded:', testimonialsSnapshot.size);
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }

    createTestimonialElement(id, testimonial) {
        const stars = '⭐'.repeat(testimonial.rating || 5);
        const div = document.createElement('div');
        div.className = 'testimonial-item';
        div.innerHTML = `
            <div class="testimonial-item-header">
                ${testimonial.image ? `<img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar">` : '<div class="testimonial-avatar-placeholder"><i class="fas fa-user"></i></div>'}
                <div class="testimonial-info">
                    <h4>${testimonial.name}</h4>
                    <p class="testimonial-job">${testimonial.job || ''}</p>
                    <div class="testimonial-rating">${stars}</div>
                </div>
            </div>
            <div class="testimonial-content">
                <p>${testimonial.text}</p>
            </div>
            <div class="testimonial-actions">
                <button class="btn btn-primary" onclick="window.admin.editTestimonial('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="window.admin.deleteTestimonial('${id}')">
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

    async loadTestimonialData(testimonialId) {
        try {
            const doc = await db.collection('testimonials').doc(testimonialId).get();
            if (doc.exists) {
                const testimonial = doc.data();
                document.getElementById('testimonialName').value = testimonial.name || '';
                document.getElementById('testimonialJob').value = testimonial.job || '';
                document.getElementById('testimonialRating').value = testimonial.rating || 5;
                document.getElementById('testimonialText').value = testimonial.text || '';
                document.getElementById('testimonialImage').value = testimonial.image || '';
            }
        } catch (error) {
            console.error('Error loading testimonial data:', error);
            this.showMessage('حدث خطأ في تحميل بيانات الرأي', 'error');
        }
    }

    resetTestimonialForm() {
        document.getElementById('testimonialName').value = '';
        document.getElementById('testimonialJob').value = '';
        document.getElementById('testimonialRating').value = '5';
        document.getElementById('testimonialText').value = '';
        document.getElementById('testimonialImage').value = '';
    }

    async saveTestimonial() {
        try {
            this.showLoading();
            
            const testimonialData = {
                name: document.getElementById('testimonialName').value,
                job: document.getElementById('testimonialJob').value,
                rating: parseInt(document.getElementById('testimonialRating').value),
                text: document.getElementById('testimonialText').value,
                image: document.getElementById('testimonialImage').value,
                lastUpdated: new Date()
            };

            if (!testimonialData.name || !testimonialData.text) {
                this.showMessage('يرجى إدخال اسم العميل والرأي', 'error');
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
            await this.loadTestimonials();
            
        } catch (error) {
            console.error('Error saving testimonial:', error);
            this.showMessage('حدث خطأ في حفظ الرأي', 'error');
        } finally {
            this.hideLoading();
        }
    }

    editTestimonial(testimonialId) {
        console.log('Edit testimonial:', testimonialId);
        this.showTestimonialEditor(testimonialId);
    }

    async deleteTestimonial(testimonialId) {
        if (confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
            try {
                await db.collection('testimonials').doc(testimonialId).delete();
                this.showMessage('تم حذف الرأي بنجاح!', 'success');
                await this.loadTestimonials();
            } catch (error) {
                this.showMessage('حدث خطأ في حذف الرأي', 'error');
            }
        }
    }

    // === الدوال الأساسية (الحالية) ===
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
            console.log('✅ Hero content saved');
            
        } catch (error) {
            console.error('Error saving hero:', error);
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
            console.log('✅ Features content saved');
            
        } catch (error) {
            console.error('Error saving features:', error);
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
            console.log('✅ Contact content saved');
            
        } catch (error) {
            console.error('Error saving contact:', error);
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
    console.log('🚀 DOM loaded, initializing application...');
    
    // انتظر حتى يتم تحميل Firebase أولاً
    const initApp = setInterval(() => {
        if (typeof db !== 'undefined' && typeof auth !== 'undefined') {
            clearInterval(initApp);
            console.log('✅ Firebase services ready, initializing AdminPanel...');
            
            window.admin = new AdminPanel();
            
            // تحقق من حالة المستخدم الحالي
            setTimeout(() => {
                if (auth.currentUser) {
                    console.log('✅ User already logged in:', auth.currentUser.email);
                } else {
                    console.log('❌ No user logged in');
                }
            }, 500);
            
        } else {
            console.log('⏳ Waiting for Firebase services...');
        }
    }, 100);
});

// دالة لتهيئة البيانات الافتراضية
async function initializeDefaultData() {
    try {
        const heroDoc = await db.collection('content').doc('hero').get();
        
        if (!heroDoc.exists) {
            const defaultHeroData = {
                title1: "أنور الراجح للديكور",
                title2: "قوتنا في الهيكل و جمالنا في التفاصيل",
                description: "نقدم أعمال جبس بورد بمعايير عالية، هيكل مدروس، مواد أصلية، وشغل نظيف يبقى سنين.",
                stats: {
                    projects: "150",
                    experience: "5",
                    satisfaction: "100%"
                },
                createdAt: new Date(),
                lastUpdated: new Date()
            };
            
            await db.collection('content').doc('hero').set(defaultHeroData);
            console.log('✅ Default hero data initialized');
        }

        // تهيئة بيانات الخدمات الافتراضية
        const servicesSnapshot = await db.collection('services').get();
        if (servicesSnapshot.empty) {
            const defaultServices = [
                {
                    title: "أسقف جبس بورد",
                    description: "تنفيذ أسقف جبس بورد حديثة بمواد أصلية ووزن حقيقي 0.5 مع توزيع هيكل كل 40 سم للحصول على سقف مستقر لا يتشقق ولا يهبط.",
                    features: ["هيكل حديد 0.5", "ألواح تركية أصلية", "توزيع هيكل كل 40 سم"],
                    icon: "fas fa-layer-group",
                    order: 1,
                    createdAt: new Date()
                },
                {
                    title: "جدران جبس بورد",
                    description: "عزل صوتي وحراري، استقامة كاملة، وتنفيذ سريع. نستخدم لوح تركي أصلي لنتائج قوية من الجهتين.",
                    features: ["عزل صوتي وحراري", "استقامة كاملة", "تنفيذ سريع"],
                    icon: "fas fa-wall",
                    order: 2,
                    createdAt: new Date()
                }
            ];

            for (const service of defaultServices) {
                await db.collection('services').add(service);
            }
            console.log('✅ Default services initialized');
        }

    } catch (error) {
        console.error('Error initializing default data:', error);
    }
}

// استدعاء الدالة بعد تحميل Firebase
setTimeout(initializeDefaultData, 2000);