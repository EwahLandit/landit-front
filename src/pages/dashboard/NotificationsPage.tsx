import { useEffect, useState } from 'react';
import { apiGetNotifications, apiMarkRead, apiMarkAllRead, NotificationItem } from '../../lib/api';
import { NOTIF_ICONS } from '../../lib/notificationIcons';
import { useNotifications } from '../../context/NotificationContext';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days > 1 ? 's' : ''}`;
}

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <>
      <style>{`
        .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; gap:16px; flex-wrap:wrap; }
        .topbar__title { font-size:clamp(1.5rem,3vw,2rem); letter-spacing:-.03em; }
        .topbar__actions { display:flex; align-items:center; gap:10px; }
        .card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow-sm); }
        .card__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; gap:12px; }
        .card__title { font-size:1rem; font-weight:700; color:var(--text); }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; font-family:var(--font-display); font-size:.8125rem; font-weight:600; border-radius:var(--radius-full); transition:all .25s var(--ease-out); white-space:nowrap; cursor:pointer; border:none; background:none; }
        .btn--outline { background:transparent; color:var(--text); border:1.5px solid var(--border-strong); }
        .btn--outline:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
        .btn--sm { padding:7px 14px; font-size:.75rem; }
        .notif-item { display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:background .15s; }
        .notif-item:last-child { border-bottom:none; }
        .notif-item:hover { background:var(--accent-subtle); margin:0 -28px; padding:16px 28px; border-radius:var(--radius); }
        .notif-item.unread .notif-title { font-weight:700; }
        .notif-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:6px; }
        .notif-dot.read { background:var(--border-strong); }
        .notif-icon { width:38px; height:38px; border-radius:var(--radius); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1rem; }
        .notif-content { flex:1; min-width:0; }
        .notif-title { font-size:.875rem; color:var(--text); margin-bottom:2px; }
        .notif-time { font-size:.75rem; color:var(--text-muted); }
        .notif-action { flex-shrink:0; align-self:center; }
        .notif-mark-btn { font-size:.72rem; font-family:var(--font-display); font-weight:700; color:var(--accent); background:var(--accent-subtle); border:1px solid rgba(0,87,255,.2); border-radius:var(--radius-full); padding:3px 10px; cursor:pointer; white-space:nowrap; transition:background .2s; }
        .notif-mark-btn:hover { background:rgba(0,87,255,.2); }
        .notif-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:var(--radius-full); font-size:.7rem; font-family:var(--font-display); font-weight:700; letter-spacing:.04em; text-transform:uppercase; background:var(--accent-subtle); color:var(--accent); border:1px solid rgba(0,87,255,.2); }
        .empty-state { text-align:center; padding:64px 24px; color:var(--text-muted); }
        .empty-state__icon { display:flex; align-items:center; justify-content:center; margin-bottom:16px; opacity:.4; }
        .empty-state__title { font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px; }
        .skeleton { background:var(--border); border-radius:var(--radius); animation:pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="topbar">
        <h1 className="topbar__title">Notificaciones</h1>
        <div className="topbar__actions">
          {unreadCount > 0 && (
            <button className="btn btn--outline btn--sm" onClick={markAllAsRead}>
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Todas las notificaciones</h3>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount} sin leer</span>}
        </div>

        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="notif-item">
              <div className="skeleton" style={{ width:38, height:38, borderRadius:'var(--radius)', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div className="skeleton" style={{ height:14, width:'75%', marginBottom:8 }} />
                <div className="skeleton" style={{ height:11, width:'35%' }} />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
            <div className="empty-state__title">Sin notificaciones</div>
            <p>No tienes notificaciones pendientes.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`notif-item${notif.is_read ? '' : ' unread'}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="notif-icon" style={{ background: notif.icon_bg, color: notif.icon_color }}>
                {NOTIF_ICONS[notif.icon] ?? NOTIF_ICONS.bell}
              </div>
              <div className="notif-content">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-time">{timeAgo(notif.created_at)}</div>
              </div>
              <div className="notif-action" style={{ display:'flex', alignItems:'center', gap:10 }}>
                {!notif.is_read && (
                  <button className="notif-mark-btn" onClick={e => { e.stopPropagation(); markAsRead(notif.id); }}>
                    Marcar como leída
                  </button>
                )}
                <span className={`notif-dot${notif.is_read ? ' read' : ''}`} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
