// js/admin.js
class AdminPanel {
    constructor() {
        this.currentUser = null;
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
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.dataset.section);
            });
        });

        // Save Buttons
        document.getElementById('saveHero').addEventListener('click', () => this.saveHero());
        document.getElementById('saveFeatures').addEventListener('click', () => this.saveFeatures());
        document.getElementById('saveContact').addEventListener('click', () => this.saveContact());
        
        // Add Service/Project
        document.getElementById('addService').addEventListener('click', () => this.addService());
        document.getElementById('addProject').addEventListener('click', () => this.addProject());
    }

   async login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('loginMessage');

    try {
        this.showLoading();
        
        // محاولة تسجيل الدخول
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        this.currentUser = userCredential.user;
        
        console.log('✅ Login successful:', this.currentUser.email);
        message.innerHTML = '<div class="message success">تم تسجيل الدخول بنجاح!</div>';
        
        // تحميل المحتوى بعد تسجيل الدخول
        setTimeout(() => {
            this.showDashboard();
            this.loadContent();
        }, 1000);
        
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
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    showLogin() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
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
        document.getElementById(sectionId + 'Section').classList.add('active');
        
        // Activate menu item
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    }

    async loadContent() {
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
            }

            // Load Features
            const featuresDoc = await db.collection('content').doc('features').get();
            if (featuresDoc.exists) {
                const data = featuresDoc.data();
                document.getElementById('feature1Title').value = data.feature1?.title || '';
                document.getElementById('feature1Desc').value = data.feature1?.description || '';
                document.getElementById('feature2Title').value = data.feature2?.title || '';
                document.getElementById('feature2Desc').value = data.feature2?.description || '';
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
            }

            // Load Services
            await this.loadServices();
            
            // Load Projects
            await this.loadProjects();

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
            servicesList.innerHTML = '';

            servicesSnapshot.forEach(doc => {
                const service = doc.data();
                const serviceElement = this.createServiceElement(doc.id, service);
                servicesList.appendChild(serviceElement);
            });

        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    async loadProjects() {
        try {
            const projectsSnapshot = await db.collection('projects').orderBy('date', 'desc').get();
            const projectsList = document.getElementById('projectsList');
            projectsList.innerHTML = '';

            projectsSnapshot.forEach(doc => {
                const project = doc.data();
                const projectElement = this.createProjectElement(doc.id, project);
                projectsList.appendChild(projectElement);
            });

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
                <button class="btn btn-primary" onclick="admin.editService('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="admin.deleteService('${id}')">
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
                <button class="btn btn-primary" onclick="admin.editProject('${id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="admin.deleteProject('${id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        return div;
    }

    async addService() {
        // Implementation for adding new service
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
        // Implementation for adding new project
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
        document.getElementById('loadingSpinner').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }

    showMessage(text, type = 'success') {
        const messageDiv = document.getElementById('successMessage');
        messageDiv.className = `message ${type}`;
        messageDiv.querySelector('span').textContent = text;
        messageDiv.classList.remove('hidden');

        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
    }
}
// دالة لتهيئة البيانات الافتراضية
async function initializeDefaultData() {
    try {
        // فحص إذا كانت البيانات موجودة
        const heroDoc = await db.collection('content').doc('hero').get();
        
        if (!heroDoc.exists) {
            // بيانات افتراضية للقسم الرئيسي
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

        // بيانات افتراضية للمميزات
        const featuresDoc = await db.collection('content').doc('features').get();
        if (!featuresDoc.exists) {
            const defaultFeaturesData = {
                feature1: {
                    title: "سرعة التنفيذ",
                    description: "إنجاز المشاريع في الوقت المتفق عليه مع الحفاظ على الجودة"
                },
                feature2: {
                    title: "مواد أصلية", 
                    description: "ألواح تركية أصلية وحديد 0.5 حقيقي بجودة لا تضاهى"
                },
                createdAt: new Date(),
                lastUpdated: new Date()
            };
            
            await db.collection('content').doc('features').set(defaultFeaturesData);
            console.log('✅ Default features data initialized');
        }

        // بيانات افتراضية للاتصال
        const contactDoc = await db.collection('content').doc('contact').get();
        if (!contactDoc.exists) {
            const defaultContactData = {
                phone: "٠١٢٣٤٥٦٧٨٩",
                whatsapp: "9647825044606",
                email: "info@anwar-alrajih.com",
                workHours: {
                    weekdays: "٨:٠٠ ص - ٦:٠٠ م",
                    friday: "١٠:٠٠ ص - ٤:٠٠ م", 
                    saturday: "إجازة"
                },
                createdAt: new Date(),
                lastUpdated: new Date()
            };
            
            await db.collection('content').doc('contact').set(defaultContactData);
            console.log('✅ Default contact data initialized');
        }
        
    } catch (error) {
        console.error('Error initializing default data:', error);
    }
}

// استدعاء الدالة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeDefaultData, 1000);
});

