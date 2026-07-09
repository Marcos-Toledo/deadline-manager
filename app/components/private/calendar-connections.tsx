"use client";

import { disconnectCalendar } from "@/actions/calendar";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { MESSAGES } from "@/lib/messages";
import type { CalendarProvider } from "@/types";
import { Calendar, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const PROVIDER_LABELS: Record<CalendarProvider, string> = {
  google: "Google Calendar",
  outlook: "Outlook Calendar",
};

interface ConnectionStatus {
  provider: CalendarProvider;
  calendarId: string;
  status: string;
}

interface CalendarConnectionsProps {
  initialConnections: ConnectionStatus[];
  onDisconnect?: () => void;
}

export function CalendarConnections({
  initialConnections,
  onDisconnect,
}: CalendarConnectionsProps) {
  const [connections, setConnections] =
    useState<ConnectionStatus[]>(initialConnections);
  const [disconnecting, startDisconnect] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showError } = useActionFeedback();

  const error = searchParams.get("calendar_error");
  const connected = searchParams.get("calendar_connected");

  useEffect(() => {
    if (connected) {
      showSuccess(
        MESSAGES.calendar.connected(
          PROVIDER_LABELS[connected as CalendarProvider],
        ),
      );
    } else if (error) {
      showError(MESSAGES.calendar.connectError(error));
    }

    if (connected || error) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("calendar_connected");
      params.delete("calendar_error");
      const query = params.toString();
      router.replace(query ? `?${query}` : window.location.pathname, {
        scroll: false,
      });
    }
  }, [connected, error, searchParams, router, showSuccess, showError]);

  const handleDisconnect = (provider: CalendarProvider) => {
    startDisconnect(async () => {
      const result = await disconnectCalendar(provider);
      if (result.success) {
        showSuccess(MESSAGES.calendar.disconnected(PROVIDER_LABELS[provider]));
      } else {
        showError(MESSAGES.calendar.disconnectError(PROVIDER_LABELS[provider]));
      }
      setConnections((prev) =>
        prev.filter((connection) => connection.provider !== provider),
      );
      onDisconnect?.();
    });
  };

  return (
    <div className="card bg-base-200 border-base-300 border">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Calendários conectados
        </h2>

        <div className="flex flex-col lg:flex-row gap-3 mt-2">
          {(["google", "outlook"] as CalendarProvider[]).map((provider) => {
            const connection = connections.find(
              (item) => item.provider === provider,
            );
            return (
              <div
                key={provider}
                className="flex-1 flex items-center justify-between p-3 rounded-lg bg-base-100 relative overflow-hidden"
              >
                <Image
                  src={`/img/ico-calendar-${provider}.png`}
                  alt={`${PROVIDER_LABELS[provider]} icon`}
                  width={72}
                  height={72}
                  loading="eager"
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 z-0 opacity-50 rotate-20"
                />
                <div className="flex items-center gap-3 relative z-10">
                  <span className="font-medium">
                    {PROVIDER_LABELS[provider]}
                  </span>
                  {connection ? (
                    <span className="badge badge-success badge-sm">
                      Conectado
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">
                      Não conectado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  {connection ? (
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDisconnect(provider)}
                      disabled={disconnecting}
                    >
                      {disconnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Desconectar"
                      )}
                    </button>
                  ) : (
                    <a
                      href={`/api/calendar/${provider}/connect`}
                      className="btn btn-sm btn-primary"
                    >
                      Conectar
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
