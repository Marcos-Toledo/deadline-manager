import { adminDb } from "@/config/firebase-admin";
import {
    type Deadline,
    type InAppNotification,
    type NotificationChannel,
    type NotificationLog,
    type User,
    DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/types";
import { sendEmailNotification } from "./email";
import { sendPushNotification } from "./push";
import { sendSmsNotification, sendWhatsAppNotification } from "./sms";

const USERS_COLLECTION = "users";
const DEADLINES_COLLECTION = "deadlines";
const IN_APP_NOTIFICATIONS_COLLECTION = "inAppNotifications";
const NOTIFICATION_LOGS_COLLECTION = "notificationLogs";

export function calculateDaysUntilDeadline(
  date: string,
  timezone: string,
): number {
  const now = new Date();
  const nowLocal = new Date(
    now.toLocaleString("en-US", { timeZone: timezone }),
  );
  const nowDay = Date.UTC(
    nowLocal.getFullYear(),
    nowLocal.getMonth(),
    nowLocal.getDate(),
  );

  // Parse the date string as local midnight to avoid UTC off-by-one.
  // Handles both "YYYY-MM-DD" and full ISO strings.
  const datePart = date.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  const deadlineDay = Date.UTC(year, month - 1, day);

  return Math.floor((deadlineDay - nowDay) / (1000 * 60 * 60 * 24));
}

export function buildInAppNotification(
  userId: string,
  deadline: Deadline,
  window: number,
): Omit<InAppNotification, "id"> {
  const dateLabel = new Date(deadline.date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const title =
    window === 0
      ? "Prazo hoje"
      : `Prazo em ${window} dia${window === 1 ? "" : "s"}`;
  return {
    userId,
    deadlineId: deadline.id,
    title,
    message: `"${deadline.title}" (${deadline.processNumber}) acontece em ${dateLabel}.`,
    window,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export async function hasNotificationBeenSent(
  userId: string,
  deadlineId: string,
  window: number,
  channel: NotificationChannel,
): Promise<boolean> {
  const snapshot = await adminDb
    .collection(NOTIFICATION_LOGS_COLLECTION)
    .where("userId", "==", userId)
    .where("deadlineId", "==", deadlineId)
    .where("window", "==", window)
    .where("channel", "==", channel)
    .limit(1)
    .get();
  return !snapshot.empty;
}

export async function processNotificationsForUser(
  userId: string,
): Promise<number> {
  const userDoc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
  if (!userDoc.exists) return 0;

  const user = userDoc.data() as User;
  const preferences =
    user.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFERENCES;
  if (!preferences.enabled) return 0;

  const activeChannels = Object.entries(preferences.channels).filter(
    ([, enabled]) => enabled,
  ) as [NotificationChannel, boolean][];
  if (activeChannels.length === 0) return 0;

  const deadlinesSnapshot = await adminDb
    .collection(DEADLINES_COLLECTION)
    .where("userId", "==", userId)
    .where("status", "==", "pending")
    .get();

  if (deadlinesSnapshot.empty) return 0;

  const now = new Date().toISOString();
  let createdCount = 0;
  const batch = adminDb.batch();

  for (const doc of deadlinesSnapshot.docs) {
    const deadline = { id: doc.id, ...doc.data() } as Deadline;
    const daysUntil = calculateDaysUntilDeadline(
      deadline.date,
      preferences.timezone,
    );

    for (const window of preferences.windows) {
      if (daysUntil !== window) continue;

      for (const [channel] of activeChannels) {
        const alreadySent = await hasNotificationBeenSent(
          userId,
          deadline.id,
          window,
          channel,
        );
        if (alreadySent) continue;

        if (channel === "in-app") {
          const notificationRef = adminDb
            .collection(IN_APP_NOTIFICATIONS_COLLECTION)
            .doc();
          batch.set(
            notificationRef,
            buildInAppNotification(userId, deadline, window),
          );
          batch.set(adminDb.collection(NOTIFICATION_LOGS_COLLECTION).doc(), {
            userId,
            deadlineId: deadline.id,
            window,
            channel: "in-app",
            status: "sent",
            sentAt: now,
          } as Omit<NotificationLog, "id">);
          createdCount++;
          continue;
        }

        if (channel === "email") {
          const result = await sendEmailNotification(userId, deadline, window);
          batch.set(adminDb.collection(NOTIFICATION_LOGS_COLLECTION).doc(), {
            userId,
            deadlineId: deadline.id,
            window,
            channel: "email",
            status: result.status,
            sentAt: result.sentAt,
          } as Omit<NotificationLog, "id">);
          createdCount++;
          continue;
        }

        if (channel === "push") {
          const result = await sendPushNotification(userId, deadline, window);
          batch.set(adminDb.collection(NOTIFICATION_LOGS_COLLECTION).doc(), {
            userId,
            deadlineId: deadline.id,
            window,
            channel: "push",
            status: result.status,
            sentAt: result.sentAt,
          } as Omit<NotificationLog, "id">);
          createdCount++;
          continue;
        }

        if (channel === "sms") {
          const result = user.phoneNumber
            ? await sendSmsNotification(user.phoneNumber, deadline, window)
            : { status: "failed", sentAt: new Date().toISOString() };
          batch.set(adminDb.collection(NOTIFICATION_LOGS_COLLECTION).doc(), {
            userId,
            deadlineId: deadline.id,
            window,
            channel: "sms",
            status: result.status,
            sentAt: result.sentAt,
          } as Omit<NotificationLog, "id">);
          createdCount++;
          continue;
        }

        if (channel === "whatsapp") {
          const result = user.phoneNumber
            ? await sendWhatsAppNotification(user.phoneNumber, deadline, window)
            : { status: "failed", sentAt: new Date().toISOString() };
          batch.set(adminDb.collection(NOTIFICATION_LOGS_COLLECTION).doc(), {
            userId,
            deadlineId: deadline.id,
            window,
            channel: "whatsapp",
            status: result.status,
            sentAt: result.sentAt,
          } as Omit<NotificationLog, "id">);
          createdCount++;
          continue;
        }

        batch.set(adminDb.collection(NOTIFICATION_LOGS_COLLECTION).doc(), {
          userId,
          deadlineId: deadline.id,
          window,
          channel,
          status: "sent",
          sentAt: now,
        } as Omit<NotificationLog, "id">);
        createdCount++;
      }
    }
  }

  if (createdCount > 0) {
    await batch.commit();
  }

  return createdCount;
}

export async function runNotificationEngine(): Promise<{
  processed: number;
  created: number;
}> {
  const usersSnapshot = await adminDb.collection(USERS_COLLECTION).get();
  let processed = 0;
  let created = 0;

  for (const doc of usersSnapshot.docs) {
    const user = { uid: doc.id, ...doc.data() } as User;
    processed++;
    const count = await processNotificationsForUser(user.uid);
    created += count;
  }

  return { processed, created };
}
