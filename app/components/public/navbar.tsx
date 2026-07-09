import { Clock } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-base-200 bg-base-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="#topo" className="flex items-center gap-2 text-primary">
          <Clock className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">PrazoJus</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral/70 md:flex">
          <a href="#beneficios" className="transition hover:text-neutral">
            Benefícios
          </a>
          <a href="#prova" className="transition hover:text-neutral">
            Confiança
          </a>
          <a href="#cta" className="transition hover:text-neutral">
            Teste grátis
          </a>
        </nav>
        <Link
          href="/login"
          className="btn btn-primary btn-sm rounded-md px-4 text-sm font-semibold"
        >
          Começar agora
        </Link>
      </div>
    </header>
  );
}
