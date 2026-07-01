import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Ideal para testar a plataforma e organizar seus primeiros prazos.",
    features: [
      "Até 5 prazos ativos",
      "Alertas por e-mail",
      "Agenda integrada",
      "1 usuário",
    ],
    cta: "Criar conta gratuita",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Profissional",
    price: "R$ 49",
    period: "/mês",
    description: "Para escritórios e equipes que precisam de controle total.",
    features: [
      "Prazos ilimitados",
      "Alertas por e-mail e push",
      "Integração com Google e Outlook",
      "Relatórios personalizados",
      "Colaboração em equipe",
      "Suporte prioritário",
    ],
    cta: "Começar teste grátis",
    href: "/signup",
    highlighted: true,
  },
];

export const Pricing = () => (
  <section id="pricing" className="py-24 bg-base-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-primary font-semibold tracking-wide uppercase text-sm">
          Preços
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-base-content">
          Escolha o plano ideal para você
        </h2>
        <p className="mt-4 text-lg text-base-content/70">
          Comece grátis e evolua conforme sua equipe cresce. Teste o plano Profissional por 14 dias.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card border transition-all duration-300 ${
              plan.highlighted
                ? "bg-primary text-primary-content border-primary shadow-xl"
                : "bg-base-200 text-base-content border-base-300"
            }`}
          >
            <div className="card-body">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-primary-content/80" : "text-base-content/70"
                  }`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`mt-2 ${
                  plan.highlighted ? "text-primary-content/90" : "text-base-content/70"
                }`}
              >
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 shrink-0 ${
                        plan.highlighted ? "text-primary-content" : "text-primary"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="card-actions mt-8">
                <Link
                  href={plan.href}
                  className={`btn btn-block btn-lg ${
                    plan.highlighted
                      ? "bg-base-100 text-primary border-none hover:bg-base-200"
                      : "btn-primary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
