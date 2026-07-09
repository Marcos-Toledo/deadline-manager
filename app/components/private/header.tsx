"use client";

import { useAuth } from "@/hooks/useAuth";
import { Clock, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeController } from "../theme-controller";
import { NotificationBell } from "./notification-bell";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Configurações", href: "/alert-settings" },
    { label: "Perfil", href: "/profile" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-base-100/70 backdrop-blur-md shadow-sm" : "bg-base-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary"
          >
            <Clock className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">PrazoJus</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            <ThemeController />
            <NotificationBell />
            <Link href="/alert-settings" className="btn btn-ghost">
              Configurações
            </Link>
            <Link href="/profile" className="btn btn-ghost">
              Perfil
            </Link>
            <button className="btn btn-ghost" onClick={signOut}>
              Sair
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeController className="md:hidden" />
            <button
              className="md:hidden btn btn-ghost btn-circle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden shadow-sm border-t border-base-200`}>
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="btn btn-ghost block w-full text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
