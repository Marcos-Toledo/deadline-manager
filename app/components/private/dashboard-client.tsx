"use client";

import type { CalendarEvent, CalendarProvider, Deadline } from "@/app/types";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { CalendarConnections } from "./calendar-connections";
import { DeadlineForm } from "./deadline-form";
import { DeadlinesList } from "./deadlines-list";

interface ConnectionInfo {
  provider: CalendarProvider;
  calendarId: string;
  status: string;
}

interface DashboardClientProps {
  connections: ConnectionInfo[];
  deadlines: Deadline[];
  calendarEvents: CalendarEvent[];
}

export function DashboardClient({
  connections,
  deadlines,
  calendarEvents,
}: DashboardClientProps) {
  const router = useRouter();
  const connectionsCount = connections.length;

  return (
    <div className="flex flex-col gap-6 py-6">
      <CalendarConnections
        initialConnections={connections}
        onDisconnect={() => router.refresh()}
      />

      {connectionsCount === 0 && (
        <div className="alert alert-info alert-soft text-sm">
          <Info className="w-4 h-4" />
          Conecte seus calendários para importar eventos automaticamente.
        </div>
      )}

      {connectionsCount > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Prazos</h2>
            <DeadlineForm onSuccess={() => router.refresh()} />
          </div>
          <DeadlinesList
            deadlines={deadlines}
            calendarEvents={calendarEvents}
          />
        </>
      )}
    </div>
  );
}
