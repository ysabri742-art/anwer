function renderServicesPage() {
    const services = [
        {
            title: "أسقف جبس بورد",
            desc: "تنفيذ أسقف جبس بورد حديثة بمواد أصلية ووزن حقيقي 0.5 مع توزيع هيكل كل 40 سم للحصول على سقف مستقر لا يتشقق ولا يهبط.",
            image: "https://placehold.co/400x300/4F46E5/FFFFFF?text=أسقف+جبس+بورد"
        },
        {
            title: "جدران جبس بورد",
            desc: "عزل صوتي وحراري، استقامة كاملة، وتنفيذ سريع. نستخدم لوح تركي أصلي لنتائج قوية من الجهتين.",
            image: "https://placehold.co/400x300/F59E0B/FFFFFF?text=جدران+جبس+بورد"
        },
        {
            title: "ديكور شاشة بلازما",
            desc: "تصميم حديث، توزيع هيكل محسوب، وفتحات LED مخفية. نركز على الثبات قبل الشكل.",
            image: "https://placehold.co/400x300/10B981/FFFFFF?text=ديكور+شاشة+بلازما"
        },
        {
            title: "مكتبات ورفوف ديكور",
            desc: "تصاميم فاخرة بمقاسات دقيقة، وإضاءة داخلية، ومواد قوية تتحمل الاستخدام.",
            image: "https://placehold.co/400x300/EF4444/FFFFFF?text=مكتبات+ورفوف+ديكور"
        },
        {
            title: "مشاريع المطاعم والفنادق",
            desc: "تنفيذ احترافي للمساحات التجارية بضمان السرعة والجودة، مع الالتزام بالمواعيد.",
            image: "https://placehold.co/400x300/6366F1/FFFFFF?text=مشاريع+تجارية"
        },
    ];

    const serviceCards = services.map(service => `
        <div class="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
            <img src="${service.image}" alt="${service.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-bold text-indigo-700 mb-3">${service.title}</h3>
                <p class="text-gray-600 mb-4">${service.desc}</p>
                <a href="#calculator" onclick="navigate('calculator')" class="block w-full text-center bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition duration-300 font-semibold">
                    اطلب عرض سعر
                </a>
            </div>
        </div>
    `).join('');

    contentDiv.innerHTML = `
        <section class="container mx-auto px-6 py-12 md:py-20">
            <h2 class="text-4xl font-bold text-center text-indigo-700 mb-4">خدماتنا المضمونة</h2>
            <p class="text-center text-xl text-gray-600 mb-12">كل خدمة نقدمها ترتكز على معيارين: الهيكل المتين والدقة في التفاصيل.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${serviceCards}
            </div>
        </section>
    `;
}