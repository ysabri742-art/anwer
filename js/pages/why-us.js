function renderWhyUsPage() {
    const points = [
        { icon: `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`, title: "هيكل مدروس", text: "توزيع شبكي كل 40 سم لضمان أعلى ثبات يمنع التشققات أو الهبوط على المدى الطويل." },
        { icon: `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.5 3-9s-1.343-9-3-9m0 18v-9"></path></svg>`, title: "حديد 0.5 حقيقي", text: "نستخدم مواد بوزن وسمك 鉄 0.5 مطابق للمواصفات، بعيداً عن المواد المغشوشة أو خفيفة الوزن." },
        { icon: `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.05v-10.45m0 0V3.7m0 7.35l4 4m-4-4l-4 4m8 4.75a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`, title: "ألواح تركية أصلية", text: "نعتمد على ألواح جبس بورد تركية ذات جودة معتمدة، لضمان مظهر نهائي قوي ومتانة تدوم." },
        { icon: `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`, title: "سرعة إنجاز وجودة", text: "إنجاز سريع للمشروع دون التأثير على معايير الجودة العالية للهيكل الداخلي." },
        { icon: `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, title: "فحص المواد أمام العميل", text: "نحن شفافون! يتم فحص المواد أمام الزبون قبل البدء للتأكد من مواصفاتها وأصالتها." },
        { icon: `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`, title: "ضمان حقيقي", text: "نقدم ضماناً مكتوباً على جودة الهيكل والعمل، ثقة في التنفيذ تمتد لسنوات طويلة." }
    ];

    const featureBoxes = points.map(p => `
        <div class="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border-b-4 border-indigo-700 hover:shadow-2xl transition duration-300 text-center">
            ${p.icon}
            <h3 class="font-bold text-xl text-gray-800 mt-4 mb-2">${p.title}</h3>
            <p class="text-gray-600">${p.text}</p>
        </div>
    `).join('');

    contentDiv.innerHTML = `
        <section class="container mx-auto px-6 py-12 md:py-20">
            <h2 class="text-4xl font-bold text-center text-indigo-700 mb-4">لماذا نحن؟</h2>
            <p class="text-center text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                نهتم بالهيكل كما نهتم بالديكور. قوتنا تبدأ من داخل السقف، لأن الشغل المتين يطول سنين ويظل ثابت.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${featureBoxes}
            </div>
        </section>
    `;
}