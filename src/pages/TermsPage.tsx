import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

export default function TermsPage() {
  const { lang } = useI18n();
  const { theme, toggle } = useTheme();
  const isES = lang === 'es';

  return (
    <>
      <style>{`
        .policy-page {
          min-height: 100dvh;
          background: var(--bg, #f9f9f8);
          color: var(--text, #111);
          font-family: var(--font-body, 'DM Sans', sans-serif);
        }

        .policy-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          background: rgba(249,249,248,.9);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border, rgba(0,0,0,.08));
        }

        [data-theme="dark"] .policy-nav {
          background: rgba(10,10,10,.9);
        }

        .policy-nav__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: .06em;
          color: var(--text);
          text-decoration: none;
        }

        .policy-nav__logo-mark {
          width: 32px;
          height: 32px;
          background: var(--accent, #0057ff);
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .95rem;
          font-weight: 800;
        }

        .policy-nav__right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .policy-nav__back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 9999px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .8rem;
          font-weight: 600;
          color: var(--text-secondary, #555);
          background: transparent;
          border: 1.5px solid var(--border-strong, rgba(0,0,0,.14));
          cursor: pointer;
          text-decoration: none;
          transition: color .2s, border-color .2s, background .2s;
        }

        .policy-nav__back:hover {
          color: var(--accent, #0057ff);
          border-color: var(--accent, #0057ff);
          background: var(--accent-subtle, #e8f0ff);
        }

        .policy-theme-btn {
          padding: 7px;
          border-radius: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary, #555);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s, color .2s;
        }

        .policy-theme-btn:hover {
          background: var(--border);
          color: var(--text);
        }

        .policy-content {
          max-width: 760px;
          margin: 0 auto;
          padding: 64px 24px 120px;
        }

        .policy-content__badge {
          display: inline-block;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--accent, #0057ff);
          background: var(--accent-subtle, #e8f0ff);
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 20px;
        }

        .policy-content h1 {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -.03em;
          color: var(--text, #111);
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .policy-content__meta {
          font-size: .85rem;
          color: var(--text-muted, #999);
          margin-bottom: 48px;
          font-family: var(--font-display, 'Syne', sans-serif);
        }

        .policy-content__divider {
          height: 1px;
          background: var(--border, rgba(0,0,0,.08));
          margin: 40px 0;
        }

        .policy-content h2 {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text, #111);
          margin-bottom: 12px;
          margin-top: 40px;
        }

        .policy-content p {
          font-size: .95rem;
          color: var(--text-secondary, #555);
          line-height: 1.75;
          margin-bottom: 16px;
        }

        .policy-content ul {
          padding-left: 20px;
          margin-bottom: 16px;
        }

        .policy-content ul li {
          font-size: .95rem;
          color: var(--text-secondary, #555);
          line-height: 1.75;
          margin-bottom: 6px;
        }

        .policy-content a {
          color: var(--accent, #0057ff);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .policy-content a:hover {
          opacity: .75;
        }

        .policy-placeholder-note {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(245,158,11,.08);
          border: 1px solid rgba(245,158,11,.2);
          color: #b45309;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: .82rem;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-weight: 600;
          margin-bottom: 40px;
        }

        [data-theme="dark"] .policy-placeholder-note {
          background: rgba(245,158,11,.06);
          color: #fbbf24;
        }

        @media (max-width: 600px) {
          .policy-nav { padding: 0 20px; }
          .policy-content { padding: 40px 20px 80px; }
        }
      `}</style>

      <div className="policy-page">
        {/* Nav */}
        <nav className="policy-nav">
          <a href="/" className="policy-nav__logo">
            <span className="policy-nav__logo-mark">L</span>
            LANDIT
          </a>
          <div className="policy-nav__right">
            <button className="policy-theme-btn" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <a href="/" className="policy-nav__back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M19 12H5m6-6-6 6 6 6"/>
              </svg>
              {isES ? 'Volver' : 'Back'}
            </a>
          </div>
        </nav>

        {/* Content */}
        <div className="policy-content">
          <span className="policy-content__badge">
            {isES ? 'Legal' : 'Legal'}
          </span>
          <h1>{isES ? 'Términos de Servicio' : 'Terms of Service'}</h1>
          <p className="policy-content__meta">
            {isES
              ? 'Última actualización: abril de 2025'
              : 'Last updated: April 2025'}
          </p>

          <div className="policy-placeholder-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {isES
              ? 'Este documento es un borrador provisional. El texto final será revisado por asesoría legal antes del lanzamiento oficial.'
              : 'This document is a provisional draft. The final text will be reviewed by legal counsel before official launch.'}
          </div>

          <div className="policy-content__divider" />

          <h2>{isES ? '1. Aceptación de los términos' : '1. Acceptance of Terms'}</h2>
          <p>
            {isES
              ? 'Al acceder o utilizar los servicios de LandIt ("Servicio"), aceptás quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podés acceder al Servicio.'
              : 'By accessing or using LandIt\'s services ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.'}
          </p>

          <h2>{isES ? '2. Descripción del servicio' : '2. Description of Service'}</h2>
          <p>
            {isES
              ? 'LandIt es una plataforma de suscripción que ofrece diseño y desarrollo de páginas web profesionales bajo diferentes planes. El servicio incluye diseño, desarrollo, hosting y soporte según el plan contratado.'
              : 'LandIt is a subscription platform that provides professional web page design and development under different plans. The service includes design, development, hosting, and support according to the contracted plan.'}
          </p>

          <h2>{isES ? '3. Suscripciones y pagos' : '3. Subscriptions and Payments'}</h2>
          <p>
            {isES
              ? 'Los planes son facturados de forma mensual o anual según la elección del usuario. Al suscribirte, autorizás el cargo recurrente según el plan elegido. Podés cancelar en cualquier momento desde tu panel de control.'
              : 'Plans are billed monthly or annually according to user choice. By subscribing, you authorize recurring charges according to the chosen plan. You can cancel at any time from your control panel.'}
          </p>
          <ul>
            {isES ? (
              <>
                <li>Los precios pueden cambiar con previo aviso de 30 días.</li>
                <li>No se realizan reembolsos por períodos parciales.</li>
                <li>Los planes anuales tienen un descuento del 20% respecto al precio mensual.</li>
              </>
            ) : (
              <>
                <li>Prices may change with 30 days prior notice.</li>
                <li>No refunds are issued for partial periods.</li>
                <li>Annual plans have a 20% discount compared to the monthly price.</li>
              </>
            )}
          </ul>

          <h2>{isES ? '4. Uso aceptable' : '4. Acceptable Use'}</h2>
          <p>
            {isES
              ? 'No podés utilizar el Servicio para publicar contenido ilegal, difamatorio, fraudulento o que viole derechos de terceros. LandIt se reserva el derecho de suspender cuentas que violen estas condiciones sin previo aviso.'
              : 'You may not use the Service to publish illegal, defamatory, fraudulent content, or content that violates third-party rights. LandIt reserves the right to suspend accounts that violate these conditions without prior notice.'}
          </p>

          <h2>{isES ? '5. Propiedad intelectual' : '5. Intellectual Property'}</h2>
          <p>
            {isES
              ? 'El contenido, diseños y código entregados como parte del servicio son propiedad del cliente una vez completado el pago. LandIt retiene el derecho a mostrar el trabajo como portfolio a menos que se indique lo contrario.'
              : 'Content, designs, and code delivered as part of the service are the client\'s property once payment is completed. LandIt retains the right to display work as portfolio unless otherwise indicated.'}
          </p>

          <h2>{isES ? '6. Limitación de responsabilidad' : '6. Limitation of Liability'}</h2>
          <p>
            {isES
              ? 'LandIt no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso o la imposibilidad de uso del Servicio. Nuestra responsabilidad máxima está limitada al monto pagado en los últimos 3 meses.'
              : 'LandIt shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use the Service. Our maximum liability is limited to the amount paid in the last 3 months.'}
          </p>

          <h2>{isES ? '7. Modificaciones' : '7. Modifications'}</h2>
          <p>
            {isES
              ? 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos cambios significativos por correo electrónico o a través del panel de control. El uso continuado del servicio implica la aceptación de los nuevos términos.'
              : 'We reserve the right to modify these terms at any time. We will notify significant changes by email or through the control panel. Continued use of the service implies acceptance of the new terms.'}
          </p>

          <h2>{isES ? '8. Contacto' : '8. Contact'}</h2>
          <p>
            {isES
              ? 'Para consultas sobre estos términos, escribinos a '
              : 'For inquiries about these terms, write to us at '}
            <a href="mailto:legal@landit.com">legal@landit.com</a>
            {isES ? '.' : '.'}
          </p>

          <div className="policy-content__divider" />
          <p className="policy-content__meta">
            © 2025 LandIt Design Group.{' '}
            <a href="/privacy">{isES ? 'Política de Privacidad' : 'Privacy Policy'}</a>
          </p>
        </div>
      </div>
    </>
  );
}
