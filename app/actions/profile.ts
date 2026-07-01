"use server";

import { adminAuth, adminDb } from "@/app/config/firebase-admin";
import { requireAuth } from "@/app/lib/auth";
import type { User } from "@/app/types";

const USERS_COLLECTION = "users";

export interface ProfileFormData {
  name: string;
  phoneNumber: string;
  oab: string;
  email: string;
}

function sanitizePhoneNumber(phone: string): string {
  return phone.trim();
}

export async function getUserProfile(): Promise<User | null> {
  const user = await requireAuth();
  const snapshot = await adminDb
    .collection(USERS_COLLECTION)
    .doc(user.uid)
    .get();

  if (!snapshot.exists) return null;

  const data = snapshot.data() as User;

  return {
    ...data,
    createdAt:
      typeof data.createdAt === "object" && data.createdAt !== null
        ? new Date(
            (data.createdAt as { _seconds: number; _nanoseconds: number })
              ._seconds * 1000,
          ).toISOString()
        : data.createdAt,
  };
}

export async function updateUserProfile(data: ProfileFormData) {
  const user = await requireAuth();
  const { name, phoneNumber, oab, email } = data;

  if (!name || !name.trim()) {
    return { success: false, error: "Nome é obrigatório." };
  }

  const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
  if (sanitizedPhone && !/^\+?[1-9]\d{1,14}$/.test(sanitizedPhone)) {
    return { success: false, error: "Telefone inválido." };
  }

  try {
    await adminAuth.updateUser(user.uid, {
      displayName: name.trim(),
    });

    await adminDb.collection(USERS_COLLECTION).doc(user.uid).set(
      {
        name: name.trim(),
        phoneNumber: sanitizedPhone,
        oab: oab.trim(),
        email: email.trim(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return { success: true };
  } catch (error: unknown) {
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, error: (error as Error).message };
  }
}
