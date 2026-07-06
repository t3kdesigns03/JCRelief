import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Difference } from "@/components/sections/difference";
import { EstimatorSection } from "@/components/sections/estimator-section";
import { ComparisonTeaser } from "@/components/sections/comparison-teaser";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { ClosingCta } from "@/components/sections/closing-cta";
import { SiteFooter } from "@/components/sections/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        {/* Striking emblem CTA elevated near the top of the page */}
        <FinalCta />
        <Difference />
        <EstimatorSection />
        <ComparisonTeaser />
        <Testimonials />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
