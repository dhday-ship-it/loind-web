import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnJ_bgRb51sUUDlatipuREsfrDcoTQy1U",
  authDomain: "loind-472cd.firebaseapp.com",
  projectId: "loind-472cd",
  storageBucket: "loind-472cd.firebasestorage.app",
  messagingSenderId: "405998534289",
  appId: "1:405998534289:web:0f861bc822e1ea5391c930",
  measurementId: "G-5B5MM51YH2",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
