import type { Metadata } from "next";

import { Benefits } from "@/components/public/benefits";
import { CTA } from "@/components/public/cta";
import { Footer } from "@/components/public/footer";
import { Hero } from "@/components/public/hero";
import { Navbar } from "@/components/public/navbar";
import { SocialProof } from "@/components/public/social-proof";

export const metadata: Metadata = {
  title: "Gestão de Prazos Processuais | Nunca Mais Perca um Prazo",
  description:
    "Sincronize prazos processuais com Google Calendar e Outlook. Alertas por Email, SMS e WhatsApp. Teste grátis por 30 dias.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content antialiased">
      <Navbar />
      <main id="topo">
        <Hero />
        <Benefits />
        <CTA />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}
