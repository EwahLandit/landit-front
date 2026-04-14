import { useScrollReveal } from '../hooks/useScrollReveal';
import CustomCursor from '../components/ui/CustomCursor';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import MarqueeStrip from '../components/landing/MarqueeStrip';
import ServicesSection from '../components/landing/ServicesSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import Footer from '../components/landing/Footer';

const SECTION_STYLES = `
  /* ── Global section styles ── */
  [data-reveal] {
    opacity: 0;
    transform: translateY(24px);
    pointer-events: auto;
    transition: opacity 0.6s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
                transform 0.6s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  }

  [data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .section {
    padding: 100px 0;
  }

  .section__header {
    text-align: center;
    margin-bottom: 64px;
  }

  .section__label {
    display: inline-block;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent, #0057ff);
    margin-bottom: 12px;
  }

  .section__title {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text, #111);
    margin-bottom: 16px;
    line-height: 1.1;
  }

  .section__desc {
    font-size: 1.0625rem;
    color: var(--text-secondary, #555);
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  @media (min-width: 768px) {
    .container { padding: 0 40px; }
  }
`;

export default function LandingPage() {
  useScrollReveal();

  return (
    <>
      <style>{SECTION_STYLES}</style>
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeStrip />
        <ServicesSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
