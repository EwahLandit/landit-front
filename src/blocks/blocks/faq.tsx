import { useState } from 'react';
import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface FAQItem { question: string; answer: string; }
interface FAQConfig { title: string; items: FAQItem[]; open_first: boolean; allow_multiple_open: boolean; bg_color: string; text_color: string; spacing: { top: number; bottom: number }; }

function FAQComponent({ config, viewport }: { config: FAQConfig; viewport: string; blockId: string; mobileConfig?: unknown }) {
  const [openItems, setOpenItems] = useState<number[]>(() => config.open_first !== false ? [0] : []);
  const open = (i: number) => openItems.includes(i);
  function toggle(i: number) {
    if (config.allow_multiple_open) {
      setOpenItems(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    } else {
      setOpenItems(prev => prev.includes(i) ? [] : [i]);
    }
  }
  const isMobile = viewport === 'mobile';
  const tc = config.text_color || 'var(--text)';
  const tcs = config.text_color || 'var(--text-secondary)';
  return (
    <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 64}px ${isMobile ? 24 : 80}px ${config.spacing?.bottom ?? 64}px` }}>
      <style>{`.faq-item{border-bottom:1px solid var(--border,rgba(0,0,0,.08))}.faq-btn{width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;background:none;border:none;cursor:pointer;font-family:var(--font-display);font-weight:700;font-size:.95rem;color:${tc};text-align:left}.faq-answer{padding:0 0 18px;font-family:var(--font-body);font-size:.9rem;color:${tcs};line-height:1.7}.faq-chevron{transition:transform .2s;flex-shrink:0}.faq-chevron.open{transform:rotate(180deg)}`}</style>
      {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: tc, margin: '0 0 40px', textAlign: 'center' }}>{config.title}</h2>}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {(config.items ?? []).map((item, i) => (
          <div key={i} className="faq-item">
            <button className="faq-btn" onClick={() => toggle(i)}>
              {item.question}
              <svg className={`faq-chevron${open(i) ? ' open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {open(i) && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

const def: BlockDefinition<FAQConfig> = {
  type: 'faq',
  category: 'content',
  label: 'Preguntas frecuentes',
  description: 'Acordeón de preguntas y respuestas.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  defaultConfig: { title: 'Preguntas frecuentes', bg_color: '', text_color: '', open_first: true, allow_multiple_open: false, items: [{ question: '¿Cómo funciona el período de prueba?', answer: 'Tienes 15 días gratis para probar todas las funciones sin necesidad de tarjeta de crédito.' }, { question: '¿Puedo cancelar en cualquier momento?', answer: 'Sí, puedes cancelar tu suscripción cuando quieras desde tu panel de control.' }], spacing: { top: 64, bottom: 64 } },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'items', label: 'Preguntas', kind: 'repeater', fields: [{ key: 'question', label: 'Pregunta', kind: 'text' }, { key: 'answer', label: 'Respuesta', kind: 'textarea', rows: 3 }], addLabel: 'Agregar pregunta', section: 'Contenido' },
    { key: 'open_first', label: 'Abrir primera pregunta por defecto', kind: 'toggle', section: 'Comportamiento' },
    { key: 'allow_multiple_open', label: 'Permitir múltiples abiertas', kind: 'toggle', section: 'Comportamiento' },
    { key: 'bg_color', label: 'Color de fondo', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: FAQComponent as BlockDefinition<FAQConfig>['Component'],
};
registerBlock(def);
export default def;
