async function renderProjectsPage() {
    const contentDiv = document.getElementById('app-content');
    
    contentDiv.innerHTML = `
        <section style="max-width: 1200px; margin: 0 auto; padding: 3rem 1rem;">
            <h2 style="text-align: center; font-size: 2.25rem; color: #4338CA; margin-bottom: 1rem;">أعمالنا المنفذة</h2>
            <p style="text-align: center; font-size: 1.25rem; color: #6B7280; margin-bottom: 3rem;">
                جاري تحميل المشاريع...
            </p>
            <div id="projects-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;"></div>
        </section>
    `;

    try {
        // جلب المشاريع من Firebase
        const projects = await getFirebaseData('projects');
        
        const projectsContainer = document.getElementById('projects-container');
        
        if (projects.length > 0) {
            const projectCards = projects.map(project => `
                <div class="project-card" style="background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.3s;">
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover;">
                    <div style="padding: 1rem;">
                        <h3 style="margin-bottom: 0.5rem; color: #1F2937;">${project.title}</h3>
                        <p style="color: #6B7280; margin-bottom: 0.5rem;">${project.category}</p>
                        ${project.description ? `<p style="color: #374151; font-size: 0.875rem;">${project.description}</p>` : ''}
                    </div>
                </div>
            `).join('');
            
            projectsContainer.innerHTML = projectCards;
        } else {
            projectsContainer.innerHTML = `
                <div style="text-align: center; grid-column: 1 / -1; padding: 3rem;">
                    <p style="color: #6B7280; font-size: 1.125rem;">لا توجد مشاريع معروضة حالياً</p>
                    <p style="color: #9CA3AF; margin-top: 0.5rem;">سيتم إضافة المشاريع قريباً</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 3rem;">
                <p style="color: #DC2626; font-size: 1.125rem;">حدث خطأ في تحميل المشاريع</p>
                <button onclick="renderProjectsPage()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4338CA; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}