import { useI18n } from '../../hooks/useI18n';

export default function MarqueeStrip() {
  const { t } = useI18n();

  // Marquee items from translations
  const items = [
    t('marquee_1'),
    t('marquee_2'),
    t('marquee_3'),
    t('marquee_4'),
    t('marquee_5'),
    t('marquee_6'),
  ];

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <>
      <style>{`
        /* ── Marquee Strip ── */
        .marquee-strip {
          border-top: 1px solid var(--border, rgba(0,0,0,.08));
          border-bottom: 1px solid var(--border, rgba(0,0,0,.08));
          background: var(--bg-alt, #fff);
          padding: 16px 0;
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: marquee 28s linear infinite;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .8125rem;
          font-weight: 600;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: var(--text-muted, #999);
        }

        .marquee-track span {
          padding: 0 20px;
          flex-shrink: 0;
        }

        .marquee-sep {
          color: var(--accent, #0057ff) !important;
          padding: 0 4px !important;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .marquee-strip:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-strip">
        <div className="marquee-track">
          {duplicatedItems.map((item, index) => (
            <span key={index}>
              {item}
              <span className="marquee-sep" aria-hidden="true">★</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
