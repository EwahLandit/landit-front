import { useI18n } from '../../hooks/useI18n';

// ── Footer ────────────────────────────────────────────────────────────────

export default function Footer() {
  const { t } = useI18n();

  const col1Links = [
    { key: 'footer_design', href: '#' },
    { key: 'footer_dev', href: '#' },
    { key: 'footer_cases', href: '#' },
    { key: 'footer_docs', href: '#' },
  ] as const;

  const col2Links = [
    { key: 'footer_about', href: '#' },
    { key: 'footer_careers', href: '#' },
    { key: 'footer_hiring', href: '#' },
    { key: 'footer_press', href: '#' },
    { key: 'footer_partners', href: '#' },
  ] as const;

  const col3Links = [
    { key: 'footer_blog', href: '#' },
    { key: 'footer_whitepapers', href: '#' },
    { key: 'footer_webinars', href: '#' },
  ] as const;

  const legalLinks = [
    { key: 'footer_privacy', href: '#' },
    { key: 'footer_terms', href: '#' },
    { key: 'footer_cookies', href: '#' },
  ] as const;

  return (
    <>
      <style>{`
        /* ── Footer ── */
        .footer {
          background: var(--bg-alt, #fff);
          border-top: 1px solid var(--border, rgba(0,0,0,.08));
          padding: 80px 0 0;
        }

        .footer .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .footer .container {
            padding: 0 40px;
          }
        }

        /* ── Main grid ── */
        .footer__main {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          padding-bottom: 64px;
        }

        @media (min-width: 768px) {
          .footer__main {
            grid-template-columns: 1.6fr 1fr 1fr 1fr;
            gap: 40px;
          }
        }

        /* ── Brand column ── */
        .footer__brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer__logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: .06em;
          color: var(--text, #111);
          text-decoration: none;
        }

        .footer__logo-mark {
          width: 34px;
          height: 34px;
          background: var(--accent, #0057ff);
          color: #fff;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 800;
          flex-shrink: 0;
          transition: transform .3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
        }

        .footer__logo:hover .footer__logo-mark {
          transform: rotate(-8deg) scale(1.05);
        }

        .footer__tagline {
          font-size: .9rem;
          color: var(--text-secondary, #555);
          line-height: 1.7;
          max-width: 280px;
        }

        /* ── Link columns ── */
        .footer__col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer__col-title {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--text, #111);
          margin-bottom: 4px;
        }

        .footer__link {
          font-size: .875rem;
          color: var(--text-secondary, #555);
          text-decoration: none;
          transition: color .2s;
          line-height: 1.5;
        }

        .footer__link:hover {
          color: var(--accent, #0057ff);
        }

        /* ── Bottom bar ── */
        .footer__bottom {
          border-top: 1px solid var(--border, rgba(0,0,0,.08));
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          text-align: center;
        }

        @media (min-width: 640px) {
          .footer__bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .footer__copy {
          font-size: .8125rem;
          color: var(--text-muted, #999);
        }

        .footer__legal {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .footer__legal {
            justify-content: flex-end;
          }
        }

        .footer__legal-link {
          font-size: .8125rem;
          color: var(--text-muted, #999);
          text-decoration: none;
          transition: color .2s;
        }

        .footer__legal-link:hover {
          color: var(--accent, #0057ff);
        }
      `}</style>

      <footer className="footer">
        <div className="container">
          <div className="footer__main">
            {/* Brand */}
            <div className="footer__brand">
              <a href="/" className="footer__logo">
                <span className="footer__logo-mark">L</span>
                LANDIT
              </a>
              <p className="footer__tagline">{t('footer_tagline')}</p>
            </div>

            {/* Column 1 — Services */}
            <div className="footer__col">
              <span className="footer__col-title">{t('footer_col1')}</span>
              {col1Links.map(({ key, href }) => (
                <a key={key} href={href} className="footer__link">
                  {t(key)}
                </a>
              ))}
            </div>

            {/* Column 2 — Company */}
            <div className="footer__col">
              <span className="footer__col-title">{t('footer_col2')}</span>
              {col2Links.map(({ key, href }) => (
                <a key={key} href={href} className="footer__link">
                  {t(key)}
                </a>
              ))}
            </div>

            {/* Column 3 — Resources */}
            <div className="footer__col">
              <span className="footer__col-title">{t('footer_col3')}</span>
              {col3Links.map(({ key, href }) => (
                <a key={key} href={href} className="footer__link">
                  {t(key)}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer__bottom">
            <span className="footer__copy">{t('footer_copy')}</span>
            <nav className="footer__legal" aria-label="Legal links">
              {legalLinks.map(({ key, href }) => (
                <a key={key} href={href} className="footer__legal-link">
                  {t(key)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
