// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// === DEBUG LOGS ===
console.log("🔥 Firebase Config Loaded:");
console.log("MODE:", import.meta.env.MODE);
console.log("VITE_FIREBASE_API_KEY:", firebaseConfig.apiKey ? "✅ Present" : "❌ MISSING");
console.log("VITE_FIREBASE_PROJECT_ID:", firebaseConfig.projectId);
console.table(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;