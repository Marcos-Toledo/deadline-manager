"use client";

import { useEditDeadline } from "@/context/edit-deadline";
import type { CalendarEvent, CalendarProvider, Deadline } from "@/types";
import { Info, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarConnections } from "./calendar-connections";
import { CalendarEventsList } from "./calendar-events-list";
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
  const [activeTab, setActiveTab] = useState<"deadlines" | "events">(
    "deadlines",
  );
  const { openModal = () => {}, setIsEditing = () => {} } =
    useEditDeadline() || {};

  return (
    <div className="flex flex-col gap-6">
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

      <div className="tabs tabs-border">
        <button
          className={`tab ${activeTab === "deadlines" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("deadlines")}
        >
          Prazos
        </button>
        <button
          className={`tab ${activeTab === "events" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Eventos nos calendários
        </button>
      </div>

      {activeTab === "deadlines" ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                openModal();
              }}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              Adicionar prazo
            </button>
          </div>
          <DeadlinesList
            deadlines={deadlines}
            calendarEvents={calendarEvents}
          />
        </div>
      ) : (
        <CalendarEventsList calendarEvents={calendarEvents} />
      )}
    </div>
  );
}
