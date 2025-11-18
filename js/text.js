const typewriterTexts = [
    "تصميم داخلي انيق ومتقن",
    "ضمان جودة ومتابعة مابعد التسليم",
    "تركيب جبس بورد احترافي"
];

// نستهدف الـ div الجديد
const container = document.getElementById("typewriter-output");

let textIndex = 0;
let charIndex = 0;
let typingSpeed = 40;
let delayBetweenTexts = 400;

function typeWriterLoop() {
    const currentText = typewriterTexts[textIndex];

    if (charIndex < currentText.length) {
        container.innerHTML = `<p class="typewriter-text">${currentText.slice(0, charIndex + 1)}</p>`;
        charIndex++;
        setTimeout(typeWriterLoop, typingSpeed);
    } else {
        setTimeout(() => {
            charIndex = 0;
            textIndex = (textIndex + 1) % typewriterTexts.length;
            container.innerHTML = ""; // يمسح النص الحالي قبل الجملة التالية
            setTimeout(typeWriterLoop, 500);
        }, delayBetweenTexts);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.querySelector(".hero-title");
    // إضافة class show بعد قليل لتفعيل الـ transition
    setTimeout(() => {
        heroTitle.classList.add("show");
    }, 100); // يمكن تعديل الرقم لتأخير بسيط قبل بدء الانيميشن
});
document.addEventListener("DOMContentLoaded", () => {
    const title1 = document.getElementById("heroTitle1");
    const title2 = document.getElementById("heroTitle2");

    function restartHeroAnimation() {
        // نوقف الأنيميشن مؤقتًا
        title1.style.animation = "none";
        title2.style.animation = "none";

        // نخلي المتصفح يحس إن في تغيير (reflow)
        title1.offsetHeight;
        title2.offsetHeight;

        // نرجع الأنيميشن زي ما هي من الـ CSS
        title1.style.animation = "";
        title2.style.animation = "";
    }

    // إجمالي وقت الأنيميشن تقريبًا (1s + delay لكل واحد)
    const totalDuration = 3000; // 3 ثواني

    // تكرار الأنيميشن في لوب
    setInterval(restartHeroAnimation, totalDuration);
});


document.addEventListener("DOMContentLoaded", typeWriterLoop);
