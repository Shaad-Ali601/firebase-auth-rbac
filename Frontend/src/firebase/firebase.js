import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyvZYIQuj8Aq1YaUXMDqWpqiXb8rEM-xQ",
  authDomain: "role-based-auth-920e9.firebaseapp.com",
  projectId: "role-based-auth-920e9",
  storageBucket: "role-based-auth-920e9.firebasestorage.app",
  messagingSenderId: "497865283867",
  appId: "1:497865283867:web:42ad0d6c17101130b85bbe",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
