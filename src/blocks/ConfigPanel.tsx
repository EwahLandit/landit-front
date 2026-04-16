import type { EditorState } from './types';
import type { EditorAction } from './editorReducer';
import { getBlock } from './registry';
import { renderControl } from './controls/renderControl';

interface ConfigPanelProps {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  websiteId: number;
}

export default function ConfigPanel({ state, dispatch, websiteId }: ConfigPanelProps) {
  const block = state.blocks.find(b => b.id === state.selectedBlockId);

  if (!block) {
    return (
      <div style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: '.85rem', fontFamily: 'var(--font-body)', textAlign: 'center', lineHeight: 1.6 }}>
        <style>{`
          .cfg-empty-icon { opacity: .3; margin-bottom: 12px; }
        `}</style>
        <svg className="cfg-empty-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
        </svg>
        <p>Selecciona un bloque para editarlo</p>
      </div>
    );
  }

  const def = getBlock(block.type);
  if (!def) {
    return (
      <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '.82rem' }}>
        Tipo de bloque «{block.type}» no reconocido.
      </div>
    );
  }

  const schema = state.viewport === 'mobile' && def.mobileSchema ? def.mobileSchema : def.schema;
  const config = state.viewport === 'mobile' && def.mobileSchema
    ? { ...block.config, ...(block.mobile_config ?? {}) }
    : block.config;

  function onChange(path: string, value: unknown) {
    if (state.viewport === 'mobile' && def?.mobileSchema) {
      dispatch({ type: 'UPDATE_BLOCK_MOBILE_CONFIG', payload: { blockId: block!.id, path, value } });
    } else {
      dispatch({ type: 'UPDATE_BLOCK_CONFIG', payload: { blockId: block!.id, path, value } });
    }
  }

  return (
    <div className="cfg-panel">
      <style>{`
        .cfg-panel { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
        .cfg-header { padding: 14px 16px 10px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
        .cfg-block-type { font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
        .cfg-block-label { font-size: .92rem; font-family: var(--font-display); font-weight: 700; color: var(--text); }
        .cfg-viewport-tabs { display: flex; gap: 4px; margin-top: 10px; }
        .cfg-vp-tab { flex: 1; padding: 6px; border: 1px solid var(--border-strong); border-radius: var(--radius); background: none; font-size: .72rem; font-family: var(--font-display); font-weight: 600; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 5px; transition: all .15s; }
        .cfg-vp-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .cfg-fields { flex: 1; overflow-y: auto; padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 20px; }
        .cfg-section { display: flex; flex-direction: column; gap: 20px; }
        .cfg-section-header { display: flex; align-items: center; gap: 10px; margin-top: 28px; }
        .cfg-section:first-child .cfg-section-header { margin-top: 0; }
        .cfg-section-label { font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
        .cfg-section-line { flex: 1; height: 1px; background: var(--border); }
        .cfg-section > * { margin-bottom: 0 !important; }
      `}</style>
      <div className="cfg-header">
        <div className="cfg-block-type">{block.type}</div>
        <div className="cfg-block-label">{def.label}</div>
        {def.mobileSchema && (
          <div className="cfg-viewport-tabs">
            <button className={`cfg-vp-tab${state.viewport === 'desktop' ? ' active' : ''}`} onClick={() => dispatch({ type: 'SET_VIEWPORT', payload: 'desktop' })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Escritorio
            </button>
            <button className={`cfg-vp-tab${state.viewport === 'mobile' ? ' active' : ''}`} onClick={() => dispatch({ type: 'SET_VIEWPORT', payload: 'mobile' })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Móvil
            </button>
          </div>
        )}
      </div>
      <div className="cfg-fields">
        {(() => {
          const sections: { name: string | null; fields: typeof schema }[] = [];
          let currentName: string | null = null;
          let currentFields: typeof schema = [];
          for (const f of schema) {
            const s = f.section ?? null;
            if (s !== currentName) {
              if (currentFields.length) sections.push({ name: currentName, fields: currentFields });
              currentName = s;
              currentFields = [f];
            } else {
              currentFields.push(f);
            }
          }
          if (currentFields.length) sections.push({ name: currentName, fields: currentFields });
          const namedSections = sections.filter(s => s.name);
          const shouldShowHeaders = schema.length > 5 && namedSections.length >= 2;
          return sections.map((sec, i) => (
            <div key={sec.name ?? `_nogroup_${i}`} className="cfg-section">
              {shouldShowHeaders && sec.name && (
                <div className="cfg-section-header">
                  <span className="cfg-section-label">{sec.name}</span>
                  <span className="cfg-section-line" />
                </div>
              )}
              {sec.fields.map(field =>
                renderControl(field, config[field.key], value => onChange(field.key, value), websiteId)
              )}
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
