export type CalendarProvider = "google" | "outlook";

export type DeadlineStatus = "pending" | "completed" | "cancelled";

export type DeadlineType =
  | "hearing"
  | "expertise"
  | "deadline"
  | "meeting"
  | "other";

export interface Deadline {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  type: DeadlineType;
  processNumber: string;
  status: DeadlineStatus;
  createdAt: string;
  updatedAt: string;
  calendarEventIds?: Partial<Record<CalendarProvider, string>>;
}

export interface CalendarConnection {
  id: string;
  userId: string;
  provider: CalendarProvider;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
  calendarId: string;
  status: "connected" | "disconnected" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  provider: CalendarProvider;
  summary: string;
  description?: string;
  start: string;
  end: string;
  sourceMarker: string;
  deadlineId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeadlineInput {
  title: string;
  description: string;
  date: string;
  type: DeadlineType;
  processNumber: string;
}

export interface UpdateDeadlineInput {
  title?: string;
  description?: string;
  date?: string;
  type?: DeadlineType;
  processNumber?: string;
  status?: DeadlineStatus;
}

export const APP_SOURCE_MARKER = "prazojus";
export const APP_SOURCE_PROPERTY = "app-source";
export const APP_DEADLINE_PROPERTY = "deadline-id";
export const APP_CALENDAR_NAME = "PrazoJus";
