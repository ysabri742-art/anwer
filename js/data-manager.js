// js/data-manager.js
import { 
    db, collection, getDocs, addDoc, getDoc, doc, 
    storage, ref, uploadBytes, getDownloadURL 
} from './firebase-config.js';

class DataManager {
    // جلب جميع الخدمات
    async getServices() {
        try {
            const querySnapshot = await getDocs(collection(db, "services"));
            const services = [];
            querySnapshot.forEach((doc) => {
                services.push({ id: doc.id, ...doc.data() });
            });
            return services.sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error("Error fetching services:", error);
            return [];
        }
    }

    // جلب المشاريع
    async getProjects(category = null) {
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            let projects = [];
            querySnapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            
            if (category) {
                projects = projects.filter(project => project.category === category);
            }
            
            return projects.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    }

    // جلب بيانات الأسعار
    async getPricing() {
        try {
            const docRef = doc(db, "pricing", "currentPrices");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return {
                    standardPrice: 23000,
                    discountThreshold: 200,
                    note: "الأسعار تقديرية. السعر النهائي يتم تحديده بعد الكشف."
                };
            }
        } catch (error) {
            console.error("Error fetching pricing:", error);
            return null;
        }
    }

    // إرسال طلب تواصل
    async submitContactForm(contactData) {
        try {
            await addDoc(collection(db, "contacts"), {
                ...contactData,
                timestamp: new Date().toISOString(),
                status: "new"
            });
            return true;
        } catch (error) {
            console.error("Error submitting contact form:", error);
            return false;
        }
    }

    // جلب محتوى الموقع
    async getWebsiteContent() {
        try {
            const docRef = doc(db, "websiteContent", "mainContent");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return this.getDefaultContent();
            }
        } catch (error) {
            console.error("Error fetching website content:", error);
            return this.getDefaultContent();
        }
    }

    // المحتوى الافتراضي
    getDefaultContent() {
        return {
            heroTitle: "قوتنا في الهيكل و جمالنا في التفاصيل",
            heroDescription: "نقدم أعمال جبس بورد بمعايير عالية، هيكل مدروس، مواد أصلية، وشغل نظيف يبقى سنين.",
            aboutText: "أنور الراجح - فريق متخصص بتنفيذ أعمال الجبس بورد بجودة عالية ومعايير دقيقة.",
            whyUsPoints: [
                "هيكل مدروس كل 40 سم",
                "حديد 0.5 حقيقي",
                "ألواح تركية أصلية",
                "سرعة إنجاز دون التأثير على الجودة",
                "فحص المواد أمام الزبون قبل البدء",
                "ضمان على العمل"
            ]
        };
    }

    // رفع صورة إلى Storage
    async uploadImage(file, path) {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }
}

export default new DataManager();