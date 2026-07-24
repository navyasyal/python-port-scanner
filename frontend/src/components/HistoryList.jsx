import { Clock, ChevronRight, Target } from 'lucide-react';

export default function HistoryList({ history = [], onSelect, selectedJobId }) {
  if (!history.length) {
    return (
      <div className="history-empty card fade-in">
        <Clock size={20} />
        <p>No scans run yet this session.</p>
        <style>{`
          .history-empty {
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: var(--text-muted);
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="history-list card fade-in">
      {history.map((item) => (
        <button
          key={item.job_id}
          className={`history-item ${selectedJobId === item.job_id ? 'active' : ''}`}
          onClick={() => onSelect(item.job_id)}
        >
          <div className="history-item-icon">
            <Target size={15} />
          </div>
          <div className="history-item-body">
            <div className="history-item-target mono">{item.target}</div>
            <div className="history-item-meta">
              {item.start_port}-{item.end_port} · {item.open_count} open · {item.elapsed_seconds}s
            </div>
          </div>
          <span className={`status-pill status-${item.status}`}>{item.status}</span>
          <ChevronRight size={14} className="chevron" />
        </button>
      ))}

      <style>{`
        .history-list {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border-soft);
          text-align: left;
          transition: background var(--transition-fast);
          width: 100%;
        }
        .history-item:last-child { border-bottom: none; }
        .history-item:hover { background: var(--card-hover); }
        .history-item.active { background: var(--secondary-dim); }

        .history-item-icon {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
          flex-shrink: 0;
        }
        .history-item-body { flex: 1; min-width: 0; }
        .history-item-target {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .history-item-meta {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .status-pill {
          font-family: var(--font-display);
          font-size: 10px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .status-completed { background: var(--accent-dim); color: var(--accent); }
        .status-running { background: var(--secondary-dim); color: var(--secondary); }
        .status-error { background: var(--danger-dim); color: var(--danger); }
        .status-pending { background: var(--warning-dim); color: var(--warning); }
        .chevron { color: var(--text-muted); flex-shrink: 0; }
      `}</style>
    </div>
  );
}
