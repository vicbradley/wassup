import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import dotenv from "dotenv";

// dotenv.config();

// vicbradley_21@kharisma.ac.id
const firebaseConfig = {
  apiKey: "AIzaSyBEM_R3spDSfCvGEJj6Tt6KVKsiEpdFJw8",
  authDomain: "wassup-caf9b.firebaseapp.com",
  projectId: "wassup-caf9b",
  storageBucket: "wassup-caf9b.appspot.com",
  messagingSenderId: "888273529982",
  appId: "1:888273529982:web:9a3298f051bb30e5dafc2f",
  measurementId: "G-Y3Q60FQ9HJ"
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID,
//   measurementId: import.meta.env.VITE_MEASUREMENT_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export const storage = getStorage(app);
