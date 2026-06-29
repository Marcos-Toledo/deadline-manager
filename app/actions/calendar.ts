"use server";

import { requireAuth } from "@/app/lib/auth";
import {
  getCalendarConnections,
  removeCalendarConnection,
} from "@/app/lib/calendar/connection";
import { listAppCalendarEvents } from "@/app/lib/calendar";
import { type CalendarEvent, type CalendarProvider } from "@/app/types";

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
  provider: CalendarProvider
): Promise<CalendarEvent[]> {
  const user = await requireAuth();
  return listAppCalendarEvents(user.uid, provider);
}
