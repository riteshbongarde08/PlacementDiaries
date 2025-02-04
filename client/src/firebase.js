// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "placementdiaries-2c32f.firebaseapp.com",
  projectId: "placementdiaries-2c32f",
  storageBucket: "placementdiaries-2c32f.firebasestorage.app",
  messagingSenderId: "895946401011",
  appId: "1:895946401011:web:b0e331e837e1e607e0c386"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
