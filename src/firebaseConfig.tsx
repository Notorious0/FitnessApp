import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBr2S-zqSDmngYgiEP40tpGKa9Z6bIKdK4",
    authDomain: "fitness-f2345.firebaseapp.com",
    projectId: "fitness-f2345",
    storageBucket: "fitness-f2345.firebasestorage.app",
    messagingSenderId: "419832636481",
    appId: "1:419832636481:web:cbe466d62a08e325fa12c0",
    measurementId: "G-Z0YK5KDQR5"
  };


  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const googleProvider = new GoogleAuthProvider();
