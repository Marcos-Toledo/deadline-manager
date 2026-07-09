import {
    APP_CALENDAR_NAME,
    APP_DEADLINE_PROPERTY,
    APP_SOURCE_MARKER,
    APP_SOURCE_PROPERTY,
    type CalendarEvent,
    type Deadline,
} from "@/types";
import { calendar_v3, google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export function getGoogleOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth credentials are not configured");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleAuthUrl(state: string) {
  const client = getGoogleOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
    include_granted_scopes: true,
  });
}

export async function getGoogleTokensFromCode(code: string) {
  const client = getGoogleOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export function getGoogleCalendarClient(accessToken: string) {
  const client = getGoogleOAuth2Client();
  client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth: client });
}

export async function refreshGoogleToken(refreshToken: string) {
  const client = getGoogleOAuth2Client();
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  return credentials;
}

export async function findOrCreateGoogleCalendar(
  accessToken: string,
): Promise<string> {
  const calendar = getGoogleCalendarClient(accessToken);

  const list = await calendar.calendarList.list();
  const existing = list.data.items?.find(
    (item) => item.summary === APP_CALENDAR_NAME,
  );

  if (existing?.id) {
    return existing.id;
  }

  const created = await calendar.calendars.insert({
    requestBody: { summary: APP_CALENDAR_NAME },
  });

  if (!created.data.id) {
    throw new Error("Failed to create Google Calendar");
  }

  return created.data.id;
}

function buildGoogleEventPayload(deadline: Deadline): calendar_v3.Schema$Event {
  const startDate = new Date(deadline.date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  return {
    summary: deadline.title,
    description: deadline.description,
    start: { dateTime: startDate.toISOString(), timeZone: "UTC" },
    end: { dateTime: endDate.toISOString(), timeZone: "UTC" },
    extendedProperties: {
      private: {
        [APP_SOURCE_PROPERTY]: APP_SOURCE_MARKER,
        [APP_DEADLINE_PROPERTY]: deadline.id,
      },
    },
  };
}

export async function createGoogleEvent(
  accessToken: string,
  calendarId: string,
  deadline: Deadline,
): Promise<string> {
  const calendar = getGoogleCalendarClient(accessToken);

  const existing = await findGoogleEventByDeadlineId(
    accessToken,
    calendarId,
    deadline.id,
  );
  if (existing) {
    return updateGoogleEvent(accessToken, calendarId, existing.id, deadline);
  }

  const result = await calendar.events.insert({
    calendarId,
    requestBody: buildGoogleEventPayload(deadline),
  });

  if (!result.data.id) {
    throw new Error("Failed to create Google Calendar event");
  }

  return result.data.id;
}

export async function updateGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  deadline: Deadline,
): Promise<string> {
  const calendar = getGoogleCalendarClient(accessToken);
  const result = await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: buildGoogleEventPayload(deadline),
  });

  if (!result.data.id) {
    throw new Error("Failed to update Google Calendar event");
  }

  return result.data.id;
}

export async function deleteGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
): Promise<void> {
  const calendar = getGoogleCalendarClient(accessToken);
  await calendar.events.delete({ calendarId, eventId });
}

export async function findGoogleEventByDeadlineId(
  accessToken: string,
  calendarId: string,
  deadlineId: string,
): Promise<CalendarEvent | null> {
  const calendar = getGoogleCalendarClient(accessToken);
  const result = await calendar.events.list({
    calendarId,
    privateExtendedProperty: [`${APP_DEADLINE_PROPERTY}=${deadlineId}`],
    singleEvents: true,
    maxResults: 1,
  });

  const event = result.data.items?.[0];
  if (!event?.id) {
    return null;
  }

  return mapGoogleEvent(event, calendarId);
}

export async function listGoogleAppEvents(
  accessToken: string,
  calendarId: string,
): Promise<CalendarEvent[]> {
  const calendar = getGoogleCalendarClient(accessToken);
  const result = await calendar.events.list({
    calendarId,
    privateExtendedProperty: [`${APP_SOURCE_PROPERTY}=${APP_SOURCE_MARKER}`],
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 2500,
  });

  return (result.data.items ?? []).map((event) =>
    mapGoogleEvent(event, calendarId),
  );
}

function mapGoogleEvent(
  event: calendar_v3.Schema$Event,
  calendarId: string,
): CalendarEvent {
  return {
    id: event.id!,
    calendarId,
    provider: "google",
    summary: event.summary ?? "",
    description: event.description ?? undefined,
    start:
      event.start?.dateTime ?? event.start?.date ?? new Date().toISOString(),
    end: event.end?.dateTime ?? event.end?.date ?? new Date().toISOString(),
    sourceMarker: APP_SOURCE_MARKER,
    deadlineId: event.extendedProperties?.private?.[APP_DEADLINE_PROPERTY],
    createdAt: event.created ?? undefined,
    updatedAt: event.updated ?? undefined,
  };
}
