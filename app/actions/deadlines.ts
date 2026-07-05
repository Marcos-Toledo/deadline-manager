"use server";

import { adminDb } from "@/app/config/firebase-admin";
import { requireAuth } from "@/app/lib/auth";
import {
  deleteDeadlineCalendarEvent,
  findDivergentCalendarEvent,
  syncDeadlineToCalendar,
  updateDeadlineCalendarEvent,
} from "@/app/lib/calendar";
import { getCalendarConnections } from "@/app/lib/calendar/connection";
import { buscarProcesso } from "@/app/lib/datajud";
import {
  type CalendarProvider,
  type CreateDeadlineInput,
  type Deadline,
  type UpdateDeadlineInput,
} from "@/app/types";
import type {
  DatajudCacheEntry,
  DatajudProcesso,
  ProcessoMetadata,
} from "@/app/types/processo";

const COLLECTION = "deadlines";

// Consulta Datajud em background: não deve bloquear/falhar a criação do prazo.
export async function fetchDatajud(processNumber: string) {
  try {
    buscarProcesso(processNumber).catch((err: Error) => {
      console.error("[createDeadline] Falha ao consultar Datajud:", err);
    });
  } catch (err) {
    console.error(
      "[createDeadline] Falha ao iniciar consulta Datajud:",
      err as Error,
    );
  }
}

function validateDeadlineInput(input: CreateDeadlineInput): string | null {
  if (!input.title?.trim()) return "Título é obrigatório.";
  if (!input.date) return "Data é obrigatória.";
  if (!input.type) return "Tipo é obrigatório.";
  if (!input.processNumber?.trim()) return "Número do processo é obrigatório.";
  if (Number.isNaN(Date.parse(input.date))) return "Data inválida.";
  return null;
}

