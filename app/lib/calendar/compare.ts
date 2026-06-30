import type { CalendarEvent, Deadline } from "@/app/types";

export function normalizeCalendarDate(date: string): string {
  return new Date(date).toISOString();
}

export function compareDeadlineWithCalendarEvent(
  deadline: Deadline,
  event: CalendarEvent,
): Array<"title" | "description" | "date"> {
  const differences: Array<"title" | "description" | "date"> = [];

  if (deadline.title !== event.summary) {
    differences.push("title");
  }

  const deadlineDescription = deadline.description?.trim() || "";
  const eventDescription = event.description?.trim() || "";
  if (deadlineDescription !== eventDescription) {
    differences.push("description");
  }

  const deadlineDate = normalizeCalendarDate(deadline.date);
  const eventDate = normalizeCalendarDate(event.start);
  if (deadlineDate !== eventDate) {
    differences.push("date");
  }

  return differences;
}
