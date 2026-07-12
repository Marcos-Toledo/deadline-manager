"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Clock,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Buscar Processos", href: "/search", icon: Search },
  { label: "Configurações", href: "/alert-settings", icon: Settings },
  { label: "Perfil", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300">
      <li className="px-2 pb-4 mb-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-primary text-lg font-bold tracking-tight px-0 hover:bg-transparent"
        >
          <Clock className="w-7 h-7" />
          PrazoJus
        </Link>
      </li>

      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`flex items-center gap-3 ${isActive ? "active" : ""}`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          </li>
        );
      })}

      <li className="mt-auto">
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-3 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </li>
    </ul>
  );
}
