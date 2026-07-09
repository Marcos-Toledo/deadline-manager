import type { Deadline, NotificationLog } from "@/app/types";
import twilio from "twilio";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured");
  }
  return twilio(accountSid, authToken);
}

function buildMessage(deadline: Deadline, window: number): string {
  const dateLabel = new Date(deadline.date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const headline =
    window === 0
      ? "Prazo hoje"
      : `Prazo em ${window} dia${window === 1 ? "" : "s"}`;
  return `${headline}: "${deadline.title}" (${deadline.processNumber}) - ${dateLabel}. PrazoJus`;
}

export async function sendSmsNotification(
  phoneNumber: string,
  deadline: Deadline,
  window: number,
): Promise<Pick<NotificationLog, "status" | "sentAt">> {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    return { status: "failed", sentAt: new Date().toISOString() };
  }

  try {
    const client = getTwilioClient();
    await client.messages.create({
      body: buildMessage(deadline, window),
      from,
      to: phoneNumber,
    });
    return { status: "sent", sentAt: new Date().toISOString() };
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return { status: "failed", sentAt: new Date().toISOString() };
  }
}

export async function sendWhatsAppNotification(
  phoneNumber: string,
  deadline: Deadline,
  window: number,
): Promise<Pick<NotificationLog, "status" | "sentAt">> {
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!from) {
    return { status: "failed", sentAt: new Date().toISOString() };
  }

  try {
    const client = getTwilioClient();
    await client.messages.create({
      body: buildMessage(deadline, window),
      contentSid: process.env.TWILIO_WHATSAPP_CONTENT_SID,
      from: `whatsapp:${from}`,
      contentVariables: JSON.stringify({ 1: buildMessage(deadline, window) }),
      to: `whatsapp:${phoneNumber}`,
    });
    return { status: "sent", sentAt: new Date().toISOString() };
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return { status: "failed", sentAt: new Date().toISOString() };
  }
}
