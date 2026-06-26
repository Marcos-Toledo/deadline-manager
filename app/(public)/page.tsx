"use client";

import { CTA } from "../components/public/CTA";
import { Features } from "../components/public/features";
import { Footer } from "../components/public/footer";
import { Hero } from "../components/public/hero";
import { Navbar } from "../components/public/nav-bar";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
