import Link from "next/link";

export const CTA = () => (
  <section className="py-24 bg-primary text-primary-content">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold">
        Pronto para organizar seus prazos?
      </h2>
      <p className="mt-4 text-lg opacity-90">
        Junte-se a centenas de escritórios que confiam no PrazoJus para manter
        seus processos sempre em dia.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/signup"
          className="btn btn-lg bg-base-100 text-primary border-none hover:bg-base-200"
        >
          Criar conta gratuita
        </Link>
      </div>
    </div>
  </section>
);
