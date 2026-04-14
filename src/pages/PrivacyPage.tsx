import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

export default function PrivacyPage() {
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
          <h1>{isES ? 'Política de Privacidad' : 'Privacy Policy'}</h1>
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

          <h2>{isES ? '1. Información que recopilamos' : '1. Information We Collect'}</h2>
          <p>
            {isES
              ? 'Recopilamos información que nos proporcionás directamente al crear una cuenta o utilizar nuestros servicios:'
              : 'We collect information you provide directly when creating an account or using our services:'}
          </p>
          <ul>
            {isES ? (
              <>
                <li>Nombre completo y dirección de correo electrónico.</li>
                <li>Información de pago procesada de forma segura por Mercado Pago.</li>
                <li>Contenido y preferencias de tu sitio web.</li>
                <li>Datos de uso y navegación dentro de la plataforma.</li>
              </>
            ) : (
              <>
                <li>Full name and email address.</li>
                <li>Payment information securely processed by Mercado Pago.</li>
                <li>Content and preferences of your website.</li>
                <li>Usage and navigation data within the platform.</li>
              </>
            )}
          </ul>

          <h2>{isES ? '2. Cómo usamos tu información' : '2. How We Use Your Information'}</h2>
          <p>
            {isES
              ? 'Utilizamos la información recopilada para los siguientes propósitos:'
              : 'We use the information collected for the following purposes:'}
          </p>
          <ul>
            {isES ? (
              <>
                <li>Proveer, mantener y mejorar nuestros servicios.</li>
                <li>Procesar transacciones y enviar notificaciones relacionadas.</li>
                <li>Responder a consultas y solicitudes de soporte.</li>
                <li>Enviarte actualizaciones del producto y comunicaciones de marketing (podés darte de baja en cualquier momento).</li>
              </>
            ) : (
              <>
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related notifications.</li>
                <li>Respond to inquiries and support requests.</li>
                <li>Send you product updates and marketing communications (you can unsubscribe at any time).</li>
              </>
            )}
          </ul>

          <h2>{isES ? '3. Compartir información' : '3. Sharing Information'}</h2>
          <p>
            {isES
              ? 'No vendemos ni alquilamos tu información personal a terceros. Podemos compartir datos con proveedores de servicios que nos asisten en la operación de la plataforma (hosting, pagos, analítica), bajo acuerdos de confidencialidad.'
              : 'We do not sell or rent your personal information to third parties. We may share data with service providers that assist us in operating the platform (hosting, payments, analytics), under confidentiality agreements.'}
          </p>

          <h2>{isES ? '4. Seguridad de los datos' : '4. Data Security'}</h2>
          <p>
            {isES
              ? 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información. Las contraseñas se almacenan con hash bcrypt. Sin embargo, ningún sistema de transmisión por internet es 100% seguro.'
              : 'We implement technical and organizational security measures to protect your information. Passwords are stored with bcrypt hash. However, no internet transmission system is 100% secure.'}
          </p>

          <h2>{isES ? '5. Retención de datos' : '5. Data Retention'}</h2>
          <p>
            {isES
              ? 'Conservamos tu información mientras tu cuenta esté activa. Podés solicitar la eliminación de tu cuenta y datos asociados en cualquier momento escribiendo a '
              : 'We retain your information while your account is active. You can request the deletion of your account and associated data at any time by writing to '}
            <a href="mailto:privacy@landit.com">privacy@landit.com</a>.
          </p>

          <h2>{isES ? '6. Cookies' : '6. Cookies'}</h2>
          <p>
            {isES
              ? 'Utilizamos cookies esenciales para el funcionamiento del servicio (sesión, preferencias de tema e idioma). No utilizamos cookies de rastreo de terceros sin tu consentimiento.'
              : 'We use essential cookies for service operation (session, theme and language preferences). We do not use third-party tracking cookies without your consent.'}
          </p>

          <h2>{isES ? '7. Tus derechos' : '7. Your Rights'}</h2>
          <p>
            {isES
              ? 'Tenés derecho a acceder, corregir o eliminar tus datos personales. También podés oponerte al procesamiento de tus datos o solicitar su portabilidad. Para ejercer estos derechos, contactanos en '
              : 'You have the right to access, correct, or delete your personal data. You can also object to the processing of your data or request its portability. To exercise these rights, contact us at '}
            <a href="mailto:privacy@landit.com">privacy@landit.com</a>.
          </p>

          <h2>{isES ? '8. Cambios a esta política' : '8. Changes to This Policy'}</h2>
          <p>
            {isES
              ? 'Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso destacado en nuestra plataforma.'
              : 'We may update this Privacy Policy periodically. We will notify you about significant changes by email or through a prominent notice on our platform.'}
          </p>

          <div className="policy-content__divider" />
          <p className="policy-content__meta">
            © 2025 LandIt Design Group.{' '}
            <a href="/terms">{isES ? 'Términos de Servicio' : 'Terms of Service'}</a>
          </p>
        </div>
      </div>
    </>
  );
}
