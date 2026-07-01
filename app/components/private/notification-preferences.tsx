"use client";

import {
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
} from "@/app/actions/notifications";
import {
  type NotificationChannel,
  type NotificationPreferences,
} from "@/app/types";
import { Bell, Loader2, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { PushToggle } from "./push-toggle";

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  "in-app": "No aplicativo",
  email: "E-mail",
  push: "Push no navegador",
  whatsapp: "WhatsApp",
  sms: "SMS",
};

const AVAILABLE_WINDOWS = [7, 3, 1];

const TIMEZONES = [
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Recife",
  "America/Cuiaba",
  "America/Boa_Vista",
  "America/Noronha",
];

export function NotificationPreferencesPanel() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getUserNotificationPreferences().then((data) => {
      setPreferences(data);
      setLoading(false);
    });
  }, []);

  const handleWindowToggle = (window: number) => {
    if (!preferences) return;
    const hasWindow = preferences.windows.includes(window);
    const next = hasWindow
      ? preferences.windows.filter((w) => w !== window)
      : [...preferences.windows, window].sort((a, b) => a - b);
    setPreferences({ ...preferences, windows: next });
  };

  const handleChannelToggle = (channel: NotificationChannel) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      channels: {
        ...preferences.channels,
        [channel]: !preferences.channels[channel],
      },
    });
  };

  const handleSubmit = () => {
    if (!preferences) return;
    startSaving(async () => {
      const result = await updateUserNotificationPreferences(preferences);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  if (loading) {
    return (
      <div className="card bg-base-200 border-base-300 border">
        <div className="card-body">
          <div className="flex items-center gap-2 text-base-content/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando preferências...
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) return null;

  return (
    <div className="card bg-base-200 border-base-300 border">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="card-title">Preferências de alerta</h2>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={preferences.enabled}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  enabled: !preferences.enabled,
                })
              }
            />
            <span className="font-medium">Ativar alertas de prazo</span>
          </label>

          <div
            className={`flex flex-col gap-4 ${preferences.enabled ? "" : "opacity-50 pointer-events-none"}`}
          >
            <div>
              <label className="label">Avisar quantos dias antes?</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_WINDOWS.map((window) => (
                  <label
                    key={window}
                    className={`badge badge-lg cursor-pointer gap-2 ${
                      preferences.windows.includes(window)
                        ? "badge-primary"
                        : "badge-outline"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={preferences.windows.includes(window)}
                      onChange={() => handleWindowToggle(window)}
                    />
                    {window} dia{window === 1 ? "" : "s"}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Horário dos alertas</label>
                <input
                  type="time"
                  className="input w-full"
                  value={preferences.time}
                  onChange={(e) =>
                    setPreferences({ ...preferences, time: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Fuso horário</label>
                <select
                  className="select w-full"
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences({ ...preferences, timezone: e.target.value })
                  }
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Canais de envio</label>
              <div className="flex flex-col gap-2">
                {(Object.keys(CHANNEL_LABELS) as NotificationChannel[]).map(
                  (channel) => {
                    const isAvailable =
                      channel === "in-app" ||
                      channel === "email" ||
                      channel === "push" ||
                      channel === "sms" ||
                      channel === "whatsapp";
                    return (
                      <div key={channel} className="flex flex-col gap-2">
                        <label
                          className={`flex items-center gap-3 cursor-pointer ${
                            isAvailable ? "" : "opacity-60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={preferences.channels[channel]}
                            onChange={() => handleChannelToggle(channel)}
                            disabled={!isAvailable}
                          />
                          <span>
                            {CHANNEL_LABELS[channel]}
                            {!isAvailable && (
                              <span className="text-xs text-base-content/50 ml-2">
                                (em breve)
                              </span>
                            )}
                          </span>
                        </label>
                        {channel === "push" && preferences.channels.push && (
                          <div className="ml-8">
                            <PushToggle />
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              {(preferences.channels.sms || preferences.channels.whatsapp) && (
                <div className="mt-3">
                  <label className="label">Número de telefone</label>
                  <input
                    type="tel"
                    className="input w-full"
                    placeholder="+55 11 99999-9999"
                    value={preferences.phoneNumber}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-base-content/50 mt-1">
                    Informe o número com DDD e código do país (ex: +55...).
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar preferências
                </>
              )}
            </button>
            {saved && (
              <span className="text-sm text-success">Preferências salvas!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
