import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import ModernTemplate from '../components/builder/templates/ModernTemplate';
import MinimalTemplate from '../components/builder/templates/MinimalTemplate';
import BoldTemplate from '../components/builder/templates/BoldTemplate';

export default function PublicLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { siteData, loadSite } = useSite();

  useEffect(() => {
    if (!siteData) loadSite();
  }, []);

  if (!siteData || siteData.slug !== slug) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", gap: 16, color: '#555',
      }}>
        <div style={{ opacity: .35 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#111', letterSpacing: '-.03em' }}>
          Sitio no encontrado
        </h1>
        <p style={{ fontSize: '.9rem', maxWidth: 340, textAlign: 'center', lineHeight: 1.6 }}>
          El sitio <strong>{slug}.landit.now</strong> no existe o aún no ha sido publicado.
        </p>
        <Link
          to="/"
          style={{ marginTop: 8, padding: '10px 22px', background: '#0057ff', color: '#fff', borderRadius: '9999px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '.85rem', textDecoration: 'none' }}
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const { templateId, content } = siteData;

  return (
    <>
      {/* Barra flotante solo visible para el dueño del sitio */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)',
        color: '#fff', borderRadius: '9999px', padding: '8px 20px',
        display: 'flex', alignItems: 'center', gap: 12, zIndex: 9999,
        fontSize: '.78rem', fontFamily: "'Syne', sans-serif", fontWeight: 700,
        boxShadow: '0 8px 32px rgba(0,0,0,.3)',
      }}>
        <span style={{ opacity: .6 }}>Vista pública de:</span>
        <span style={{ color: '#60a5fa' }}>{slug}.landit.now</span>
        <Link
          to="/panel/website/editor"
          style={{ background: '#0057ff', color: '#fff', padding: '4px 14px', borderRadius: '9999px', textDecoration: 'none', fontSize: '.72rem' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar
        </Link>
      </div>

      {templateId === 'minimal' && <MinimalTemplate content={content} />}
      {templateId === 'bold' && <BoldTemplate content={content} />}
      {templateId !== 'minimal' && templateId !== 'bold' && <ModernTemplate content={content} />}
    </>
  );
}
