import {
  getAppCalendarEvents,
  getConnectedCalendars,
} from "@/actions/calendar";
import { getUserDeadlines } from "@/actions/deadlines";
import { DashboardClient } from "@/components/private/dashboard-client";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [connections, deadlines, googleEvents, outlookEvents] =
    await Promise.all([
      getConnectedCalendars().catch(() => []),
      getUserDeadlines().catch(() => []),
      getAppCalendarEvents("google").catch(() => []),
      getAppCalendarEvents("outlook").catch(() => []),
    ]);

  return (
    <DashboardClient
      connections={connections}
      deadlines={deadlines}
      calendarEvents={[...googleEvents, ...outlookEvents]}
    />
  );
}
