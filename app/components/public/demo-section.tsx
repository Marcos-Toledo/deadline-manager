"use client";

import { Calendar, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";

export const DemoSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="demo" className="py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              Demonstração
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-base-content">
              Agende uma demonstração personalizada
            </h2>
            <p className="mt-4 text-lg text-base-content/70">
              Descubra como o PrazoJus pode ajudar sua equipe a nunca mais
              perder um prazo processual. Preencha o formulário e entraremos em
              contato em breve.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-base-content/70">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Agendamento rápido em horário flexível</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/70">
                <User className="w-5 h-5 text-primary" />
                <span>Apresentação guiada por um especialista</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/70">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>Tire todas as suas dúvidas sobre a plataforma</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-xl">
            <div className="card-body">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content">
                    Solicitação enviada!
                  </h3>
                  <p className="mt-2 text-base-content/70">
                    Entraremos em contato em breve para confirmar sua
                    demonstração.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label htmlFor="name" className="label">
                      <span className="label-text">Nome completo</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Seu nome"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label htmlFor="email" className="label">
                      <span className="label-text">E-mail</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label htmlFor="company" className="label">
                      <span className="label-text">Escritório ou empresa</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Nome do escritório"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label htmlFor="message" className="label">
                      <span className="label-text">Mensagem</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Conte um pouco sobre suas necessidades"
                      className="textarea textarea-bordered w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                  >
                    Solicitar demonstração
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
