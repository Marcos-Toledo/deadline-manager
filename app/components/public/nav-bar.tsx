"use client";

import { Clock, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeController } from "../theme-controller";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Recursos", href: "#features" },
    { label: "Preços", href: "#pricing" },
    { label: "Sobre", href: "#demo" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-base-100/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-2 text-primary">
            <Clock className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">PrazoJus</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-base-content/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" className="btn btn-primary btn-sm">
              Começar Grátis
            </Link>
            <ThemeController />
          </div>

          <div className="md:hidden">
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
        <div className="md:hidden bg-base-100 border-t border-base-200">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-base font-medium text-base-content/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="btn btn-primary btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
