import firebaseDB from '../firebase/database.js';
import firebaseAuth from '../firebase/auth.js';

let currentEditingProject = null;

async function renderProjectsManager() {
    if (!firebaseAuth.requireAuth()) return;

    try {
        const projects = await firebaseDB.getProjects();

        const contentDiv = document.getElementById('app-content');
        contentDiv.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- شريط الأدوات -->
                <div class="bg-white shadow-sm border-b">
                    <div class="container mx-auto px-6 py-4">
                        <div class="flex justify-between items-center">
                            <h1 class="text-2xl font-bold text-gray-800">إدارة المشاريع</h1>
                            <div class="flex space-x-3 space-x-reverse">
                                <button onclick="navigateTo('admin-dashboard')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                                    العودة للوحة التحكم
                                </button>
                                <button onclick="showAddProjectModal()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                    إضافة مشروع جديد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container mx-auto px-6 py-8">
                    <!-- شبكة المشاريع -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid">
                        ${projects.map(project => `
                            <div class="bg-white p-4 rounded-2xl shadow-lg border">
                                <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                                <h3 class="font-semibold text-lg mb-2">${project.title}</h3>
                                <p class="text-gray-600 text-sm mb-4">${project.category}</p>
                                <div class="flex space-x-2 space-x-reverse">
                                    <button onclick="editProject('${project.id}')" class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                                        تعديل
                                    </button>
                                    <button onclick="deleteProject('${project.id}')" class="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
                                        حذف
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${projects.length === 0 ? `
                        <div class="text-center py-12">
                            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                            </svg>
                            <p class="text-gray-500 text-lg">لا توجد مشاريع مضافة حتى الآن</p>
                            <button onclick="showAddProjectModal()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                                إضافة أول مشروع
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- نافذة إضافة/تعديل مشروع -->
            <div id="project-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-4" id="modal-title">إضافة مشروع جديد</h3>
                        
                        <form id="project-form">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">رابط صورة المشروع</label>
                                    <input type="url" id="project-image" required 
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                           placeholder="https://example.com/image.jpg">
                                    <p class="text-sm text-gray-500 mt-1">استخدم روابط من مواقع مثل Imgur, Flickr, etc.</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">عنوان المشروع</label>
                                    <input type="text" id="project-title" required 
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                           placeholder="مثال: سقف جبس بورد فاخر">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
                                    <select id="project-category" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                        <option value="أسقف">أسقف</option>
                                        <option value="جدران">جدران</option>
                                        <option value="شاشات">شاشات</option>
                                        <option value="ديكور فاخر">ديكور فاخر</option>
                                        <option value="شغل مطاعم">شغل مطاعم</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (اختياري)</label>
                                    <textarea id="project-description" rows="3" 
                                              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                              placeholder="وصف مختصر عن المشروع..."></textarea>
                                </div>
                            </div>

                            <div class="flex space-x-3 space-x-reverse mt-6">
                                <button type="button" onclick="hideProjectModal()" class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition">
                                    إلغاء
                                </button>
                                <button type="submit" class="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('project-form').addEventListener('submit', handleProjectSubmit);

    } catch (error) {
        console.error('Error loading projects:', error);
        const contentDiv = document.getElementById('app-content');
        contentDiv.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 text-lg">حدث خطأ في تحميل المشاريع</p>
                <button onclick="renderProjectsManager()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

function showAddProjectModal() {
    currentEditingProject = null;
    document.getElementById('modal-title').textContent = 'إضافة مشروع جديد';
    document.getElementById('project-form').reset();
    document.getElementById('project-modal').classList.remove('hidden');
}

function hideProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
}

async function handleProjectSubmit(event) {
    event.preventDefault();
    
    const imageUrl = document.getElementById('project-image').value;
    const title = document.getElementById('project-title').value;
    const category = document.getElementById('project-category').value;
    const description = document.getElementById('project-description').value;
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'جاري الحفظ...';

        const projectData = {
            title,
            category,
            description,
            image: imageUrl
        };

        if (currentEditingProject) {
            await firebaseDB.updateProject(currentEditingProject.id, projectData);
        } else {
            await firebaseDB.addProject(projectData);
        }

        hideProjectModal();
        await renderProjectsManager();
        
    } catch (error) {
        console.error('Error saving project:', error);
        alert('حدث خطأ أثناء حفظ المشروع: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'حفظ';
    }
}

async function editProject(id) {
    try {
        const projects = await firebaseDB.getProjects();
        currentEditingProject = projects.find(p => p.id === id);
        
        if (currentEditingProject) {
            document.getElementById('modal-title').textContent = 'تعديل المشروع';
            document.getElementById('project-image').value = currentEditingProject.image;
            document.getElementById('project-title').value = currentEditingProject.title;
            document.getElementById('project-category').value = currentEditingProject.category;
            document.getElementById('project-description').value = currentEditingProject.description || '';
            
            document.getElementById('project-modal').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error editing project:', error);
        alert('حدث خطأ أثناء تحميل بيانات المشروع');
    }
}

async function deleteProject(id) {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
        try {
            await firebaseDB.deleteProject(id);
            await renderProjectsManager();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('حدث خطأ أثناء حذف المشروع');
        }
    }
}

export { renderProjectsManager, showAddProjectModal, hideProjectModal, editProject, deleteProject };