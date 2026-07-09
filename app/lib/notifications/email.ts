import { adminDb } from "@/config/firebase-admin";
import type { Deadline, NotificationLog, User } from "@/types";
import { createTransport, type TransportOptions } from "nodemailer";

const USERS_COLLECTION = "users";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured");
  }

  return createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  } as TransportOptions);
}

function buildEmailSubject(deadline: Deadline, window: number): string {
  if (window === 0) return `[PrazoJus] Prazo hoje: ${deadline.title}`;
  return `[PrazoJus] Prazo em ${window} dia${window === 1 ? "" : "s"}: ${deadline.title}`;
}

function buildEmailHtml(deadline: Deadline, window: number): string {
  const dateLabel = new Date(deadline.date).toLocaleString("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const headline =
    window === 0
      ? "Seu prazo é hoje"
      : `Faltam ${window} dia${window === 1 ? "" : "s"} para o prazo`;

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb; font-size: 20px;">${headline}</h1>
      <p><strong>${deadline.title}</strong></p>
      <p><strong>Processo:</strong> ${deadline.processNumber}</p>
      <p><strong>Data:</strong> ${dateLabel}</p>
      <p><strong>Descrição:</strong> ${deadline.description || "Sem descrição"}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6b7280;">
        Você está recebendo este alerta porque configurou notificações no PrazoJus.
      </p>
    </div>
  `;
}

export async function sendDeadlineEmail(
  user: User,
  deadline: Deadline,
  window: number,
): Promise<void> {
  const from = process.env.FROM_EMAIL;
  if (!from) {
    throw new Error("FROM_EMAIL is not configured");
  }
  if (!user.email) {
    throw new Error("User does not have an e-mail address");
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from,
    to: user.email,
    subject: buildEmailSubject(deadline, window),
    text: `${deadline.title} (${deadline.processNumber}) - ${new Date(
      deadline.date,
    ).toLocaleString("pt-BR")}`,
    html: buildEmailHtml(deadline, window),
  });
}

export async function sendEmailNotification(
  userId: string,
  deadline: Deadline,
  window: number,
): Promise<Pick<NotificationLog, "status" | "sentAt">> {
  const userDoc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
  if (!userDoc.exists) {
    return { status: "failed", sentAt: new Date().toISOString() };
  }

  const user = userDoc.data() as User;
  if (!user.email) {
    return { status: "failed", sentAt: new Date().toISOString() };
  }

  try {
    await sendDeadlineEmail(user, deadline, window);
    return { status: "sent", sentAt: new Date().toISOString() };
  } catch (error) {
    console.error(`Failed to send e-mail to ${user.email}:`, error);
    return { status: "failed", sentAt: new Date().toISOString() };
  }
}
