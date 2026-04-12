import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiGetStats, apiGetNotifications, DashboardStats, NotificationItem } from '../../lib/api';

function formatTime(s: number) {
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function TrendBadge({ value }: { value: number }) {
  const trend = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
  const label = trend === 'neutral' ? '~0%' : `${value > 0 ? '+' : ''}${value}%`;
  const ArrowIcon = trend === 'up'
    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
    : trend === 'down'
    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
  return <span className={`stat-card__trend stat-card__trend--${trend}`}>{ArrowIcon} {label}</span>;
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetStats(), apiGetNotifications()]).then(([s, n]) => {
      if (!('error' in s)) setStats(s);
      if (!('error' in n)) setNotifs(n.slice(0, 4));
      setLoading(false);
    });
  }, []);

  const cards = stats ? [
    { label: 'Visitas', value: stats.total_visits.toLocaleString(), trend: stats.visits_trend,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Conversiones', value: `${stats.conversion_rate}%`, trend: stats.conversion_trend,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: 'Tiempo en sitio', value: formatTime(stats.avg_time_seconds), trend: stats.time_trend,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Bounce Rate', value: `${stats.bounce_rate}%`, trend: stats.bounce_trend,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
  ] : [];

  return (
    <>
      <style>{`
        .db-header{margin-bottom:32px}
        .db-header h1{font-family:var(--font-display);font-size:2.2rem;font-weight:800;letter-spacing:-.03em;color:var(--text);margin-bottom:4px}
        .db-header p{color:var(--text-muted);font-size:1rem}
        .card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);transition:transform .3s,box-shadow .3s}
        .card:hover{box-shadow:var(--shadow)}
        .card__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:12px}
        .card__title{font-size:1rem;font-weight:700;color:var(--text)}
        .card__icon{width:40px;height:40px;background:var(--accent-subtle);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0;transition:background .3s,color .3s,transform .3s var(--ease-spring)}
        .card:hover .card__icon{background:var(--accent);color:#fff;transform:scale(1.08) rotate(-4deg)}
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:32px}
        .stat-card{position:relative;overflow:hidden}
        .stat-card__value{font-family:var(--font-display);font-size:2rem;font-weight:800;letter-spacing:-.04em;color:var(--text);line-height:1;margin-bottom:4px}
        .stat-card__label{font-size:.8125rem;color:var(--text-muted)}
        .stat-card__trend{display:inline-flex;align-items:center;gap:4px;font-size:.7rem;font-weight:700;font-family:var(--font-display);padding:2px 8px;border-radius:var(--radius-full);margin-top:8px}
        .stat-card__trend--up{background:rgba(0,168,107,.1);color:#00a86b}
        .stat-card__trend--down{background:rgba(255,77,77,.1);color:#ff4d4d}
        .stat-card__trend--neutral{background:var(--accent-subtle);color:#0057ff}
        .grid-2{display:grid;grid-template-columns:1fr;gap:24px}
        @media(min-width:900px){.grid-2{grid-template-columns:1fr 1fr}}
        .activity-item{display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border)}
        .activity-item:last-child{border-bottom:none}
        .activity-icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.8rem}
        .activity-text{font-size:.85rem;font-weight:500;color:var(--text)}
        .activity-time{font-size:.72rem;color:var(--text-muted);margin-top:2px}
        .strategy-card{background:linear-gradient(135deg,var(--accent) 0%,#003de0 100%);border:none;color:#fff;position:relative;overflow:hidden}
        .strategy-card::before{content:'';position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.06);top:-60px;right:-40px;pointer-events:none}
        .strategy-card .card__title{color:#fff}
        .strategy-card .card__icon{background:rgba(255,255,255,.15);color:#fff}
        .strategy-card p{color:rgba(255,255,255,.78);font-size:.875rem;line-height:1.6}
        .strategy-date{font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:#fff;letter-spacing:-.02em;margin:8px 0 4px}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;font-family:var(--font-display);font-size:.8125rem;font-weight:600;border-radius:var(--radius-full);transition:all .25s var(--ease-out);white-space:nowrap;cursor:pointer}
        .btn--outline{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.4)}
        .btn--outline:hover{background:rgba(255,255,255,.15);border-color:#fff}
        .btn--sm{padding:7px 14px;font-size:.75rem}
        .section-link{font-size:.78rem;color:var(--accent);font-family:var(--font-display);font-weight:600;cursor:pointer}
        .section-link:hover{text-decoration:underline}
        .skeleton{background:var(--border);border-radius:var(--radius);animation:pulse 1.5s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .empty-notif{text-align:center;padding:24px;color:var(--text-muted);font-size:.875rem}
      `}</style>

      <div className="db-header">
        <h1>Hola, {user?.name.split(' ')[0] || 'Usuario'}</h1>
        <p>Aquí tienes el resumen de tu sitio esta semana.</p>
      </div>

      <div className="stats-grid">
        {loading
          ? [1,2,3,4].map(i => (
              <div key={i} className="card stat-card">
                <div className="skeleton" style={{ height:40, width:40, borderRadius:'var(--radius)', marginBottom:16 }} />
                <div className="skeleton" style={{ height:32, width:'60%', marginBottom:8 }} />
                <div className="skeleton" style={{ height:14, width:'40%' }} />
              </div>
            ))
          : cards.map(c => (
              <div key={c.label} className="card stat-card">
                <div className="card__header"><div className="card__icon">{c.icon}</div></div>
                <div className="stat-card__value">{c.value}</div>
                <div className="stat-card__label">{c.label}</div>
                <TrendBadge value={c.trend} />
              </div>
            ))
        }
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Actividad reciente</h3>
            <span className="section-link" onClick={() => navigate('/panel/notifications')}>Ver todo →</span>
          </div>
          {loading
            ? [1,2,3].map(i => (
                <div key={i} className="activity-item">
                  <div className="skeleton" style={{ width:32, height:32, borderRadius:'50%', flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div className="skeleton" style={{ height:14, width:'80%', marginBottom:6 }} />
                    <div className="skeleton" style={{ height:11, width:'40%' }} />
                  </div>
                </div>
              ))
            : notifs.length === 0
              ? <p className="empty-notif">Sin actividad reciente.</p>
              : notifs.map(n => (
                  <div key={n.id} className="activity-item">
                    <div className="activity-icon" style={{ background:n.icon_bg, color:n.icon_color }}>{n.icon}</div>
                    <div>
                      <p className="activity-text">{n.title}</p>
                      <p className="activity-time">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                ))
          }
        </div>

        <div className="card strategy-card">
          <div className="card__header">
            <div className="card__title">Strategy Call</div>
            <div className="card__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
          </div>
          <p>Tu próxima sesión de estrategia con el equipo LandIt está programada para:</p>
          <div className="strategy-date">15 Ene, 2026</div>
          <p style={{ marginBottom:'20px' }}>10:00 AM · 45 min · Google Meet</p>
          <button className="btn btn--outline btn--sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Ver en calendario
          </button>
        </div>
      </div>
    </>
  );
}
