import { adminDb } from "@/app/config/firebase-admin";
import {
    APP_CALENDAR_NAME,
    type CalendarConnection,
    type CalendarProvider,
} from "@/app/types";

const COLLECTION = "calendarConnections";

export async function getCalendarConnection(
  userId: string,
  provider: CalendarProvider,
): Promise<CalendarConnection | null> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .where("provider", "==", provider)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as Omit<CalendarConnection, "id">),
  };
}

export async function getCalendarConnections(
  userId: string,
): Promise<CalendarConnection[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CalendarConnection, "id">),
  }));
}

export type CalendarConnectionInput = Omit<
  CalendarConnection,
  "id" | "userId" | "provider" | "createdAt" | "updatedAt"
>;

export async function saveCalendarConnection(
  userId: string,
  provider: CalendarProvider,
  data: CalendarConnectionInput,
): Promise<CalendarConnection> {
  const existing = await getCalendarConnection(userId, provider);
  const now = new Date().toISOString();
  const payload = {
    userId,
    provider,
    ...data,
    updatedAt: now,
  };

  if (existing) {
    await adminDb.collection(COLLECTION).doc(existing.id).update(payload);
    return { ...existing, ...payload };
  }

  const docRef = await adminDb.collection(COLLECTION).add({
    ...payload,
    createdAt: now,
  });

  return {
    id: docRef.id,
    ...payload,
    createdAt: now,
  } as CalendarConnection;
}

export async function removeCalendarConnection(
  userId: string,
  provider: CalendarProvider,
): Promise<void> {
  const existing = await getCalendarConnection(userId, provider);
  if (existing) {
    await adminDb.collection(COLLECTION).doc(existing.id).delete();
  }
}

export async function findOrCreateAppCalendarId(
  userId: string,
  provider: CalendarProvider,
  createCalendar: (token: string) => Promise<string>,
): Promise<string> {
  const connection = await getCalendarConnection(userId, provider);
  if (connection?.calendarId) {
    return connection.calendarId;
  }

  if (!connection?.accessToken) {
    throw new Error(`No access token for ${provider}`);
  }

  const calendarId = await createCalendar(connection.accessToken);
  await saveCalendarConnection(userId, provider, {
    accessToken: connection.accessToken,
    refreshToken: connection.refreshToken,
    expiresAt: connection.expiresAt,
    scope: connection.scope,
    calendarId,
    status: connection.status,
  });
  return calendarId;
}

export function generateCalendarName(): string {
  return APP_CALENDAR_NAME;
}
