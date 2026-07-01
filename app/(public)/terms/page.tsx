import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | PrazoJus",
  description: "Termos de uso da plataforma PrazoJus.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-base-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-base-content">
        <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
          Termos de Uso
        </h1>
        <p className="text-base-content/70 mb-8">
          Última atualização: {new Date().getFullYear()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            1. Aceitação dos Termos
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Ao acessar e usar a plataforma PrazoJus, você concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar o serviço.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            2. Descrição do Serviço
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            O PrazoJus é uma ferramenta de gestão de prazos processuais e compromissos jurídicos. Não prestamos consultoria jurídica, e a responsabilidade pelo acompanhamento final de prazos e decisões processuais permanece com o usuário e sua equipe.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            3. Cadastro e Conta
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Para usar o PrazoJus, você deve criar uma conta com informações verdadeiras, completas e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais de acesso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            4. Uso Permitido
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            O usuário se compromete a usar a plataforma de forma lícita, não interferindo na segurança, disponibilidade ou integridade do serviço, nem utilizando-o para fins ilícitos ou não autorizados.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            5. Limitação de Responsabilidade
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            O PrazoJus se esforça para manter a plataforma disponível e os dados precisos, mas não se responsabiliza por eventuais perdas ou danos decorrentes de falhas técnicas, omissões de cadastro ou uso indevido da ferramenta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            6. Alterações nos Termos
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Podemos atualizar estes Termos de Uso periodicamente. Notificaremos os usuários sobre alterações significativas, e o uso continuado do serviço após as alterações significará aceitação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-base-content mb-3">
            7. Contato
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Dúvidas sobre estes Termos de Uso podem ser enviadas pelo formulário de contato disponível em nosso site.
          </p>
        </section>
      </div>
    </div>
  );
}
