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

export type NotificationChannel =
  | "in-app"
  | "email"
  | "push"
  | "whatsapp"
  | "sms";

export interface NotificationPreferences {
  enabled: boolean;
  windows: number[];
  channels: Record<NotificationChannel, boolean>;
  time: string;
  timezone: string;
}

export const DEFAULT_NOTIFICATION_WINDOWS = [7, 3, 1];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  windows: [7, 3, 1],
  channels: {
    "in-app": true,
    email: false,
    push: false,
    whatsapp: false,
    sms: false,
  },
  time: "08:00",
  timezone: "America/Sao_Paulo",
};

export interface User {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  oab?: string;
  createdAt: string;
  role: string;
  notificationPreferences?: NotificationPreferences;
}

export interface InAppNotification {
  id: string;
  userId: string;
  deadlineId: string;
  title: string;
  message: string;
  window: number;
  read: boolean;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  userId: string;
  deadlineId: string;
  window: number;
  channel: NotificationChannel;
  status: "pending" | "sent" | "failed";
  sentAt: string;
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
  id?: string;
  title: string;
  description: string;
  date: string;
  type: DeadlineType;
  processNumber: string;
}

export interface UpdateDeadlineInput {
  id?: string;
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
