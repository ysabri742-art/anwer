// js/projects.js
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsFilter();
    loadProjects();
});

function initializeProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projectsGrid');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    // Simulate loading delay
    setTimeout(() => {
        projectsGrid.innerHTML = '';
        
        const projects = [
            {
                id: 1,
                title: "سقف جبس مودرن",
                category: "أسقف",
                image: "../images/project1.jpg",
                description: "تنفيذ سقف جبس مودرن بمواد أصلية وهيكل حديد 0.5",
                date: "يناير 2024",
                area: "85 م²"
            },
            {
                id: 2,
                title: "جدار عازل للصوت",
                category: "جدران",
                image: "../images/project2.jpg",
                description: "جدران جبس بورد بعزل صوتي ممتاز للمساحات السكنية",
                date: "ديسمبر 2023",
                area: "120 م²"
            },
            {
                id: 3,
                title: "ديكور شاشة بلازما",
                category: "شاشات",
                image: "../images/project3.jpg",
                description: "تصميم مخصص لديكور شاشة بلازما مع إضاءة LED",
                date: "نوفمبر 2023",
                area: "15 م²"
            },
            {
                id: 4,
                title: "مكتبة ديكور فاخرة",
                category: "ديكور",
                image: "../images/project4.jpg",
                description: "مكتبة ديكور بمقاسات دقيقة وإضاءة داخلية",
                date: "أكتوبر 2023",
                area: "25 م²"
            },
            {
                id: 5,
                title: "مطعم فاخر",
                category: "مطاعم",
                image: "../images/project5.jpg",
                description: "تشطيب كامل لمطعم فاخر بمواد عالية الجودة",
                date: "سبتمبر 2023",
                area: "200 م²"
            },
            {
                id: 6,
                title: "سقف جبس كلاسيك",
                category: "أسقف",
                image: "../images/project6.jpg",
                description: "سقف جبس بتصميم كلاسيكي أنيق",
                date: "أغسطس 2023",
                area: "95 م²"
            }
        ];

        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
    }, 1500);
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    card.style.animationDelay = `${index * 0.1}s`;

    // إنشاء رسالة واتساب جاهزة
    const whatsappMessage = `مساء الخير! أريد استفسار عن مشروع مشابه لـ ${project.title}`;
    const whatsappLink = `https://wa.me/9647825044606?text=${encodeURIComponent(whatsappMessage)}`;

    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" onerror="this.src='../images/placeholder.jpg'">
            <div class="project-overlay">
                <div class="project-actions">
                    <a href="${project.image}" class="project-btn" data-lightbox="projects">
                        <i class="fas fa-expand"></i>
                    </a>
                    <a href="project-details.html?id=${project.id}" class="project-btn">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="project-content">
            <span class="project-category">${project.category}</span>
            <h3>${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <span><i class="far fa-calendar"></i> ${project.date}</span>
                <span><i class="fas fa-ruler-combined"></i> ${project.area}</span>
            </div>
            <!-- زر طلب عرض السعر الجديد -->
            <a href="${whatsappLink}" class="whatsapp-order-btn" target="_blank">
                <i class="fab fa-whatsapp"></i>
                اطلب عرض سعر
            </a>
        </div>
    `;

    return card;
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        if (filter === 'all' || project.getAttribute('data-category') === filter) {
            project.style.display = 'block';
            project.classList.add('visible');
        } else {
            project.style.display = 'none';
            project.classList.remove('visible');
        }
    });
}