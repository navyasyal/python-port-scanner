export default function StatCard({ icon: Icon, label, value, tone = 'default', sublabel }) {
  return (
    <div className={`stat-card card fade-in tone-${tone}`}>
      <div className="stat-icon">
        <Icon size={18} strokeWidth={2.25} />
      </div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sublabel && <div className="stat-sublabel">{sublabel}</div>}
      </div>

      <style>{`
        .stat-card {
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--secondary-dim);
          color: var(--secondary);
          flex-shrink: 0;
        }
        .tone-accent .stat-icon { background: var(--accent-dim); color: var(--accent); }
        .tone-danger .stat-icon { background: var(--danger-dim); color: var(--danger); }
        .tone-warning .stat-icon { background: var(--warning-dim); color: var(--warning); }

        .stat-body { min-width: 0; }
        .stat-value {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
          font-weight: 500;
        }
        .stat-sublabel {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
          font-family: var(--font-display);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
