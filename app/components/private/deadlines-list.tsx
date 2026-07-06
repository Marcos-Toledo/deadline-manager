"use client";

import {
  deleteDeadline,
  refreshProcessMetadata,
  syncDeadlineFromCalendar,
} from "@/app/actions/deadlines";
import { useEditDeadline } from "@/app/context/edit-deadline";
import { compareDeadlineWithCalendarEvent } from "@/app/lib/calendar/compare";
import type { CalendarEvent, Deadline } from "@/app/types";
import { formatDateTimeLocal } from "@/app/utils/formatDateTimeLocal";
import { formatarProcessoCNJ } from "@/app/utils/formatter-process-number";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ProcessProfile } from "./process-profile";

const TYPE_LABELS: Record<Deadline["type"], string> = {
  hearing: "Audiência",
  expertise: "Perícia",
  deadline: "Prazo",
  meeting: "Reunião",
  other: "Outro",
};

function calculateDaysUntilDeadline(date: string): number {
  const deadline = new Date(date);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getAlertLabel(days: number): string | null {
  if (days < 0) return "Atrasado";
  if (days === 0) return "Hoje";
  if (days === 1) return "1 dia";
  if (days <= 7) return `${days} dias`;
  return null;
}

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
  const [, startSync] = useTransition();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [refreshingProcess, setRefreshingProcess] = useState<string | null>(
    null,
  );
  const [refreshMessage, setRefreshMessage] = useState<{
    id: string;
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedProcessNumber, setSelectedProcessNumber] = useState<
    string | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    if (!refreshMessage) return;
    const timeout = setTimeout(() => setRefreshMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, [refreshMessage]);

  const {
    setForm = () => {},
    setIsEditing = () => {},
    openModal = () => {},
  } = useEditDeadline() || {};

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
    setSyncingId(id);
    startSync(async () => {
      const result = await syncDeadlineFromCalendar(id);
      if (result.success) {
        router.refresh();
      }
      setSyncingId(null);
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
                  <th>Último andamento</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Calendários</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deadlines.map((deadline) => {
                  const differences = divergences.get(deadline.id);
                  const daysUntil = calculateDaysUntilDeadline(deadline.date);
                  const alertLabel = getAlertLabel(daysUntil);
                  return (
                    <tr key={deadline.id}>
                      <td>
                        <div className="font-medium">{deadline.title}</div>
                        <div className="text-xs text-base-content/60 max-w-xs truncate">
                          {deadline.description}
                        </div>
                      </td>
                      <td>
                        {deadline.hasProcessCache ? (
                          <button
                            type="button"
                            className="link link-primary text-sm"
                            onClick={() =>
                              setSelectedProcessNumber(deadline.processNumber)
                            }
                          >
                            {formatarProcessoCNJ(deadline.processNumber)}
                          </button>
                        ) : (
                          <span className="text-sm">
                            {formatarProcessoCNJ(deadline.processNumber)}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {deadline.processMetadata?.ultimoMovimento ? (
                            <div>
                              <div className="text-sm font-medium">
                                {deadline.processMetadata.ultimoMovimento.nome}
                              </div>
                              <div className="text-xs text-base-content/60">
                                {formatDate(
                                  deadline.processMetadata.ultimoMovimento
                                    .dataHora,
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-base-content/50">
                              Não disponível
                            </span>
                          )}
                          <button
                            className="btn btn-ghost btn-xs tooltip"
                            data-tip="Atualizar andamentos agora (ignora cache)"
                            disabled={refreshingProcess === deadline.id}
                            onClick={async () => {
                              setRefreshingProcess(deadline.id);
                              setRefreshMessage(null);
                              const result = await refreshProcessMetadata(
                                deadline.id,
                                true,
                              );
                              if (result.success) {
                                setRefreshMessage({
                                  id: deadline.id,
                                  type: "success",
                                  message: result.fromCache
                                    ? "Dados já estavam atualizados"
                                    : "Andamentos atualizados",
                                });
                              } else {
                                setRefreshMessage({
                                  id: deadline.id,
                                  type: "error",
                                  message: result.error ?? "Erro ao atualizar",
                                });
                              }
                              router.refresh();
                              setRefreshingProcess(null);
                            }}
                          >
                            <RefreshCw
                              size={16}
                              className={
                                refreshingProcess === deadline.id
                                  ? "animate-spin"
                                  : ""
                              }
                            />
                          </button>
                          {refreshMessage?.id === deadline.id && (
                            <div
                              className={`text-xs mt-1 ${
                                refreshMessage.type === "success"
                                  ? "text-success"
                                  : "text-error"
                              }`}
                            >
                              {refreshMessage.message}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{TYPE_LABELS[deadline.type]}</td>
                      <td>
                        <div>{formatDate(deadline.date)}</div>
                        {alertLabel && deadline.status === "pending" && (
                          <span
                            className={`badge badge-xs ${
                              daysUntil < 0
                                ? "badge-error"
                                : daysUntil <= 1
                                  ? "badge-error"
                                  : "badge-warning"
                            }`}
                          >
                            {alertLabel}
                          </span>
                        )}
                      </td>
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
                              className="btn btn-ghost btn-xs text-warning tooltip"
                              data-tip={`Sincronizar com calendário (${formatDifferences(differences)})`}
                              onClick={() => handleSync(deadline.id)}
                              disabled={syncingId === deadline.id}
                            >
                              <RefreshCw
                                className={`w-4 h-4 ${
                                  syncingId === deadline.id
                                    ? "animate-spin"
                                    : ""
                                }`}
                              />
                            </button>
                          )}
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => {
                              openModal();
                              setIsEditing(true);
                              setForm({
                                id: deadline.id,
                                title: deadline.title,
                                description: deadline.description,
                                date: formatDateTimeLocal(
                                  new Date(deadline.date),
                                ),
                                type: deadline.type,
                                processNumber: deadline.processNumber,
                              });
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
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

      {selectedProcessNumber && (
        <ProcessProfile
          key={selectedProcessNumber}
          processNumber={selectedProcessNumber}
          onClose={() => setSelectedProcessNumber(null)}
        />
      )}
    </div>
  );
}
