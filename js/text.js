const typewriterTexts = [
    "نقدم أعمال جبس بورد بمعايير عالية",
    "هيكل مدروس، مواد أصلية، وشغل نظيف يبقى سنين",
    "خبرة 5 سنوات في تنفيذ مشاريع الديكور"
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

document.addEventListener("DOMContentLoaded", typeWriterLoop);
