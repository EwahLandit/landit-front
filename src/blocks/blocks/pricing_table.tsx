import { useEffect, useState } from 'react';
import { registerBlock } from '../registry';
import type { BlockDefinition } from '../types';

interface PricingTier { name: string; price_usd: number; price_ars: number | null; period: string; features: string[]; featured: boolean; cta_label: string; cta_url: string; badge: string; }
interface PricingConfig { title: string; subtitle: string; tiers: PricingTier[]; ars_mode: 'manual' | 'oficial' | 'blue'; bg_color: string; text_color: string; card_bg_color: string; card_text_color: string; spacing: { top: number; bottom: number }; }

function useDolarRate(mode: 'none' | 'oficial' | 'blue') {
  const [rate, setRate] = useState<number | null>(null);
  useEffect(() => {
    if (mode === 'none') return;
    const slug = mode === 'blue' ? 'blue' : 'oficial';
    fetch(`https://dolarapi.com/v1/dolares/${slug}`)
      .then(r => r.json())
      .then(d => setRate(d.venta ?? null))
      .catch(() => setRate(null));
  }, [mode]);
  return rate;
}

function PricingComponent({ config }: { config: PricingConfig; viewport: string; blockId: string; mobileConfig?: unknown }) {
  const [currency, setCurrency] = useState<'usd' | 'ars'>('usd');
  const arsMode = config.ars_mode ?? 'manual';
  const exchangeRate = useDolarRate(arsMode === 'manual' ? 'none' : arsMode);
  const tiers = config.tiers ?? [];

  function getPrice(tier: PricingTier): string {
    if (currency === 'usd') return `USD $${tier.price_usd.toLocaleString()}`;
    if (arsMode === 'manual' && tier.price_ars != null) return `ARS $${tier.price_ars.toLocaleString()}`;
    if (exchangeRate && tier.price_usd) {
      const ars = Math.round(tier.price_usd * exchangeRate);
      return `ARS $${ars.toLocaleString()}`;
    }
    return `USD $${tier.price_usd.toLocaleString()}`;
  }

  // Section-level text (title / subtitle)
  const tc = config.text_color || 'var(--text)';
  const tcs = config.text_color || 'var(--text-secondary)';
  // Card-level colors (independent of section background)
  const cardBg = config.card_bg_color || 'var(--bg-card,#fff)';
  const cardTc = config.card_text_color || 'var(--text)';
  const cardTcs = config.card_text_color || 'var(--text-secondary)';
  return (
    <section style={{ background: config.bg_color || 'var(--bg)', padding: `${config.spacing?.top ?? 72}px 40px ${config.spacing?.bottom ?? 72}px` }}>
      <style>{`
        .pr-card{background:${cardBg};border:1px solid var(--border,rgba(0,0,0,.08));border-radius:var(--radius-lg,20px);padding:32px 28px;display:flex;flex-direction:column;gap:6px;transition:transform .2s,box-shadow .2s}
        .pr-card.featured{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow,rgba(0,87,255,.15))}
        .pr-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg,0 16px 40px rgba(0,0,0,.12))}
        .pr-features li{font-size:.85rem;color:${cardTcs};display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-family:var(--font-body)}
        .pr-toggle{display:flex;align-items:center;gap:8px;background:var(--bg,#f9f9f8);border:1px solid var(--border,rgba(0,0,0,.08));border-radius:9999px;padding:3px}
        .pr-toggle-btn{padding:5px 16px;border-radius:9999px;border:none;font-size:.78rem;font-family:var(--font-display);font-weight:700;cursor:pointer;background:none;color:var(--text-secondary);transition:all .15s}
        .pr-toggle-btn.active{background:var(--accent);color:#fff}
        .pr-rate-badge{font-size:.68rem;background:rgba(0,87,255,.1);color:var(--accent);border-radius:9999px;padding:3px 10px;font-weight:600}
      `}</style>

      {(config.title || config.subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {config.title && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: tc, margin: '0 0 12px' }}>{config.title}</h2>}
          {config.subtitle && <p style={{ fontFamily: 'var(--font-body)', color: tcs, opacity: .75, fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>{config.subtitle}</p>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        <div className="pr-toggle">
          <button className={`pr-toggle-btn${currency === 'usd' ? ' active' : ''}`} onClick={() => setCurrency('usd')}>USD</button>
          <button className={`pr-toggle-btn${currency === 'ars' ? ' active' : ''}`} onClick={() => setCurrency('ars')}>ARS</button>
        </div>
        {currency === 'ars' && arsMode !== 'manual' && exchangeRate && (
          <span className="pr-rate-badge">Dólar {arsMode === 'blue' ? 'Blue' : 'Oficial'}: ${exchangeRate.toLocaleString()}</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(tiers.length || 1, 4)}, 1fr)`, gap: 20, maxWidth: 1100, margin: '0 auto' }}>
        {tiers.map((tier, i) => (
          <div key={i} className={`pr-card${tier.featured ? ' featured' : ''}`}>
            {tier.badge && <div style={{ background: 'var(--accent)', color: '#fff', fontSize: '.68rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.05em', padding: '3px 12px', borderRadius: 9999, textTransform: 'uppercase', width: 'fit-content', marginBottom: 4 }}>{tier.badge}</div>}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: tc }}>{tier.name}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: tier.featured ? 'var(--accent)' : tc, margin: '10px 0 2px', lineHeight: 1 }}>{getPrice(tier)}</div>
            {tier.period && <div style={{ fontFamily: 'var(--font-body)', fontSize: '.78rem', color: tcs }}>por {tier.period}</div>}
            <ul className="pr-features" style={{ listStyle: 'none', padding: 0, margin: '20px 0', flex: 1 }}>
              {(Array.isArray(tier.features) ? tier.features : String(tier.features ?? '').split('\n').filter(Boolean)).map((f, j) => (
                <li key={j}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            {tier.cta_label && <a href={tier.cta_url || '#'} style={{ display: 'block', textAlign: 'center', padding: '13px', background: tier.featured ? 'var(--accent)' : 'transparent', color: tier.featured ? '#fff' : 'var(--accent)', border: `1.5px solid var(--accent)`, borderRadius: 'var(--radius-full,9999px)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', textDecoration: 'none' }}>{tier.cta_label}</a>}
          </div>
        ))}
      </div>
    </section>
  );
}

const def: BlockDefinition<PricingConfig> = {
  type: 'pricing_table',
  category: 'commerce',
  label: 'Tabla de precios',
  description: 'Planes y precios con toggle USD/ARS y tipo de cambio en tiempo real.',
  icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  defaultConfig: {
    title: 'Planes simples y transparentes', subtitle: '', bg_color: '', text_color: '', card_bg_color: '', card_text_color: '', ars_mode: 'blue', spacing: { top: 72, bottom: 72 },
    tiers: [
      { name: 'Starter', price_usd: 9, price_ars: null, period: 'mes', features: ['1 sitio', 'Dominio personalizado', 'Soporte por email'], featured: false, cta_label: 'Comenzar', cta_url: '', badge: '' },
      { name: 'Pro', price_usd: 29, price_ars: null, period: 'mes', features: ['5 sitios', 'Analíticas avanzadas', 'Soporte prioritario', 'API access'], featured: true, cta_label: 'Comenzar', cta_url: '', badge: 'Más popular' },
      { name: 'Business', price_usd: 79, price_ars: null, period: 'mes', features: ['Sitios ilimitados', 'White-label', 'SLA garantizado', 'Onboarding dedicado'], featured: false, cta_label: 'Contactar ventas', cta_url: '', badge: '' },
    ],
  },
  schema: [
    { key: 'title', label: 'Título', kind: 'text', section: 'Contenido' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'textarea', rows: 2, section: 'Contenido' },
    { key: 'tiers', label: 'Planes', kind: 'repeater', fields: [{ key: 'name', label: 'Nombre', kind: 'text' }, { key: 'price_usd', label: 'Precio USD', kind: 'number', min: 0 }, { key: 'price_ars', label: 'Precio ARS (manual)', kind: 'number', min: 0, description: 'Solo se usa si el modo ARS es "manual".' }, { key: 'period', label: 'Período', kind: 'text', placeholder: 'mes' }, { key: 'features', label: 'Características (una por línea)', kind: 'textarea', rows: 4 }, { key: 'featured', label: 'Destacado', kind: 'toggle' }, { key: 'badge', label: 'Badge (ej: Más popular)', kind: 'text' }, { key: 'cta_label', label: 'Texto del botón', kind: 'text' }, { key: 'cta_url', label: 'URL del botón', kind: 'url' }], addLabel: 'Agregar plan', section: 'Contenido' },
    { key: 'ars_mode', label: 'Modo ARS', kind: 'select', options: [{ value: 'manual', label: 'Precio manual' }, { value: 'oficial', label: 'Dólar Oficial (auto)' }, { value: 'blue', label: 'Dólar Blue (auto)' }], description: 'Auto: convierte precio USD usando el tipo de cambio en tiempo real.', section: 'Estilo' },
    { key: 'bg_color', label: 'Color de fondo (sección)', kind: 'color', section: 'Estilo' },
    { key: 'text_color', label: 'Color de texto (título y subtítulo)', kind: 'color', section: 'Estilo' },
    { key: 'card_bg_color', label: 'Color de fondo (tarjetas)', kind: 'color', section: 'Estilo' },
    { key: 'card_text_color', label: 'Color de texto (tarjetas)', kind: 'color', section: 'Estilo' },
    { key: 'spacing', label: 'Espaciado', kind: 'spacing', section: 'Espaciado' },
  ],
  Component: PricingComponent as BlockDefinition<PricingConfig>['Component'],
};
registerBlock(def);
export default def;
