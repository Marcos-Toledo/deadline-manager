import {
    type CalendarConnection,
    type CalendarEvent,
    type CalendarProvider,
    type Deadline,
} from "@/types";
import { compareDeadlineWithCalendarEvent } from "./compare";
import {
    getCalendarConnection,
    getCalendarConnections,
    saveCalendarConnection,
} from "./connection";
import {
    createGoogleEvent,
    deleteGoogleEvent,
    findGoogleEventByDeadlineId,
    listGoogleAppEvents,
    refreshGoogleToken,
    updateGoogleEvent,
} from "./google";
import {
    createOutlookEvent,
    deleteOutlookEvent,
    findOutlookEventByDeadlineId,
    listOutlookAppEvents,
    refreshMicrosoftToken,
    updateOutlookEvent,
} from "./outlook";

async function refreshIfNeeded(
  connection: CalendarConnection,
): Promise<CalendarConnection> {
  const buffer = 60; // segundos
  const now = Math.floor(Date.now() / 1000);

  if (connection.expiresAt > now + buffer) {
    return connection;
  }

  let refreshed:
    | { accessToken: string; refreshToken: string; expiresAt: number }
    | undefined;

  if (connection.provider === "google") {
    const tokens = await refreshGoogleToken(connection.refreshToken);
    refreshed = {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token ?? connection.refreshToken,
      expiresAt: tokens.expiry_date
        ? Math.floor(tokens.expiry_date / 1000)
        : now + 3600,
    };
  } else {
    const tokens = await refreshMicrosoftToken(connection.refreshToken);
    refreshed = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? connection.refreshToken,
      expiresAt: now + tokens.expires_in,
    };
  }

  return saveCalendarConnection(connection.userId, connection.provider, {
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    expiresAt: refreshed.expiresAt,
    scope: connection.scope,
    calendarId: connection.calendarId,
    status: connection.status,
  });
}

async function withConnection<T>(
  userId: string,
  provider: CalendarProvider,
  action: (connection: CalendarConnection) => Promise<T>,
): Promise<T> {
  const connection = await getCalendarConnection(userId, provider);
  if (!connection) {
    throw new Error(`Calendar ${provider} is not connected`);
  }
  const valid = await refreshIfNeeded(connection);
  return action(valid);
}

export async function syncDeadlineToCalendar(
  userId: string,
  deadline: Deadline,
  provider: CalendarProvider,
): Promise<string> {
  return withConnection(userId, provider, async (connection) => {
    if (connection.provider === "google") {
      return createGoogleEvent(
        connection.accessToken,
        connection.calendarId,
        deadline,
      );
    }
    return createOutlookEvent(
      connection.accessToken,
      connection.calendarId,
      deadline,
    );
  });
}

export async function updateDeadlineCalendarEvent(
  userId: string,
  deadline: Deadline,
  provider: CalendarProvider,
): Promise<string> {
  return withConnection(userId, provider, async (connection) => {
    if (connection.provider === "google") {
      const existing = await findGoogleEventByDeadlineId(
        connection.accessToken,
        connection.calendarId,
        deadline.id,
      );
      if (!existing) {
        return createGoogleEvent(
          connection.accessToken,
          connection.calendarId,
          deadline,
        );
      }
      return updateGoogleEvent(
        connection.accessToken,
        connection.calendarId,
        existing.id,
        deadline,
      );
    }

    const existing = await findOutlookEventByDeadlineId(
      connection.accessToken,
      connection.calendarId,
      deadline.id,
    );
    if (!existing) {
      return createOutlookEvent(
        connection.accessToken,
        connection.calendarId,
        deadline,
      );
    }
    return updateOutlookEvent(
      connection.accessToken,
      connection.calendarId,
      existing.id,
      deadline,
    );
  });
}

export async function deleteDeadlineCalendarEvent(
  userId: string,
  deadline: Deadline,
  provider: CalendarProvider,
): Promise<void> {
  return withConnection(userId, provider, async (connection) => {
    if (connection.provider === "google") {
      const existing = await findGoogleEventByDeadlineId(
        connection.accessToken,
        connection.calendarId,
        deadline.id,
      );
      if (existing) {
        await deleteGoogleEvent(
          connection.accessToken,
          connection.calendarId,
          existing.id,
        );
      }
      return;
    }

    const existing = await findOutlookEventByDeadlineId(
      connection.accessToken,
      connection.calendarId,
      deadline.id,
    );
    if (existing) {
      await deleteOutlookEvent(
        connection.accessToken,
        connection.calendarId,
        existing.id,
      );
    }
  });
}

export async function listAppCalendarEvents(
  userId: string,
  provider: CalendarProvider,
): Promise<CalendarEvent[]> {
  return withConnection(userId, provider, async (connection) => {
    if (connection.provider === "google") {
      return listGoogleAppEvents(connection.accessToken, connection.calendarId);
    }
    return listOutlookAppEvents(connection.accessToken, connection.calendarId);
  });
}

export async function findCalendarEventByDeadlineId(
  userId: string,
  deadlineId: string,
  provider: CalendarProvider,
): Promise<CalendarEvent | null> {
  return withConnection(userId, provider, async (connection) => {
    if (connection.provider === "google") {
      return findGoogleEventByDeadlineId(
        connection.accessToken,
        connection.calendarId,
        deadlineId,
      );
    }
    return findOutlookEventByDeadlineId(
      connection.accessToken,
      connection.calendarId,
      deadlineId,
    );
  });
}

export interface DeadlineCalendarDivergence {
  provider: CalendarProvider;
  calendarEvent: CalendarEvent;
  fieldDifferences: Array<"title" | "description" | "date">;
}

export async function findDivergentCalendarEvent(
  userId: string,
  deadline: Deadline,
): Promise<DeadlineCalendarDivergence | null> {
  const connections = await getCalendarConnections(userId);
  const connectedProviders = connections
    .filter((connection) => connection.status === "connected")
    .map((connection) => connection.provider);

  const events: Array<{ provider: CalendarProvider; event: CalendarEvent }> =
    [];

  for (const provider of connectedProviders) {
    if (!deadline.calendarEventIds?.[provider]) continue;
    try {
      const event = await findCalendarEventByDeadlineId(
        userId,
        deadline.id,
        provider,
      );
      if (event) {
        events.push({ provider, event });
      }
    } catch (err) {
      console.error(`Failed to find ${provider} event for deadline:`, err);
    }
  }

  if (events.length === 0) return null;

  const mostRecent = events.reduce((latest, current) => {
    const latestUpdated = latest.event.updatedAt
      ? new Date(latest.event.updatedAt).getTime()
      : 0;
    const currentUpdated = current.event.updatedAt
      ? new Date(current.event.updatedAt).getTime()
      : 0;
    return currentUpdated > latestUpdated ? current : latest;
  });

  const fieldDifferences = compareDeadlineWithCalendarEvent(
    deadline,
    mostRecent.event,
  );

  if (fieldDifferences.length === 0) return null;

  return {
    provider: mostRecent.provider,
    calendarEvent: mostRecent.event,
    fieldDifferences,
  };
}
