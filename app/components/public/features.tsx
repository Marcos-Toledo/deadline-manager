import {
  Bell,
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Controle de Prazos",
    description:
      "Acompanhe todos os prazos processuais em um único painel, com contadores claros e visuais intuitivos.",
  },
  {
    icon: Calendar,
    title: "Agenda Integrada",
    description:
      "Sincronize compromissos, audiências e reuniões diretamente com a sua agenda jurídica.",
  },
  {
    icon: Bell,
    title: "Alertas Automáticos",
    description:
      "Receba notificações por e-mail e push sempre que um prazo estiver próximo do vencimento.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança Avançada",
    description:
      "Dados criptografados e controle de acesso para garantir a confidencialidade da informação.",
  },
  {
    icon: Users,
    title: "Colaboração em Equipe",
    description:
      "Convide colegas, defina permissões e trabalhe junto sem perder o controle dos processos.",
  },
  {
    icon: FileText,
    title: "Relatórios Personalizados",
    description:
      "Gere relatórios completos sobre prazos, produtividade e status dos processos em segundos.",
  },
];

export const Features = () => (
  <section id="features" className="py-24 bg-base-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-primary font-semibold tracking-wide uppercase text-sm">
          Recursos
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-base-content">
          Tudo que você precisa para gerenciar prazos
        </h2>
        <p className="mt-4 text-lg text-base-content/70">
          Uma suíte completa de ferramentas para advogados, escritórios e
          departamentos jurídicos que querem mais produtividade.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="card-title text-xl font-bold text-base-content">
                  {feature.title}
                </h3>
                <p className="text-base-content/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
