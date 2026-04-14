import { useI18n } from '../../hooks/useI18n';

// ── Types ──────────────────────────────────────────────────────────────────

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  company: string;
  text: string;
  website?: string;
  stars?: number;
  avatarHue?: number;
}

// ── StarRow ────────────────────────────────────────────────────────────────

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="tcard__stars" aria-label={`${count} estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`tcard__star${i < count ? ' tcard__star--filled' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8L10 1.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

// ── TestimonialCard ────────────────────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const delays = ['0', '120', '240', '360', '480'];
  const delay = delays[index % delays.length];
  const hue = testimonial.avatarHue ?? (index * 47 + 210) % 360;

  return (
    <article
      className="tcard"
      data-reveal
      data-delay={delay}
      style={{ '--tcard-hue': hue } as React.CSSProperties}
    >
      {/* Accent bar */}
      <div className="tcard__bar" aria-hidden="true" />

      {/* Stars */}
      <StarRow count={testimonial.stars ?? 5} />

      {/* Quote */}
      <div className="tcard__quote-wrap">
        <svg className="tcard__quote-icon" viewBox="0 0 40 32" fill="none" aria-hidden="true">
          <path
            d="M0 32V19.2C0 13.6 1.6 9.06667 4.8 5.6C8 2.13333 12.5333 0.266667 18.4 0L19.2 3.2C16.2667 3.73333 13.8667 5.06667 12 7.2C10.1333 9.33333 9.2 11.7333 9.2 14.4H16V32H0ZM22.4 32V19.2C22.4 13.6 24 9.06667 27.2 5.6C30.4 2.13333 34.9333 0.266667 40.8 0L41.6 3.2C38.6667 3.73333 36.2667 5.06667 34.4 7.2C32.5333 9.33333 31.6 11.7333 31.6 14.4H38.4V32H22.4Z"
            fill="currentColor"
          />
        </svg>
        <blockquote className="tcard__text">{testimonial.text}</blockquote>
      </div>

      {/* Spacer */}
      <div className="tcard__spacer" />

      {/* Website link */}
      {testimonial.website && (
        <a
          className="tcard__link"
          href={`https://${testimonial.website}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M5.5 8c0-2.5.9-4.5 2.5-5.5M10.5 8c0 2.5-.9 4.5-2.5 5.5M2 8h12M2.5 5.5h11M2.5 10.5h11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          {testimonial.website}
        </a>
      )}

      {/* Author */}
      <div className="tcard__author">
        <div className="tcard__avatar" aria-hidden="true">
          {testimonial.initials}
        </div>
        <div className="tcard__author-info">
          <strong className="tcard__name">{testimonial.name}</strong>
          <span className="tcard__role">
            {testimonial.role}
            {testimonial.company && (
              <> · <span className="tcard__company">{testimonial.company}</span></>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}

// ── TestimonialsSection ────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const { t } = useI18n();

  const testimonials: Testimonial[] = [
    {
      initials: 'JD',
      name: t('testimonial_author'),
      role: t('testimonial_role').split(',')[0].trim(),
      company: t('testimonial_role').split(',')[1]?.trim() ?? 'Vertex Global',
      text: t('testimonial_text'),
      website: 'vertexglobal.io',
      stars: 5,
      avatarHue: 214,
    },
    {
      initials: 'SM',
      name: 'Sofía Martínez',
      role: 'CEO',
      company: 'NovaBrand Studio',
      text: 'Desde que empezamos con LandIt, nuestro tiempo de lanzamiento se redujo a la mitad. El equipo entiende exactamente lo que necesitamos y lo entrega con una calidad impecable.',
      website: 'novabrand.studio',
      stars: 5,
      avatarHue: 280,
    },
    {
      initials: 'AR',
      name: 'Alejandro Ríos',
      role: 'Head of Growth',
      company: 'Fintech Latam',
      text: 'La flexibilidad del modelo de suscripción es perfecta para nuestro ritmo de trabajo. Podemos pausar, reanudar y escalar según la demanda sin ningún tipo de fricción.',
      website: 'fintechlatam.com',
      stars: 5,
      avatarHue: 160,
    },
  ];

  return (
    <>
      <style>{`
        /* ── Testimonials Section ── */
        .testimonials {
          background: var(--bg-alt, #fff);
          padding: 120px 0;
          overflow: hidden;
        }

        .testimonials .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .testimonials .container { padding: 0 40px; }
        }

        /* ── Section header ── */
        .testimonials__header {
          text-align: center;
          margin-bottom: 72px;
        }

        .testimonials__header .section__desc {
          margin: 0 auto;
        }

        /* ── Grid ── */
        .testimonials__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }

        @media (min-width: 640px) {
          .testimonials__grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          .testimonials__grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Testimonial card ── */
        .tcard {
          --hue: var(--tcard-hue, 214);
          --card-accent: hsl(var(--hue), 100%, 54%);
          --card-accent-soft: hsl(var(--hue), 100%, 54%, .08);

          position: relative;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, rgba(0,0,0,.08));
          border-radius: var(--radius-lg, 20px);
          padding: 32px 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
          transition:
            transform .4s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
            box-shadow .4s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
            border-color .4s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
          cursor: default;
        }

        .tcard::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 60% at 50% -10%,
            var(--card-accent-soft) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity .4s ease;
          pointer-events: none;
        }

        .tcard:hover {
          transform: translateY(-8px);
          box-shadow:
            0 0 0 1.5px var(--card-accent),
            0 20px 60px rgba(0,0,0,.12),
            0 4px 16px color-mix(in srgb, var(--card-accent) 20%, transparent);
          border-color: var(--card-accent);
        }

        .tcard:hover::before { opacity: 1; }

        /* ── Accent top bar ── */
        .tcard__bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--card-accent), hsl(var(--hue), 100%, 72%));
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .4s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        .tcard:hover .tcard__bar { transform: scaleX(1); }

        /* ── Stars ── */
        .tcard__stars {
          display: flex;
          gap: 4px;
          margin-bottom: 18px;
        }

        .tcard__star {
          width: 16px;
          height: 16px;
          color: var(--border-strong, rgba(0,0,0,.14));
          transition: color .2s ease, transform .2s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
        }

        .tcard__star--filled { color: #f5a623; }

        .tcard:hover .tcard__star--filled {
          transform: scale(1.2);
        }

        .tcard:hover .tcard__star--filled:nth-child(1) { transition-delay: .00s; }
        .tcard:hover .tcard__star--filled:nth-child(2) { transition-delay: .04s; }
        .tcard:hover .tcard__star--filled:nth-child(3) { transition-delay: .08s; }
        .tcard:hover .tcard__star--filled:nth-child(4) { transition-delay: .12s; }
        .tcard:hover .tcard__star--filled:nth-child(5) { transition-delay: .16s; }

        /* ── Quote block ── */
        .tcard__quote-wrap {
          position: relative;
          margin-bottom: 20px;
        }

        .tcard__quote-icon {
          width: 28px;
          height: 22px;
          color: var(--card-accent);
          opacity: .15;
          margin-bottom: 10px;
          display: block;
          transition: opacity .3s ease;
        }

        .tcard:hover .tcard__quote-icon { opacity: .3; }

        .tcard__text {
          font-size: .9375rem;
          color: var(--text-secondary, #555);
          line-height: 1.8;
          margin: 0;
          font-style: italic;
        }

        /* ── Spacer ── */
        .tcard__spacer { flex: 1; min-height: 16px; }

        /* ── Website link ── */
        .tcard__link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: .8rem;
          font-weight: 500;
          color: var(--card-accent);
          text-decoration: none;
          background: var(--card-accent-soft);
          border: 1px solid color-mix(in srgb, var(--card-accent) 20%, transparent);
          border-radius: var(--radius-full, 9999px);
          padding: 5px 12px 5px 8px;
          margin-bottom: 20px;
          width: fit-content;
          transition:
            background .25s ease,
            border-color .25s ease,
            gap .25s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
          letter-spacing: .01em;
        }

        .tcard__link svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          opacity: .8;
        }

        .tcard__link:hover {
          background: color-mix(in srgb, var(--card-accent) 15%, transparent);
          border-color: color-mix(in srgb, var(--card-accent) 40%, transparent);
          gap: 8px;
        }

        /* ── Author row ── */
        .tcard__author {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 18px;
          border-top: 1px solid var(--border, rgba(0,0,0,.08));
          transition: border-color .3s ease;
        }

        .tcard:hover .tcard__author {
          border-color: color-mix(in srgb, var(--card-accent) 25%, transparent);
        }

        /* ── Avatar ── */
        .tcard__avatar {
          flex-shrink: 0;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            var(--card-accent),
            hsl(var(--hue), 100%, 72%)
          );
          color: #fff;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .8125rem;
          font-weight: 700;
          letter-spacing: .05em;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px color-mix(in srgb, var(--card-accent) 35%, transparent);
          transition: transform .35s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)),
                      box-shadow .35s ease;
        }

        .tcard:hover .tcard__avatar {
          transform: scale(1.08);
          box-shadow: 0 6px 18px color-mix(in srgb, var(--card-accent) 50%, transparent);
        }

        /* ── Author info ── */
        .tcard__author-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .tcard__name {
          display: block;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .9375rem;
          font-weight: 600;
          color: var(--text, #111);
        }

        .tcard__role {
          font-size: .8125rem;
          color: var(--text-muted, #999);
        }

        .tcard__company {
          color: var(--card-accent);
          font-weight: 500;
        }

        /* ── Dark theme overrides ── */
        [data-theme="dark"] .tcard {
          background: color-mix(in srgb, var(--bg-card, #1a1a1a) 95%, var(--card-accent) 5%);
        }

        [data-theme="dark"] .tcard:hover {
          box-shadow:
            0 0 0 1.5px var(--card-accent),
            0 20px 60px rgba(0,0,0,.35),
            0 4px 16px color-mix(in srgb, var(--card-accent) 25%, transparent);
        }
      `}</style>

      <section className="testimonials section" id="testimonios">
        <div className="container">
          {/* Header */}
          <div className="testimonials__header section__header" data-reveal>
            <span className="section__label">Testimonios</span>
            <h2 className="section__title">Lo que dicen nuestros clientes</h2>
            <p className="section__desc">
              Empresas de todos los tamaños confían en LandIt para escalar su presencia web.
            </p>
          </div>

          {/* Grid */}
          <div className="testimonials__grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
