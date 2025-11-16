// js/admin.js - النسخة المعدلة
class AdminPanel {
    constructor() {
        this.currentUser = null;
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

        // Save Buttons
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
        
        // Add Service/Project
        const addServiceBtn = document.getElementById('addService');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', () => {
                console.log('➕ Adding service...');
                this.addService();
            });
        }

        const addProjectBtn = document.getElementById('addProject');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                console.log('➕ Adding project...');
                this.addProject();
            });
        }

        console.log('✅ All event listeners setup successfully');
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
            
            // تأخير بسيط قبل التحميل
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

            console.log('✅ All content loaded successfully');

        } catch (error) {
            console.error('Error loading content:', error);
            this.showMessage('حدث خطأ في تحميل المحتوى', 'error');
        } finally {
            this.hideLoading();
        }
    }

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

    async loadServices() {
        try {
            const servicesSnapshot = await db.collection('services').orderBy('order').get();
            const servicesList = document.getElementById('servicesList');
            if (servicesList) {
                servicesList.innerHTML = '';

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

    async loadProjects() {
        try {
            const projectsSnapshot = await db.collection('projects').orderBy('date', 'desc').get();
            const projectsList = document.getElementById('projectsList');
            if (projectsList) {
                projectsList.innerHTML = '';

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

    createServiceElement(id, service) {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <h4>${service.title}</h4>
            <p>${service.description}</p>
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

    createProjectElement(id, project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
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

    async addService() {
        const title = prompt('أدخل عنوان الخدمة:');
        if (title) {
            try {
                await db.collection('services').add({
                    title: title,
                    description: 'وصف الخدمة...',
                    order: Date.now(),
                    createdAt: new Date()
                });
                this.loadServices();
                this.showMessage('تم إضافة الخدمة بنجاح!', 'success');
            } catch (error) {
                this.showMessage('حدث خطأ في إضافة الخدمة', 'error');
            }
        }
    }

    async addProject() {
        const title = prompt('أدخل عنوان المشروع:');
        if (title) {
            try {
                await db.collection('projects').add({
                    title: title,
                    description: 'وصف المشروع...',
                    date: new Date(),
                    createdAt: new Date()
                });
                this.loadProjects();
                this.showMessage('تم إضافة المشروع بنجاح!', 'success');
            } catch (error) {
                this.showMessage('حدث خطأ في إضافة المشروع', 'error');
            }
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

    // Placeholder methods for edit/delete
    editService(id) {
        console.log('Edit service:', id);
        alert(`تعديل الخدمة: ${id}`);
    }

    deleteService(id) {
        if (confirm('هل تريد حذف هذه الخدمة؟')) {
            console.log('Delete service:', id);
            db.collection('services').doc(id).delete()
                .then(() => {
                    this.loadServices();
                    this.showMessage('تم حذف الخدمة بنجاح!', 'success');
                })
                .catch(error => {
                    this.showMessage('حدث خطأ في الحذف', 'error');
                });
        }
    }

    editProject(id) {
        console.log('Edit project:', id);
        alert(`تعديل المشروع: ${id}`);
    }

    deleteProject(id) {
        if (confirm('هل تريد حذف هذا المشروع؟')) {
            console.log('Delete project:', id);
            db.collection('projects').doc(id).delete()
                .then(() => {
                    this.loadProjects();
                    this.showMessage('تم حذف المشروع بنجاح!', 'success');
                })
                .catch(error => {
                    this.showMessage('حدث خطأ في الحذف', 'error');
                });
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
    } catch (error) {
        console.error('Error initializing default data:', error);
    }
}

// استدعاء الدالة بعد تحميل Firebase
setTimeout(initializeDefaultData, 2000);
