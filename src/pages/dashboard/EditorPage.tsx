import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite, SiteContent } from '../../context/SiteContext';
import ModernTemplate from '../../components/builder/templates/ModernTemplate';
import MinimalTemplate from '../../components/builder/templates/MinimalTemplate';
import BoldTemplate from '../../components/builder/templates/BoldTemplate';

const TEMPLATE_NAMES = {
  modern: 'Modern SaaS',
  minimal: 'Portfolio Limpio',
  bold: 'Agencia Bold',
};

function TemplateRenderer({ content, templateId, hiddenSections }: {
  content: SiteContent;
  templateId: string;
  hiddenSections: string[];
}) {
  // Inject hidden sections into content so templates can read it
  const enriched = { ...content, hidden_sections: hiddenSections };
  if (templateId === 'minimal') return <MinimalTemplate content={enriched} />;
  if (templateId === 'bold') return <BoldTemplate content={enriched} />;
  return <ModernTemplate content={enriched} />;
}

function FieldInput({
  label, value, onChange, multiline = false, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const base: React.CSSProperties = {
    width: '100%', padding: '8px 12px',
    background: 'var(--bg)', border: '1.5px solid var(--border-strong)',
    borderRadius: 8, fontSize: '.82rem', outline: 'none',
    transition: 'border-color .2s', color: 'var(--text)',
    fontFamily: 'var(--font-body)', resize: 'vertical' as const,
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: '.68rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 5 }}>
        {label}
      </label>
      {multiline ? (
        <textarea rows={3} style={base} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type} style={base} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function EditorPage() {
  const { siteData, updateContent, updateFeature, saveSite, loadSite } = useSite();
  const navigate = useNavigate();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'about' | 'cta' | 'brand'>('hero');
  const [activeTab, setActiveTab] = useState<'content' | 'sections'>('sections');
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteData) {
      loadSite();
    }
  }, [siteData, loadSite]);

  const handleSave = useCallback(async () => {
    await saveSite();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [saveSite]);

  if (!siteData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>No hay ningún sitio activo.</p>
        <button onClick={() => navigate('/panel/website')} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          ← Volver a Mi Sitio Web
        </button>
      </div>
    );
  }

  const { content, templateId, slug } = siteData;

  // Secciones disponibles con su estado visible
  const BASE_SECTIONS = [
    { id: 'hero',     label: 'Hero / Portada',      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>, editId: 'hero' as const },
    { id: 'features', label: 'Características',      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, editId: 'features' as const },
    { id: 'about',    label: 'Acerca de',            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, editId: 'about' as const },
    { id: 'cta',      label: 'Llamada a la Acción',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z"/></svg>, editId: 'cta' as const },
    { id: 'footer',   label: 'Footer',               icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>, editId: 'brand' as const },
  ];

  // Respect saved order
  const savedOrder: string[] = (content as any).section_order ?? BASE_SECTIONS.map(s => s.id);
  const ALL_SECTIONS = [...BASE_SECTIONS].sort((a, b) => {
    const ai = savedOrder.indexOf(a.id);
    const bi = savedOrder.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Visibility
  const hiddenSections: string[] = (content as any).hidden_sections ?? [];
  const isSectionVisible = (id: string) => !hiddenSections.includes(id);

  const toggleSection = (id: string) => {
    const current: string[] = (content as any).hidden_sections ?? [];
    const next = current.includes(id) ? current.filter(s => s !== id) : [...current, id];
    updateContent('hidden_sections' as any, next as any);
  };

  // Double-click → jump to content tab for that section
  const handleSectionDoubleClick = (editId: 'hero' | 'features' | 'about' | 'cta' | 'brand') => {
    setActiveSection(editId);
    setActiveTab('content');
  };

  // Drag and drop
  const handleDragStart = (index: number) => { dragIndexRef.current = index; };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    const newOrder = ALL_SECTIONS.map(s => s.id);
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(index, 0, moved);
    dragIndexRef.current = index;
    updateContent('section_order' as any, newOrder as any);
  };
  const handleDragEnd = () => { dragIndexRef.current = null; };

  const EDIT_SECTIONS = [
    { id: 'brand', label: 'Marca' },
    { id: 'hero', label: 'Hero' },
    { id: 'features', label: 'Características' },
    { id: 'about', label: 'Acerca de' },
    { id: 'cta', label: 'CTA' },
  ] as const;

  return (
    <>
      <style>{`
        .editor-root {
          display: flex; height: calc(100vh - var(--nav-h, 68px));
          margin: -32px -40px;
          overflow: hidden;
        }
        @media (max-width: 768px) { .editor-root { margin: -24px -16px; } }

        /* ── ADMIN PANEL ── */
        .editor-admin {
          width: 320px; flex-shrink: 0;
          background: var(--bg-alt); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .editor-admin__header {
          padding: 16px 20px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .editor-admin__title { font-family: var(--font-display); font-weight: 800; font-size: .9rem; color: var(--text); }
        .editor-admin__badge { font-size: .65rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .04em; padding: 3px 8px; border-radius: 4px; background: var(--accent-subtle); color: var(--accent); }

        /* ── TABS ── */
        .editor-tabs { display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0; }
        .editor-tab { flex: 1; padding: 11px 8px; font-family: var(--font-display); font-size: .78rem; font-weight: 700; text-align: center; cursor: pointer; border: none; background: none; color: var(--text-muted); border-bottom: 2px solid transparent; transition: color .2s, border-color .2s; }
        .editor-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

        /* ── SECTIONS LIST ── */
        .section-list { list-style: none; padding: 0; margin: 0; }
        .section-item { display: flex; align-items: center; gap: 12px; padding: 13px 20px; border-bottom: 1px solid var(--border); transition: background .15s; }
        .section-item:last-child { border-bottom: none; }
        .section-item:hover { background: var(--bg); }
        .section-item__drag { color: var(--border-strong); cursor: grab; flex-shrink: 0; font-size: .9rem; }
        .section-item__label { flex: 1; font-size: .875rem; color: var(--text); }
        .section-item__label.hidden { color: var(--text-muted); }
        .section-item__toggle { background: none; border: none; cursor: pointer; padding: 4px; color: var(--accent); transition: color .2s, transform .2s; flex-shrink: 0; display: flex; align-items: center; }
        .section-item__toggle.hidden { color: var(--border-strong); }
        .section-item__toggle:hover { transform: scale(1.15); }
        .section-item[draggable]:active { opacity: .6; }

        .editor-admin__section-tabs { padding: 12px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
        .editor-section-select { width: 100%; padding: 10px 14px; background: var(--bg-alt); border: 1.5px solid var(--border-strong); border-radius: var(--radius); font-family: var(--font-display); font-weight: 700; font-size: .8125rem; color: var(--text); outline: none; cursor: pointer; transition: border-color .2s; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .editor-section-select:focus { border-color: var(--accent); }
        .editor-admin__fields { flex: 1; overflow-y: auto; padding: 16px 20px; }
        .editor-admin__footer { padding: 12px 20px; border-top: 1px solid var(--border); display: flex; gap: 8px; flex-shrink: 0; }
        .editor-section-title { font-family: var(--font-display); font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px; }
        .feat-item { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 12px; }
        .feat-item-head { font-family: var(--font-display); font-size: .72rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 10px; }

        /* ── PREVIEW PANEL ── */
        .editor-preview { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--border); gap: 1px; }
        .editor-preview__bar {
          background: var(--bg-alt); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; flex-shrink: 0; gap: 12px;
        }
        .editor-preview__url { font-size: .75rem; color: var(--text-muted); font-family: var(--font-display); font-weight: 600; }
        .editor-preview__url strong { color: var(--accent); }
        .vp-toggle { display: flex; gap: 4px; }
        .vp-btn { padding: 6px 10px; border-radius: 6px; border: 1.5px solid var(--border-strong); cursor: pointer; font-size: .75rem; font-family: var(--font-display); font-weight: 700; transition: all .2s; background: transparent; color: var(--text-muted); }
        .vp-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .editor-preview__frame { flex: 1; overflow: auto; display: flex; justify-content: center; padding: 16px; }
        .editor-preview__inner { background: #fff; overflow: auto; transition: width .3s, border-radius .3s; transform-origin: top center; }
        .editor-preview__inner--desktop { width: 100%; max-width: 1200px; border-radius: 8px; }
        .editor-preview__inner--mobile { width: 390px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,.25); }
        
        /* Btns in editor */
        .ed-btn { padding: 8px 16px; border-radius: var(--radius-full); font-family: var(--font-display); font-weight: 700; font-size: .78rem; cursor: pointer; border: none; transition: all .2s; }
        .ed-btn--primary { background: var(--accent); color: #fff; }
        .ed-btn--primary:hover { background: var(--accent-hover); }
        .ed-btn--success { background: var(--success); color: #fff; }
        .ed-btn--outline { background: transparent; border: 1.5px solid var(--border-strong); color: var(--text); }
        .ed-btn--outline:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>

      <div className="editor-root">
        {/* ── ADMIN PANEL ── */}
        <aside className="editor-admin">
          <div className="editor-admin__header">
            <div>
              <div className="editor-admin__title">Panel de Edición</div>
            </div>
            <span className="editor-admin__badge">{TEMPLATE_NAMES[templateId]}</span>
          </div>

          {/* Tabs: Secciones / Contenido */}
          <div className="editor-tabs">
            <button className={`editor-tab${activeTab === 'sections' ? ' active' : ''}`} onClick={() => setActiveTab('sections')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>Secciones
            </button>
            <button className={`editor-tab${activeTab === 'content' ? ' active' : ''}`} onClick={() => setActiveTab('content')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Contenido
            </button>
          </div>

          {/* TAB: SECCIONES */}
          {activeTab === 'sections' && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '12px 20px 8px', fontSize: '.68rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Página de inicio
              </div>
              <ul className="section-list">
                {ALL_SECTIONS.map((sec, index) => {
                  const visible = isSectionVisible(sec.id);
                  return (
                    <li
                      key={sec.id}
                      className="section-item"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onDoubleClick={() => handleSectionDoubleClick(sec.editId)}
                      title="Doble clic para editar contenido"
                      style={{ cursor: 'grab' }}
                    >
                      <span className="section-item__drag" style={{ userSelect: 'none', display:'flex', alignItems:'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
                      </span>
                      <span className={`section-item__label${visible ? '' : ' hidden'}`}>
                        {sec.icon} {sec.label}
                      </span>
                      <button
                        className={`section-item__toggle${visible ? '' : ' hidden'}`}
                        onClick={(e) => { e.stopPropagation(); toggleSection(sec.id); }}
                        title={visible ? 'Ocultar sección' : 'Mostrar sección'}
                        aria-label={visible ? 'Ocultar' : 'Mostrar'}
                      >
                        {visible ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div style={{ padding: '10px 20px', fontSize: '.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5,opacity:.6}} aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Arrastra para reordenar · Doble clic para editar
              </div>
            </div>
          )}

          {/* TAB: CONTENIDO */}
          {activeTab === 'content' && (
            <>
              <div className="editor-admin__section-tabs">
                <select
                  className="editor-section-select"
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value as any)}
                >
                  {EDIT_SECTIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="editor-admin__fields">
            {/* BRAND */}
            {activeSection === 'brand' && (
              <>
                <p className="editor-section-title">Identidad de Marca</p>
                <FieldInput label="Nombre de la Marca" value={content.brand_name} onChange={v => updateContent('brand_name', v)} />
                <FieldInput label="Tagline / Lema" value={content.brand_tagline} onChange={v => updateContent('brand_tagline', v)} />
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '.68rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 5 }}>
                    Color de Acento
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={content.accent_color}
                      onChange={e => updateContent('accent_color', e.target.value)}
                      style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }}
                    />
                    <input
                      type="text"
                      value={content.accent_color}
                      onChange={e => updateContent('accent_color', e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', background: 'var(--bg)', border: '1.5px solid var(--border-strong)', borderRadius: 8, fontSize: '.82rem', outline: 'none', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                </div>
                <FieldInput label="Texto del Footer" value={content.footer_text} onChange={v => updateContent('footer_text', v)} />
              </>
            )}

            {/* HERO */}
            {activeSection === 'hero' && (
              <>
                <p className="editor-section-title">Sección Hero</p>
                <FieldInput label="Título Principal" value={content.hero_title} onChange={v => updateContent('hero_title', v)} multiline />
                <FieldInput label="Subtítulo" value={content.hero_subtitle} onChange={v => updateContent('hero_subtitle', v)} multiline />
                <FieldInput label="Botón Principal (CTA)" value={content.hero_cta} onChange={v => updateContent('hero_cta', v)} />
                <FieldInput label="Botón Secundario" value={content.hero_secondary_cta} onChange={v => updateContent('hero_secondary_cta', v)} />
              </>
            )}

            {/* FEATURES */}
            {activeSection === 'features' && (
              <>
                <p className="editor-section-title">Características</p>
                <FieldInput label="Título de la Sección" value={content.features_title} onChange={v => updateContent('features_title', v)} />
                {content.features.map((feat, i) => (
                  <div key={i} className="feat-item">
                    <div className="feat-item-head">Característica {i + 1}</div>
                    <FieldInput label="Emoji / Icono" value={feat.icon} onChange={v => updateFeature(i, 'icon', v)} />
                    <FieldInput label="Título" value={feat.title} onChange={v => updateFeature(i, 'title', v)} />
                    <FieldInput label="Descripción" value={feat.description} onChange={v => updateFeature(i, 'description', v)} multiline />
                  </div>
                ))}
              </>
            )}

            {/* ABOUT */}
            {activeSection === 'about' && (
              <>
                <p className="editor-section-title">Acerca de / Nosotros</p>
                <FieldInput label="Título" value={content.about_title} onChange={v => updateContent('about_title', v)} />
                <FieldInput label="Texto" value={content.about_text} onChange={v => updateContent('about_text', v)} multiline />
              </>
            )}

            {/* CTA */}
            {activeSection === 'cta' && (
              <>
                <p className="editor-section-title">Sección de Llamada a Acción</p>
                <FieldInput label="Título" value={content.cta_section_title} onChange={v => updateContent('cta_section_title', v)} />
                <FieldInput label="Texto" value={content.cta_section_text} onChange={v => updateContent('cta_section_text', v)} multiline />
                <FieldInput label="Texto del Botón" value={content.cta_section_btn} onChange={v => updateContent('cta_section_btn', v)} />
              </>
            )}
          </div>
            </>
          )}

          <div className="editor-admin__footer">
            <button className="ed-btn ed-btn--outline" onClick={() => navigate('/panel/website')}>← Salir</button>
            <button
              className={`ed-btn ${saved ? 'ed-btn--success' : 'ed-btn--primary'}`}
              onClick={handleSave}
              style={{ flex: 1 }}
            >
              {saved ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Guardado</> : 'Guardar Cambios'}
            </button>
          </div>
        </aside>

        {/* ── PREVIEW PANEL ── */}
        <div className="editor-preview">
          <div className="editor-preview__bar">
            <span className="editor-preview__url">
              Vista previa: <strong>{slug}.landit.now</strong>
            </span>
            <div className="vp-toggle">
              <button className={`vp-btn ${viewport === 'desktop' ? 'active' : ''}`} onClick={() => setViewport('desktop')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>Desktop
              </button>
              <button className={`vp-btn ${viewport === 'mobile' ? 'active' : ''}`} onClick={() => setViewport('mobile')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>Mobile
              </button>
            </div>
          </div>
          <div className="editor-preview__frame">
            <div className={`editor-preview__inner editor-preview__inner--${viewport}`}>
              <TemplateRenderer content={content} templateId={templateId} hiddenSections={hiddenSections} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
