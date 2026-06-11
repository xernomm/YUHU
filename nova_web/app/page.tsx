import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import {
  AboutSection,
  OpportunitySection,
  JoinStepsSection,
  CtaSection,
  ContactSection,
} from "@/components/landing/sections";
import { ProductsSection } from "@/components/landing/products-section";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <AboutSection />
        <ProductsSection />
        <OpportunitySection />
        <JoinStepsSection />
        <TestimonialsSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
