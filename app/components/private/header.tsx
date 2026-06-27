"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-base-100/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-2 text-primary">
            <Clock className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">PrazoJus</span>
          </a>

          <button className="btn btn-ghost" onClick={signOut}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};
