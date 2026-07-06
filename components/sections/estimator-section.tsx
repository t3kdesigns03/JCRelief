import { SectionHeading } from "@/components/shared/section-heading";
import { Estimator } from "@/components/estimator/estimator";

export function EstimatorSection() {
  return (
    <section
      id="estimator"
      className="section scroll-mt-24 border-y border-white/5 bg-white/[0.02]"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Debt Freedom Estimator"
          title="Your numbers, side by side, in seconds"
          description="No sign-up, nothing stored. Move the sliders and watch your current path stack up against a Debt Angel plan — in real dollars."
        />
        <div className="mt-12">
          <Estimator />
        </div>
      </div>
    </section>
  );
}
