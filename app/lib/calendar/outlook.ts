import {
    APP_CALENDAR_NAME,
    APP_DEADLINE_PROPERTY,
    APP_SOURCE_MARKER,
    APP_SOURCE_PROPERTY,
    type CalendarEvent,
    type Deadline,
} from "@/app/types";
import { Client } from "@microsoft/microsoft-graph-client";
import type {
    Calendar,
    Event,
    SingleValueLegacyExtendedProperty,
} from "@microsoft/microsoft-graph-types";

const EXTENDED_PROPERTY_NAMESPACE = "{66f5a359-4659-4830-9070-00040ec6ac6e}";

const SCOPES = [
  "https://graph.microsoft.com/Calendars.ReadWrite",
  "offline_access",
];

export function getMicrosoftOAuthEndpoints() {
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
  return {
    authorize: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
    token: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  };
}

export function getMicrosoftClientConfig() {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Microsoft OAuth credentials are not configured");
  }

  return { clientId, clientSecret, redirectUri };
}

export function getMicrosoftAuthUrl(state: string, codeChallenge: string) {
  const { clientId, redirectUri } = getMicrosoftClientConfig();
  const { authorize } = getMicrosoftOAuthEndpoints();

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    response_mode: "query",
    scope: SCOPES.join(" "),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${authorize}?${params.toString()}`;
}

export async function getMicrosoftTokensFromCode(
  code: string,
  codeVerifier: string,
) {
  const { clientId, clientSecret, redirectUri } = getMicrosoftClientConfig();
  const { token } = getMicrosoftOAuthEndpoints();

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
  });

  const response = await fetch(token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Microsoft token exchange failed: ${response.status} ${await response.text()}`,
    );
  }

  return (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  };
}

export async function refreshMicrosoftToken(refreshToken: string) {
  const { clientId, clientSecret, redirectUri } = getMicrosoftClientConfig();
  const { token } = getMicrosoftOAuthEndpoints();

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    redirect_uri: redirectUri,
    grant_type: "refresh_token",
    scope: SCOPES.join(" "),
  });

  const response = await fetch(token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Microsoft token refresh failed: ${response.status} ${await response.text()}`,
    );
  }

  return (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
  };
}

function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

export async function findOrCreateOutlookCalendar(
  accessToken: string,
): Promise<string> {
  const client = getGraphClient(accessToken);
  const calendars = await client.api("/me/calendars").get();
  const existing = (calendars.value as Calendar[]).find(
    (calendar) => calendar.name === APP_CALENDAR_NAME,
  );

  if (existing?.id) {
    return existing.id;
  }

  const created = await client
    .api("/me/calendars")
    .post({ name: APP_CALENDAR_NAME });

  if (!created.id) {
    throw new Error("Failed to create Outlook calendar");
  }

  return created.id;
}

function buildExtendedProperties(deadlineId: string) {
  return [
    {
      id: `String ${EXTENDED_PROPERTY_NAMESPACE} Name ${APP_SOURCE_PROPERTY}`,
      value: APP_SOURCE_MARKER,
    },
    {
      id: `String ${EXTENDED_PROPERTY_NAMESPACE} Name ${APP_DEADLINE_PROPERTY}`,
      value: deadlineId,
    },
  ];
}

function buildOutlookEventPayload(deadline: Deadline): Event {
  const startDate = new Date(deadline.date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  return {
    subject: deadline.title,
    body: {
      contentType: "text",
      content: deadline.description,
    },
    start: {
      dateTime: startDate.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: "UTC",
    },
    singleValueExtendedProperties: buildExtendedProperties(deadline.id),
  };
}

export async function createOutlookEvent(
  accessToken: string,
  calendarId: string,
  deadline: Deadline,
): Promise<string> {
  const client = getGraphClient(accessToken);

  const existing = await findOutlookEventByDeadlineId(
    accessToken,
    calendarId,
    deadline.id,
  );
  if (existing) {
    return updateOutlookEvent(accessToken, calendarId, existing.id, deadline);
  }

  const result = await client
    .api(`/me/calendars/${calendarId}/events`)
    .post(buildOutlookEventPayload(deadline));

  return result.id;
}

export async function updateOutlookEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  deadline: Deadline,
): Promise<string> {
  const client = getGraphClient(accessToken);
  const result = await client
    .api(`/me/calendars/${calendarId}/events/${eventId}`)
    .patch(buildOutlookEventPayload(deadline));

  return result.id;
}

export async function deleteOutlookEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
): Promise<void> {
  const client = getGraphClient(accessToken);
  await client.api(`/me/calendars/${calendarId}/events/${eventId}`).delete();
}

export async function findOutlookEventByDeadlineId(
  accessToken: string,
  calendarId: string,
  deadlineId: string,
): Promise<CalendarEvent | null> {
  const client = getGraphClient(accessToken);
  const filter = `singleValueExtendedProperties/Any(prop: prop/id eq 'String ${EXTENDED_PROPERTY_NAMESPACE} Name ${APP_DEADLINE_PROPERTY}' and prop/value eq '${deadlineId}')`;

  const result = await client
    .api(`/me/calendars/${calendarId}/events`)
    .filter(filter)
    .get();

  const event = (result.value as Event[])[0];
  if (!event?.id) {
    return null;
  }

  return mapOutlookEvent(event, calendarId);
}

export async function listOutlookAppEvents(
  accessToken: string,
  calendarId: string,
): Promise<CalendarEvent[]> {
  const client = getGraphClient(accessToken);
  const filter = `singleValueExtendedProperties/Any(prop: prop/id eq 'String ${EXTENDED_PROPERTY_NAMESPACE} Name ${APP_SOURCE_PROPERTY}' and prop/value eq '${APP_SOURCE_MARKER}')`;

  const result = await client
    .api(`/me/calendars/${calendarId}/events`)
    .filter(filter)
    .get();

  return (result.value as Event[]).map((event) =>
    mapOutlookEvent(event, calendarId),
  );
}

function mapOutlookEvent(event: Event, calendarId: string): CalendarEvent {
  const start =
    typeof event.start === "string" ? event.start : event.start?.dateTime;
  const end = typeof event.end === "string" ? event.end : event.end?.dateTime;
  const deadlineProp = event.singleValueExtendedProperties?.find(
    (prop: SingleValueLegacyExtendedProperty) =>
      prop.id ===
      `String ${EXTENDED_PROPERTY_NAMESPACE} Name ${APP_DEADLINE_PROPERTY}`,
  );

  return {
    id: event.id!,
    calendarId,
    provider: "outlook",
    summary: event.subject ?? "",
    description: event.body?.content ?? undefined,
    start: start ?? new Date().toISOString(),
    end: end ?? new Date().toISOString(),
    sourceMarker: APP_SOURCE_MARKER,
    deadlineId: deadlineProp?.value ?? undefined,
    createdAt: event.createdDateTime ?? undefined,
    updatedAt: event.lastModifiedDateTime ?? undefined,
  };
}
