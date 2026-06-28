import { useRouter } from "next/navigation";
import {
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
} from "../lib/firebase-client";

export const useAuth = () => {
  const router = useRouter();

  const createSession = async (idToken: string) => {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  };

  const googleSignIn = async () => {
    const result = await signInWithGoogle();
    const idToken = await result.user.getIdToken();
    await createSession(idToken);
    router.push("/dashboard");
  };

  const emailSignIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    const idToken = await result.user.getIdToken();
    await createSession(idToken);
    router.push("/dashboard");
  };

  const passwordReset = async (email: string) => {
    await sendPasswordReset(email);
  };

  const signOut = async () => {
    await signOutUser();
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
  };

  return {
    googleSignIn,
    emailSignIn,
    passwordReset,
    signOut,
  };
};
