import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { useToast } from '../../components/ui/Toast';

const PLANS = [
  {
    id: 'starter', name: 'Starter', price: '$20', period: '/mes',
    features: [
      '1 landing page o sitio hasta 5 secciones',
      '1 solicitud activa a la vez',
      'Entrega promedio en 3 días hábiles',
      'Dominio personalizado (1 dominio)',
      'SSL gratuito + HTTPS forzado',
      'Diseño responsive',
      'SEO on-page básico',
      'Google Analytics 4',
      'Soporte por email (48h)',
    ],
  },
  {
    id: 'growth', name: 'Growth', price: '$40', period: '/mes', popular: true,
    features: [
      'Sitio multi-página (hasta 8 páginas)',
      '2 solicitudes activas simultáneas',
      'Entrega prioritaria en 2 días hábiles',
      'Animaciones custom (GSAP)',
      'Blog / CMS integrado',
      'Formularios ilimitados + integraciones',
      'Dashboard analítico + heatmaps',
      'Core Web Vitals monitoring',
      'Soporte prioritario (<12h)',
      'Llamada estratégica mensual 30 min',
    ],
  },
  {
    id: 'scale', name: 'Scale', price: '$120', period: '/mes',
    features: [
      'Páginas ilimitadas + arquitectura escalable',
      'Solicitudes ilimitadas en cola gestionada',
      'Entrega objetivo en 24h',
      'Desarrollo full-stack: APIs, bases de datos, auth',
      'E-commerce completo (Stripe)',
      'CMS headless personalizado',
      'Multi-idioma / i18n nativo',
      'Project manager dedicado',
      'SLA con tiempo de respuesta garantizado',
    ],
  },
  {
    id: 'custom', name: 'Custom', price: 'A medida', period: '', isCustom: true,
    features: [
      'Llamada de descubrimiento de alcance',
      'Aplicaciones web complejas a medida',
      'Integraciones backend (CRMs, ERPs, APIs)',
      'Equipo dedicado (diseño + dev + QA)',
      'NDAs + contratos personalizados',
      'SLAs empresariales con uptime garantizado',
      'Soporte 24/7 con canal dedicado',
    ],
  },
];

const USAGE_LIMITS: Record<string, { pages: number; visits: number; storage: number; api: number }> = {
  trial:   { pages: 3,   visits: 1000,   storage: 1,  api: 1000   },
  starter: { pages: 10,  visits: 10000,  storage: 5,  api: 10000  },
  growth:  { pages: 50,  visits: 100000, storage: 20, api: 100000 },
  scale:   { pages: 999, visits: 1000000,storage: 100,api: 999999 },
  custom:  { pages: 999, visits: 1000000,storage: 100,api: 999999 },
};

function getProgressColor(pct: number) {
  if (pct >= 90) return 'var(--danger)';
  if (pct >= 70) return 'var(--warning)';
  return 'var(--accent)';
}

