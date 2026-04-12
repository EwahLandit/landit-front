import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { key: 'nav_services', href: '#servicios' },
  { key: 'nav_features', href: '#features' },
  { key: 'nav_pricing', href: '#pricing' },
  { key: 'nav_faq', href: '#faq' },
  { key: 'nav_testimonials', href: '#testimonios' },
] as const;

type AuthTab = 'login' | 'register';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { login, register: authRegister, isAuthenticated, logout } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [strength, setStrength] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const panelsWrapRef = useRef<HTMLDivElement>(null);
  const loginPanelRef = useRef<HTMLDivElement>(null);
  const registerPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = authOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [authOpen]);

  // Sync panels-wrap height to active panel
  useEffect(() => {
    const wrap = panelsWrapRef.current;
    const panel = authTab === 'login' ? loginPanelRef.current : registerPanelRef.current;
    if (wrap && panel) {
      wrap.style.height = panel.scrollHeight + 'px';
    }
  }, [authTab, authOpen]);

  const openAuth = (tab: AuthTab) => {
    setAuthTab(tab);
    setAuthOpen(true);
    setMenuOpen(false);
    setError('');
  };

  const handleLoginSubmit = async () => {
    if (!loginEmail || !loginPassword) { setError('Completa todos los campos.'); return; }
    setLoading(true); setError('');
    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    setAuthOpen(false);
    window.location.href = '/panel';
  };

  const handleRegisterSubmit = async () => {
    if (!regName || !regEmail || !regPassword) { setError('Completa todos los campos.'); return; }
    setLoading(true); setError('');
    const res = await authRegister(regName, regEmail, regPassword);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    setAuthOpen(false);
    window.location.href = '/panel';
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const calcStrength = (val: string) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const strengthColor = ['', '#ff4d4d', '#ff9900', '#0057ff', '#00a86b'][strength] || '';
  const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'][strength] || '';

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes authPanelIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* ── HEADER ── */
        .header { position:fixed; top:0; left:0; right:0; z-index:1000; height:var(--nav-h,68px); transition:background .3s var(--ease-out),box-shadow .3s var(--ease-out); }
        .header--scrolled { background:rgba(249,249,248,.88); backdrop-filter:blur(16px) saturate(1.4); -webkit-backdrop-filter:blur(16px) saturate(1.4); box-shadow:0 1px 0 var(--border),0 4px 16px rgba(0,0,0,.04); }
        [data-theme="dark"] .header--scrolled { background:rgba(10,10,10,.88); }
        .nav { height:100%; display:grid; grid-template-columns:auto 1fr auto; align-items:center; max-width:1200px; margin:0 auto; padding:0 24px; }
        @media(min-width:768px){ .nav { padding:0 40px; } }
        .nav__logo { display:flex; align-items:center; gap:10px; font-family:var(--font-display,'Syne',sans-serif); font-weight:800; font-size:1rem; letter-spacing:.06em; color:var(--text); text-decoration:none; }
        .nav__logo-mark { width:34px; height:34px; background:var(--accent,#0057ff); color:#fff; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:1rem; font-weight:800; transition:transform .3s var(--ease-spring); flex-shrink:0; }
        .nav__logo:hover .nav__logo-mark { transform:rotate(-8deg) scale(1.05); }
        .nav__links { display:none; list-style:none; margin:0; padding:0; gap:4px; justify-content:center; align-items:center; }
        @media(min-width:768px){ .nav__links { display:flex; } }
        .nav__links.is-open { display:flex; flex-direction:column; position:fixed; top:var(--nav-h,68px); left:0; right:0; background:var(--bg-alt,#fff); padding:24px; border-bottom:1px solid var(--border); gap:4px; z-index:999; animation:slideDown .3s var(--ease-out); }
        .nav__links.is-open .nav__link { padding:12px 16px; font-size:1rem; }
        .nav__link { padding:8px 14px; font-size:.875rem; font-family:var(--font-display,'Syne',sans-serif); font-weight:500; color:var(--text-secondary,#555); border-radius:var(--radius-full,9999px); transition:color .2s,background .2s; white-space:nowrap; text-decoration:none; cursor:pointer; }
        .nav__link:hover { color:var(--accent,#0057ff); background:var(--accent-subtle,#e8f0ff); }
        .nav__actions { display:flex; align-items:center; gap:8px; justify-content:flex-end; }
        .nav__hamburger { display:flex; flex-direction:column; gap:5px; padding:8px; border-radius:var(--radius-sm,6px); flex-shrink:0; background:none; border:none; cursor:pointer; }
        @media(min-width:768px){ .nav__hamburger { display:none; } }
        .nav__hamburger span { display:block; width:22px; height:1.5px; background:var(--text,#111); border-radius:2px; transition:transform .3s var(--ease-out),opacity .2s; }
        .nav__hamburger.is-open span:first-child { transform:rotate(45deg) translate(4.5px,4.5px); }
        .nav__hamburger.is-open span:last-child  { transform:rotate(-45deg) translate(4.5px,-4.5px); }
        .nav__theme-btn { padding:8px; border-radius:var(--radius,12px); background:none; border:none; cursor:pointer; color:var(--text-secondary,#555); font-size:1.1rem; display:flex; align-items:center; justify-content:center; transition:background .2s,color .2s; }
        .nav__theme-btn:hover { background:var(--border); color:var(--text); }
        .nav__lang-btn { padding:6px 10px; border-radius:var(--radius-full,9999px); background:none; border:1.5px solid var(--border-strong); cursor:pointer; color:var(--text-secondary,#555); font-family:var(--font-display,'Syne',sans-serif); font-size:.75rem; font-weight:700; letter-spacing:.06em; transition:border-color .2s,color .2s,background .2s; }
        .nav__lang-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; font-family:var(--font-display,'Syne',sans-serif); font-size:.875rem; font-weight:600; border-radius:var(--radius-full,9999px); transition:all .25s var(--ease-out); white-space:nowrap; letter-spacing:-.01em; cursor:pointer; text-decoration:none; border:none; }
        .btn--ghost-nav { background:transparent; color:var(--text); }
        .btn--ghost-nav:hover { background:var(--border); }
        .btn--primary { background:var(--accent,#0057ff); color:#fff; box-shadow:0 8px 32px rgba(0,87,255,.25); }
        .btn--primary:hover { background:var(--accent-hover,#0044cc); transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,87,255,.35); }
        .nav__cta-desktop { display:none; }
        @media(min-width:768px){ .nav__cta-desktop { display:inline-flex; } }

        /* ── AUTH OVERLAY ── */
        .auth-overlay { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(0,0,0,.45); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); opacity:0; pointer-events:none; transition:opacity .3s var(--ease-out); }
        .auth-overlay.is-open { opacity:1; pointer-events:auto; }

        /* ── AUTH MODAL ── */
        .auth-modal { position:relative; width:100%; max-width:420px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:36px 36px 32px; box-shadow:0 32px 80px rgba(0,0,0,.22),0 8px 24px rgba(0,0,0,.12); transform:translateY(28px) scale(0.97); opacity:0; transition:transform .4s var(--ease-spring),opacity .35s var(--ease-out); overflow:hidden; }
        .auth-overlay.is-open .auth-modal { transform:translateY(0) scale(1); opacity:1; }

        .auth-modal__close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); background:transparent; border:1px solid transparent; cursor:pointer; transition:background .2s,color .2s,border-color .2s,transform .2s var(--ease-spring); }
        .auth-modal__close:hover { background:var(--bg-alt); color:var(--text); border-color:var(--border); transform:rotate(90deg); }

        .auth-modal__brand { display:flex; align-items:center; gap:10px; margin-bottom:24px; color:var(--text); }

        /* ── TABS ── */
        .auth-tabs { position:relative; display:flex; gap:0; background:var(--bg-alt); border:1px solid var(--border); border-radius:var(--radius-full); padding:4px; margin-bottom:28px; }
        .auth-tabs__indicator { position:absolute; top:4px; left:4px; width:calc(50% - 4px); height:calc(100% - 8px); background:var(--accent); border-radius:var(--radius-full); box-shadow:0 2px 10px var(--accent-glow); transition:transform .32s var(--ease-spring); pointer-events:none; }
        .auth-tabs[data-active="register"] .auth-tabs__indicator { transform:translateX(100%); }
        .auth-tab { flex:1; padding:8px 12px; font-family:var(--font-display,'Syne',sans-serif); font-size:.8125rem; font-weight:700; letter-spacing:.02em; border-radius:var(--radius-full); position:relative; z-index:1; color:var(--text-muted); cursor:pointer; transition:color .25s var(--ease-out); background:transparent; border:none; }
        .auth-tab--active { color:#fff; }

        /* ── PANELS ── */
        .auth-panels-wrap { position:relative; overflow:hidden; transition:height .38s cubic-bezier(0.22,1,0.36,1); }
        .auth-panel { display:flex; flex-direction:column; gap:18px; position:absolute; top:0; left:0; right:0; opacity:0; pointer-events:none; transform:translateY(12px); transition:opacity .3s var(--ease-out),transform .35s var(--ease-spring); padding-bottom:8px; }
        .auth-panel--active { opacity:1; pointer-events:auto; transform:translateY(0); position:relative; }

        /* ── FIELDS ── */
        .auth-field { display:flex; flex-direction:column; gap:7px; }
        .auth-label { font-family:var(--font-display,'Syne',sans-serif); font-size:.75rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--text-secondary); }
        .auth-input-wrap { position:relative; display:flex; align-items:center; }
        .auth-input-icon { position:absolute; left:12px; color:var(--text-muted); pointer-events:none; flex-shrink:0; transition:color .2s; }
        .auth-input { width:100%; padding:11px 44px 11px 38px; background:var(--bg-alt); color:var(--text); border:1.5px solid var(--border-strong); border-radius:var(--radius); font-family:var(--font-body,'DM Sans',sans-serif); font-size:.9rem; outline:none; transition:border-color .22s var(--ease-out),box-shadow .22s var(--ease-out),background .22s; }
        .auth-input::placeholder { color:var(--text-muted); }
        .auth-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); background:var(--bg-card); }
        .auth-input-wrap:focus-within .auth-input-icon { color:var(--accent); }
        .auth-input-toggle { position:absolute; right:12px; color:var(--text-muted); background:transparent; border:none; cursor:pointer; padding:2px; transition:color .2s,transform .2s var(--ease-spring); }
        .auth-input-toggle:hover { color:var(--accent); transform:scale(1.1); }

        /* ── STRENGTH BAR ── */
        .auth-strength { display:flex; align-items:center; gap:10px; margin-top:4px; overflow:hidden; max-height:0; transition:max-height .3s var(--ease-out),opacity .3s; opacity:0; }
        .auth-strength.is-visible { max-height:24px; opacity:1; }
        .auth-strength__track { flex:1; height:3px; background:var(--border-strong); border-radius:99px; overflow:hidden; }
        .auth-strength__fill { height:100%; border-radius:99px; transition:width .4s var(--ease-spring),background .3s; }
        .auth-strength__label { font-size:.7rem; font-weight:700; font-family:var(--font-display,'Syne',sans-serif); letter-spacing:.04em; white-space:nowrap; color:var(--text-muted); transition:color .3s; min-width:60px; text-align:right; }

        /* ── ROW / CHECK ── */
        .auth-row { display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
        .auth-check { display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-size:.85rem; color:var(--text-secondary); line-height:1.4; }
        .auth-check input { position:absolute; opacity:0; width:0; height:0; }
        .auth-check__box { width:16px; height:16px; flex-shrink:0; margin-top:1px; border:1.5px solid var(--border-strong); border-radius:4px; background:var(--bg-alt); transition:background .2s,border-color .2s,transform .2s var(--ease-spring); display:flex; align-items:center; justify-content:center; }
        .auth-check__box::after { content:''; width:9px; height:5px; border-left:2px solid #fff; border-bottom:2px solid #fff; transform:rotate(-45deg) scale(0); transition:transform .2s var(--ease-spring); }
        .auth-check input:checked ~ .auth-check__box { background:var(--accent); border-color:var(--accent); transform:scale(1.08); }
        .auth-check input:checked ~ .auth-check__box::after { transform:rotate(-45deg) scale(1) translate(0px,-1px); }
        .auth-link { color:var(--accent); font-size:.82rem; transition:opacity .2s; }
        .auth-link:hover { opacity:.75; }

        /* ── SUBMIT ── */
        .auth-submit { position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:13px 20px; background:var(--accent); color:#fff; border:none; border-radius:var(--radius); font-family:var(--font-display,'Syne',sans-serif); font-size:.9rem; font-weight:700; letter-spacing:.02em; cursor:pointer; transition:background .22s var(--ease-out),transform .2s var(--ease-spring),box-shadow .22s var(--ease-out); margin-top:4px; }
        .auth-submit::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 60%); pointer-events:none; }
        .auth-submit:hover { background:var(--accent-hover,#0044cc); box-shadow:var(--shadow-accent); transform:translateY(-1px); }
        .auth-submit:active { transform:translateY(0); }
        .auth-submit__arrow { transition:transform .3s var(--ease-spring); flex-shrink:0; }
        .auth-submit:hover .auth-submit__arrow { transform:translateX(4px); }
        .auth-submit__spinner { position:absolute; right:16px; width:16px; height:16px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; opacity:0; transition:opacity .2s; }

        /* ── DIVIDER / SOCIALS ── */
        .auth-divider { display:flex; align-items:center; gap:12px; color:var(--text-muted); font-size:.78rem; }
        .auth-divider::before,.auth-divider::after { content:''; flex:1; height:1px; background:var(--border); }
        .auth-socials { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .auth-social { display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 16px; background:var(--bg-alt); color:var(--text); border:1.5px solid var(--border-strong); border-radius:var(--radius); font-family:var(--font-body,'DM Sans',sans-serif); font-size:.85rem; font-weight:500; cursor:pointer; transition:border-color .2s,background .2s,transform .2s var(--ease-spring),box-shadow .2s; }
        .auth-social:hover { border-color:var(--accent); background:var(--accent-subtle); transform:translateY(-2px); box-shadow:var(--shadow-sm); }
        .auth-social:active { transform:translateY(0); }

        /* ── STAGGER ANIMATIONS ── */
        .auth-panel--active .auth-field:nth-child(1) { animation:authPanelIn .35s .04s var(--ease-out) both; }
        .auth-panel--active .auth-field:nth-child(2) { animation:authPanelIn .35s .09s var(--ease-out) both; }
        .auth-panel--active .auth-field:nth-child(3) { animation:authPanelIn .35s .14s var(--ease-out) both; }
        .auth-panel--active .auth-row    { animation:authPanelIn .35s .18s var(--ease-out) both; }
        .auth-panel--active .auth-submit { animation:authPanelIn .35s .22s var(--ease-out) both; }
        .auth-panel--active .auth-divider{ animation:authPanelIn .35s .26s var(--ease-out) both; }
        .auth-panel--active .auth-socials{ animation:authPanelIn .35s .30s var(--ease-out) both; }

        @media(max-width:480px){
          .auth-modal { padding:28px 20px 24px; }
          .nav__actions { gap:6px; }
        }

        .auth-error { background:rgba(255,77,77,.1); border:1px solid rgba(255,77,77,.25); color:#ff4d4d; border-radius:var(--radius,12px); padding:10px 14px; font-size:.82rem; font-family:var(--font-display,'Syne',sans-serif); font-weight:600; margin-bottom:4px; }
        .auth-submit.is-loading { pointer-events:none; opacity:.8; }
        .auth-submit.is-loading .auth-submit__spinner { opacity:1; }
        .auth-submit.is-loading span, .auth-submit.is-loading .auth-submit__arrow { opacity:0; }
      `}</style>

      {/* ── HEADER ── */}
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <nav className="nav">
          <a href="/" className="nav__logo">
            <span className="nav__logo-mark">L</span>
            LANDIT
          </a>

          <ul className={`nav__links${menuOpen ? ' is-open' : ''}`}>
            {NAV_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <a className="nav__link" href={href} onClick={(e) => handleNavClick(e, href)}>
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__actions">
            <button className="nav__theme-btn" onClick={toggle}
              aria-label={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}>
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="nav__lang-btn"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              aria-label="Cambiar idioma">
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            {isAuthenticated ? (
              <>
                <a href="/panel" className="btn btn--primary nav__cta-desktop">
                  {t('nav_dashboard') || 'Panel Control'}
                </a>
                <button className="btn btn--ghost-nav nav__cta-desktop" onClick={logout}>
                  {t('auth_logout') || 'Salir'}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn--ghost-nav nav__cta-desktop" onClick={() => openAuth('login')}>
                  {t('nav_login')}
                </button>
                <button className="btn btn--primary nav__cta-desktop" onClick={() => openAuth('register')}>
                  {t('nav_cta')}
                </button>
              </>
            )}
            <button className={`nav__hamburger${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu" aria-expanded={menuOpen}>
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      {/* ── AUTH MODAL ── */}
      <div
        className={`auth-overlay${authOpen ? ' is-open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) setAuthOpen(false); }}
        aria-modal="true" role="dialog" aria-label="Autenticación"
      >
        <div className="auth-modal">
          <button className="auth-modal__close" onClick={() => setAuthOpen(false)} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Brand */}
          <div className="auth-modal__brand">
            <span className="nav__logo-mark" style={{ fontSize:'1.1rem', width:32, height:32, borderRadius:8 }}>L</span>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', letterSpacing:'-.02em' }}>LANDIT</span>
          </div>

          {/* Tabs */}
          <div className="auth-tabs" role="tablist" data-active={authTab}>
            <button
              className={`auth-tab${authTab === 'login' ? ' auth-tab--active' : ''}`}
              role="tab" aria-selected={authTab === 'login'}
              onClick={() => setAuthTab('login')}>
              {t('auth_login')}
            </button>
            <button
              className={`auth-tab${authTab === 'register' ? ' auth-tab--active' : ''}`}
              role="tab" aria-selected={authTab === 'register'}
              onClick={() => setAuthTab('register')}>
              {t('auth_register')}
            </button>
            <div className="auth-tabs__indicator" />
          </div>

          {/* Panels wrapper — height animates */}
          <div className="auth-panels-wrap" ref={panelsWrapRef}>

            {/* ── LOGIN PANEL ── */}
            <div className={`auth-panel${authTab === 'login' ? ' auth-panel--active' : ''}`} ref={loginPanelRef}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="loginEmail">{t('auth_email')}</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input className="auth-input" type="email" id="loginEmail" placeholder={t('auth_email_ph')} autoComplete="email" 
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="loginPassword">{t('auth_password')}</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input className="auth-input" type={showLoginPass ? 'text' : 'password'} id="loginPassword" placeholder={t('auth_pass_ph')} autoComplete="current-password" 
                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  <button className="auth-input-toggle" type="button" aria-label="Mostrar contraseña" tabIndex={-1} onClick={() => setShowLoginPass(v => !v)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {showLoginPass
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      }
                    </svg>
                  </button>
                </div>
              </div>
              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" id="rememberMe" />
                  <span className="auth-check__box" />
                  <span>{t('auth_remember')}</span>
                </label>
                <a href="#" className="auth-link">{t('auth_forgot')}</a>
              </div>
              {authTab === 'login' && error && <div className="auth-error">{error}</div>}
              <button className={`auth-submit${loading ? ' is-loading' : ''}`} type="button" onClick={handleLoginSubmit} disabled={loading}>
                <span>{t('auth_signin')}</span>
                <svg className="auth-submit__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
                <span className="auth-submit__spinner" />
              </button>
              <div className="auth-divider"><span>{t('auth_or')}</span></div>
              <div className="auth-socials">
                <button className="auth-social" type="button" aria-label="Google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="auth-social" type="button" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>

            {/* ── REGISTER PANEL ── */}
            <div className={`auth-panel${authTab === 'register' ? ' auth-panel--active' : ''}`} ref={registerPanelRef}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="regName">{t('auth_name')}</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input className="auth-input" type="text" id="regName" placeholder={t('auth_name_ph')} autoComplete="name" 
                    value={regName} onChange={(e) => setRegName(e.target.value)} />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="regEmail">{t('auth_email')}</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input className="auth-input" type="email" id="regEmail" placeholder={t('auth_email_ph')} autoComplete="email" 
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="regPassword">{t('auth_password')}</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input className="auth-input" type={showRegPass ? 'text' : 'password'} id="regPassword"
                    placeholder={t('auth_pass_ph')} autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      calcStrength(e.target.value);
                    }} />
                  <button className="auth-input-toggle" type="button" aria-label="Mostrar contraseña" tabIndex={-1} onClick={() => setShowRegPass(v => !v)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {showRegPass
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      }
                    </svg>
                  </button>
                </div>
                <div className={`auth-strength${strength > 0 ? ' is-visible' : ''}`}>
                  <div className="auth-strength__track">
                    <div className="auth-strength__fill" style={{ width: `${strength * 25}%`, background: strengthColor }} />
                  </div>
                  <span className="auth-strength__label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              </div>
              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" id="agreeTerms" />
                  <span className="auth-check__box" />
                  <span>
                    {t('auth_agree_pre') || 'Acepto los'}{' '}
                    <a href="#" className="auth-link">{t('auth_terms') || 'Términos'}</a>
                    {' '}{t('auth_agree_and') || 'y la'}{' '}
                    <a href="#" className="auth-link">{t('auth_privacy') || 'Política de privacidad'}</a>
                  </span>
                </label>
              </div>
              {authTab === 'register' && error && <div className="auth-error">{error}</div>}
              <button className={`auth-submit${loading ? ' is-loading' : ''}`} type="button" onClick={handleRegisterSubmit} disabled={loading}>
                <span>{t('auth_create')}</span>
                <svg className="auth-submit__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
                <span className="auth-submit__spinner" />
              </button>
              <div className="auth-divider"><span>{t('auth_or')}</span></div>
              <div className="auth-socials">
                <button className="auth-social" type="button" aria-label="Google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="auth-social" type="button" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
