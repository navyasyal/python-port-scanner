import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radar, FileBarChart, ScrollText, Info, ChevronsLeft, ShieldHalf } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/scanner', label: 'Scanner', icon: Radar },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/logs', label: 'Logs', icon: ScrollText },
  { to: '/about', label: 'About', icon: Info },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <ShieldHalf size={22} className="brand-icon" />
        {!collapsed && <span className="brand-text">NetRecon</span>}
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} strokeWidth={2} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
        <ChevronsLeft size={16} className={collapsed ? 'rotate' : ''} />
        {!collapsed && <span>Collapse</span>}
      </button>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: var(--sidebar-width);
          background: var(--bg-elevated);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 20;
          transition: width var(--transition-base);
          overflow: hidden;
        }
        .sidebar.collapsed { width: var(--sidebar-width-collapsed); }
        @media (max-width: 900px) { .sidebar { display: none; } }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px;
          height: var(--topbar-height);
          border-bottom: 1px solid var(--border);
          color: var(--accent);
        }
        .brand-icon { flex-shrink: 0; }
        .brand-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.02em;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-body);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .nav-item:hover {
          background: var(--card-hover);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: var(--accent-dim);
          color: var(--accent);
        }

        .sidebar-collapse-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px;
          padding: 10px 12px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 600;
        }
        .sidebar-collapse-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
        .rotate { transform: rotate(180deg); }
      `}</style>
    </aside>
  );
}