export default function BillingPage() {
  const { status: sub, loading, upgrade } = useSubscription();
  const { showToast } = useToast();
  const [upgrading, setUpgrading] = useState('');

  const currentPlan = sub?.plan ?? 'trial';
  const limits = USAGE_LIMITS[currentPlan] ?? USAGE_LIMITS.trial;

  // Uso simulado (en producción vendría del backend)
  const usage = { pages: 3, visits: 8240, storage: 1.2, api: 4200 };

  const meters = [
    { label: 'Páginas',       current: usage.pages,   max: limits.pages,   display: `${usage.pages}`,          maxDisplay: `${limits.pages}` },
    { label: 'Visitas / mes', current: usage.visits,  max: limits.visits,  display: `${usage.visits.toLocaleString()}`, maxDisplay: `${limits.visits.toLocaleString()}` },
    { label: 'Almacenamiento',current: usage.storage, max: limits.storage, display: `${usage.storage} GB`,      maxDisplay: `${limits.storage} GB` },
    { label: 'API calls / mes',current: usage.api,    max: limits.api,     display: `${usage.api.toLocaleString()}`,   maxDisplay: `${limits.api.toLocaleString()}` },
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'custom') {
      showToast('Contacta a nuestro equipo en hola@landit.now', 'info');
      return;
    }
    setUpgrading(planId);
    const res = await upgrade(planId);
    setUpgrading('');
    if (res.error) {
      showToast(res.error, 'error');
    } else {
      showToast(`¡Plan ${planId} activado correctamente!`, 'success');
    }
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Cargando facturación...</div>;

  return (
    <>
      <style>{`
        .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; gap:16px; flex-wrap:wrap; }
        .topbar__title { font-size:clamp(1.5rem,3vw,2rem); letter-spacing:-.03em; }

        /* Trial badge */
        .trial-status {
          display:inline-flex; align-items:center; gap:8px;
          padding:8px 16px; border-radius:var(--radius-full);
          font-family:var(--font-display); font-size:.8rem; font-weight:700;
        }
        .trial-status--trial   { background:rgba(0,87,255,.1);  color:var(--accent);  border:1px solid rgba(0,87,255,.2); }
        .trial-status--active  { background:rgba(0,168,107,.1); color:var(--success); border:1px solid rgba(0,168,107,.2); }
        .trial-status--expired { background:rgba(255,77,77,.1); color:var(--danger);  border:1px solid rgba(255,77,77,.2); }

        /* Plan grid */
        .plan-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:40px; }
        @media(min-width:1100px){ .plan-grid { grid-template-columns:repeat(4,1fr); } }
        @media(max-width:600px) { .plan-grid { grid-template-columns:1fr; } }

        .plan-card {
          background:var(--bg-card); border:1px solid var(--border);
          border-radius:var(--radius-lg); padding:28px 20px;
          display:flex; flex-direction:column;
          transition:transform .3s var(--ease-spring),box-shadow .3s;
          position:relative;
        }
        .plan-card:not(.plan-card--current):not(.plan-card--custom):hover { transform:translateY(-4px); box-shadow:var(--shadow); }
        .plan-card--current { border:2px solid var(--accent); box-shadow:0 8px 32px rgba(0,87,255,.2); }
        .plan-card--popular-badge {
          position:absolute; top:-13px; left:0; right:0; margin:0 auto;
          width:max-content; font-size:.65rem; font-family:var(--font-display);
          font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          padding:4px 12px; border-radius:var(--radius-full);
          background:var(--accent); color:#fff;
        }
        .plan-card__name { font-family:var(--font-display); font-size:1.1rem; font-weight:700; margin-bottom:8px; color:var(--text); }
        .plan-card__price { font-family:var(--font-display); font-size:2rem; font-weight:800; letter-spacing:-.03em; color:var(--text); line-height:1; margin-bottom:4px; }
        .plan-card__price span { font-size:.9rem; font-weight:500; color:var(--text-secondary); }
        .plan-card__features { flex:1; display:flex; flex-direction:column; gap:8px; margin:16px 0 20px; font-size:.82rem; color:var(--text-secondary); list-style:none; padding:0; }
        .plan-card__features li { display:flex; align-items:flex-start; gap:8px; line-height:1.4; }
        .plan-card__features li::before { content:''; display:block; width:14px; height:14px; flex-shrink:0; margin-top:1px; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230057ff' stroke-width='2.5'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") no-repeat center; }

        .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 20px; font-family:var(--font-display); font-size:.8125rem; font-weight:600; border-radius:var(--radius-full); transition:all .25s var(--ease-out); white-space:nowrap; cursor:pointer; border:none; background:none; width:100%; }
        .btn--primary { background:var(--accent); color:#fff; box-shadow:0 8px 32px rgba(0,87,255,.25); }
        .btn--primary:hover { background:var(--accent-hover,#0044cc); transform:translateY(-2px); }
        .btn--primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .btn--outline { background:transparent; color:var(--text); border:1.5px solid var(--border-strong); }
        .btn--outline:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
        .btn--current { background:var(--accent-subtle); color:var(--accent); border:1.5px solid rgba(0,87,255,.25); cursor:default; pointer-events:none; }

        /* Usage */
        .usage-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow-sm); }
        .usage-card__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; gap:12px; }
        .usage-card__title { font-size:1rem; font-weight:700; color:var(--text); }
        .usage-card__plan { font-size:.75rem; font-family:var(--font-display); font-weight:700; color:var(--accent); background:var(--accent-subtle); border:1px solid rgba(0,87,255,.2); border-radius:var(--radius-full); padding:3px 10px; }
        .usage-meter { margin-bottom:20px; }
        .usage-meter:last-child { margin-bottom:0; }
        .usage-meter__top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
        .usage-meter__label { font-size:.8rem; color:var(--text-secondary); }
        .usage-meter__value { font-size:.8rem; font-weight:600; font-family:var(--font-display); color:var(--text); }
        .progress { height:6px; background:var(--border); border-radius:99px; overflow:hidden; margin-top:8px; }
        .progress__fill { height:100%; border-radius:99px; transition:width .8s var(--ease-out); }
        .usage-meter__pct { font-size:.7rem; color:var(--text-muted); margin-top:4px; text-align:right; }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <h1 className="topbar__title">Facturación</h1>
        <div>
          {sub?.is_trial && !sub.is_expired && (
            <span className="trial-status trial-status--trial">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Trial · {sub.days_left} {sub.days_left === 1 ? 'día' : 'días'} restantes
            </span>
          )}
          {sub?.subscription_status === 'active' && (
            <span className="trial-status trial-status--active">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Plan activo · {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </span>
          )}
          {sub?.is_expired && (
            <span className="trial-status trial-status--expired">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Trial expirado
            </span>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
        Planes disponibles
      </p>
      <div className="plan-grid">
        {PLANS.map((plan) => {
          const isActive = sub?.subscription_status === 'active' && currentPlan === plan.id;
          return (
            <div key={plan.id} className={`plan-card${isActive ? ' plan-card--current' : ''}${(plan as any).popular ? ' plan-card--popular' : ''}`}>
              {(plan as any).popular && <div className="plan-card--popular-badge">Más popular</div>}

              <div className="plan-card__name">{plan.name}</div>
              <div className="plan-card__price">
                {plan.price}{plan.period && <span>{plan.period}</span>}
              </div>

              <ul className="plan-card__features">
                {plan.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>

              {isActive ? (
                <button className="btn btn--current" disabled>Plan actual</button>
              ) : (
                <button
                  className={`btn ${plan.isCustom ? 'btn--outline' : 'btn--primary'}`}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={upgrading === plan.id}
                >
                  {upgrading === plan.id ? 'Procesando...' : plan.isCustom ? 'Contactar ventas' : `Elegir ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Usage meters */}
      <div className="usage-card">
        <div className="usage-card__header">
          <h3 className="usage-card__title">Uso del plan</h3>
          <span className="usage-card__plan">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</span>
        </div>
        {meters.map((m) => {
          const pct = Math.min(100, Math.round((m.current / m.max) * 100));
          const color = getProgressColor(pct);
          return (
            <div key={m.label} className="usage-meter">
              <div className="usage-meter__top">
                <span className="usage-meter__label">{m.label}</span>
                <span className="usage-meter__value">{m.display} / {m.maxDisplay}</span>
              </div>
              <div className="progress">
                <div className="progress__fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="usage-meter__pct">{pct}%</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
