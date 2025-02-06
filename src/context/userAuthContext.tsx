import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification, // <-- Dodajemy import sendEmailVerification
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { ProfileInfo } from "@/types";

interface IUserAuthProviderProps {
  children: React.ReactNode;
}

type AuthContextData = {
  user: User | null;
  logIn: typeof logIn;
  signUp: typeof signUp;
  logOut: typeof logOut;
  googleSignIn: typeof googleSignIn;
  updateProfileInfo: typeof updateProfileInfo;
  sendVerificationEmail: (user: User) => Promise<void>; // <-- Dodajemy typ funkcji wysyłania maila weryfikacyjnego
};

const logIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  return signOut(auth);
};

const googleSignIn = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

const updateProfileInfo = (profileInfo: ProfileInfo) => {
  console.log("The user profile is: ", profileInfo);
  return updateProfile(profileInfo.user!, {
    displayName: profileInfo.displayName,
    photoURL: profileInfo.photoURL,
  });
};

// Dodajemy funkcję wysyłającą email weryfikacyjny
const sendVerificationEmail = (user: User) => {
  return sendEmailVerification(user);
};

export const userAuthContext = createContext<AuthContextData>({
  user: null,
  logIn,
  signUp,
  logOut,
  googleSignIn,
  updateProfileInfo,
  sendVerificationEmail, // <-- dodajemy do wartości domyślnej
});

export const UserAuthProvider: React.FC<IUserAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("I am in useEffect and user is : ", user);
      if (user) {
        console.log("The logged in user state is : ", user);
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const value: AuthContextData = {
    user,
    logIn,
    signUp,
    logOut,
    googleSignIn,
    updateProfileInfo,
    sendVerificationEmail,
  };

  return (
    <userAuthContext.Provider value={value}>
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(userAuthContext);
};
