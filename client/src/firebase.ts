import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use environment variables for API keys and sensitive values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDbN1K0IrwVc-CxXDN0FHs1PuveX0r97jA",
  authDomain: "mindfuel-bed97.firebaseapp.com",
  projectId: "mindfuel-bed97",
  storageBucket: "mindfuel-bed97.appspot.com",
  messagingSenderId: "767188496754",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:767188496754:android:acfd1db11e7e747a0dadeb",
  measurementId: "G-LM1ZZZGZ98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services and app
export { app, auth, db };