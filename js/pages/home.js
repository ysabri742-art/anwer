function renderHomePage() {
    const contentDiv = document.getElementById('app-content');
    contentDiv.innerHTML = `
        <section class="hero">
            <div class="hero-content">
                <h1>قوتنا في الهيكل و جمالنا في التفاصيل</h1>
                <p>نقدم أعمال جبس بورد بمعايير عالية، هيكل مدروس، مواد أصلية، وشغل نظيف يبقى سنين. هدفنا نكشف للزبون جودة التنفيذ قبل الشكل.</p>
                <a href="#calculator" onclick="navigate('calculator')" class="hero-button">اطلب عرض سعر</a>
            </div>
        </section>

        <section class="features">
            <h2>لماذا نختلف؟ المتانة قبل المظهر</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <h3>سرعة التنفيذ</h3>
                </div>
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.61 2.39a2.5 2.5 0 00-3.535 0L12 7.465 7.465 2.93a2.5 2.5 0 00-3.535 3.535L8.535 12 3 17.535a2.5 2.5 0 003.535 3.535L12 16.535l4.535 4.535a2.5 2.5 0 003.535-3.535L15.465 12l4.535-4.535a2.5 2.5 0 000-3.535z"></path>
                    </svg>
                    <h3>مواد أصلية (0.5 حقيقي)</h3>
                </div>
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3>فحص قبل التركيب</h3>
                </div>
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3>ضمان على العمل</h3>
                </div>
            </div>
        </section>
    `;
}