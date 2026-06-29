import {
  getAppCalendarEvents,
  getConnectedCalendars,
} from "@/app/actions/calendar";
import { getUserDeadlines } from "@/app/actions/deadlines";
import { DashboardClient } from "@/app/components/private/dashboard-client";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [connections, deadlines, googleEvents, outlookEvents] =
    await Promise.all([
      getConnectedCalendars().catch(() => []),
      getUserDeadlines().catch((err) => {
        console.error("getUserDeadlines error:", err);
        return [];
      }),
      getAppCalendarEvents("google").catch(() => []),
      getAppCalendarEvents("outlook").catch(() => []),
    ]);
  console.log("connections", connections);
  console.log("deadlines", deadlines);
  console.log("googleEvents", googleEvents);
  console.log("outlookEvents", outlookEvents);
  return (
    <DashboardClient
      connections={connections}
      deadlines={deadlines}
      calendarEvents={[...googleEvents, ...outlookEvents]}
    />
  );
}
