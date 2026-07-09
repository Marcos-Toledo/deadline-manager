import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-base-200 to-base-100">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <span className="badge badge-outline border-primary/40 text-primary">
            Gestão de prazos processuais
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral sm:text-5xl">
            Nunca Mais Perca um Prazo Processual
          </h1>
          <p className="max-w-xl text-lg text-neutral/70">
            Centralize o controle de prazos do seu escritório e sincronize
            automaticamente cada data com o Google Calendar e o Outlook. Receba
            alertas antecipados e atue com previsibilidade em todas as suas
            demandas.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="btn btn-primary btn-lg rounded-md px-8 text-base font-semibold shadow"
            >
              Testar Grátis por 30 Dias
            </Link>
            <a
              href="#beneficios"
              className="btn btn-ghost btn-lg rounded-md px-6 text-base font-medium text-neutral"
            >
              Conhecer os benefícios
            </a>
          </div>
          <p className="text-sm text-neutral/60">
            Sem cartão de crédito. Configuração em minutos.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-base-200 bg-base-100 p-3 shadow-lg sm:p-6">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.6}
                  stroke="currentColor"
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0V11.25A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
                Agenda sincronizada
              </div>
              <span className="badge badge-success badge-sm text-success-content">
                Ativo
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-base-200/60 px-4 py-3">
                <div>
                  <p className="font-medium text-neutral">
                    Petição inicial — Ação Indenizatória
                  </p>
                  <p className="text-neutral/60">0001234-56.2024.8.26.0100</p>
                </div>
                <span className="badge badge-primary badge-outline max-sm:text-xs px-2">
                  3 dias
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-base-200/60 px-4 py-3">
                <div>
                  <p className="font-medium text-neutral">
                    Recurso de Apelação
                  </p>
                  <p className="text-neutral/60">0009876-54.2024.8.26.0100</p>
                </div>
                <span className="badge badge-warning badge-outline max-sm:text-xs px-2">
                  1 dia
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-base-200/60 px-4 py-3">
                <div>
                  <p className="font-medium text-neutral">
                    Manifestação — Cumprimento de sentença
                  </p>
                  <p className="text-neutral/60">0005555-12.2024.8.26.0100</p>
                </div>
                <span className="badge badge-neutral badge-outline max-sm:text-xs px-2">
                  7 dias
                </span>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral/60">
              <span className="badge badge-ghost max-sm:text-xs px-1 sm:px-2">
                Google Calendar
              </span>
              <span className="badge badge-ghost max-sm:text-xs px-1 sm:px-2">
                Outlook
              </span>
              <span className="badge badge-ghost max-sm:text-xs px-1 sm:px-2">
                Email
              </span>
              <span className="badge badge-ghost max-sm:text-xs px-1 sm:px-2">
                SMS
              </span>
              <span className="badge badge-ghost max-sm:text-xs px-1 sm:px-2">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
