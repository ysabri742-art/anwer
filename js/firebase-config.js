// js/firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyAJjD-ShtdoCr_waoB2NSBAn4O_znE8sV8",
  authDomain: "anawer-eec45.firebaseapp.com",
  projectId: "anawer-eec45",
  storageBucket: "anawer-eec45.firebasestorage.app",
  messagingSenderId: "1058097078828",
  appId: "1:1058097078828:web:757b48bdd1984953c1a789",
  measurementId: "G-XWS7ESFP6K"
};

// Initialize Firebase
try {
    // تحقق إذا كان Firebase مثبت بالفعل
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase initialized successfully for Anwar AlRajih');
    } else {
        firebase.app(); // إذا كان مثبت بالفعل
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// تحسين إعدادات Firestore
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// تفعيل الاستمرارية (اختياري)
db.enablePersistence()
    .then(() => {
        console.log('✅ Firestore persistence enabled');
    })
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('⚠️ The current browser does not support persistence');
        }
    });

// دالة لفحص اتصال Firebase
async function checkFirebaseConnection() {
    try {
        const testDoc = await db.collection('content').doc('hero').get();
        if (testDoc.exists) {
            console.log('✅ Firebase Firestore connected successfully');
            return true;
        } else {
            console.log('⚠️ Firebase connected but hero document not found');
            return true;
        }
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        return false;
    }
}

// دالة لتهيئة البيانات الافتراضية إذا لم تكن موجودة
async function initializeDefaultData() {
    try {
        // فحص بيانات hero
        const heroDoc = await db.collection('content').doc('hero').get();
        if (!heroDoc.exists) {
            console.log('🔄 Initializing default hero data...');
            await db.collection('content').doc('hero').set({
                title1: "أنور الراجح للديكور",
                title2: "قوتنا في الهيكل و جمالنا في التفاصيل",
                description: "نقدم أعمال جبس بورد بمعايير عالية، هيكل مدروس، مواد أصلية، وشغل نظيف يبقى سنين.",
                stats: {
                    projects: "150",
                    experience: "5", 
                    satisfaction: "100%"
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        // فحص بيانات features
        const featuresDoc = await db.collection('content').doc('features').get();
        if (!featuresDoc.exists) {
            console.log('🔄 Initializing default features data...');
            await db.collection('content').doc('features').set({
                feature1: {
                    title: "سرعة التنفيذ",
                    description: "إنجاز المشاريع في الوقت المتفق عليه مع الحفاظ على الجودة"
                },
                feature2: {
                    title: "مواد أصلية",
                    description: "ألواح تركية أصلية وحديد 0.5 حقيقي بجودة لا تضاهى"
                },
                feature3: {
                    title: "فحص الجودة", 
                    description: "فحص المواد أمام العميل قبل البدء في التنفيذ"
                },
                feature4: {
                    title: "ضمان ممتد",
                    description: "ضمان على جميع الأعمال لضمان راحتك وثقتك بنا"
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        // فحص بيانات contact
        const contactDoc = await db.collection('content').doc('contact').get();
        if (!contactDoc.exists) {
            console.log('🔄 Initializing default contact data...');
            await db.collection('content').doc('contact').set({
                phone: "٠١٢٣٤٥٦٧٨٩",
                whatsapp: "9647825044606",
                email: "info@anwar-alrajih.com",
                workHours: {
                    weekdays: "٨:٠٠ ص - ٦:٠٠ م",
                    friday: "١٠:٠٠ ص - ٤:٠٠ م",
                    saturday: "إجازة"
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log('✅ All default data initialized successfully');

    } catch (error) {
        console.error('❌ Error initializing default data:', error);
    }
}

// فحص الاتصال وتهيئة البيانات عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async () => {
        const isConnected = await checkFirebaseConnection();
        if (isConnected) {
            await initializeDefaultData();
        }
    }, 1000);
});

// جعل الدوال متاحة globally للاستخدام في admin.js
window.checkFirebaseConnection = checkFirebaseConnection;
window.initializeDefaultData = initializeDefaultData;
window.db = db;
window.auth = auth;
window.storage = storage;