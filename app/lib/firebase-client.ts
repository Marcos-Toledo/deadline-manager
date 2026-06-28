import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "@/app/config/firebase";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(getAuth(), email);
}

export async function signOutUser() {
  return signOut(auth);
}
