import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSite } from '../../context/SiteContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSubscription } from '../../hooks/useSubscription';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loadSite } = useSite();
  const { unreadCount } = useNotifications();
  const { status: sub, upgrade } = useSubscription();
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState('');

  useEffect(() => { loadSite(); }, [loadSite]);

  // Mostrar modal bloqueante cuando el trial expira
  useEffect(() => {
    if (sub?.is_expired) setShowExpiredModal(true);
  }, [sub]);

  const handleUpgrade = async (plan: string) => {
    setUpgradingPlan(plan);
    const res = await upgrade(plan);
    setUpgradingPlan('');
    if (!res.error) setShowExpiredModal(false);
  };

  return (
    <>
      <style>{`
        /* ── LAYOUT ── */
        .panel-layout { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--sidebar-w, 260px);
          background: var(--bg-alt); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; z-index: 100;
          transition: transform .35s var(--ease-out, cubic-bezier(0.22,1,0.36,1)),
                      width .3s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          overflow-y: auto; overflow-x: hidden;
        }
        /* Desktop collapsed */
        .sidebar.collapsed {
          width: 64px;
        }
        .sidebar.collapsed .sidebar__logo-text,
        .sidebar.collapsed .sidebar__label-text,
        .sidebar.collapsed .sidebar__user-info,
        .sidebar.collapsed .sidebar__badge,
        .sidebar.collapsed .sidebar__section-label {
          opacity: 0;
          width: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .sidebar.collapsed .sidebar__link {
          justify-content: center;
          padding: 10px;
        }
        .sidebar.collapsed .sidebar__link svg {
          flex-shrink: 0;
          opacity: 1;
        }
        .sidebar.collapsed .sidebar__logo {
          padding: 24px 12px 20px;
          justify-content: center;
        }
        .sidebar.collapsed .sidebar__nav {
          padding: 8px 8px;
        }
        .sidebar.collapsed .sidebar__hamburger {
          margin: 0 8px 12px;
          justify-content: center;
        }
        .sidebar__logo {
          display: flex; align-items: center; gap: 10px; padding: 24px 24px 20px;
          font-family: var(--font-display); font-weight: 800; font-size: 1rem;
          letter-spacing: .06em; color: var(--text); flex-shrink: 0;
        }
        .sidebar__logo-mark {
          width: 34px; height: 34px; background: var(--accent); color: #fff;
          border-radius: 9px; display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 800;
          transition: transform .3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
          flex-shrink: 0;
        }
        .sidebar__logo:hover .sidebar__logo-mark { transform: rotate(-8deg) scale(1.05); }
        .sidebar__hamburger {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; margin: 0 24px 12px; padding: 8px;
          border-radius: var(--radius); background: transparent; border: none;
          color: var(--text-secondary); cursor: pointer;
          transition: all .2s var(--ease-out);
          flex-shrink: 0;
        }
        .sidebar__hamburger:hover { background: var(--border); color: var(--text); }
        .sidebar__nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; }
        .sidebar__link {
          display: flex; align-items: center; gap: 12px; padding: 10px 16px;
          border-radius: var(--radius); font-size: .875rem;
          font-family: var(--font-display); font-weight: 500;
          color: var(--text-secondary);
          transition: all .2s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          cursor: pointer; position: relative;
        }
        .sidebar__link:hover { background: var(--border); color: var(--text); }
        .sidebar__link.active { background: var(--accent-subtle); color: var(--accent); font-weight: 700; }
        .sidebar__link svg { flex-shrink: 0; opacity: .6; transition: opacity .2s; }
        .sidebar__link.active svg, .sidebar__link:hover svg { opacity: 1; }
        .sidebar__badge {
          margin-left: auto; background: var(--accent); color: #fff;
          font-size: .6rem; font-weight: 700; padding: 2px 7px;
          border-radius: var(--radius-full); font-family: var(--font-display);
          letter-spacing: .04em;
        }
        .sidebar__divider { height: 1px; background: var(--border); margin: 12px 16px; }
        .sidebar__section-label {
          padding: 8px 16px; font-size: .65rem; font-family: var(--font-display);
          font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          color: var(--text-muted);
        }
        .sidebar__footer { padding: 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
        .sidebar__user {
          display: flex; align-items: center; gap: 12px; padding: 8px 12px;
          border-radius: var(--radius); transition: background .2s; cursor: pointer;
        }
        .sidebar__user:hover { background: var(--border); }
        .sidebar__avatar {
          width: 36px; height: 36px; background: var(--accent); color: #fff;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700; font-size: .8rem; flex-shrink: 0;
        }
        .sidebar__user-info { flex: 1; min-width: 0; }
        .sidebar__user-name {
          font-size: .8125rem; font-weight: 600; color: var(--text);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar__user-email {
          font-size: .7rem; color: var(--text-muted);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ── MAIN ── */
        .panel-main {
          margin-left: var(--sidebar-w, 260px); flex: 1; padding: 32px 40px;
          min-height: 100vh;
          transition: margin .3s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }
        .panel-main.collapsed {
          margin-left: 64px;
        }

        /* ── TOPBAR ── */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px; gap: 16px; flex-wrap: wrap;
        }
        .topbar__title { font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -.03em; }
        .topbar__actions { display: flex; align-items: center; gap: 10px; }

        /* ── BUTTONS ── */
        .btn {
          display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px;
          font-family: var(--font-display); font-size: .8125rem; font-weight: 600;
          border-radius: var(--radius-full); transition: all .25s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
          white-space: nowrap; cursor: pointer;
        }
        .btn--ghost {
          padding: 8px 12px; border-radius: var(--radius);
          color: var(--text-secondary); font-size: 1rem; line-height: 1;
        }
        .btn--ghost:hover { background: var(--border); color: var(--text); }
        .btn--primary { background: var(--accent); color: #fff; box-shadow: var(--shadow-accent); }
        .btn--primary:hover { background: var(--accent-hover); transform: translateY(-2px); }
        .btn--outline {
          background: transparent; color: var(--text);
          border: 1.5px solid var(--border-strong);
        }
        .btn--outline:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-subtle); }
        .btn--sm { padding: 7px 14px; font-size: .75rem; }
        .btn--danger { background: var(--danger); color: #fff; }
        .btn--danger:hover { background: #e03030; transform: translateY(-2px); }

        /* ── THEME ICON ── */
        .theme-icon { font-size: 1rem; line-height: 1; }

        /* ── FADE IN ANIMATION ── */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .page-fade {
          animation: fadeIn .4s var(--ease-out, cubic-bezier(0.22,1,0.36,1));
        }

        /* ── TRIAL BANNER (inline en topbar) ── */
        .trial-banner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
          padding: 8px 14px;
          background: linear-gradient(90deg, rgba(0,87,255,.1), rgba(0,87,255,.05));
          border: 1px solid rgba(0,87,255,.2);
          border-radius: var(--radius);
          font-size: .8rem;
          white-space: nowrap;
          overflow: hidden;
        }
        .trial-banner__text { color: var(--text); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .trial-banner__text strong { color: var(--accent); font-family: var(--font-display); }
        .trial-banner--urgent {
          background: linear-gradient(90deg, rgba(255,77,77,.1), rgba(255,77,77,.05));
          border-color: rgba(255,77,77,.25);
        }
        .trial-banner--urgent .trial-banner__text strong { color: var(--danger); }

        /* ── EXPIRED MODAL OVERLAY ── */
        .expired-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .expired-modal {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 40px 36px;
          max-width: 680px; width: 100%;
          box-shadow: 0 32px 80px rgba(0,0,0,.3);
          animation: fadeIn .4s var(--ease-out);
        }
        .expired-modal__title {
          font-family: var(--font-display); font-size: 1.75rem; font-weight: 800;
          letter-spacing: -.03em; color: var(--text); margin-bottom: 8px;
        }
        .expired-modal__desc { font-size: .9375rem; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.6; }
        .expired-plans {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
        }
        @media(max-width:520px){ .expired-plans { grid-template-columns: 1fr; } }
        .expired-plan {
          border: 1.5px solid var(--border); border-radius: var(--radius-lg);
          padding: 20px; cursor: pointer;
          transition: border-color .2s, transform .2s var(--ease-spring), box-shadow .2s;
          background: var(--bg);
        }
        .expired-plan:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: var(--shadow); }
        .expired-plan--popular { border-color: var(--accent); box-shadow: var(--shadow-accent); }
        .expired-plan__name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .expired-plan__price { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--accent); margin-bottom: 12px; }
        .expired-plan__price span { font-size: .875rem; font-weight: 500; color: var(--text-muted); }
        .expired-plan__features { font-size: .8rem; color: var(--text-secondary); line-height: 1.7; }
        .expired-plan__btn {
          width: 100%; margin-top: 16px; padding: 10px;
          background: var(--accent); color: #fff; border: none;
          border-radius: var(--radius-full); font-family: var(--font-display);
          font-size: .8125rem; font-weight: 700; cursor: pointer;
          transition: background .2s, transform .2s;
        }
        .expired-plan__btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
        .expired-plan__btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .expired-plan--custom .expired-plan__btn { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); }
        .expired-plan--custom .expired-plan__btn:hover { background: var(--accent-subtle); }

        /* ── SIDEBAR OVERLAY (mobile) ── */
        .sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,.4); z-index: 99;
          opacity: 0; transition: opacity .3s;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .sidebar-overlay { display: block; }
          .sidebar-overlay.open { opacity: 1; pointer-events: auto; }
          .panel-main { margin-left: 0; padding: 24px 16px; padding-top: 72px; }
        }
      `}</style>

      <div className="panel-layout">
        <Sidebar
          isOpen={sidebarOpen}
          collapsed={collapsed}
          onClose={() => setSidebarOpen(false)}
          onMenuToggle={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(prev => !prev);
            } else {
              setCollapsed(prev => !prev);
            }
          }}
          notificationCount={unreadCount}
        />

        <main className={`panel-main${collapsed ? ' collapsed' : ''}`}>
          <Topbar
            trialBanner={sub?.is_trial && !sub.is_expired ? (
              <div className={`trial-banner${(sub.days_left ?? 99) <= 3 ? ' trial-banner--urgent' : ''}`}>
                <span className="trial-banner__text">
                  {(sub.days_left ?? 0) > 0
                    ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Tu prueba gratuita termina en <strong>{sub.days_left} {sub.days_left === 1 ? 'día' : 'días'}</strong>. Elige un plan.</>
                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:5}} aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Tu prueba gratuita <strong>expira hoy</strong>.</>
                  }
                </span>
                <button className="btn btn--primary btn--sm" onClick={() => navigate('/panel/billing')} style={{ flexShrink: 0 }}>
                  Ver planes
                </button>
              </div>
            ) : undefined}
          />

          {/* key on location.pathname triggers remount → fadeIn on every route change */}
          <div key={location.pathname} className="page-fade">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modal bloqueante cuando el trial expira */}
      {showExpiredModal && (
        <div className="expired-overlay">
          <div className="expired-modal">
            <div className="expired-modal__title">Tu prueba gratuita ha terminado</div>
            <p className="expired-modal__desc">
              Esperamos que hayas disfrutado los 15 días de LandIt. Para seguir usando la plataforma, elige el plan que mejor se adapte a tu negocio.
            </p>
            <div className="expired-plans">
              {[
                { id: 'starter', name: 'Starter', price: '$20', period: '/mes', popular: false, features: '1 landing · 1 solicitud activa · Entrega en 3 días · SSL gratis · SEO básico' },
                { id: 'growth',  name: 'Growth',  price: '$40', period: '/mes', popular: true,  features: 'Hasta 8 páginas · 2 solicitudes · Entrega en 2 días · Analytics · Blog/CMS' },
                { id: 'scale',   name: 'Scale',   price: '$120', period: '/mes', popular: false, features: 'Páginas ilimitadas · Solicitudes ilimitadas · Full-stack · E-commerce · PM dedicado' },
                { id: 'custom',  name: 'Custom',  price: 'A medida', period: '', popular: false, features: 'Todo en Scale + SLA · Infraestructura dedicada · Equipo dedicado · NDAs' },
              ].map((plan) => (
                <div key={plan.id} className={`expired-plan${plan.popular ? ' expired-plan--popular' : ''}${plan.id === 'custom' ? ' expired-plan--custom' : ''}`}>
                  {plan.popular && (
                    <div style={{ fontSize: '.65rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{display:'inline',verticalAlign:'middle',marginRight:4}} aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Más popular
                    </div>
                  )}
                  <div className="expired-plan__name">{plan.name}</div>
                  <div className="expired-plan__price">
                    {plan.price}{plan.period && <span>{plan.period}</span>}
                  </div>
                  <div className="expired-plan__features">{plan.features}</div>
                  <button
                    className="expired-plan__btn"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgradingPlan === plan.id}
                  >
                    {upgradingPlan === plan.id ? 'Procesando...' : plan.id === 'custom' ? 'Contactar ventas' : `Elegir ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
