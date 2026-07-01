import { Clock } from "lucide-react";
import Link from "next/link";

export const Footer = () => (
  <footer className="bg-base-300 text-base-content py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Clock className="w-7 h-7" />
            <span className="text-xl font-bold">PrazoJus</span>
          </Link>
          <p className="mt-4 text-base-content/70 max-w-sm">
            O gestor de prazos jurídicos moderno para advogados e escritórios
            que valorizam precisão, segurança e produtividade.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-base-content mb-4">Produto</h4>
          <ul className="space-y-2 text-base-content/70">
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-colors"
              >
                Recursos
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="hover:text-primary transition-colors"
              >
                Preços
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-colors"
              >
                Segurança
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-colors"
              >
                Integrações
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base-content mb-4">Empresa</h4>
          <ul className="space-y-2 text-base-content/70">
            <li>
              <a href="#demo" className="hover:text-primary transition-colors">
                Sobre
              </a>
            </li>
            <li>
              <a href="#demo" className="hover:text-primary transition-colors">
                Contato
              </a>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Termos
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-base-content/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-base-content/60">
        <p>
          &copy; {new Date().getFullYear()} PrazoJus. Todos os direitos
          reservados.
        </p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Termos de uso
          </Link>
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Política de privacidade
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
