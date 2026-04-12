import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

// ── FAQ data ───────────────────────────────────────────────────────────────

const FAQ_ITEMS: FAQItem[] = [
  {
    question: '¿Cómo funciona el modelo de suscripción?',
    answer:
      'Te suscribes a un plan mensual y puedes agregar tantas solicitudes de diseño como quieras. Las trabajamos una por una con entrega promedio de 2–3 días hábiles. Puedes pausar o cancelar tu suscripción en cualquier momento, sin penalizaciones ni contratos de permanencia.',
  },
  {
    question: '¿Qué tipo de solicitudes puedo hacer?',
    answer:
      'Puedes solicitar landing pages, sitios multi-página, rediseños, nuevas secciones, ajustes de UI, animaciones, integraciones de formularios, optimización SEO y mucho más. Si tienes dudas sobre si tu solicitud aplica, escríbenos y te confirmamos en menos de 24 horas.',
  },
  {
    question: '¿Cuánto tiempo tarda la entrega de un diseño?',
    answer:
      'La mayoría de las solicitudes se entregan en un promedio de 2–3 días hábiles en el plan Starter, 1–2 días en Growth y objetivo de 24 horas en Scale. Los tiempos pueden variar según la complejidad de la solicitud. Siempre te mantenemos informado del progreso.',
  },
  {
    question: '¿Puedo pausar o cancelar mi suscripción?',
    answer:
      'Sí, absolutamente. Puedes pausar tu suscripción en cualquier momento y reanudarla cuando lo necesites — solo pagas por los días activos. También puedes cancelar sin cargos adicionales. Creemos en la flexibilidad total para nuestros clientes.',
  },
  {
    question: '¿En qué tecnologías entregan los proyectos?',
    answer:
      'Entregamos en React, Webflow o HTML/CSS plano según tus necesidades. El código es limpio, bien documentado y listo para producción. También podemos integrarnos con tu stack existente — solo cuéntanos qué usas y lo adaptamos.',
  },
  {
    question: '¿Qué incluye el soporte y cómo me comunico con el equipo?',
    answer:
      'Todos los planes incluyen soporte por email. El plan Growth tiene soporte prioritario con respuesta en menos de 12 horas y una llamada estratégica mensual. El plan Scale incluye un project manager dedicado. Siempre tendrás un canal directo con el equipo que trabaja en tu proyecto.',
  },
  {
    question: '¿Puedo solicitar revisiones ilimitadas?',
    answer:
      'Sí. Trabajamos contigo hasta que estés 100% satisfecho con el resultado. Las revisiones están incluidas en todos los planes sin costo adicional. Nuestro objetivo es que cada entrega supere tus expectativas.',
  },
];

// ── FAQItem component ──────────────────────────────────────────────────────

interface FAQItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItemRow({ item, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <div
      className={`faq__item${isOpen ? ' faq__item--open' : ''}`}
    >
      <button
        className="faq__question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span>{item.question}</span>
        <span className="faq__icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div
        className="faq__answer-wrapper"
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        style={{ maxHeight: isOpen ? '600px' : '0' }}
      >
        <div className="faq__answer">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ── FAQSection ─────────────────────────────────────────────────────────────

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <style>{`
        /* ── FAQ Section ── */
        .faq {
          background: var(--bg, #f9f9f8);
          padding: 120px 0;
        }

        .faq .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .faq .container {
            padding: 0 40px;
          }
        }

        /* ── FAQ inner layout ── */
        .faq__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
          align-items: start;
        }

        @media (min-width: 900px) {
          .faq__inner {
            grid-template-columns: 1fr 2fr;
          }
        }

        /* ── FAQ header (left column) ── */
        .faq__header {
          position: sticky;
          top: calc(var(--nav-h, 68px) + 24px);
        }

        /* ── FAQ list ── */
        .faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border, rgba(0,0,0,.08));
          border-radius: var(--radius-lg, 20px);
          overflow: hidden;
        }

        /* ── FAQ item ── */
        .faq__item {
          border-bottom: 1px solid var(--border, rgba(0,0,0,.08));
          background: var(--bg-card, #fff);
          transition: background .2s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        .faq__item:last-child {
          border-bottom: none;
        }

        .faq__item--open {
          background: var(--bg-alt, #fff);
        }

        /* ── FAQ question button ── */
        .faq__question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 24px 28px;
          text-align: left;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text, #111);
          background: none;
          border: none;
          cursor: pointer;
          transition: color .2s;
        }

        .faq__question:hover {
          color: var(--accent, #0057ff);
        }

        .faq__item--open .faq__question {
          color: var(--accent, #0057ff);
        }

        /* ── FAQ chevron icon ── */
        .faq__icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-subtle, #e8f0ff);
          color: var(--accent, #0057ff);
          transition: transform .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      background .2s;
        }

        .faq__item--open .faq__icon {
          transform: rotate(180deg);
          background: var(--accent, #0057ff);
          color: #fff;
        }

        /* ── FAQ answer wrapper (height animation) ── */
        .faq__answer-wrapper {
          max-height: 0;
          overflow: hidden;
          transition: max-height .45s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        /* ── FAQ answer content ── */
        .faq__answer {
          padding: 0 28px 24px;
        }

        .faq__answer p {
          font-size: .9375rem;
          color: var(--text-secondary, #555);
          line-height: 1.75;
          margin: 0;
        }
      `}</style>

      <section className="faq section" id="faq">
        <div className="container">
          <div className="faq__inner">
            {/* Left: section header */}
            <div className="faq__header" data-reveal>
              <span className="section__label">FAQ</span>
              <h2 className="section__title">Preguntas frecuentes</h2>
              <p className="section__desc">
                Todo lo que necesitas saber sobre LandIt. ¿No encuentras tu respuesta?{' '}
                <a href="#contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  Escríbenos
                </a>
                .
              </p>
            </div>

            {/* Right: accordion list */}
            <div className="faq__list" role="list">
              {FAQ_ITEMS.map((item, index) => (
                <FAQItemRow
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
