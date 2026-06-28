"use server";

import { adminAuth, adminDb } from "@/app/config/firebase-admin";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = formData;

  if (!name || !email || !password) {
    return { success: false, error: "Todos os campos são obrigatórios." };
  }

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      role: "user",
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Erro ao cadastrar usuário:", error);
    return { success: false, error: (error as Error).message };
  }
}
