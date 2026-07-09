"use server";

import { requireAuth } from "@/lib/auth";
import { listAppCalendarEvents } from "@/lib/calendar";
import {
    getCalendarConnections,
    removeCalendarConnection,
} from "@/lib/calendar/connection";
import { type CalendarEvent, type CalendarProvider } from "@/types";

export async function getConnectedCalendars() {
  const user = await requireAuth();
  const connections = await getCalendarConnections(user.uid);
  return connections.map((connection) => ({
    provider: connection.provider,
    calendarId: connection.calendarId,
    status: connection.status,
  }));
}

export async function disconnectCalendar(provider: CalendarProvider) {
  const user = await requireAuth();
  await removeCalendarConnection(user.uid, provider);
  return { success: true };
}

export async function getAppCalendarEvents(
  provider: CalendarProvider,
): Promise<CalendarEvent[]> {
  const user = await requireAuth();
  return listAppCalendarEvents(user.uid, provider);
}
