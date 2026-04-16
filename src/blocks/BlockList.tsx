import { useRef, useState } from 'react';
import type { EditorState, BlockInstance } from './types';
import type { EditorAction } from './editorReducer';
import { getBlock } from './registry';
import { useListDnd } from './useListDnd';

interface BlockListProps {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  onAddBlock: () => void;
  onSelectBlock: (id: string) => void;
  hoveredBlockId?: string | null;
}

function BlockRow({ block, selected, previewHovered, index, onSelect, onEdit, onToggle, onDuplicate, onDelete, dndHandlers }: {
  block: BlockInstance;
  selected: boolean;
  previewHovered: boolean;
  index: number;
  onSelect: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  dndHandlers: ReturnType<ReturnType<typeof useListDnd>['getHandlers']>;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);
  const def = getBlock(block.type);

  function requestDelete() {
    setExiting(true);
    setTimeout(() => onDelete(), 180);
  }

  return (
    <div
      ref={rowRef}
      className={`blk-row${selected ? ' selected' : ''}${previewHovered && !selected ? ' preview-hovered' : ''}${!block.visible ? ' hidden' : ''}${exiting ? ' exiting' : ''}`}
      onClick={onSelect}
      {...dndHandlers}
      style={{ '--dnd-indicator': 'none' } as React.CSSProperties}
    >
      <style>{`
        @keyframes blk-row-enter { from { transform: translateX(-8px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes blk-row-exit { from { transform: scale(1); opacity: 1; } to { transform: scale(.92); opacity: 0; } }
        .blk-row { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--radius); cursor: pointer; user-select: none; position: relative; border: 1px solid transparent; background: var(--bg-card); animation: blk-row-enter .2s var(--ease-out, cubic-bezier(0.22,1,0.36,1)); transition: opacity .2s var(--ease-out, cubic-bezier(0.22,1,0.36,1)), background .2s var(--ease-out, cubic-bezier(0.22,1,0.36,1)), border-color .12s, box-shadow .12s; }
        .blk-row:hover { background: var(--accent-subtle); border-color: var(--accent); }
        .blk-row.selected { background: var(--accent-subtle); border-color: var(--accent); box-shadow: var(--shadow-sm); }
        @keyframes blk-row-preview-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(0,87,255,.15); } 50% { box-shadow: 0 0 0 4px rgba(0,87,255,.1); } }
        .blk-row.preview-hovered { background: var(--accent-subtle); border-color: rgba(0,87,255,.5); animation: blk-row-preview-pulse 1.4s ease-in-out infinite; }
        .blk-row.hidden { opacity: .45; background: var(--bg-alt); }
        .blk-row.exiting { animation: blk-row-exit .18s var(--ease-out, cubic-bezier(0.22,1,0.36,1)) forwards; pointer-events: none; }
        .blk-row[style*="top"]::before { content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 3px; background: var(--accent); border-radius: var(--radius); display: var(--dnd-indicator, none); box-shadow: 0 0 0 2px var(--accent-glow, rgba(0,87,255,.2)); }
        .blk-row[style*="bottom"]::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: var(--accent); border-radius: var(--radius); display: var(--dnd-indicator, none); box-shadow: 0 0 0 2px var(--accent-glow, rgba(0,87,255,.2)); }
        .blk-row-drag { color: var(--text-muted); cursor: grab; flex-shrink: 0; display: flex; align-items: center; }
        .blk-row-drag:active { cursor: grabbing; }
        .blk-row-icon { width: 28px; height: 28px; border-radius: var(--radius); background: var(--bg-alt); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-secondary); }
        .blk-row-label { flex: 1; font-size: .82rem; font-family: var(--font-body); font-weight: 500; color: var(--text); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .blk-row-actions { display: flex; align-items: center; gap: 2px; opacity: 0; transition: opacity .12s; }
        .blk-row:hover .blk-row-actions, .blk-row.selected .blk-row-actions { opacity: 1; }
        .blk-row-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: var(--radius); color: var(--text-muted); display: flex; align-items: center; transition: color .12s, background .12s; }
        .blk-row-btn:hover { color: var(--text); background: var(--border); }
        .blk-row-btn.del:hover { color: var(--danger); }
      `}</style>
      <div className="blk-row-drag" title="Arrastrar para reordenar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
      </div>
      <div className="blk-row-icon">
        {def ? <def.icon width="14" height="14" /> : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        )}
      </div>
      <span className="blk-row-label">{def?.label ?? block.type}</span>
      <div className="blk-row-actions">
        <button className="blk-row-btn" title="Editar" onClick={e => { e.stopPropagation(); onEdit(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
        </button>
        <button className="blk-row-btn" title={block.visible ? 'Ocultar' : 'Mostrar'} onClick={e => { e.stopPropagation(); onToggle(); }}>
          {block.visible
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          }
        </button>
        <button className="blk-row-btn" title="Duplicar" onClick={e => { e.stopPropagation(); onDuplicate(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button className="blk-row-btn del" title="Eliminar" onClick={e => { e.stopPropagation(); requestDelete(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function BlockList({ state, dispatch, onAddBlock, onSelectBlock, hoveredBlockId }: BlockListProps) {
  const { getHandlers } = useListDnd({
    onReorder: (from, to) => dispatch({ type: 'REORDER', payload: { fromIndex: from, toIndex: to } }),
  });

  return (
    <div className="blk-list-wrap">
      <style>{`
        .blk-list-wrap { display: flex; flex-direction: column; overflow: hidden; flex: 1; min-height: 0; height: 100%; }
        .blk-list-header { padding: 12px 16px 8px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .blk-list-title { font-size: .72rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted, #999); }
        .blk-list-add { display: flex; align-items: center; gap: 5px; font-size: .78rem; font-family: var(--font-display); font-weight: 700; color: var(--accent); background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background .12s; }
        .blk-list-add:hover { background: var(--accent-subtle, #e8f0ff); }
        .blk-list-items { overflow-y: auto; overflow-x: hidden; padding: 4px 8px 8px; flex: 1 1 auto; min-height: 0; }
        .blk-list-empty { padding: 20px; text-align: center; color: var(--text-muted, #999); font-size: .82rem; font-family: var(--font-body); line-height: 1.6; }
      `}</style>
      <div className="blk-list-header">
        <span className="blk-list-title">Bloques ({state.blocks.length})</span>
        <button className="blk-list-add" onClick={onAddBlock}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
      </div>
      <div className="blk-list-items">
        {state.blocks.length === 0 ? (
          <div className="blk-list-empty">
            <p>Tu página está vacía.</p>
            <p>Agrega bloques para comenzar.</p>
          </div>
        ) : (
          state.blocks.map((block, index) => (
            <BlockRow
              key={block.id}
              block={block}
              selected={block.id === state.selectedBlockId}
              previewHovered={block.id === hoveredBlockId}
              index={index}
              onSelect={() => onSelectBlock(block.id)}
              onEdit={() => onSelectBlock(block.id)}
              onToggle={() => dispatch({ type: 'TOGGLE_VISIBLE', payload: { blockId: block.id } })}
              onDuplicate={() => dispatch({ type: 'DUPLICATE_BLOCK', payload: { blockId: block.id } })}
              onDelete={() => dispatch({ type: 'REMOVE_BLOCK', payload: { blockId: block.id } })}
              dndHandlers={getHandlers(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}
