import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, surname: string) => Promise<UserCredential>; 
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

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string, surname: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Kullanıcıyı Firestore'a ekliyoruz
    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name, 
        surname: surname, 
        email: email,
        uid: userCredential.user.uid,
        createdAt: new Date(),
    });

    return userCredential; // Kullanıcı bilgisini döndürdük
};



  const logout = async () => {
    await signOut(auth);
  };

  const checkUserData = async () => {
    if (!auth.currentUser) return false;
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, checkUserData }}>
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
