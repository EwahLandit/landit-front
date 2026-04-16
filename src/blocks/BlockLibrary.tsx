import { useState } from 'react';
import type { EditorAction } from './editorReducer';
import { getAllBlocks } from './registry';
import type { BlockCategory, BlockDefinition } from './types';

interface BlockLibraryProps {
  dispatch: React.Dispatch<EditorAction>;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  layout: 'Estructura',
  content: 'Contenido',
  media: 'Multimedia',
  commerce: 'Comercio',
  social: 'Prueba social',
  form: 'Formularios',
  utility: 'Utilidades',
};

const CATEGORY_ORDER: BlockCategory[] = ['layout', 'content', 'media', 'social', 'commerce', 'form', 'utility'];

function makeId(): string {
  return `blk_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;
}

export default function BlockLibrary({ dispatch, onClose }: BlockLibraryProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlockCategory | 'all'>('all');

  const allBlocks = getAllBlocks();

  const filtered = allBlocks.filter(def => {
    const matchesSearch = !search || def.label.toLowerCase().includes(search.toLowerCase()) || def.description.toLowerCase().includes(search.toLowerCase()) || def.type.includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || def.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const grouped = CATEGORY_ORDER.reduce<Record<string, BlockDefinition[]>>((acc, cat) => {
    const items = filtered.filter(d => d.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  function addBlock(def: BlockDefinition) {
    dispatch({
      type: 'ADD_BLOCK',
      payload: {
        id: makeId(),
        type: def.type,
        visible: true,
        config: JSON.parse(JSON.stringify(def.defaultConfig)),
        mobile_config: def.defaultMobileConfig ? JSON.parse(JSON.stringify(def.defaultMobileConfig)) : undefined,
      },
    });
    onClose();
  }

  return (
    <div className="lib-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <style>{`
        .lib-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1000; display: flex; align-items: stretch; animation: lib-overlay-fade .2s var(--ease-out); }
        @keyframes lib-overlay-fade { from { opacity: 0; } to { opacity: 1; } }
        .lib-panel { width: 420px; background: var(--bg-card); border: 1px solid var(--border); border-left: none; display: flex; flex-direction: column; overflow: hidden; border-radius: 0 var(--radius-lg) var(--radius-lg) 0; box-shadow: var(--shadow-lg); animation: lib-slide-in .2s var(--ease-out); }
        @keyframes lib-slide-in { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .lib-header { padding: 20px 20px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; background: var(--bg-alt); }
        .lib-title { font-size: 1rem; font-family: var(--font-display); font-weight: 700; color: var(--text); flex: 1; }
        .lib-close { background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px; border-radius: var(--radius); display: flex; align-items: center; transition: background .12s, color .12s; }
        .lib-close:hover { background: var(--border); color: var(--text); }
        .lib-search-wrap { padding: 12px 20px; border-bottom: 1px solid var(--border); background: var(--bg-alt); }
        .lib-search { width: 100%; padding: 9px 14px; border: 1.5px solid var(--border-strong); border-radius: var(--radius-full); font-size: .85rem; font-family: var(--font-body); color: var(--text); background: var(--bg); outline: none; box-sizing: border-box; transition: border-color .15s; }
        .lib-search:focus { border-color: var(--accent); }
        .lib-cats { display: flex; gap: 6px; padding: 10px 20px; overflow-x: auto; border-bottom: 1px solid var(--border); background: var(--bg-alt); scrollbar-width: none; }
        .lib-cats::-webkit-scrollbar { display: none; }
        .lib-cat-btn { padding: 5px 12px; border-radius: var(--radius-full); border: 1px solid var(--border-strong); font-size: .75rem; font-family: var(--font-display); font-weight: 600; cursor: pointer; background: none; color: var(--text-secondary); white-space: nowrap; transition: all .12s; }
        .lib-cat-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .lib-blocks { flex: 1; overflow-y: auto; padding: 8px 12px 24px; background: var(--bg); }
        .lib-cat-heading { font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); padding: 12px 8px 6px; }
        .lib-block-card { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--radius); cursor: pointer; transition: all .12s; border: 1px solid transparent; background: var(--bg-card); }
        .lib-block-card:hover { background: var(--accent-subtle); border-color: var(--accent); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
        .lib-block-icon { width: 36px; height: 36px; border-radius: var(--radius); background: var(--bg-alt); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-secondary); }
        .lib-block-info { flex: 1; min-width: 0; }
        .lib-block-name { font-size: .85rem; font-family: var(--font-body); font-weight: 600; color: var(--text); }
        .lib-block-desc { font-size: .72rem; color: var(--text-secondary); margin-top: 1px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .lib-add-icon { color: var(--accent); flex-shrink: 0; opacity: 0; transition: opacity .12s; }
        .lib-block-card:hover .lib-add-icon { opacity: 1; }
        .lib-block-card.confirming { background: var(--accent-subtle); border-color: var(--accent); }
        .lib-block-card.confirming .lib-add-icon { opacity: 1; color: var(--accent); animation: lib-check-pop .22s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)); }
        @keyframes lib-check-pop { 0% { transform: scale(.6); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .lib-empty { padding: 40px 20px; text-align: center; color: var(--text-muted); font-size: .85rem; font-family: var(--font-body); }
      `}</style>

      <div className="lib-panel">
        <div className="lib-header">
          <span className="lib-title">Biblioteca de bloques</span>
          <button className="lib-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="lib-search-wrap">
          <input
            className="lib-search"
            placeholder="Buscar bloques..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="lib-cats">
          {(['all', ...CATEGORY_ORDER] as const).map(cat => (
            <button
              key={cat}
              className={`lib-cat-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="lib-blocks">
          {filtered.length === 0 && (
            <div className="lib-empty">No se encontraron bloques para «{search}»</div>
          )}
          {activeCategory === 'all'
            ? Object.entries(grouped).map(([cat, defs]) => (
                <div key={cat}>
                  <div className="lib-cat-heading">{CATEGORY_LABELS[cat as BlockCategory]}</div>
                  {defs.map(def => <BlockCard key={def.type} def={def} onAdd={() => addBlock(def)} />)}
                </div>
              ))
            : filtered.map(def => <BlockCard key={def.type} def={def} onAdd={() => addBlock(def)} />)
          }
        </div>
      </div>
    </div>
  );
}

function BlockCard({ def, onAdd }: { def: BlockDefinition; onAdd: () => void }) {
  const [confirming, setConfirming] = useState(false);

  function handle() {
    if (confirming) return;
    setConfirming(true);
    setTimeout(() => onAdd(), 220);
  }

  return (
    <div className={`lib-block-card${confirming ? ' confirming' : ''}`} onClick={handle}>
      <div className="lib-block-icon">
        <def.icon width="18" height="18" />
      </div>
      <div className="lib-block-info">
        <div className="lib-block-name">{def.label}</div>
        <div className="lib-block-desc">{def.description}</div>
      </div>
      <svg className="lib-add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {confirming
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
        }
      </svg>
    </div>
  );
}
