import { adminDb } from "@/config/firebase-admin";
import type { Deadline, NotificationLog } from "@/types";
import type { PushSubscription } from "web-push";
import { sendNotification, setVapidDetails } from "web-push";

const PUSH_SUBSCRIPTIONS_COLLECTION = "pushSubscriptions";

export function configurePushProvider(): void {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@prazojus.com";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
  }

  setVapidDetails(subject, publicKey, privateKey);
}

function buildPushPayload(
  deadline: Deadline,
  window: number,
): {
  title: string;
  body: string;
  icon: string;
  data: { deadlineId: string; url: string };
} {
  const title =
    window === 0
      ? "Prazo hoje"
      : `Prazo em ${window} dia${window === 1 ? "" : "s"}`;
  const dateLabel = new Date(deadline.date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return {
    title,
    body: `"${deadline.title}" (${deadline.processNumber}) acontece em ${dateLabel}.`,
    icon: "/favicon.svg",
    data: { deadlineId: deadline.id, url: "/dashboard" },
  };
}

export async function sendPushNotification(
  userId: string,
  deadline: Deadline,
  window: number,
): Promise<Pick<NotificationLog, "status" | "sentAt">> {
  try {
    configurePushProvider();
  } catch {
    return { status: "failed", sentAt: new Date().toISOString() };
  }

  const subscriptionsSnapshot = await adminDb
    .collection(PUSH_SUBSCRIPTIONS_COLLECTION)
    .where("userId", "==", userId)
    .get();

  if (subscriptionsSnapshot.empty) {
    return { status: "failed", sentAt: new Date().toISOString() };
  }

  const payload = buildPushPayload(deadline, window);
  const results = await Promise.all(
    subscriptionsSnapshot.docs.map(async (doc) => {
      const { subscription } = doc.data() as {
        subscription: PushSubscription;
      };
      try {
        await sendNotification(subscription, JSON.stringify(payload));
        return true;
      } catch (error) {
        console.error("Failed to send push notification:", error);
        return false;
      }
    }),
  );

  return {
    status: results.some(Boolean) ? "sent" : "failed",
    sentAt: new Date().toISOString(),
  };
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription,
): Promise<void> {
  const snapshot = await adminDb
    .collection(PUSH_SUBSCRIPTIONS_COLLECTION)
    .where("userId", "==", userId)
    .get();

  const existing = snapshot.docs.find((doc) => {
    const data = doc.data() as { subscription: PushSubscription };
    return data.subscription.endpoint === subscription.endpoint;
  });

  if (existing) {
    await existing.ref.update({
      subscription,
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  await adminDb.collection(PUSH_SUBSCRIPTIONS_COLLECTION).add({
    userId,
    subscription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function removePushSubscription(
  userId: string,
  endpoint: string,
): Promise<void> {
  const snapshot = await adminDb
    .collection(PUSH_SUBSCRIPTIONS_COLLECTION)
    .where("userId", "==", userId)
    .get();

  const matching = snapshot.docs.find((doc) => {
    const data = doc.data() as { subscription: PushSubscription };
    return data.subscription.endpoint === endpoint;
  });

  if (matching) {
    await matching.ref.delete();
  }
}
