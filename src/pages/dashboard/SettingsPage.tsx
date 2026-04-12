import { useEffect, useState } from 'react';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import {
  apiUpdateProfile, apiChangePassword,
  apiGetApiKeys, apiCreateApiKey, apiRevokeApiKey, ApiKeyItem,
} from '../../lib/api';

const REFERRAL_TIERS = [
  { count: 1, reward: '1 mes gratis', detail: 'Por tu primer referido activo', achieved: false },
  { count: 5, reward: '3 meses gratis', detail: 'Al alcanzar 5 referidos activos', achieved: false },
  { count: 10, reward: 'Plan Pro gratis', detail: 'Al alcanzar 10 referidos activos', achieved: false },
];

function maskKey(value: string): string {
  return '••••••••' + value.slice(-4);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="settings-section">
      <h2 className="settings-section__title">{title}</h2>
      <div className="settings-section__body">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, id }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void; id: string;
}) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{description}</span>
      </div>
      <label className="toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle__slider" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const { showToast } = useToast();
  const { user } = useAuth();

  // Perfil
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Seguridad
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);

  // Notificaciones
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: false, marketing: true });

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); }
    apiGetApiKeys().then(res => { if (!('error' in res)) setApiKeys(res); });
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await apiUpdateProfile({ name, email });
    setSavingProfile(false);
    if ('error' in res) { showToast(res.error, 'error'); return; }
    showToast('Perfil actualizado correctamente', 'success');
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { showToast('Las contraseñas no coinciden', 'error'); return; }
    setSavingPwd(true);
    const res = await apiChangePassword(currentPwd, newPwd);
    setSavingPwd(false);
    if ('error' in res) { showToast(res.error, 'error'); return; }
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    showToast('Contraseña actualizada correctamente', 'success');
  };

  const handleCopyKey = (key: ApiKeyItem) => {
    navigator.clipboard.writeText(key.key_value);
    showToast(`API key "${key.name}" copiada al portapapeles`, 'success');
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    const res = await apiCreateApiKey(newKeyName.trim());
    setCreatingKey(false);
    if ('error' in res) { showToast(res.error, 'error'); return; }
    setApiKeys(prev => [...prev, res]);
    setNewKeyName('');
    showToast('API key creada correctamente', 'success');
  };

  const handleRevokeKey = async (id: number) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    await apiRevokeApiKey(id);
    showToast('API key revocada', 'warning');
  };

  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  const referralCode = `LANDIT-${(user?.name ?? 'USER').split(' ')[0].toUpperCase().slice(0, 4)}${user?.id ?? '00'}`;

  return (
    <>
      <style>{`
        .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; gap:16px; flex-wrap:wrap; }
        .topbar__title { font-size:clamp(1.5rem,3vw,2rem); letter-spacing:-.03em; }
        .settings-stack { display:flex; flex-direction:column; gap:28px; }
        .settings-section { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow-sm); }
        .settings-section__title { font-family:var(--font-display); font-size:1rem; font-weight:700; color:var(--text); margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--border); }
        .settings-section__body { display:flex; flex-direction:column; gap:0; }
        .profile-header { display:flex; align-items:center; gap:16px; margin-bottom:24px; }
        .profile-avatar { width:56px; height:56px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:700; font-size:1.1rem; flex-shrink:0; }
        .profile-avatar__name { font-family:var(--font-display); font-size:.9rem; font-weight:700; color:var(--text); }
        .profile-avatar__email { font-size:.78rem; color:var(--text-muted); margin-top:2px; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:640px){ .form-grid { grid-template-columns:1fr; } }
        .form-group { display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
        .form-group:last-of-type { margin-bottom:0; }
        .form-label { font-size:.75rem; font-family:var(--font-display); font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--text-secondary); }
        .form-input { padding:11px 16px; background:var(--bg-alt); color:var(--text); border:1.5px solid var(--border-strong); border-radius:var(--radius); font-size:.9rem; outline:none; transition:border-color .22s,box-shadow .22s; font-family:inherit; }
        .form-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow,rgba(0,87,255,0.18)); }
        .form-actions { display:flex; justify-content:flex-end; margin-top:24px; }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; font-family:var(--font-display); font-size:.8125rem; font-weight:600; border-radius:var(--radius-full); transition:all .25s var(--ease-out); white-space:nowrap; cursor:pointer; border:none; background:none; }
        .btn--primary { background:var(--accent); color:#fff; box-shadow:0 8px 32px rgba(0,87,255,.25); }
        .btn--primary:hover { background:var(--accent-hover,#0044cc); transform:translateY(-2px); }
        .btn--primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .btn--outline { background:transparent; color:var(--text); border:1.5px solid var(--border-strong); }
        .btn--outline:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
        .btn--danger { background:var(--danger,#ff4d4d); color:#fff; }
        .btn--danger:hover { background:#e03030; transform:translateY(-2px); }
        .btn--sm { padding:7px 14px; font-size:.75rem; }
        .btn--ghost { padding:7px 10px; border-radius:var(--radius); color:var(--text-secondary); font-size:.8rem; }
        .btn--ghost:hover { background:var(--border); color:var(--text); }
        .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); }
        .toggle-row:last-child { border-bottom:none; }
        .toggle-info { display:flex; flex-direction:column; gap:2px; }
        .toggle-label { font-size:.875rem; font-weight:500; color:var(--text); }
        .toggle-desc { font-size:.75rem; color:var(--text-muted); }
        .toggle { position:relative; width:42px; height:24px; flex-shrink:0; }
        .toggle input { opacity:0; width:0; height:0; position:absolute; }
        .toggle__slider { position:absolute; inset:0; border-radius:99px; background:var(--border-strong); transition:background .3s var(--ease-out); cursor:pointer; }
        .toggle__slider::before { content:''; position:absolute; width:18px; height:18px; border-radius:50%; background:#fff; top:3px; left:3px; transition:transform .3s var(--ease-spring); box-shadow:0 1px 4px rgba(0,0,0,.2); }
        .toggle input:checked + .toggle__slider { background:var(--accent); }
        .toggle input:checked + .toggle__slider::before { transform:translateX(18px); }
        .api-key-row { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:10px; }
        .api-key-row:last-child { margin-bottom:0; }
        .api-key-name { font-size:.85rem; font-weight:600; color:var(--text); flex:1; }
        .api-key-value { font-family:monospace; font-size:.78rem; color:var(--text-muted); background:var(--bg-alt); padding:4px 10px; border-radius:var(--radius-sm); border:1px solid var(--border); flex:2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px; cursor:pointer; transition:color .2s; }
        .api-key-value:hover { color:var(--text); }
        .api-key-meta { font-size:.72rem; color:var(--text-muted); text-align:right; white-space:nowrap; }
        .api-key-actions { display:flex; gap:6px; }
        .api-key-create { display:flex; gap:10px; margin-top:16px; }
        .api-key-create input { flex:1; padding:9px 14px; background:var(--bg-alt); color:var(--text); border:1.5px solid var(--border-strong); border-radius:var(--radius); font-size:.875rem; outline:none; font-family:inherit; transition:border-color .2s; }
        .api-key-create input:focus { border-color:var(--accent); }
        .referral-code { font-family:var(--font-display); font-size:1.5rem; font-weight:800; letter-spacing:.12em; color:var(--accent); padding:16px 24px; background:var(--accent-subtle); border:2px dashed rgba(0,87,255,.3); border-radius:var(--radius); text-align:center; cursor:pointer; transition:background .2s; user-select:all; }
        .referral-code:hover { background:rgba(0,87,255,.15); }
        .referral-hint { font-size:.75rem; color:var(--text-muted); text-align:center; margin-top:8px; }
        .referral-progress { display:flex; flex-direction:column; gap:12px; margin-top:20px; }
        .referral-tier { display:flex; align-items:center; gap:16px; padding:14px 16px; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg); }
        .referral-tier.achieved { border-color:var(--success); background:rgba(0,168,107,.06); }
        .referral-tier__count { font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:var(--text); width:40px; }
        .referral-tier__info { flex:1; }
        .referral-tier__reward { font-size:.85rem; font-weight:600; color:var(--text); }
        .referral-tier__detail { font-size:.75rem; color:var(--text-muted); }
        .section-sep { height:1px; background:var(--border); margin:20px 0; }
      `}</style>

      <div className="topbar">
        <h1 className="topbar__title">Configuración</h1>
      </div>

      <div className="settings-stack">

        {/* Perfil */}
        <Section title="Perfil">
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <div>
              <div className="profile-avatar__name">{name}</div>
              <div className="profile-avatar__email">{email}</div>
            </div>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Nombre</label>
                <input id="profile-name" className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email</label>
                <input id="profile-email" className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary btn--sm" disabled={savingProfile}>
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </Section>

        {/* Seguridad */}
        <Section title="Seguridad">
          <form onSubmit={handleSavePassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="pwd-current">Contraseña actual</label>
              <input id="pwd-current" className="form-input" type="password" placeholder="••••••••" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="pwd-new">Nueva contraseña</label>
                <input id="pwd-new" className="form-input" type="password" placeholder="••••••••" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pwd-confirm">Confirmar contraseña</label>
                <input id="pwd-confirm" className="form-input" type="password" placeholder="••••••••" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary btn--sm" disabled={savingPwd}>
                {savingPwd ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        </Section>

        {/* API Keys */}
        <Section title="API Keys">
          {apiKeys.map(key => (
            <div key={key.id} className="api-key-row">
              <span className="api-key-name">{key.name}</span>
              <span className="api-key-value" title="Clic para copiar" onClick={() => handleCopyKey(key)}>
                {maskKey(key.key_value)}
              </span>
              <span className="api-key-meta">{new Date(key.created_at).toLocaleDateString('es')}</span>
              <div className="api-key-actions">
                <button className="btn btn--ghost btn--sm" onClick={() => handleCopyKey(key)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copiar
                </button>
                <button className="btn btn--danger btn--sm" onClick={() => handleRevokeKey(key.id)}>Revocar</button>
              </div>
            </div>
          ))}
          {apiKeys.length === 0 && (
            <p style={{ fontSize:'.875rem', color:'var(--text-muted)', marginBottom:12 }}>No tienes API keys activas.</p>
          )}
          <div className="api-key-create">
            <input type="text" placeholder="Nombre de la nueva key (ej. Producción)" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
            <button className="btn btn--primary btn--sm" onClick={handleCreateKey} disabled={creatingKey || !newKeyName.trim()}>
              {creatingKey ? '...' : '+ Crear'}
            </button>
          </div>
        </Section>

        {/* Notificaciones */}
        <Section title="Notificaciones">
          <ToggleRow id="toggle-email" label="Notificaciones por email" description="Recibe actualizaciones importantes en tu correo" checked={notifPrefs.email} onChange={v => setNotifPrefs(p => ({ ...p, email: v }))} />
          <ToggleRow id="toggle-push" label="Notificaciones push" description="Alertas en tiempo real en el navegador" checked={notifPrefs.push} onChange={v => setNotifPrefs(p => ({ ...p, push: v }))} />
          <ToggleRow id="toggle-marketing" label="Comunicaciones de marketing" description="Novedades, ofertas y consejos de LandIt" checked={notifPrefs.marketing} onChange={v => setNotifPrefs(p => ({ ...p, marketing: v }))} />
        </Section>

        {/* Referidos */}
        <Section title="Referidos">
          <div className="referral-code" onClick={() => { navigator.clipboard.writeText(referralCode); showToast('Código de referido copiado', 'success'); }}>
            {referralCode}
          </div>
          <p className="referral-hint">Haz clic para copiar tu código de referido</p>
          <div className="referral-progress">
            {REFERRAL_TIERS.map(tier => (
              <div key={tier.count} className={`referral-tier${tier.achieved ? ' achieved' : ''}`}>
                <div className="referral-tier__count">{tier.count}</div>
                <div className="referral-tier__info">
                  <div className="referral-tier__reward">{tier.reward}</div>
                  <div className="referral-tier__detail">{tier.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </>
  );
}
