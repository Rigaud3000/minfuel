// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxAl1KPll-j2IEyKfBNajlzDwFAGBWMpU",
  authDomain: "mindfuel-bed97.firebaseapp.com",
  projectId: "mindfuel-bed97",
  storageBucket: "mindfuel-bed97.firebasestorage.app",
  messagingSenderId: "767188496754",
  appId: "1:767188496754:web:5e3802512104d43c0dadeb",
  measurementId: "G-LM12ZZGZ98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);