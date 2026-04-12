import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import TemplatePickerModal from '../../components/builder/TemplatePickerModal';
import { useSite, TemplateId } from '../../context/SiteContext';
import ModernTemplate from '../../components/builder/templates/ModernTemplate';
import MinimalTemplate from '../../components/builder/templates/MinimalTemplate';
import BoldTemplate from '../../components/builder/templates/BoldTemplate';

// Constantes para el renderizado local de indicadores
const SCORE_COLORS: Record<string, string> = {
  good: '#00a86b',
  needs: '#ff9900',
  poor: '#ff4d4d',
};

function TemplateMiniature({ templateId, content }: { templateId: TemplateId, content: any }) {
  const scale = 0.5;
  const components = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    bold: BoldTemplate
  };
  const Selected = components[templateId] || ModernTemplate;
  
  return (
    <div style={{ 
      width: '200%', height: '200%', transform: `scale(${scale})`, transformOrigin: 'top left',
      overflow: 'hidden', pointerEvents: 'none'
    }}>
      <Selected content={content} />
    </div>
  );
}

function DomainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  );
}

export default function WebsitePage() {
  const { siteData, loadSite, createSite, setSiteData } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [domainType, setDomainType] = useState<'own' | 'subdomain'>('subdomain');
  const [inputValue, setInputValue] = useState('');
  const [deletingsite, setDeletingSite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadSite(); }, [loadSite]);

  async function handleDeleteSite() {
    if (!siteData) return;
    if (!window.confirm(`¿Eliminar el sitio "${siteData.slug}"? Esta acción no se puede deshacer.`)) return;
    setDeletingSite(true);
    try {
      await fetch(`http://localhost:8000/websites/${siteData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('landit-token')}` }
      });
    } catch { /* silencioso */ }
    setSiteData(null);
    setDeletingSite(false);
  }

  async function handleDeleteDomain(id: number) {
    if (!window.confirm('¿Eliminar este dominio?')) return;
    try {
      const res = await fetch(`http://localhost:8000/domains/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('landit-token')}` }
      });
      if (res.ok) loadSite();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddDomain() {
    if (!inputValue || !siteData) return;
    const name = domainType === 'own' ? inputValue : `${inputValue}.landit.now`;
    
    try {
      const res = await fetch(`http://localhost:8000/websites/${siteData.id}/domains`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('landit-token')}` 
        },
        body: JSON.stringify({ name, type: domainType })
      });
      if (res.ok) {
        setInputValue('');
        setIsModalOpen(false);
        loadSite();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTemplateSelect(templateId: TemplateId, slug: string) {
    await createSite(templateId, slug);
    setIsTemplateOpen(false);
    navigate('/panel/website/editor');
  }

  if (!siteData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
        <div style={{ opacity: .35 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Aún no tienes un sitio</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 300 }}>Crea tu primera landing page profesional en segundos.</p>
        <button className="btn btn--primary" onClick={() => setIsTemplateOpen(true)}>+ Crear mi primer sitio</button>
        <TemplatePickerModal isOpen={isTemplateOpen} onClose={() => setIsTemplateOpen(false)} onSelect={handleTemplateSelect} />
      </div>
    );
  }

  const latestVitals = siteData.vitals?.[0] || { lcp: '...', fid: '...', cls: '...' };
  const getScoreLabel = (val: number) => val >= 90 ? 'good' : val >= 70 ? 'needs' : 'poor';
  const getScoreText = (val: number) => val >= 90 ? 'Bueno' : val >= 70 ? 'Mejorable' : 'Pobre';

  return (
    <>
      <style>{`
        /* ── SITE PREVIEW THUMBNAIL ── */
        .site-preview {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--bg-card);
          width: 200px;
          flex-shrink: 0;
        }
        .site-preview__toolbar {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 10px;
          background: var(--bg-alt);
          border-bottom: 1px solid var(--border);
        }
        .site-preview__dot { width: 7px; height: 7px; border-radius: 50%; }
        .site-preview__url {
          flex: 1; padding: 2px 8px;
          background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-full);
          font-size: .6rem; color: var(--text-muted); text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .site-preview__thumb {
          position: relative;
          height: 120px;
          overflow: hidden;
          background: var(--bg);
          cursor: pointer;
        }
        .site-preview__thumb-inner {
          width: 400%;
          height: 400%;
          transform: scale(0.25);
          transform-origin: top left;
          pointer-events: none;
          overflow: hidden;
        }
        .site-preview__thumb:hover::after {
          content: 'Ver completo';
          position: absolute; inset: 0;
          background: rgba(0,0,0,.4);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: .75rem; font-family: var(--font-display); font-weight: 700;
        }
        /* preview card row */
        .preview-card-row {
          display: flex; align-items: flex-start; gap: 20px;
        }

        /* ── DOMAIN LIST ── */
        .domain-item {
          display: flex; align-items: center; gap: 14px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg);
          margin-bottom: 10px;
          transition: border-color .2s;
        }
        .domain-item:hover { border-color: var(--accent); }
        .domain-icon {
          width: 36px; height: 36px;
          background: var(--accent-subtle);
          border-radius: var(--radius);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); flex-shrink: 0;
        }
        .domain-name { font-size: .9rem; font-weight: 600; color: var(--text); }
        .domain-sub  { font-size: .75rem; color: var(--text-muted); }
        .domain-actions { margin-left: auto; display: flex; gap: 8px; }

        /* ── CWV GRID ── */
        .cwv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-top: 20px;
        }
        @media (max-width: 640px) { .cwv-grid { grid-template-columns: 1fr; } }
        .cwv-item {
          padding: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          text-align: center;
        }
        .cwv-score {
          font-family: var(--font-display); font-size: 2rem;
          font-weight: 800; line-height: 1; letter-spacing: -.04em;
        }
        .cwv-label {
          font-size: .72rem; font-family: var(--font-display);
          font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
          color: var(--text-muted); margin-top: 4px;
        }
        .cwv-desc { font-size: .72rem; color: var(--text-muted); margin-top: 2px; }

        /* ── SHARED CARD STYLES ── */
        .card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 28px;
          box-shadow: var(--shadow-sm);
          transition: transform .3s var(--ease-out, cubic-bezier(0.22,1,0.36,1)), box-shadow .3s;
        }
        .card:hover { box-shadow: var(--shadow); }
        .card__header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; gap: 12px;
        }
        .card__title { font-size: 1rem; font-weight: 700; color: var(--text); }

        /* ── GRID ── */
        .website-grid {
          display: grid; grid-template-columns: 1fr; gap: 24px;
          margin-bottom: 24px;
        }
        @media (min-width: 900px) { .website-grid { grid-template-columns: 1fr 1fr; } }

        /* ── BUTTONS ── */
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          font-family: var(--font-display); font-size: .8125rem; font-weight: 600;
          border-radius: var(--radius-full);
          transition: all .25s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          white-space: nowrap; cursor: pointer; border: none; background: none;
        }
        .btn--primary { background: var(--accent); color: #fff; box-shadow: var(--shadow-accent, 0 8px 32px rgba(0,87,255,.25)); }
        .btn--primary:hover { background: var(--accent-hover, #0044cc); transform: translateY(-2px); }
        .btn--outline {
          background: transparent; color: var(--text);
          border: 1.5px solid var(--border-strong);
        }
        .btn--outline:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-subtle); }
        .btn--sm { padding: 7px 14px; font-size: .75rem; }
        .btn--danger { background: var(--danger, #ff4d4d); color: #fff; }
        .btn--danger:hover { background: #e03030; transform: translateY(-2px); }

        /* ── TOPBAR ── */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px; gap: 16px; flex-wrap: wrap;
        }
        .topbar__title {
          font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -.03em;
        }
        .topbar__actions { display: flex; align-items: center; gap: 10px; }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <h1 className="topbar__title">Mi Sitio Web</h1>
        <div className="topbar__actions">
          <button
            className="btn btn--outline btn--sm"
            onClick={() => siteData ? navigate(`/landing/${siteData.slug}`) : undefined}
            title={`Ver ${siteData.slug}.landit.now`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Ver Sitio
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={handleDeleteSite}
            disabled={deletingsite}
            title="Eliminar sitio y crear uno nuevo"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            {deletingsite ? 'Eliminando...' : 'Eliminar sitio'}
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => setIsTemplateOpen(true)}>+ Nueva Solicitud</button>
        </div>
      </div>

      {/* Top grid: Site Status + Preview */}
      <div className="website-grid">
        {/* Site Status */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Estado del Sitio</h3>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 'var(--radius-full)',
              fontSize: '.7rem', fontFamily: 'var(--font-display)', fontWeight: 700,
              letterSpacing: '.04em', textTransform: 'uppercase',
              background: 'rgba(0,168,107,.12)', color: 'var(--success)',
              border: '1px solid rgba(0,168,107,.2)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'currentColor', display: 'inline-block',
              }} />
              Activo
            </span>
          </div>

          {/* Metrics */}
          {[
            { label: 'SEO Score', value: `${siteData.seo_score}/100`, pct: siteData.seo_score, color: SCORE_COLORS[getScoreLabel(siteData.seo_score)] },
            { label: 'Velocidad de carga', value: `${siteData.speed_score}/100`, pct: siteData.speed_score, color: SCORE_COLORS[getScoreLabel(siteData.speed_score)] },
            { label: 'Accesibilidad', value: `${siteData.accessibility_score}/100`, pct: siteData.accessibility_score, color: SCORE_COLORS[getScoreLabel(siteData.accessibility_score)] },
          ].map((m) => (
            <div key={m.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ fontSize: '.8rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: m.color }}>{m.value}</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 99, transition: 'width .8s' }} />
              </div>
            </div>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>Slug del proyecto</div>
            <div style={{ fontSize: '.9rem', color: 'var(--text)' }}>{siteData.slug}</div>
          </div>
          <div>
            <div style={{ fontSize: '.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>Última actualización</div>
            <div style={{ fontSize: '.9rem', color: 'var(--text)' }}>
              {siteData.updated_at ? new Date(siteData.updated_at).toLocaleDateString() : new Date(siteData.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Site Preview */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Vista Previa</h3>
            <a
              href={`/landing/${siteData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '.75rem', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Abrir ↗
            </a>
          </div>
          <div className="preview-card-row">
            {/* Thumbnail pequeño */}
            <div className="site-preview">
              <div className="site-preview__toolbar">
                <span className="site-preview__dot" style={{ background: '#ff5f57' }} />
                <span className="site-preview__dot" style={{ background: '#febc2e' }} />
                <span className="site-preview__dot" style={{ background: '#28c840' }} />
                <span className="site-preview__url">{siteData.slug}.landit.now</span>
              </div>
              <div
                className="site-preview__thumb"
                onClick={() => navigate(`/landing/${siteData.slug}`)}
                title="Ver sitio completo"
              >
                <div className="site-preview__thumb-inner">
                  <TemplateMiniature templateId={siteData.templateId} content={siteData.content} />
                </div>
              </div>
            </div>
            {/* Info al lado */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>Plantilla</div>
              <div style={{ fontSize: '.9rem', color: 'var(--text)', marginBottom: 12, textTransform: 'capitalize' }}>{siteData.templateId}</div>
              <div style={{ fontSize: '.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>URL</div>
              <div style={{ fontSize: '.85rem', color: 'var(--accent)', wordBreak: 'break-all' }}>{siteData.slug}.landit.now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain List */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card__header">
          <h3 className="card__title">Dominios</h3>
          <button className="btn btn--primary btn--sm" onClick={() => setIsModalOpen(true)}>+ Agregar dominio</button>
        </div>
        {siteData.domains.length === 0 ? (
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            No hay dominios configurados.
          </p>
        ) : (
          siteData.domains.map((domain) => (
            <div key={domain.id} className="domain-item">
              <div className="domain-icon">
                <DomainIcon />
              </div>
              <div>
                <div className="domain-name">{domain.name}</div>
                <div className="domain-sub">{domain.type === 'subdomain' ? 'Subdominio LandIt' : 'Dominio Propio'}</div>
              </div>
              <div className="domain-actions">
                <button className="btn btn--danger btn--sm" onClick={() => handleDeleteDomain(domain.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Core Web Vitals */}
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Core Web Vitals</h3>
          <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
            Últimos 28 días
          </span>
        </div>
        <div className="cwv-grid">
          {[
            { label: 'LCP', key: 'lcp', value: latestVitals.lcp, desc: 'Largest Contentful Paint', score: getScoreLabel(siteData.speed_score) },
            { label: 'FID', key: 'fid', value: latestVitals.fid, desc: 'First Input Delay', score: 'good' },
            { label: 'CLS', key: 'cls', value: latestVitals.cls, desc: 'Cumulative Layout Shift', score: getScoreLabel(siteData.seo_score) },
          ].map((metric) => (
            <div key={metric.key} className="cwv-item">
              <div
                className="cwv-score"
                style={{ color: SCORE_COLORS[metric.score] }}
              >
                {metric.value}
              </div>
              <div className="cwv-label">{metric.label}</div>
              <div className="cwv-desc">{metric.desc}</div>
              <div style={{
                marginTop: 8, fontSize: '.68rem', fontFamily: 'var(--font-display)',
                fontWeight: 700, color: SCORE_COLORS[metric.score],
                background: `${SCORE_COLORS[metric.score]}18`,
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                display: 'inline-block',
              }}>
                {getScoreText(metric.score === 'good' ? 90 : metric.score === 'needs' ? 70 : 50)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add Domain Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configurar nuevo dominio"
        description="Elige cómo quieres que tus usuarios accedan a tu landing page."
      >
        <style>{`
          .option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
          .opt-card {
            padding: 16px; border: 2px solid var(--border); border-radius: var(--radius);
            cursor: pointer; transition: all .2s; text-align: center;
            background: var(--bg);
          }
          .opt-card--active { border-color: var(--accent); background: var(--accent-subtle); }
          .opt-title { font-size: .85rem; font-weight: 700; margin-bottom: 4px; display: block; color: var(--text); }
          .opt-desc { font-size: .7rem; color: var(--text-muted); }
          
          .input-group { margin-bottom: 24px; }
          .input-label { display: block; font-size: .75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: var(--text-secondary); }
          .text-input {
            width: 100%; padding: 12px 16px; background: var(--bg-alt); border: 1.5px solid var(--border-strong);
            border-radius: var(--radius); font-size: .9rem; outline: none; transition: border-color .2s;
            color: var(--text);
          }
          .text-input:focus { border-color: var(--accent); }
          .preview-box {
            padding: 12px; background: var(--bg-alt); border-radius: var(--radius);
            font-size: .8rem; color: var(--text-muted); margin-bottom: 24px; border: 1px dashed var(--border);
          }
        `}</style>

        <div className="option-grid">
          <div 
            className={`opt-card ${domainType === 'own' ? 'opt-card--active' : ''}`}
            onClick={() => setDomainType('own')}
          >
            <span className="opt-title">Dominio Propio</span>
            <span className="opt-desc">ej. mi-empresa.com</span>
          </div>
          <div 
            className={`opt-card ${domainType === 'subdomain' ? 'opt-card--active' : ''}`}
            onClick={() => setDomainType('subdomain')}
          >
            <span className="opt-title">Subdominio LandIt</span>
            <span className="opt-desc">mi-nombre.landit.now</span>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">
            {domainType === 'own' ? 'Tu Dominio' : 'Nombre de tu sitio'}
          </label>
          <input 
            type="text" 
            className="text-input" 
            placeholder={domainType === 'own' ? 'ejemplo.com' : 'mi-increible-landing'}
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value.toLowerCase()
                .replace(/\s+/g, '-') // Espacios a guiones
                .replace(/[^a-z0-9.-]/g, ''); // Solo letras, números, puntos y guiones
              setInputValue(val);
            }}
          />
        </div>

        <div className="preview-box">
          Tu sitio será accesible en: <br/>
          <strong style={{ color: 'var(--text)' }}>
            {domainType === 'own' 
              ? (inputValue || 'tu-dominio.com')
              : `${inputValue || 'nombre'}.landit.now`}
          </strong>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn--outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={handleAddDomain}>Confirmar</button>
        </div>
      </Modal>
      {/* Template Picker Modal */}
      <TemplatePickerModal
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </>
  );
}
