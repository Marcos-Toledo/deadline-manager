"use client";

import { deleteDeadline } from "@/app/actions/deadlines";
import type { CalendarEvent, CalendarProvider, Deadline } from "@/app/types";
import { Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const TYPE_LABELS: Record<Deadline["type"], string> = {
  hearing: "Audiência",
  expertise: "Perícia",
  deadline: "Prazo",
  meeting: "Reunião",
  other: "Outro",
};

const PROVIDER_LABELS: Record<CalendarProvider, string> = {
  google: "Google",
  outlook: "Outlook",
};

interface DeadlinesListProps {
  deadlines: Deadline[];
  calendarEvents: CalendarEvent[];
}

export function DeadlinesList({
  deadlines,
  calendarEvents,
}: DeadlinesListProps) {
  const [deleting, startDelete] = useTransition();
  const router = useRouter();

  const handleDelete = (id: string) => {
    startDelete(async () => {
      await deleteDeadline(id);
      router.refresh();
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex flex-col gap-6">
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
                  {deadlines.map((deadline) => (
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
                        <div className="flex gap-1">
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
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => handleDelete(deadline.id)}
                          disabled={deleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card bg-base-200 border-base-300 border">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Eventos dos calendários (apenas do app)
          </h2>
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
    </div>
  );
}
