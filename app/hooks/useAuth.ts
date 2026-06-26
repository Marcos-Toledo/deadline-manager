import { useRouter } from "next/navigation";
import { signInWithGoogle, signOutUser } from "../api/firebase";

export const useAuth = () => {
  const router = useRouter();

  const googleSignIn = async () => {
    const result = await signInWithGoogle();
    const idToken = await result.user.getIdToken();

    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    }).then(() => router.push("/dashboard"));
  };

  const signOut = async () => {
    await signOutUser();

    await fetch("/api/auth/session", {
      method: "DELETE",
    });
    router.push("/");
  };

  return {
    googleSignIn,
    signOut,
  };
};
