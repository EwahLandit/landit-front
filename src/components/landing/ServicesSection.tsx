import { useI18n } from '../../hooks/useI18n';

interface ServiceCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  linkLabel: string;
  delay?: string;
}

function ServiceCard({ number, icon, title, desc, linkLabel, delay }: ServiceCardProps) {
  return (
    <article
      className="service-card"
      data-reveal
      {...(delay ? { 'data-delay': delay } : {})}
    >
      <div className="service-card__number">{number}</div>
      <div className="service-card__icon">{icon}</div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__desc">{desc}</p>
      <a href="#pricing" className="service-card__link">{linkLabel}</a>
      <div className="service-card__bg" aria-hidden="true" />
    </article>
  );
}

export default function ServicesSection() {
  const { t } = useI18n();

  const cards: Omit<ServiceCardProps, 'linkLabel'>[] = [
    {
      number: '01',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      title: t('s1_title'),
      desc: t('s1_desc'),
    },
    {
      number: '02',
      delay: '100',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: t('s2_title'),
      desc: t('s2_desc'),
    },
    {
      number: '03',
      delay: '200',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: t('s3_title'),
      desc: t('s3_desc'),
    },
    {
      number: '04',
      delay: '300',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="2" />
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
        </svg>
      ),
      title: t('s4_title'),
      desc: t('s4_desc'),
    },
  ];

  return (
    <>
      <style>{`
        /* ── Services Section ── */
        .services {
          background: var(--bg, #f9f9f8);
          padding: 120px 0;
        }

        .services .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .services .container {
            padding: 0 40px;
          }
        }

        .services__header {
          margin-bottom: 72px;
        }

        .services__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: var(--border, rgba(0,0,0,.08));
          border: 1px solid var(--border, rgba(0,0,0,.08));
          border-radius: var(--radius-lg, 20px);
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .services__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .services__grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .service-card {
          position: relative;
          background: var(--bg-card, #fff);
          padding: 40px 36px;
          overflow: hidden;
          transition: background .3s;
        }

        .service-card:hover {
          background: var(--bg-alt, #fff);
        }

        .service-card__bg {
          position: absolute;
          bottom: -60px;
          right: -60px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: var(--accent-subtle, #e8f0ff);
          opacity: 0;
          transform: scale(.5);
          transition: opacity .5s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      transform .5s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          pointer-events: none;
        }

        .service-card:hover .service-card__bg {
          opacity: 1;
          transform: scale(1);
        }

        .service-card__number {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .75rem;
          font-weight: 700;
          color: var(--text-muted, #999);
          letter-spacing: .1em;
          margin-bottom: 24px;
        }

        .service-card__icon {
          width: 44px;
          height: 44px;
          background: var(--accent-subtle, #e8f0ff);
          border-radius: var(--radius, 12px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent, #0057ff);
          margin-bottom: 24px;
          transition: background .3s, color .3s,
                      transform .3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
        }

        .service-card:hover .service-card__icon {
          background: var(--accent, #0057ff);
          color: #fff;
          transform: scale(1.08) rotate(-4deg);
        }

        .service-card__title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text, #111);
          font-family: var(--font-display, 'Syne', sans-serif);
        }

        .service-card__desc {
          font-size: .9rem;
          color: var(--text-secondary, #555);
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .service-card__link {
          font-size: .8125rem;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 600;
          color: var(--accent, #0057ff);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity .3s, transform .3s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          display: inline-block;
          text-decoration: none;
        }

        .service-card:hover .service-card__link {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile: add border between cards */
        @media (max-width: 639px) {
          .service-card {
            border-radius: 0;
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .service-card {
            border-radius: 0;
          }
        }
      `}</style>

      <section className="services section" id="servicios">
        <div className="container">
          {/* Section header */}
          <div className="services__header section__header" data-reveal>
            <span className="section__label">{t('services_label')}</span>
            <h2 className="section__title">{t('services_title')}</h2>
            <p className="section__desc">{t('services_desc')}</p>
          </div>

          {/* Cards grid */}
          <div className="services__grid">
            {cards.map((card) => (
              <ServiceCard
                key={card.number}
                {...card}
                linkLabel={t('s_cta')}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
