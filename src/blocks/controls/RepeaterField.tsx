import { useState } from 'react';
import type { ConfigFieldSchema } from '../types';
import { renderControl } from './renderControl';

interface RepeaterFieldProps {
  label: string;
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  fields: ConfigFieldSchema[];
  addLabel?: string;
  maxItems?: number;
  description?: string;
  websiteId?: number;
}

function defaultItem(fields: ConfigFieldSchema[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.kind === 'text' || f.kind === 'textarea' || f.kind === 'url' || f.kind === 'image' || f.kind === 'richtext') item[f.key] = '';
    else if (f.kind === 'toggle') item[f.key] = false;
    else if (f.kind === 'number') item[f.key] = 0;
    else if (f.kind === 'color') item[f.key] = '#000000';
    else if (f.kind === 'select' && 'options' in f && f.options.length) item[f.key] = f.options[0].value;
    else item[f.key] = '';
  }
  return item;
}

export default function RepeaterField({ label, value, onChange, fields, addLabel = 'Agregar', maxItems, description, websiteId }: RepeaterFieldProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const items = Array.isArray(value) ? value : [];
  const canAdd = maxItems == null || items.length < maxItems;

  function add() {
    onChange([...items, defaultItem(fields)]);
    setExpanded(items.length);
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
    setExpanded(null);
  }

  function updateItem(i: number, key: string, val: unknown) {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  return (
    <div className="ctrl-rep-wrap">
      <style>{`
        .ctrl-rep-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted, #999); margin-bottom: 5px; line-height: 1.4; }
        .ctrl-rep-list { display: flex; flex-direction: column; gap: 4px; }
        .ctrl-rep-item { border: 1px solid var(--border, rgba(0,0,0,.08)); border-radius: 8px; overflow: hidden; }
        .ctrl-rep-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-alt, #fff); cursor: pointer; user-select: none; }
        .ctrl-rep-title { font-size: .78rem; font-weight: 600; color: var(--text); }
        .ctrl-rep-actions { display: flex; align-items: center; gap: 6px; }
        .ctrl-rep-del { background: none; border: none; cursor: pointer; color: var(--text-muted, #999); padding: 2px; display: flex; align-items: center; }
        .ctrl-rep-del:hover { color: #e55; }
        .ctrl-rep-body { padding: 12px; border-top: 1px solid var(--border, rgba(0,0,0,.08)); background: var(--bg, #f9f9f8); }
        .ctrl-rep-add { width: 100%; margin-top: 6px; padding: 7px; border: 1.5px dashed var(--border-strong, rgba(0,0,0,.14)); border-radius: 8px; background: none; font-size: .78rem; font-family: var(--font-body); color: var(--accent); cursor: pointer; transition: background .15s; }
        .ctrl-rep-add:hover:not(:disabled) { background: var(--accent-subtle, #e8f0ff); }
        .ctrl-rep-add:disabled { color: var(--text-muted, #999); cursor: not-allowed; }
        .ctrl-rep-chevron { transition: transform .2s; }
        .ctrl-rep-chevron.open { transform: rotate(180deg); }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <div className="ctrl-rep-list">
        {items.map((item, i) => (
          <div key={i} className="ctrl-rep-item">
            <div className="ctrl-rep-header" onClick={() => setExpanded(expanded === i ? null : i)}>
              <span className="ctrl-rep-title">
                {(item.label as string) || (item.title as string) || (item.name as string) || (item.text as string) || `${label} ${i + 1}`}
              </span>
              <div className="ctrl-rep-actions">
                <svg className={`ctrl-rep-chevron${expanded === i ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                <button type="button" className="ctrl-rep-del" onClick={e => { e.stopPropagation(); remove(i); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            </div>
            {expanded === i && (
              <div className="ctrl-rep-body">
                {fields.map(f => renderControl(f, item[f.key], val => updateItem(i, f.key, val), websiteId))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="ctrl-rep-add" onClick={add} disabled={!canAdd}>
        + {addLabel}
      </button>
    </div>
  );
}
