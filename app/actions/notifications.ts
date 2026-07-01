"use server";

import { adminDb } from "@/app/config/firebase-admin";
import { requireAuth } from "@/app/lib/auth";
import {
  removePushSubscription,
  savePushSubscription,
} from "@/app/lib/notifications/push";
import {
  type InAppNotification,
  type NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/app/types";
import type { PushSubscription } from "web-push";

const USERS_COLLECTION = "users";
const IN_APP_NOTIFICATIONS_COLLECTION = "inAppNotifications";
const PUSH_SUBSCRIPTIONS_COLLECTION = "pushSubscriptions";

function sanitizePreferences(
  input: Partial<NotificationPreferences>,
): NotificationPreferences {
  const channels = {
    ...DEFAULT_NOTIFICATION_PREFERENCES.channels,
    ...input.channels,
  };
  return {
    enabled: typeof input.enabled === "boolean" ? input.enabled : true,
    windows: Array.isArray(input.windows)
      ? input.windows.filter((w) => [1, 3, 7].includes(w)).sort((a, b) => a - b)
      : [7, 3, 1],
    channels: {
      "in-app":
        typeof channels["in-app"] === "boolean" ? channels["in-app"] : true,
      email: typeof channels.email === "boolean" ? channels.email : false,
      push: typeof channels.push === "boolean" ? channels.push : false,
      whatsapp:
        typeof channels.whatsapp === "boolean" ? channels.whatsapp : false,
      sms: typeof channels.sms === "boolean" ? channels.sms : false,
    },
    time:
      typeof input.time === "string" && /^\d{2}:\d{2}$/.test(input.time)
        ? input.time
        : "08:00",
    timezone:
      typeof input.timezone === "string" ? input.timezone : "America/Sao_Paulo",
  };
}

export async function getUserNotificationPreferences(): Promise<NotificationPreferences> {
  const user = await requireAuth();
  const snapshot = await adminDb
    .collection(USERS_COLLECTION)
    .doc(user.uid)
    .get();
  if (!snapshot.exists) return DEFAULT_NOTIFICATION_PREFERENCES;
  const data = snapshot.data();
  return sanitizePreferences(data?.notificationPreferences ?? {});
}

export async function updateUserNotificationPreferences(
  preferences: Partial<NotificationPreferences>,
) {
  const user = await requireAuth();
  const sanitized = sanitizePreferences(preferences);
  await adminDb.collection(USERS_COLLECTION).doc(user.uid).update({
    notificationPreferences: sanitized,
    updatedAt: new Date().toISOString(),
  });
  return { success: true, preferences: sanitized };
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const user = await requireAuth();
  const snapshot = await adminDb
    .collection(IN_APP_NOTIFICATIONS_COLLECTION)
    .where("userId", "==", user.uid)
    .where("read", "==", false)
    .count()
    .get();
  return snapshot.data().count;
}

export async function getUserNotifications(): Promise<InAppNotification[]> {
  const user = await requireAuth();
  const snapshot = await adminDb
    .collection(IN_APP_NOTIFICATIONS_COLLECTION)
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();
  return snapshot.docs.map((doc) => doc.data() as InAppNotification);
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  const user = await requireAuth();
  const batch = adminDb.batch();
  for (const id of notificationIds) {
    const ref = adminDb.collection(IN_APP_NOTIFICATIONS_COLLECTION).doc(id);
    batch.update(ref, { read: true });
  }
  await batch.commit();

  const remaining = await adminDb
    .collection(IN_APP_NOTIFICATIONS_COLLECTION)
    .where("userId", "==", user.uid)
    .where("read", "==", false)
    .count()
    .get();
  return { success: true, unreadCount: remaining.data().count };
}

export async function getVapidPublicKey(): Promise<string | null> {
  return process.env.VAPID_PUBLIC_KEY ?? null;
}

export async function subscribePush(subscription: PushSubscription) {
  const user = await requireAuth();
  await savePushSubscription(user.uid, subscription);
  return { success: true };
}

export async function unsubscribePush(endpoint: string) {
  const user = await requireAuth();
  await removePushSubscription(user.uid, endpoint);
  return { success: true };
}

export async function hasPushSubscription(): Promise<boolean> {
  const user = await requireAuth();
  const snapshot = await adminDb
    .collection(PUSH_SUBSCRIPTIONS_COLLECTION)
    .where("userId", "==", user.uid)
    .limit(1)
    .count()
    .get();
  return snapshot.data().count > 0;
}
