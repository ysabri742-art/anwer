// js/contact.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // هنا سيتم إرسال البيانات إلى Firebase
        const success = await submitContactForm(formData);
        
        if (success) {
            showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            contactForm.reset();
        } else {
            showMessage('حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.', 'error');
        }
    });

    async function submitContactForm(data) {
        // محاكاة الإرسال - سيتم استبدالها بـ Firebase
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('بيانات التواصل:', data);
                resolve(true);
            }, 1000);
        });
    }

    function showMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});