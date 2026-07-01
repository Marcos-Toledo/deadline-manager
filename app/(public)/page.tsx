"use client";

import { CTA } from "../components/public/CTA";
import { DemoSection } from "../components/public/demo-section";
import { Features } from "../components/public/features";
import { Footer } from "../components/public/footer";
import { Hero } from "../components/public/hero";
import { Navbar } from "../components/public/nav-bar";
import { Pricing } from "../components/public/pricing";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <DemoSection />
      <CTA />
      <Footer />
    </>
  );
}
