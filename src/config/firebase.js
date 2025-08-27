import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwf8TmvtAslPZfzxVxtPq8ihfCcNk6n_c",
  authDomain: "webapp-60bbb.firebaseapp.com",
  projectId: "webapp-60bbb",
  storageBucket: "webapp-60bbb.firebasestorage.app",
  messagingSenderId: "472647600943",
  appId: "1:472647600943:web:f0135b4ffb7c868b1e2fda",
  measurementId: "G-EMM0X9TQD6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;