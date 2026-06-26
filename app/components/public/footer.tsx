import { Clock } from "lucide-react";

export const Footer = () => (
  <footer className="bg-base-300 text-base-content py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <a href="#" className="flex items-center gap-2 text-primary">
            <Clock className="w-7 h-7" />
            <span className="text-xl font-bold">PrazoJus</span>
          </a>
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
                href="#security"
                className="hover:text-primary transition-colors"
              >
                Segurança
              </a>
            </li>
            <li>
              <a
                href="#integrations"
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
              <a href="#about" className="hover:text-primary transition-colors">
                Sobre
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-primary transition-colors"
              >
                Contato
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-primary transition-colors">
                Termos
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                className="hover:text-primary transition-colors"
              >
                Privacidade
              </a>
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
          <a href="#terms" className="hover:text-primary transition-colors">
            Termos de uso
          </a>
          <a href="#privacy" className="hover:text-primary transition-colors">
            Política de privacidade
          </a>
        </div>
      </div>
    </div>
  </footer>
);
