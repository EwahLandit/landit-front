import { useI18n } from '../../hooks/useI18n';

// Bar heights for the decorative bar chart (percentage values)
const BAR_DATA = [
  { height: '95%', accent: false },
  { height: '80%', accent: false },
  { height: '55%', accent: false },
  { height: '35%', accent: false },
  { height: '15%', accent: true },
];

// Checkmark icon shared by all feature items
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8L6 12L14 4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeaturesSection() {
  const { t } = useI18n();

  const features = [
    { key: 'f1', title: t('f1_title'), desc: t('f1_desc') },
    { key: 'f2', title: t('f2_title'), desc: t('f2_desc') },
    { key: 'f3', title: t('f3_title'), desc: t('f3_desc') },
    { key: 'f4', title: t('f4_title'), desc: t('f4_desc') },
  ];

  return (
    <>
      <style>{`
        /* ── Features Section ── */
        .features {
          background: var(--bg-alt, #fff);
          padding: 120px 0;
        }

        .features .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .features .container {
            padding: 0 40px;
          }
        }

        .features__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 80px;
          align-items: center;
        }

        @media (min-width: 900px) {
          .features__inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ── Card Stack ── */
        .features__visual {
          display: flex;
          justify-content: center;
        }

        .features__card-stack {
          position: relative;
          width: 340px;
          height: 260px;
        }

        .fcard {
          position: absolute;
          border-radius: var(--radius-lg, 20px);
          border: 1px solid var(--border, rgba(0,0,0,.08));
        }

        .fcard--back {
          inset: 0;
          transform: rotate(-4deg) translate(-8px, 12px);
          background: var(--accent-subtle, #e8f0ff);
          opacity: .6;
        }

        .fcard--mid {
          inset: 0;
          transform: rotate(-2deg) translate(-4px, 6px);
          background: var(--bg-card, #fff);
        }

        .fcard--front {
          inset: 0;
          background: var(--bg-card, #fff);
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-lg, 0 16px 48px rgba(0,0,0,.12));
        }

        .fcard__metric-value {
          display: block;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -.04em;
          color: var(--accent, #0057ff);
        }

        .fcard__metric-label {
          font-size: .8125rem;
          color: var(--text-secondary, #555);
        }

        .fcard__chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 80px;
        }

        .fcard__bar {
          flex: 1;
          background: var(--border, rgba(0,0,0,.08));
          border-radius: 4px 4px 0 0;
          transition: height .7s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        .fcard__bar--accent {
          background: var(--accent, #0057ff);
        }

        /* ── Features Content ── */
        .features__content {
          /* right column */
        }

        .features__list {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin-top: 32px;
          list-style: none;
          padding: 0;
          margin-left: 0;
        }

        .features__item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .features__item-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          background: var(--accent-subtle, #e8f0ff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent, #0057ff);
          margin-top: 2px;
          transition: background .3s,
                      transform .3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
        }

        .features__item:hover .features__item-icon {
          background: var(--accent, #0057ff);
          color: #fff;
          transform: scale(1.1);
        }

        .features__item h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
          color: var(--text, #111);
          font-family: var(--font-display, 'Syne', sans-serif);
        }

        .features__item p {
          font-size: .9rem;
          color: var(--text-secondary, #555);
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <section className="features section" id="features">
        <div className="container">
          <div className="features__inner">

            {/* Left column — decorative card stack */}
            <div data-reveal>
              <div className="features__visual">
                <div className="features__card-stack" aria-hidden="true">
                  <div className="fcard fcard--back" />
                  <div className="fcard fcard--mid" />
                  <div className="fcard fcard--front">
                    <div className="fcard__metric">
                      <span className="fcard__metric-value">-147%</span>
                      <span className="fcard__metric-label">Delivery time</span>
                    </div>
                    <div className="fcard__chart">
                      {BAR_DATA.map((bar, i) => (
                        <div
                          key={i}
                          className={`fcard__bar${bar.accent ? ' fcard__bar--accent' : ''}`}
                          style={{ height: bar.height }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — section header + feature list */}
            <div className="features__content" data-reveal data-delay="150">
              <span className="section__label">{t('features_label')}</span>
              <h2 className="section__title">{t('features_title')}</h2>

              <ul className="features__list">
                {features.map((f) => (
                  <li key={f.key} className="features__item">
                    <div className="features__item-icon">
                      <CheckIcon />
                    </div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
