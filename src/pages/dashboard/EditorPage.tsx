import { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { editorReducer, INITIAL_STATE } from '../../blocks/editorReducer';
import { migrateContent } from '../../blocks/migrate';
import BlockList from '../../blocks/BlockList';
import ConfigPanel from '../../blocks/ConfigPanel';
import BlockLibrary from '../../blocks/BlockLibrary';
import BlockRenderer from '../../blocks/BlockRenderer';
import { apiSaveBlocks } from '../../lib/api';
import type { SiteContentV2 } from '../../lib/api';

// Registers all block types (side-effect imports)
import '../../blocks/blocks/index';

type AdminTab = 'blocks' | 'config';

export default function EditorPage() {
  const { siteData, loadSite } = useSite();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(editorReducer, INITIAL_STATE);
  const [adminTab, setAdminTab] = useState<AdminTab>('blocks');
  const [savedMsg, setSavedMsg] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!siteData) loadSite();
  }, [siteData, loadSite]);

  useEffect(() => {
    if (siteData && !initializedRef.current) {
      initializedRef.current = true;
      const v2 = migrateContent(siteData.content);
      dispatch({ type: 'LOAD', payload: { site: v2.site, theme: v2.theme, blocks: v2.blocks } });
    }
  }, [siteData]);

  function handleSelectBlock(blockId: string) {
    dispatch({ type: 'SELECT', payload: { blockId } });
    setAdminTab('config');
  }

  async function handleSave() {
    if (!siteData) return;
    const content: SiteContentV2 = {
      schema_version: 2,
      site: state.site as Record<string, unknown>,
      theme: state.theme as Record<string, unknown>,
      blocks: state.blocks as unknown[],
    };
    const result = await apiSaveBlocks(siteData.id, content);
    if ('error' in result) {
      alert(`Error al guardar: ${result.error}`);
      return;
    }
    dispatch({ type: 'MARK_SAVED' });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  if (!siteData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>No hay ningún sitio activo.</p>
        <button
          onClick={() => navigate('/panel/website')}
          style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700 }}
        >
          ← Volver a Mi Sitio Web
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .editor-root {
          display: flex;
          height: calc(100vh - var(--nav-h, 68px));
          margin: -32px -40px;
          overflow: hidden;
          background: var(--bg);
        }
        @media (max-width: 768px) { .editor-root { margin: -24px -16px; } }

        /* ── ADMIN PANEL ── */
        .editor-admin {
          width: 360px;
          flex-shrink: 0;
          background: var(--bg-alt);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-header {
          padding: 14px 16px 0;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .admin-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
        }
        .admin-header-left {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
        }
        .admin-dirty-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50% { opacity: .4; }
        }
        .admin-site-slug {
          font-size: .78rem;
          font-family: var(--font-body);
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .admin-save-btn {
          padding: 7px 16px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-full);
          font-size: .78rem;
          font-family: var(--font-display);
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
          transition: background .15s, opacity .15s;
          white-space: nowrap;
        }
        .admin-save-btn:disabled { opacity: .4; cursor: default; }
        .admin-save-btn.saved { background: var(--success, #00a86b); }
        .admin-tabs {
          display: flex;
          gap: 0;
        }
        .admin-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 8px;
          font-size: .78rem;
          font-family: var(--font-display);
          font-weight: 700;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          color: var(--text-muted);
          transition: color .15s, border-color .15s;
        }
        .admin-tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .admin-panel-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── PREVIEW PANEL ── */
        .editor-preview {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg);
        }
        .preview-toolbar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 10px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-alt);
          flex-shrink: 0;
        }
        .preview-vp-tabs {
          display: flex;
          gap: 2px;
          background: var(--bg);
          border-radius: var(--radius-full);
          padding: 3px;
          border: 1px solid var(--border);
        }
        .preview-vp-btn {
          width: 32px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: var(--radius-full);
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .preview-vp-btn.active {
          background: var(--accent);
          color: #fff;
        }
        .preview-slug-badge {
          font-size: .72rem;
          font-family: var(--font-body);
          color: var(--text-muted);
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 3px 10px;
        }
        .preview-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px;
          box-sizing: border-box;
        }
        .preview-frame {
          width: 100%;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.06);
          min-height: 400px;
          transition: max-width .3s var(--ease-out), border-radius .3s var(--ease-out), box-shadow .3s var(--ease-out);
        }
        .preview-frame.mobile {
          max-width: 390px;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,.14);
        }
        .preview-frame.desktop {
          max-width: 100%;
        }
        .preview-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: .88rem;
          text-align: center;
          gap: 6px;
        }
        .preview-empty p { margin: 0; line-height: 1.6; }
      `}</style>

      <div className="editor-root">
        {/* ── LEFT ADMIN PANEL ── */}
        <div className="editor-admin">
          <div className="admin-header">
            <div className="admin-header-top">
              <div className="admin-header-left">
                {state.dirty && <span className="admin-dirty-dot" title="Cambios sin guardar" />}
                <span className="admin-site-slug">{siteData.slug}</span>
              </div>
              <button
                className={`admin-save-btn${savedMsg ? ' saved' : ''}`}
                onClick={handleSave}
                disabled={!state.dirty}
              >
                {savedMsg ? '✓ Guardado' : 'Guardar'}
              </button>
            </div>
            <div className="admin-tabs">
              <button
                className={`admin-tab${adminTab === 'blocks' ? ' active' : ''}`}
                onClick={() => setAdminTab('blocks')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                Bloques
              </button>
              <button
                className={`admin-tab${adminTab === 'config' ? ' active' : ''}`}
                onClick={() => setAdminTab('config')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
                Configurar
              </button>
            </div>
          </div>

          <div className="admin-panel-body">
            {adminTab === 'blocks' && (
              <BlockList
                state={state}
                dispatch={dispatch}
                onAddBlock={() => dispatch({ type: 'SET_LIBRARY_OPEN', payload: true })}
                onSelectBlock={handleSelectBlock}
                hoveredBlockId={hoveredBlockId}
              />
            )}
            {adminTab === 'config' && (
              <ConfigPanel
                state={state}
                dispatch={dispatch}
                websiteId={siteData.id}
              />
            )}
          </div>
        </div>

        {/* ── RIGHT PREVIEW PANEL ── */}
        <div className="editor-preview">
          <div className="preview-toolbar">
            <div className="preview-vp-tabs">
              <button
                className={`preview-vp-btn${state.viewport === 'desktop' ? ' active' : ''}`}
                title="Vista escritorio"
                onClick={() => dispatch({ type: 'SET_VIEWPORT', payload: 'desktop' })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </button>
              <button
                className={`preview-vp-btn${state.viewport === 'mobile' ? ' active' : ''}`}
                title="Vista móvil"
                onClick={() => dispatch({ type: 'SET_VIEWPORT', payload: 'mobile' })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </button>
            </div>
            <span className="preview-slug-badge">{siteData.slug}.landit.app</span>
          </div>

          <div className="preview-area">
            <div className={`preview-frame ${state.viewport}`}>
              {state.blocks.length === 0 ? (
                <div className="preview-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .2, marginBottom: 8 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  <p>Tu página está vacía</p>
                  <p style={{ opacity: .6, fontSize: '.8rem' }}>Agrega bloques desde el panel izquierdo</p>
                </div>
              ) : (
                <BlockRenderer
                  blocks={state.blocks}
                  theme={state.theme}
                  viewport={state.viewport}
                  editorMode
                  hoveredBlockId={hoveredBlockId}
                  onHoverBlock={setHoveredBlockId}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── BLOCK LIBRARY OVERLAY ── */}
        {state.libraryOpen && (
          <BlockLibrary
            dispatch={dispatch}
            onClose={() => dispatch({ type: 'SET_LIBRARY_OPEN', payload: false })}
          />
        )}
      </div>
    </>
  );
}
