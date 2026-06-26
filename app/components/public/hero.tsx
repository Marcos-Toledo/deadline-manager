import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";

export const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-base-100">
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Gestão de prazos simplificada
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-base-content">
            Nunca mais perca um{" "}
            <span className="text-primary">prazo processual</span>
          </h1>

          <p className="text-lg text-base-content/70 max-w-lg">
            Centralize prazos, audiências e compromissos da sua equipe jurídica
            em uma plataforma moderna, segura e fácil de usar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#register" className="btn btn-primary btn-lg gap-2">
              Criar conta gratuita
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#demo" className="btn btn-outline btn-lg">
              Agendar demonstração
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>14 dias grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Cancelamento fácil</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Próximos prazos</h3>
                <span className="badge badge-primary">Hoje</span>
              </div>

              {[
                {
                  title: "Contestação - Processo nº 123456",
                  time: "16:00",
                  type: "Processual",
                  urgent: true,
                },
                {
                  title: "Audiência de conciliação",
                  time: "09:30",
                  type: "Audiência",
                  urgent: false,
                },
                {
                  title: "Prazo para recurso",
                  time: "Em 2 dias",
                  type: "Recurso",
                  urgent: false,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-base-100 border border-base-300 hover:border-primary/40 transition-colors"
                >
                  <div
                    className={`mt-1 w-3 h-3 rounded-full ${
                      item.urgent ? "bg-error animate-pulse" : "bg-success"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">
                      {item.title}
                    </p>
                    <p className="text-sm text-base-content/60">{item.type}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {item.time}
                  </span>
                </div>
              ))}

              <div className="pt-2">
                <button className="btn btn-primary btn-block gap-2">
                  <Bell className="w-4 h-4" />
                  Ativar lembretes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
