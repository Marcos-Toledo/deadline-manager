"use client";

import { Clock, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeController } from "../theme-controller";
import { NotificationBell } from "./notification-bell";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="app-drawer"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </label>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary font-bold text-lg lg:hidden"
          >
            <Clock className="w-6 h-6" />
            PrazoJus
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeController />
        </div>
      </div>
    </header>
  );
}
