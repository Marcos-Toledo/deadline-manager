"use client";

import {
    getUnreadNotificationsCount,
    getUserNotifications,
    markNotificationsAsRead,
} from "@/actions/notifications";
import type { InAppNotification } from "@/types";
import { Bell, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUnreadNotificationsCount().then(setUnreadCount);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    if (!open) {
      setLoading(true);
      const data = await getUserNotifications();
      setNotifications(data);
      const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length > 0) {
        const result = await markNotificationsAsRead(unreadIds);
        setUnreadCount(result.unreadCount);
      }
      setLoading(false);
    }
    setOpen(!open);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-ghost btn-circle"
        onClick={handleToggle}
        aria-label="Notificações"
      >
        <div className="indicator">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="badge badge-xs badge-primary indicator-item">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-box shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-base-300 flex items-center justify-between">
            <span className="font-semibold text-sm">Notificações</span>
            {notifications.some((n) => !n.read) && (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={async () => {
                  const unreadIds = notifications
                    .filter((n) => !n.read)
                    .map((n) => n.id);
                  if (unreadIds.length > 0) {
                    const result = await markNotificationsAsRead(unreadIds);
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true })),
                    );
                    setUnreadCount(result.unreadCount);
                  }
                }}
              >
                <Check className="w-3 h-3" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-base-content/50" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-base-content/60">
                Nenhuma notificação ainda.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-base-200 last:border-b-0 ${
                    notification.read ? "opacity-70" : "bg-base-200/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-base-content/70 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