export async function createDeadline(input: CreateDeadlineInput) {
  const user = await requireAuth();
  const error = validateDeadlineInput(input);
  if (error) return { success: false, error };

  const now = new Date().toISOString();
  const deadlineRef = adminDb.collection(COLLECTION).doc();
  const deadline: Deadline = {
    id: deadlineRef.id,
    userId: user.uid,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    type: input.type,
    processNumber: input.processNumber.replace(/\D/g, ""),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  await deadlineRef.set(deadline);

  // Consulta Datajud em background: não deve bloquear/falhar a criação do prazo.
  if (input.processNumber) {
    try {
      await fetchDatajud(input.processNumber);
    } catch (err) {
      console.error(
        "[createDeadline] Falha ao iniciar consulta Datajud:",
        err as Error,
      );
    }
  }

  const connections = await getCalendarConnections(user.uid);
  const calendarEventIds: Partial<Record<CalendarProvider, string>> = {};

  for (const connection of connections) {
    if (connection.status !== "connected") continue;
    try {
      const eventId = await syncDeadlineToCalendar(
        user.uid,
        deadline,
        connection.provider,
      );
      calendarEventIds[connection.provider] = eventId;
    } catch (err) {
      console.error(`Failed to sync deadline to ${connection.provider}:`, err);
    }
  }

  if (Object.keys(calendarEventIds).length > 0) {
    await deadlineRef.update({ calendarEventIds });
    deadline.calendarEventIds = calendarEventIds;
  }

  return { success: true, deadline };
}

export async function updateDeadline(id: string, input: UpdateDeadlineInput) {
  const user = await requireAuth();
  const deadlineRef = adminDb.collection(COLLECTION).doc(id);
  const snapshot = await deadlineRef.get();

  if (!snapshot.exists) {
    return { success: false, error: "Prazo não encontrado." };
  }

  const existing = snapshot.data() as Deadline;
  if (existing.userId !== user.uid) {
    return { success: false, error: "Acesso negado." };
  }

  const update: Partial<Deadline> = {
    ...input,
    processNumber: input.processNumber?.replace(/\D/g, ""),
    updatedAt: new Date().toISOString(),
  };
  await deadlineRef.update(update);

  // Consulta Datajud em background: não deve bloquear/falhar a criação do prazo.
  if (input.processNumber) {
    try {
      await fetchDatajud(input.processNumber);
    } catch (err) {
      console.error(
        "[createDeadline] Falha ao iniciar consulta Datajud:",
        err as Error,
      );
    }
  }
  const updated = { ...existing, ...update } as Deadline;

  const connections = await getCalendarConnections(user.uid);
  for (const connection of connections) {
    if (connection.status !== "connected") continue;
    try {
      await updateDeadlineCalendarEvent(user.uid, updated, connection.provider);
    } catch (err) {
      console.error(
        `Failed to update calendar event on ${connection.provider}:`,
        err,
      );
    }
  }

  return { success: true, deadline: updated };
}

export async function deleteDeadline(id: string) {
  const user = await requireAuth();
  const deadlineRef = adminDb.collection(COLLECTION).doc(id);
  const snapshot = await deadlineRef.get();

  if (!snapshot.exists) {
    return { success: false, error: "Prazo não encontrado." };
  }

  const deadline = snapshot.data() as Deadline;
  if (deadline.userId !== user.uid) {
    return { success: false, error: "Acesso negado." };
  }

  const connections = await getCalendarConnections(user.uid);
  for (const connection of connections) {
    if (connection.status !== "connected") continue;
    try {
      await deleteDeadlineCalendarEvent(
        user.uid,
        deadline,
        connection.provider,
      );
    } catch (err) {
      console.error(
        `Failed to delete calendar event on ${connection.provider}:`,
        err,
      );
    }
  }

  await deadlineRef.delete();
  return { success: true };
}

export async function syncDeadlineFromCalendar(id: string) {
  const user = await requireAuth();
  const deadlineRef = adminDb.collection(COLLECTION).doc(id);
  const snapshot = await deadlineRef.get();

  if (!snapshot.exists) {
    return { success: false, error: "Prazo não encontrado." };
  }

  const existing = snapshot.data() as Deadline;
  if (existing.userId !== user.uid) {
    return { success: false, error: "Acesso negado." };
  }

  const divergence = await findDivergentCalendarEvent(user.uid, existing);
  if (!divergence) {
    return { success: true, deadline: existing, synced: false };
  }

  const update: Partial<Deadline> = {
    updatedAt: new Date().toISOString(),
  };

  if (divergence.fieldDifferences.includes("title")) {
    update.title = divergence.calendarEvent.summary;
  }
  if (divergence.fieldDifferences.includes("description")) {
    update.description = divergence.calendarEvent.description ?? "";
  }
  if (divergence.fieldDifferences.includes("date")) {
    update.date = new Date(divergence.calendarEvent.start).toISOString();
  }

  await deadlineRef.update(update);
  const updated = { ...existing, ...update } as Deadline;

  return { success: true, deadline: updated, synced: true };
}

export async function getUserDeadlines(): Promise<Deadline[]> {
  const user = await requireAuth();
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("userId", "==", user.uid)
    .orderBy("date", "asc")
    .get();

  const deadlines = snapshot.docs.map((doc) => doc.data() as Deadline);

  const processNumbers = [
    ...new Set(deadlines.map((d) => d.processNumber).filter(Boolean)),
  ];
  const cacheSnapshots = await Promise.all(
    processNumbers.map((numero) =>
      adminDb.collection("datajud_cache").doc(numero).get(),
    ),
  );

  const cacheByNumber = new Map(
    cacheSnapshots
      .filter((doc) => doc.exists)
      .map((doc) => [
        doc.id,
        (doc.data() as { processo?: ProcessoMetadata }).processo,
      ]),
  );

  const cacheExistsByNumber = new Map(
    cacheSnapshots.map((doc) => [doc.id, doc.exists]),
  );

  return deadlines.map((deadline) => {
    const normalizedNumber = deadline.processNumber.replace(/\D/g, "");
    const processMetadata = cacheByNumber.get(normalizedNumber);
    const hasProcessCache = cacheExistsByNumber.get(normalizedNumber) ?? false;
    return { ...deadline, processMetadata, hasProcessCache };
  });
}

export async function getCachedProcessoByNumber(
  processNumber: string,
): Promise<{ processo: ProcessoMetadata; rawData: DatajudProcesso } | null> {
  const user = await requireAuth();
  if (!user) return null;

  const normalizedNumber = processNumber.replace(/\D/g, "");
  try {
    const doc = await adminDb
      .collection("datajud_cache")
      .doc(normalizedNumber)
      .get();
    if (!doc.exists) return null;

    const data = doc.data() as DatajudCacheEntry;
    if (!data.processo || !data.rawData) return null;

    return {
      processo: JSON.parse(JSON.stringify(data.processo)),
      rawData: JSON.parse(JSON.stringify(data.rawData)),
    };
  } catch (err) {
    console.error("[getCachedProcessoByNumber] Erro ao ler cache:", err);
    return null;
  }
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const user = await requireAuth();
  const snapshot = await adminDb.collection(COLLECTION).doc(id).get();
  if (!snapshot.exists) return null;

  const deadline = snapshot.data() as Deadline;
  if (deadline.userId !== user.uid) return null;

  return deadline;
}

export async function refreshProcessMetadata(
  deadlineId: string,
  force = false,
): Promise<{ success: boolean; error?: string; fromCache?: boolean }> {
  const user = await requireAuth();
  const snapshot = await adminDb.collection(COLLECTION).doc(deadlineId).get();
  if (!snapshot.exists)
    return { success: false, error: "Prazo não encontrado" };

  const deadline = snapshot.data() as Deadline;
  if (deadline.userId !== user.uid) {
    return { success: false, error: "Não autorizado" };
  }

  if (!deadline.processNumber) {
    return { success: false, error: "Prazo sem número de processo" };
  }

  try {
    const { processo, fromCache } = await buscarProcesso(
      deadline.processNumber,
      force,
    );
    const cleanProcesso = JSON.parse(JSON.stringify(processo));
    await adminDb.collection(COLLECTION).doc(deadlineId).update({
      processMetadata: cleanProcesso,
      updatedAt: new Date().toISOString(),
    });
    return { success: true, fromCache };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao buscar processo";
    console.error("[refreshProcessMetadata] Erro:", err);
    return { success: false, error: message };
  }
}
