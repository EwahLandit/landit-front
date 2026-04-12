import { useI18n } from '../../hooks/useI18n';

// ── Types ──────────────────────────────────────────────────────────────────

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  company: string;
  text: string;
}

// ── TestimonialCard ────────────────────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const delays = ['100', '200', '300', '400'];
  const delay = delays[index % delays.length];

  return (
    <article
      className="tcard"
      data-reveal
      data-delay={delay}
    >
      <div className="tcard__quote-mark" aria-hidden="true">"</div>
      <blockquote className="tcard__text">{testimonial.text}</blockquote>
      <div className="tcard__author">
        <div className="tcard__avatar" aria-hidden="true">
          {testimonial.initials}
        </div>
        <div className="tcard__author-info">
          <strong className="tcard__name">{testimonial.name}</strong>
          <span className="tcard__role">
            {testimonial.role}, {testimonial.company}
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
    },
    {
      initials: 'SM',
      name: 'Sofía Martínez',
      role: 'CEO',
      company: 'NovaBrand Studio',
      text: 'Desde que empezamos con LandIt, nuestro tiempo de lanzamiento se redujo a la mitad. El equipo entiende exactamente lo que necesitamos y lo entrega con una calidad impecable.',
    },
    {
      initials: 'AR',
      name: 'Alejandro Ríos',
      role: 'Head of Growth',
      company: 'Fintech Latam',
      text: 'La flexibilidad del modelo de suscripción es perfecta para nuestro ritmo de trabajo. Podemos pausar, reanudar y escalar según la demanda sin ningún tipo de fricción.',
    },
  ];

  return (
    <>
      <style>{`
        /* ── Testimonials Section ── */
        .testimonials {
          background: var(--bg-alt, #fff);
          padding: 120px 0;
        }

        .testimonials .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .testimonials .container {
            padding: 0 40px;
          }
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
          gap: 24px;
        }

        @media (min-width: 640px) {
          .testimonials__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .testimonials__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ── Testimonial card ── */
        .tcard {
          position: relative;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, rgba(0,0,0,.08));
          border-radius: var(--radius-lg, 20px);
          padding: 40px 36px 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          transition: transform .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      box-shadow .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.07));
        }

        .tcard:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg, 0 16px 48px rgba(0,0,0,.12));
        }

        /* ── Quote mark ── */
        .tcard__quote-mark {
          position: absolute;
          top: 20px;
          left: 32px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 5rem;
          font-weight: 800;
          line-height: 1;
          color: var(--accent, #0057ff);
          opacity: .12;
          pointer-events: none;
          user-select: none;
        }

        /* ── Quote text ── */
        .tcard__text {
          font-size: .9375rem;
          font-style: italic;
          color: var(--text-secondary, #555);
          line-height: 1.75;
          margin: 0;
          flex: 1;
        }

        /* ── Author row ── */
        .tcard__author {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 20px;
          border-top: 1px solid var(--border, rgba(0,0,0,.08));
        }

        /* ── Avatar ── */
        .tcard__avatar {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--accent, #0057ff);
          color: #fff;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .8125rem;
          font-weight: 700;
          letter-spacing: .04em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Author info ── */
        .tcard__author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
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
