"use client";

import { disconnectCalendar } from "@/actions/calendar";
import type { CalendarProvider } from "@/types";
import { Calendar, CheckCircle, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

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

  const error = searchParams.get("calendar_error");
  const connected = searchParams.get("calendar_connected");

  const handleDisconnect = (provider: CalendarProvider) => {
    startDisconnect(async () => {
      await disconnectCalendar(provider);
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

        {error && (
          <div className="alert alert-error alert-soft text-sm">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {connected && (
          <div className="alert alert-success alert-soft text-sm">
            <CheckCircle className="w-4 h-4" />
            {PROVIDER_LABELS[connected as CalendarProvider]} conectado com
            sucesso.
          </div>
        )}

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
