import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
}


  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const googleProvider = new GoogleAuthProvider();
