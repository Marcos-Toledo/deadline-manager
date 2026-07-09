import Link from "next/link";

export function CTA() {
  return (
    <section id="cta" className="bg-primary text-primary-content">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Teste Grátis por 30 Dias
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-content/90">
          Configure a sincronização com o seu calendário em poucos minutos e
          comece a controlar prazos processuais com segurança. Sem compromisso e
          sem cobrança durante o período de teste.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="btn btn-neutral btn-lg rounded-md px-8 text-base font-semibold shadow"
          >
            Iniciar teste grátis
          </Link>
          <a
            href="#beneficios"
            className="btn btn-outline btn-lg border-primary-content/40 px-6 text-base font-medium text-primary-content hover:bg-primary-content hover:text-primary"
          >
            Falar com especialista
          </a>
        </div>
        <p className="mt-6 text-sm text-primary-content/80">
          Sem cartão de crédito necessário. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
