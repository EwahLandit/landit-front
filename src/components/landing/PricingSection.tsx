import { useState, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';

// ── Types ──────────────────────────────────────────────────────────────────

interface PlanFeature {
  key: string;
  soft?: boolean;
}

interface Plan {
  id: string;
  nameKey: string;
  descKey: string;
  priceMonthly: string | null;
  priceAnnual: string | null;
  annualNoteKey: string | null;
  features: PlanFeature[];
  ctaKey: string;
  ctaHref: string;
  ctaVariant: 'primary' | 'outline' | 'notify';
  badge?: { textKey: string; variant: 'popular' | 'wip' };
  inherit?: string;
  isWip?: boolean;
  isPopular?: boolean;
}

// ── Inline SVG icons ───────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── PricingCard ────────────────────────────────────────────────────────────

interface PricingCardProps {
  plan: Plan;
  isAnnual: boolean;
  isCascadeLit: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function PricingCard({ plan, isAnnual, isCascadeLit, onMouseEnter, onMouseLeave }: PricingCardProps) {
  const { t } = useI18n();

  const cardClass = [
    'pricing-card',
    plan.isPopular ? 'pricing-card--popular' : '',
    plan.isWip ? 'pricing-card--wip' : '',
    isCascadeLit ? 'cascade-lit' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      onMouseEnter={plan.isWip ? undefined : onMouseEnter}
      onMouseLeave={plan.isWip ? undefined : onMouseLeave}
    >
      {/* Badge */}
      {plan.badge && (
        plan.badge.variant === 'wip' ? (
          <div className="pricing-card__badge pricing-card__badge--wip">
            <span className="wip-pulse" />
            <span>{t(plan.badge.textKey)}</span>
          </div>
        ) : (
          <div className="pricing-card__badge">{t(plan.badge.textKey)}</div>
        )
      )}

      {/* Header */}
      <div className="pricing-card__header">
        <h3>{t(plan.nameKey)}</h3>

        {plan.priceMonthly !== null ? (
          <div className="pricing-card__price">
            <span>$</span>
            <span className="price-monthly">{plan.priceMonthly}</span>
            {plan.priceAnnual && <span className="price-annual">{plan.priceAnnual}</span>}
            <span className="period">{t('period')}</span>
          </div>
        ) : (
          <div className="pricing-card__price">{t('p4_price')}</div>
        )}

        {plan.annualNoteKey && (
          <p className={`annual-note${isAnnual ? ' annual-note--visible' : ''}`}>
            {t(plan.annualNoteKey)}
          </p>
        )}

        <p>{t(plan.descKey)}</p>
      </div>

      {/* Inherit banner */}
      {plan.inherit && (
        <div className="pricing-card__inherit-banner">
          <div className="inherit-icon">
            <CheckIcon />
          </div>
          <span>{t(plan.inherit)}</span>
        </div>
      )}

      {/* Features */}
      <ul className="pricing-card__features">
        {plan.features.map((f) => (
          <li key={f.key} className={f.soft ? 'feat--soft' : ''}>
            {t(f.key)}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {plan.ctaVariant === 'notify' ? (
        <button className="btn btn--notify">{t(plan.ctaKey)}</button>
      ) : (
        <a href={plan.ctaHref} className={`btn btn--${plan.ctaVariant}`}>
          {t(plan.ctaKey)}
        </a>
      )}
    </div>
  );
}

// ── Plans data ─────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: 'starter',
    nameKey: 'p1_name',
    descKey: 'p1_desc',
    priceMonthly: '20',
    priceAnnual: '16',
    annualNoteKey: 'pricing_billed_annual',
    features: [
      { key: 'p1_f1' },
      { key: 'p1_f2' },
      { key: 'p1_f3' },
      { key: 'p1_f4' },
      { key: 'p1_f5' },
      { key: 'p1_f6' },
      { key: 'p1_f7' },
      { key: 'p1_f8' },
      { key: 'p1_f9' },
      { key: 'p1_f10' },
      { key: 'p1_f11' },
      { key: 'p_revisions', soft: true },
    ],
    ctaKey: 'p_start',
    ctaHref: '#contact',
    ctaVariant: 'outline',
  },
  {
    id: 'growth',
    nameKey: 'p2_name',
    descKey: 'p2_desc',
    priceMonthly: '40',
    priceAnnual: '32',
    annualNoteKey: 'pricing_billed_annual2',
    inherit: 'p2_inherit',
    features: [
      { key: 'p2_f1' },
      { key: 'p2_f2' },
      { key: 'p2_f3' },
      { key: 'p2_f4' },
      { key: 'p2_f5' },
      { key: 'p2_f6' },
      { key: 'p2_f7' },
      { key: 'p2_f8' },
      { key: 'p2_f9' },
      { key: 'p2_f10' },
      { key: 'p2_f11' },
      { key: 'p2_f12', soft: true },
    ],
    ctaKey: 'p_start',
    ctaHref: '#contact',
    ctaVariant: 'primary',
    badge: { textKey: 'p_popular', variant: 'popular' },
    isPopular: true,
  },
  {
    id: 'scale',
    nameKey: 'p3_name',
    descKey: 'p3_desc',
    priceMonthly: '120',
    priceAnnual: '96',
    annualNoteKey: 'pricing_billed_annual3',
    inherit: 'p3_inherit',
    features: [
      { key: 'p3_f1' },
      { key: 'p3_f2' },
      { key: 'p3_f3' },
      { key: 'p3_f4' },
      { key: 'p3_f5' },
      { key: 'p3_f6' },
      { key: 'p3_f7' },
      { key: 'p3_f8' },
      { key: 'p3_f9', soft: true },
    ],
    ctaKey: 'p3_notify',
    ctaHref: '#contact',
    ctaVariant: 'notify',
    badge: { textKey: 'p3_wip', variant: 'wip' },
    isWip: true,
  },
  {
    id: 'custom',
    nameKey: 'p4_name',
    descKey: 'p4_desc',
    priceMonthly: null,
    priceAnnual: null,
    annualNoteKey: null,
    features: [
      { key: 'p4_f1' },
      { key: 'p4_f2' },
      { key: 'p4_f3' },
      { key: 'p4_f4' },
      { key: 'p4_f5' },
      { key: 'p4_f6' },
      { key: 'p4_f7', soft: true },
    ],
    ctaKey: 'p4_cta',
    ctaHref: '#contact',
    ctaVariant: 'outline',
  },
];

// ── PricingSection ─────────────────────────────────────────────────────────

export default function PricingSection() {
  const { t } = useI18n();
  const [isAnnual, setIsAnnual] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const isCascadeLit = (index: number) =>
    hoveredIndex !== null && index <= hoveredIndex && !PLANS[hoveredIndex].isWip;

  return (
    <>
      <style>{`
        /* ── Pricing Section ── */
        .pricing {
          background: var(--bg-alt, #fff);
          padding: 120px 0;
        }

        .pricing .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .pricing .container {
            padding: 0 40px;
          }
        }

        /* ── Billing Toggle ── */
        .billing-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 48px;
        }

        .billing-toggle__label {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .875rem;
          font-weight: 600;
          color: var(--text-secondary, #555);
          transition: color .2s;
          cursor: pointer;
          user-select: none;
        }

        .billing-toggle__label.is-active {
          color: var(--text, #111);
        }

        .billing-toggle__switch {
          position: relative;
          width: 48px;
          height: 26px;
          background: var(--border-strong, rgba(0,0,0,.15));
          border-radius: var(--radius-full, 9999px);
          cursor: pointer;
          transition: background .25s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          flex-shrink: 0;
          border: none;
          padding: 0;
        }

        .billing-toggle__switch.is-annual {
          background: var(--accent, #0057ff);
        }

        .billing-toggle__knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,.18);
          transition: transform .3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
          pointer-events: none;
        }

        .billing-toggle__switch.is-annual .billing-toggle__knob {
          transform: translateX(22px);
        }

        .billing-save-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,168,107,.12);
          color: #00a86b;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid rgba(0,168,107,.2);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity .3s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      transform .3s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          pointer-events: none;
        }

        .billing-save-badge.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Pricing Grid ── */
        .pricing__grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 24px;
          padding-top: 20px;
          overflow: visible;
        }

        @media (min-width: 768px) {
          .pricing__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1100px) {
          .pricing__grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* ── Pricing Card ── */
        .pricing-card {
          position: relative;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, rgba(0,0,0,.08));
          border-radius: var(--radius-lg, 20px);
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          transition: transform .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      box-shadow .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      border-color .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        .pricing-card:not(.pricing-card--wip):hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg, 0 16px 48px rgba(0,0,0,.12));
        }

        .pricing-card--popular {
          border: 2px solid var(--accent, #0057ff);
          box-shadow: var(--shadow-accent, 0 8px 32px rgba(0,87,255,.25));
        }

        /* ── Cascade Highlight ── */
        .pricing-card.cascade-lit {
          transform: translateY(-4px) scale(1.01);
          border-color: var(--accent, #0057ff) !important;
          box-shadow: 0 0 0 3px var(--accent-glow, rgba(0,87,255,.18)),
                      var(--shadow-accent, 0 8px 32px rgba(0,87,255,.25)) !important;
        }

        .pricing-card.cascade-lit::after {
          content: '✓ Incluido';
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--accent, #0057ff);
          color: #fff;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .6rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: var(--radius-full, 9999px);
          animation: cascadePop .3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)) both;
          pointer-events: none;
          z-index: 2;
        }

        [data-lang="en"] .pricing-card.cascade-lit::after {
          content: '✓ Included';
        }

        @keyframes cascadePop {
          from { opacity: 0; transform: scale(.5) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Badge ── */
        .pricing-card__badge {
          position: absolute;
          top: -13px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: max-content;
          font-size: .7rem;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: var(--radius-full, 9999px);
          white-space: nowrap;
          background: var(--accent, #0057ff);
          color: #fff;
        }

        .pricing-card__badge--wip {
          background: var(--bg-alt, #fff);
          color: var(--text-muted, #999);
          border: 1.5px solid var(--border-strong, rgba(0,0,0,.15));
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .wip-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          background: #f59e0b;
          animation: wipPulse 2s ease-in-out infinite;
        }

        @keyframes wipPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: .4; }
        }

        /* ── WIP Card ── */
        .pricing-card--wip {
          border: 1.5px dashed var(--border-strong, rgba(0,0,0,.15)) !important;
          box-shadow: none !important;
        }

        .pricing-card--wip:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        .pricing-card--wip .pricing-card__header,
        .pricing-card--wip .pricing-card__inherit-banner,
        .pricing-card--wip .pricing-card__features {
          opacity: .5;
        }

        .pricing-card--wip::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 0;
          background-image: repeating-linear-gradient(
            -45deg,
            transparent 0, transparent 6px,
            rgba(0,0,0,.018) 6px, rgba(0,0,0,.018) 7px
          );
        }

        [data-theme="dark"] .pricing-card--wip::before {
          background-image: repeating-linear-gradient(
            -45deg,
            transparent 0, transparent 6px,
            rgba(255,255,255,.035) 6px, rgba(255,255,255,.035) 7px
          );
        }

        .pricing-card--wip > * {
          position: relative;
          z-index: 1;
        }

        /* ── Card Header ── */
        .pricing-card__header {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border, rgba(0,0,0,.08));
          padding-bottom: 24px;
        }

        .pricing-card__header h3 {
          font-size: 1.25rem;
          color: var(--text, #111);
          margin-bottom: 12px;
          font-family: var(--font-display, 'Syne', sans-serif);
        }

        .pricing-card__price {
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -.04em;
          color: var(--text, #111);
          line-height: 1;
          margin-bottom: 8px;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .pricing-card__price span:first-child {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-secondary, #555);
        }

        .pricing-card__price .period {
          font-size: .875rem;
          font-weight: 500;
          color: var(--text-muted, #999);
          margin-left: 2px;
        }

        .pricing-card__header p {
          font-size: .875rem;
          color: var(--text-secondary, #555);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Annual note ── */
        .annual-note {
          font-size: .75rem;
          color: var(--text-muted, #999);
          margin-top: 4px;
          margin-bottom: 8px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 500;
          display: none;
        }

        .annual-note--visible {
          display: block;
        }

        /* ── Price visibility ── */
        .price-annual {
          display: none;
        }

        .pricing-section--annual .price-monthly {
          display: none;
        }

        .pricing-section--annual .price-annual {
          display: inline;
        }

        /* ── Inherit Banner ── */
        .pricing-card__inherit-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--accent-subtle, #e8f0ff);
          border-radius: var(--radius-sm, 6px);
          margin-bottom: 20px;
        }

        .pricing-card__inherit-banner .inherit-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          background: var(--accent, #0057ff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .pricing-card__inherit-banner span {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .775rem;
          font-weight: 700;
          color: var(--accent, #0057ff);
          letter-spacing: .02em;
        }

        /* ── Features List ── */
        .pricing-card__features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
          padding: 0;
          margin: 0 0 auto 0;
          padding-bottom: 28px;
        }

        .pricing-card__features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: .875rem;
          color: var(--text-secondary, #555);
          line-height: 1.5;
        }

        .pricing-card__features li::before {
          content: '';
          display: block;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          margin-top: 1px;
          background: var(--accent-subtle, #e8f0ff);
          border-radius: 50%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%230057ff' stroke-width='3'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
        }

        [data-theme="dark"] .pricing-card__features li::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%234d8aff' stroke-width='3'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
        }

        .pricing-card__features li.feat--soft {
          color: var(--text-muted, #999);
          font-style: italic;
        }

        /* ── Notify button ── */
        .btn--notify {
          background: transparent;
          color: var(--text-muted, #999);
          border: 1.5px dashed var(--border-strong, rgba(0,0,0,.15));
          transition: background .2s, color .2s, border-color .2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .875rem;
          font-weight: 600;
          border-radius: var(--radius-full, 9999px);
          white-space: nowrap;
          letter-spacing: -.01em;
          cursor: pointer;
          margin-top: auto;
        }

        .btn--notify:hover {
          background: var(--bg, #f9f9f8);
          border-color: var(--accent, #0057ff);
          color: var(--accent, #0057ff);
          transform: none;
        }
      `}</style>

      <section
        className={`pricing section pricing-section${isAnnual ? ' pricing-section--annual' : ''}`}
        id="pricing"
      >
        <div className="container">
          {/* Section header */}
          <div className="section__header" style={{ textAlign: 'center' }} data-reveal>
            <span className="section__label">{t('pricing_label')}</span>
            <h2 className="section__title">{t('pricing_title')}</h2>
            <p className="section__desc" style={{ margin: '0 auto' }}>{t('pricing_desc')}</p>
          </div>

          {/* Billing toggle */}
          <div className="billing-toggle" data-reveal>
            <span
              className={`billing-toggle__label${!isAnnual ? ' is-active' : ''}`}
              onClick={() => setIsAnnual(false)}
            >
              {t('pricing_monthly')}
            </span>

            <button
              className={`billing-toggle__switch${isAnnual ? ' is-annual' : ''}`}
              role="switch"
              aria-checked={isAnnual}
              aria-label="Annual billing"
              onClick={() => setIsAnnual((v) => !v)}
            >
              <div className="billing-toggle__knob" />
            </button>

            <span
              className={`billing-toggle__label${isAnnual ? ' is-active' : ''}`}
              onClick={() => setIsAnnual(true)}
            >
              {t('pricing_annual')}
            </span>

            <span className={`billing-save-badge${isAnnual ? ' is-visible' : ''}`}>
              {t('pricing_save20')}
            </span>
          </div>

          {/* Cards grid */}
          <div className="pricing__grid" ref={gridRef}>
            {PLANS.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isAnnual={isAnnual}
                isCascadeLit={isCascadeLit(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
