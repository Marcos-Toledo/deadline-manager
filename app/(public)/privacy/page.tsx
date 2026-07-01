import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | PrazoJus",
  description: "Política de privacidade da plataforma PrazoJus.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-base-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-base-content">
        <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
          Política de Privacidade
        </h1>
        <p className="text-base-content/70 mb-8">
          Última atualização: {new Date().getFullYear()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            1. Dados que Coletamos
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Coletamos informações necessárias para o funcionamento da plataforma, como nome, e-mail, nome do escritório e dados dos prazos e processos cadastrados por você.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            2. Como Usamos os Dados
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Usamos seus dados para fornecer o serviço, enviar alertas de prazos, permitir a gestão de compromissos e melhorar continuamente a experiência do usuário.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            3. Compartilhamento de Dados
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Não vendemos seus dados. Compartilhamos informações apenas com prestadores de serviço essenciais à operação da plataforma (hospedagem, envio de e-mails, notificações) e quando exigido por lei.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            4. Segurança
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Adotamos medidas de segurança técnicas e administrativas para proteger suas informações, incluindo criptografia, controle de acesso e monitoramento contínuo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            5. Seus Direitos
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Você pode acessar, corrigir ou excluir suas informações pessoais a qualquer momento através da plataforma. Também pode solicitar a exportação dos seus dados entrando em contato conosco.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            6. Retenção de Dados
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para cumprir obrigações legais. Após a exclusão da conta, os dados são removidos em prazo compatível com a lei.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            7. Alterações nesta Política
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você a revise regularmente. Notificaremos alterações importantes através da plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            8. Contato
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Dúvidas sobre esta Política de Privacidade podem ser enviadas pelo formulário de contato disponível em nosso site.
          </p>
        </section>
      </div>
    </div>
  );
}
