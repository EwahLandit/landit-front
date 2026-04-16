import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  collapsed?: boolean;
  onClose: () => void;
  onMenuToggle: () => void;
  notificationCount?: number;
}

export default function Sidebar({ isOpen, collapsed = false, onClose, onMenuToggle, notificationCount = 0 }: SidebarProps) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Semitransparent overlay — mobile only */}
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? ' open' : ''}${collapsed ? ' collapsed' : ''}`} id="sidebar">
        {/* Logo */}
        <NavLink to="/panel" className="sidebar__logo">
          <span className="sidebar__logo-mark">L</span>
          <span className="sidebar__logo-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>LANDIT</span>
        </NavLink>

        {/* Hamburger Menu Button */}
        <button
          className="sidebar__hamburger"
          onClick={onMenuToggle}
          aria-label="Alternar menú"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {/* Principal section */}
          <div className="sidebar__section-label" style={{ transition: 'opacity .2s', whiteSpace: 'nowrap' }}>Principal</div>

          <NavLink
            to="/panel"
            end
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Dashboard</span>
          </NavLink>

          <NavLink
            to="/panel/analytics"
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Analítica</span>
          </NavLink>

          <NavLink
            to="/panel/website"
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Mi Sitio Web</span>
          </NavLink>

          <NavLink
            to="/panel/notifications"
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Notificaciones</span>
            {notificationCount > 0 && (
              <span className="sidebar__badge">{notificationCount}</span>
            )}
          </NavLink>

          <div className="sidebar__divider" />
          <div className="sidebar__section-label" style={{ transition: 'opacity .2s', whiteSpace: 'nowrap' }}>Cuenta</div>

          <NavLink
            to="/panel/support"
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Soporte</span>
          </NavLink>

          <NavLink
            to="/panel/billing"
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Facturación</span>
          </NavLink>

          <NavLink
            to="/panel/settings"
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Configuración</span>
          </NavLink>

          <div className="sidebar__divider" />
          
          <button className="sidebar__link logout-btn" onClick={logout} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="sidebar__label-text" style={{ transition: 'opacity .2s, width .2s', whiteSpace: 'nowrap' }}>Cerrar Sesión</span>
          </button>
        </nav>

        {/* Footer with user info */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user ? getInitials(user.name) : '??'}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.name || 'Usuario'}</div>
              <div className="sidebar__user-email">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
