import { Menu } from 'lucide-react';

function GithubMark(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.7 5.39-5.26 5.67.41.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55C20.21 21.39 23.5 17.09 23.5 12 23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}
import ThemeToggle from './ThemeToggle';

export default function Navbar({ theme, onToggleTheme, onMobileMenuToggle }) {
  return (
    <header className="topbar">
      <button className="mobile-menu-btn btn btn-ghost" onClick={onMobileMenuToggle} aria-label="Open menu">
        <Menu size={18} />
      </button>

      <div className="topbar-title">
        <span className="dot" />
        Network Reconnaissance Dashboard
      </div>

      <div className="topbar-actions">
        <a
          className="btn btn-ghost"
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
        >
          <GithubMark />
          <span className="gh-label">GitHub</span>
        </a>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <style>{`
        .topbar {
          height: var(--topbar-height);
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-elevated);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .mobile-menu-btn { display: none; }
        @media (max-width: 900px) { .mobile-menu-btn { display: inline-flex; } }

        .topbar-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .topbar-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 560px) { .gh-label { display: none; } }
      `}</style>
    </header>
  );
}
