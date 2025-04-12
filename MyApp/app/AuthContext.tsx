import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider as FirebaseGoogleProvider } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkUserData: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Email & Password login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Email & Password signup
  const signup = async (email: string, password: string, username: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      username: username,
      email: email,
      uid: userCredential.user.uid,
      createdAt: new Date(),
    });

    return userCredential;
  };

  // Google login with Firestore kayıt
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  
    if (!user.email) {
      throw new Error("Google hesabınızla giriş yapılamıyor. Lütfen geçerli bir e-posta adresiyle deneyin.");
    }
  
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        username: user.displayName || "",
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });
    }
  };  

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Kullanıcının Firestore’da verisi var mı kontrolü
  const checkUserData = async () => {
    if (!auth.currentUser) return false;
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, loginWithGoogle, logout, checkUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
