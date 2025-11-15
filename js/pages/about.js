import firebaseDB from '../firebase/database.js';

async function renderAboutUsPage() {
    try {
        const content = await firebaseDB.getContent();

        contentDiv.innerHTML = `
            <section class="container mx-auto px-6 py-12 md:py-20 max-w-3xl">
                <h2 class="text-4xl font-bold text-center text-indigo-700 mb-8">من نحن</h2>
                
                <div class="bg-white rounded-xl shadow-xl p-8 md:p-10 text-center border-t-4 border-amber-500">
                    <img src="https://placehold.co/150x150/4338CA/FFFFFF?text=شعار+أنور+الراجح" alt="شعار الشركة" class="mx-auto mb-6 rounded-full shadow-md">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">أنور الراجح للديكور</h3>
                    <p class="text-xl text-gray-600 leading-relaxed">
                        ${content.aboutText || "أنور الراجح – فريق متخصص بتنفيذ أعمال الجبس بورد بجودة عالية ومعايير دقيقة. نهتم بالهيكل الداخلي قبل المظهر الخارجي لأن المتانة هي أساس الجمال والثبات."}
                    </p>
                </div>

                <div class="mt-10 text-center">
                    <a href="#services" onclick="navigate('services')" class="inline-block bg-indigo-700 text-white font-bold px-6 py-3 rounded-full hover:bg-indigo-800 transition duration-300">
                        اكتشف خدماتنا
                    </a>
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error loading about page:', error);
        contentDiv.innerHTML = `
            <section class="container mx-auto px-6 py-12 md:py-20 max-w-3xl">
                <h2 class="text-4xl font-bold text-center text-indigo-700 mb-8">من نحن</h2>
                <div class="text-center py-12">
                    <p class="text-red-500 text-lg">حدث خطأ في تحميل صفحة من نحن</p>
                    <button onclick="renderAboutUsPage()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                        إعادة المحاولة
                    </button>
                </div>
            </section>
        `;
    }
}