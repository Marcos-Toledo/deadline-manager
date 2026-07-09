"use client";

import type { CalendarEvent, CalendarProvider } from "@/types";
import { Calendar } from "lucide-react";

const PROVIDER_LABELS: Record<CalendarProvider, string> = {
  google: "Google",
  outlook: "Outlook",
};

interface CalendarEventsListProps {
  calendarEvents: CalendarEvent[];
}

export function CalendarEventsList({
  calendarEvents,
}: CalendarEventsListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="card bg-base-200 border-base-300 border">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Eventos dos calendários
        </h2>
        <p className="text-base-content/70 text-sm">
          Visualização de verificação dos eventos sincronizados pelo app nos
          calendários conectados.
        </p>
        {calendarEvents.length === 0 ? (
          <p className="text-base-content/70 text-sm">
            Nenhum evento sincronizado encontrado nos calendários conectados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Provedor</th>
                  <th>Início</th>
                  <th>Fim</th>
                </tr>
              </thead>
              <tbody>
                {calendarEvents.map((event) => (
                  <tr key={`${event.provider}-${event.id}`}>
                    <td>
                      <div className="font-medium">{event.summary}</div>
                      {event.deadlineId && (
                        <div className="text-xs text-base-content/60">
                          Prazo: {event.deadlineId.slice(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td>{PROVIDER_LABELS[event.provider]}</td>
                    <td>{formatDate(event.start)}</td>
                    <td>{formatDate(event.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
