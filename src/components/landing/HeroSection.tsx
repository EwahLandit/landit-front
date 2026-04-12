import { useI18n } from '../../hooks/useI18n';

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <>
      <style>{`
        /* ── Hero Section ── */
        .hero {
          position: relative;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding-top: var(--nav-h, 68px);
        }

        .hero__bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border, rgba(0,0,0,.08)) 1px, transparent 1px),
            linear-gradient(90deg, var(--border, rgba(0,0,0,.08)) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: .5;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .hero__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .hero__orb--1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 87, 255, .12), transparent 70%);
          top: -100px;
          right: -100px;
          animation: orbFloat1 12s ease-in-out infinite;
        }

        .hero__orb--2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 87, 255, .07), transparent 70%);
          bottom: 0;
          left: -50px;
          animation: orbFloat2 16s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(-30px, 40px); }
        }

        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(20px, -30px); }
        }

        .hero__inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 56px;
          padding-top: 60px;
          padding-bottom: 120px;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        @media (min-width: 768px) {
          .hero__inner {
            padding-left: 40px;
            padding-right: 40px;
          }
        }

        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: var(--accent-subtle, #e8f0ff);
          border: 1px solid rgba(0, 87, 255, .2);
          border-radius: var(--radius-full, 9999px);
          font-size: .75rem;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--accent, #0057ff);
          margin-bottom: 24px;
          width: fit-content;
        }

        .badge__dot {
          width: 7px;
          height: 7px;
          background: var(--accent, #0057ff);
          border-radius: 50%;
          animation: pulseDot 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: .6; }
        }

        .hero__title {
          font-size: clamp(2.5rem, 7vw, 5.5rem);
          letter-spacing: -.04em;
          line-height: 1;
          margin-bottom: 28px;
          color: var(--text, #111);
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 700;
        }

        .hero__title em {
          font-style: normal;
          color: var(--accent, #0057ff);
        }

        .hero__subtitle {
          font-size: clamp(1rem, 2vw, 1.1875rem);
          color: var(--text-secondary, #555);
          line-height: 1.7;
          max-width: 560px;
          margin-bottom: 40px;
        }

        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero__stats {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding: 28px 32px;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, rgba(0,0,0,.08));
          border-radius: var(--radius-lg, 20px);
          width: fit-content;
          box-shadow: var(--shadow, 0 4px 16px rgba(0,0,0,.08));
        }

        .stat {
          padding: 0 32px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat:first-child { padding-left: 0; }
        .stat:last-child  { padding-right: 0; }

        .stat__number {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text, #111);
          letter-spacing: -.04em;
          line-height: 1;
          display: inline;
        }

        .stat__unit {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent, #0057ff);
        }

        .stat__label {
          font-size: .8125rem;
          color: var(--text-muted, #999);
        }

        .stat__divider {
          width: 1px;
          height: 48px;
          background: var(--border, rgba(0,0,0,.08));
          flex-shrink: 0;
        }

        .hero__scroll-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: .6875rem;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--text-muted, #999);
        }

        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--text-muted, #999), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% {
            transform: scaleY(0);
            transform-origin: top;
            opacity: 1;
          }
          50% {
            transform: scaleY(1);
            transform-origin: top;
          }
          51% {
            transform-origin: bottom;
          }
          100% {
            transform: scaleY(0);
            transform-origin: bottom;
            opacity: .3;
          }
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .875rem;
          font-weight: 600;
          border-radius: var(--radius-full, 9999px);
          transition: all .25s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          white-space: nowrap;
          letter-spacing: -.01em;
          cursor: pointer;
          text-decoration: none;
          border: none;
        }

        .btn--primary {
          background: var(--accent, #0057ff);
          color: #fff;
          box-shadow: var(--shadow-accent, 0 8px 32px rgba(0,87,255,.25));
        }

        .btn--primary:hover {
          background: var(--accent-hover, #0044cc);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 87, 255, .35);
        }

        .btn--primary:active { transform: translateY(0); }

        .btn--outline {
          background: transparent;
          color: var(--text, #111);
          border: 1.5px solid var(--border-strong, rgba(0,0,0,.15));
        }

        .btn--outline:hover {
          border-color: var(--accent, #0057ff);
          color: var(--accent, #0057ff);
          background: var(--accent-subtle, #e8f0ff);
        }

        .btn--large {
          padding: 16px 32px;
          font-size: .9375rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .hero__inner {
            flex-direction: column;
            gap: 40px;
          }

          .hero__badge {
            margin: 0 auto;
          }

          .hero__scroll-hint {
            display: none;
          }

          .hero__stats {
            width: 100%;
            padding: 20px 16px;
          }

          .stat__number {
            font-size: 1.75rem;
          }

          .hero__actions {
            justify-content: center;
          }
        }
      `}</style>

      <section className="hero" id="hero">
        {/* Background grid */}
        <div className="hero__bg-grid" aria-hidden="true" />

        {/* Animated orbs */}
        <div className="hero__orb hero__orb--1" aria-hidden="true" />
        <div className="hero__orb hero__orb--2" aria-hidden="true" />

        {/* Main content */}
        <div className="hero__inner">
          {/* Hero content */}
          <div className="hero__content" data-reveal>
            {/* Animated badge */}
            <span className="hero__badge">
              <span className="badge__dot" aria-hidden="true" />
              {t('hero_badge')}
            </span>

            {/* Title with accent word */}
            <h1 className="hero__title">
              {t('hero_title_1')}<br />
              <em>{t('hero_title_accent')}</em><br />
              {t('hero_title_2')}
            </h1>

            {/* Subtitle */}
            <p className="hero__subtitle">{t('hero_subtitle')}</p>

            {/* CTA buttons */}
            <div className="hero__actions">
              <a href="#pricing" className="btn btn--primary btn--large">
                {t('hero_cta1')}
              </a>
              <a href="#servicios" className="btn btn--outline btn--large">
                {t('hero_cta2')}
              </a>
            </div>
          </div>

          {/* Stats block */}
          <div className="hero__stats" data-reveal data-delay="200">
            <div className="stat">
              <div>
                <span className="stat__number">340</span>
                <span className="stat__unit">+</span>
              </div>
              <span className="stat__label">{t('stat_pages')}</span>
            </div>

            <div className="stat__divider" aria-hidden="true" />

            <div className="stat">
              <div>
                <span className="stat__number">98</span>
                <span className="stat__unit">%</span>
              </div>
              <span className="stat__label">{t('stat_retention')}</span>
            </div>

            <div className="stat__divider" aria-hidden="true" />

            <div className="stat">
              <div>
                <span className="stat__number">4</span>
                <span className="stat__unit">x</span>
              </div>
              <span className="stat__label">{t('stat_delivery')}</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint" data-reveal data-delay="400">
          <span>{t('hero_scroll')}</span>
          <div className="scroll-line" aria-hidden="true" />
        </div>
      </section>
    </>
  );
}
