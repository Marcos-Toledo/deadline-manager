export function Footer() {
  return (
    <footer className="border-t border-base-200 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
            <span className="text-base font-semibold text-neutral">
              PrazoCerto
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral/70">
            <a href="#beneficios" className="hover:text-neutral">
              Benefícios
            </a>
            <a href="#prova" className="hover:text-neutral">
              Confiança
            </a>
            <a href="#cta" className="hover:text-neutral">
              Teste grátis
            </a>
            <a href="#topo" className="hover:text-neutral">
              Privacidade
            </a>
            <a href="#topo" className="hover:text-neutral">
              Termos
            </a>
          </nav>
        </div>
        <div className="mt-8 border-t border-base-200 pt-6 text-center text-xs text-neutral/50">
          © {new Date().getFullYear()} PrazoCerto. Todos os direitos reservados.
          Conteúdo demonstrativo.
        </div>
      </div>
    </footer>
  );
}
