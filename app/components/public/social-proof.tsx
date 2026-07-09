export function SocialProof() {
  return (
    <section id="prova" className="bg-base-200 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral sm:text-4xl">
            Construída para a confiança do escritório
          </h2>
          <p className="mt-4 text-lg text-neutral/70">
            Recursos pensados para garantir segurança, rastreabilidade e
            tranquilidade no controle de prazos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body gap-3 p-6">
              <h3 className="card-title text-base font-semibold text-neutral">
                Integrações nativas
              </h3>
              <p className="text-sm text-neutral/70">
                Conexão direta com Google Calendar e Outlook, mantendo sua
                agenda sempre atualizada sem esforço manual.
              </p>
            </div>
          </article>
          <article className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body gap-3 p-6">
              <h3 className="card-title text-base font-semibold text-neutral">
                Alertas antecipados
              </h3>
              <p className="text-sm text-neutral/70">
                Lembretes configuráveis por Email, SMS e WhatsApp antes do
                vencimento de cada prazo.
              </p>
            </div>
          </article>
          <article className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body gap-3 p-6">
              <h3 className="card-title text-base font-semibold text-neutral">
                Histórico rastreável
              </h3>
              <p className="text-sm text-neutral/70">
                Registro de cada prazo e notificação para auditoria interna
                e segurança jurídica do escritório.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-12 rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="text-lg font-medium text-neutral sm:text-xl">
              &ldquo;A sincronização automática com o calendário eliminou o
              risco de esquecer um prazo. A rotina do escritório ficou mais
              previsível e segura.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-neutral/60">
              Depoimento ilustrativo de advogado usuário da plataforma.
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
