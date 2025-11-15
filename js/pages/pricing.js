async function renderPricingPage() {
    const contentDiv = document.getElementById('app-content');
    
    try {
        // جلب بيانات الأسعار من Firebase
        const pricingData = await getFirebaseData('pricing');
        const pricing = pricingData[0] || { pricePerMeter: 23000 };
        
        contentDiv.innerHTML = `
            <section style="max-width: 800px; margin: 0 auto; padding: 3rem 1rem;">
                <h2 style="text-align: center; font-size: 2.25rem; color: #4338CA; margin-bottom: 1rem;">الأسعار التقديرية للمتر المربع</h2>
                <p style="text-align: center; font-size: 1.25rem; color: #6B7280; margin-bottom: 3rem;">
                    الأسعار تعتمد على المساحة والتصميم، وهذه الأسعار التقديرية للمتر بدون صبغ ومعجون.
                </p>

                <div style="background: white; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); padding: 3rem; border-top: 4px solid #4338CA;">
                    <!-- السعر القياسي -->
                    <div style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB;">
                        <h3 style="font-size: 1.875rem; font-weight: 800; color: #1F2937; margin-bottom: 0.5rem;">سعر المتر القياسي</h3>
                        <p style="font-size: 3.75rem; font-weight: 900; color: #F59E0B;">${formatNumber(pricing.pricePerMeter)} <span style="font-size: 1.875rem; color: #6B7280; font-weight: 700;">دينار</span></p>
                        <p style="color: #6B7280; margin-top: 0.5rem;">السعر يشمل الهيكل (0.5 حقيقي)، التركيب، والألواح التركية الأصلية.</p>
                    </div>

                    <!-- العرض الخاص -->
                    <div style="background: #EEF2FF; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #C7D2FE;">
                        <h4 style="font-size: 1.5rem; font-weight: 700; color: #4338CA; margin-bottom: 0.75rem; display: flex; align-items: center;">
                            <span style="margin-left: 0.5rem;">📢</span>
                            عرض خاص للمشاريع الكبيرة
                        </h4>
                        <p style="color: #374151;">
                            للمساحات التي تزيد عن 200 متر مربع، يوجد <strong>خصم مميز</strong> على سعر المتر المربع يتم تحديده بعد الكشف.
                        </p>
                    </div>
                    
                    <!-- ملاحظة هامة -->
                    <p style="font-size: 0.875rem; color: #DC2626; font-style: italic; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; text-align: center;">
                        **ملاحظة:** الأسعار تقديرية. السعر النهائي يتم تحديده بدقة بعد الكشف الميداني ورفع المقاسات واعتماد تفاصيل التصميم.
                    </p>
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error loading pricing:', error);
        contentDiv.innerHTML = `
            <section style="max-width: 800px; margin: 0 auto; padding: 3rem 1rem;">
                <h2 style="text-align: center; font-size: 2.25rem; color: #4338CA; margin-bottom: 1rem;">الأسعار التقديرية</h2>
                <div style="text-align: center; padding: 3rem;">
                    <p style="color: #DC2626; font-size: 1.125rem;">حدث خطأ في تحميل الأسعار</p>
                    <button onclick="renderPricingPage()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4338CA; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                        إعادة المحاولة
                    </button>
                </div>
            </section>
        `;
    }
}