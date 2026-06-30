"use client";

import {
  deleteDeadline,
  syncDeadlineFromCalendar,
} from "@/app/actions/deadlines";
import { compareDeadlineWithCalendarEvent } from "@/app/lib/calendar/compare";
import type { CalendarEvent, Deadline } from "@/app/types";
import { RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";

const TYPE_LABELS: Record<Deadline["type"], string> = {
  hearing: "Audiência",
  expertise: "Perícia",
  deadline: "Prazo",
  meeting: "Reunião",
  other: "Outro",
};

interface DeadlinesListProps {
  deadlines: Deadline[];
  calendarEvents: CalendarEvent[];
}

function findMostRecentEventForDeadline(
  deadline: Deadline,
  calendarEvents: CalendarEvent[],
): CalendarEvent | undefined {
  const events = calendarEvents.filter(
    (event) => event.deadlineId === deadline.id,
  );
  if (events.length === 0) return undefined;

  return events.reduce((latest, current) => {
    const latestUpdated = latest.updatedAt
      ? new Date(latest.updatedAt).getTime()
      : 0;
    const currentUpdated = current.updatedAt
      ? new Date(current.updatedAt).getTime()
      : 0;
    return currentUpdated > latestUpdated ? current : latest;
  });
}

export function DeadlinesList({
  deadlines,
  calendarEvents,
}: DeadlinesListProps) {
  const [deleting, startDelete] = useTransition();
  const [syncing, startSync] = useTransition();
  const router = useRouter();

  const divergences = useMemo(() => {
    const map = new Map<string, Array<"title" | "description" | "date">>();
    for (const deadline of deadlines) {
      const event = findMostRecentEventForDeadline(deadline, calendarEvents);
      if (!event) continue;
      const differences = compareDeadlineWithCalendarEvent(deadline, event);
      if (differences.length > 0) {
        map.set(deadline.id, differences);
      }
    }
    return map;
  }, [deadlines, calendarEvents]);

  const handleDelete = (id: string) => {
    startDelete(async () => {
      await deleteDeadline(id);
      router.refresh();
    });
  };

  const handleSync = (id: string) => {
    startSync(async () => {
      const result = await syncDeadlineFromCalendar(id);
      if (result.success) {
        router.refresh();
      }
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatDifferences = (
    differences: Array<"title" | "description" | "date">,
  ) => {
    const labels: Record<"title" | "description" | "date", string> = {
      title: "título",
      description: "descrição",
      date: "data",
    };
    return differences.map((field) => labels[field]).join(", ");
  };

  return (
    <div className="card bg-base-200 border-base-300 border">
      <div className="card-body">
        <h2 className="card-title">Prazos cadastrados</h2>
        {deadlines.length === 0 ? (
          <p className="text-base-content/70 text-sm">
            Nenhum prazo cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Processo</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Calendários</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deadlines.map((deadline) => {
                  const differences = divergences.get(deadline.id);
                  return (
                    <tr key={deadline.id}>
                      <td>
                        <div className="font-medium">{deadline.title}</div>
                        <div className="text-xs text-base-content/60 max-w-xs truncate">
                          {deadline.description}
                        </div>
                      </td>
                      <td>{deadline.processNumber}</td>
                      <td>{TYPE_LABELS[deadline.type]}</td>
                      <td>{formatDate(deadline.date)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {deadline.calendarEventIds?.google && (
                            <span className="badge badge-sm badge-outline">
                              Google
                            </span>
                          )}
                          {deadline.calendarEventIds?.outlook && (
                            <span className="badge badge-sm badge-outline">
                              Outlook
                            </span>
                          )}
                          {!deadline.calendarEventIds?.google &&
                            !deadline.calendarEventIds?.outlook && (
                              <span className="text-xs text-base-content/50">
                                Não sincronizado
                              </span>
                            )}
                          {differences && (
                            <span
                              className="badge badge-sm badge-warning"
                              title={`Divergência: ${formatDifferences(differences)}`}
                            >
                              divergente
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          {differences && (
                            <button
                              className="btn btn-ghost btn-xs text-warning"
                              onClick={() => handleSync(deadline.id)}
                              disabled={syncing}
                              title={`Sincronizar com calendário (${formatDifferences(differences)})`}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => handleDelete(deadline.id)}
                            disabled={deleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
