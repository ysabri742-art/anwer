// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// دالة مساعدة للحصول على البيانات
async function getFirebaseData(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error('Error getting data:', error);
        return [];
    }
}

// دالة مساعدة لحفظ البيانات
async function saveFirebaseData(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}

// دالة مساعدة لتحديث البيانات
async function updateFirebaseData(collectionName, id, data) {
    try {
        await updateDoc(doc(db, collectionName, id), {
            ...data,
            updatedAt: new Date().toISOString()
        });
        return { id, ...data };
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

// دالة مساعدة لحذف البيانات
async function deleteFirebaseData(collectionName, id) {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return true;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

// نظام المصادقة
class FirebaseAuth {
    constructor() {
        this.user = null;
        this.isLoggedIn = false;
        this.initAuthListener();
    }

    initAuthListener() {
        onAuthStateChanged(auth, (user) => {
            this.user = user;
            this.isLoggedIn = !!user;
            
            if (window.location.pathname.includes('admin.html') && this.isLoggedIn && window.location.hash === '#admin-login') {
                navigateTo('admin-dashboard');
            }
        });
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.user = userCredential.user;
            this.isLoggedIn = true;
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw this.getAuthErrorMessage(error.code);
        }
    }

    async logout() {
        try {
            await signOut(auth);
            this.user = null;
            this.isLoggedIn = false;
            if (window.location.pathname.includes('admin.html')) {
                navigateTo('admin-login');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    requireAuth() {
        if (!this.isLoggedIn) {
            navigateTo('admin-login');
            return false;
        }
        return true;
    }

    getAuthErrorMessage(errorCode) {
        const messages = {
            'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
            'auth/user-disabled': 'هذا الحساب معطل',
            'auth/user-not-found': 'لم يتم العثور على حساب بهذا البريد',
            'auth/wrong-password': 'كلمة المرور غير صحيحة',
            'auth/too-many-requests': 'محاولات تسجيل دخول كثيرة، حاول لاحقاً'
        };
        return messages[errorCode] || 'حدث خطأ أثناء تسجيل الدخول';
    }
}

const firebaseAuth = new FirebaseAuth();

// جعل الدوال متاحة globally
window.getFirebaseData = getFirebaseData;
window.saveFirebaseData = saveFirebaseData;
window.updateFirebaseData = updateFirebaseData;
window.deleteFirebaseData = deleteFirebaseData;
window.firebaseAuth = firebaseAuth;