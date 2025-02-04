// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "campusdiaries-addc4.firebaseapp.com",
    projectId: "campusdiaries-addc4",
    storageBucket: "campusdiaries-addc4.firebasestorage.app",
    messagingSenderId: "574368131237",
    appId: "1:574368131237:web:dc566f730caf7791ad454c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);