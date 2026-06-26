import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "@/app/config/firebase";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  return signOut(auth);
}
