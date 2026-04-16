import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetPublicSite } from '../lib/api';
import { migrateContent } from '../blocks/migrate';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SiteContentV2 } from '../blocks/types';

// Registers all block types
import '../blocks/blocks/index';

export default function PublicLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<SiteContentV2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiGetPublicSite(slug).then(result => {
      if ('error' in result) {
        setNotFound(true);
      } else {
        setContent(migrateContent(result.content));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
          <style>{'@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'}</style>
          <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
        </svg>
      </div>
    );
  }

  if (notFound || !content) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", gap: 16, color: '#555' }}>
        <div style={{ opacity: .35 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#111', letterSpacing: '-.03em' }}>
          Sitio no encontrado
        </h1>
        <p style={{ fontSize: '.9rem', maxWidth: 340, textAlign: 'center', lineHeight: 1.6 }}>
          El sitio <strong>{slug}.landit.app</strong> no existe o aún no ha sido publicado.
        </p>
        <Link to="/" style={{ marginTop: 8, padding: '10px 22px', background: '#0057ff', color: '#fff', borderRadius: '9999px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '.85rem', textDecoration: 'none' }}>
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <BlockRenderer
        blocks={content.blocks}
        theme={content.theme}
        viewport="desktop"
      />

      {/* Owner edit bar — always shown in public view as a convenience shortcut */}
      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)', color: '#fff', borderRadius: '9999px', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 9999, fontSize: '.78rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,.3)' }}>
        <span style={{ opacity: .6 }}>Vista pública:</span>
        <span style={{ color: '#60a5fa' }}>{slug}.landit.app</span>
        <Link to="/panel/website/editor" style={{ background: '#0057ff', color: '#fff', borderRadius: '9999px', padding: '4px 14px', fontSize: '.75rem', textDecoration: 'none' }}>
          Editar sitio
        </Link>
      </div>
    </>
  );
}
