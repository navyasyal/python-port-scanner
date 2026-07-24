import { RefreshCw, ScrollText } from 'lucide-react';

export default function LogsViewer({ log = '', onRefresh, isLoading }) {
  const lines = log.split('\n').filter(Boolean);

  return (
    <div className="logs-viewer card fade-in">
      <div className="logs-header">
        <div className="logs-title">
          <ScrollText size={15} />
          scanner.log
          <span className="logs-count">{lines.length} lines</span>
        </div>
        <button className="btn btn-ghost" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="logs-body mono">
        {lines.length ? (
          lines.map((line, i) => (
            <div key={i} className={`log-line ${getLevelClass(line)}`}>
              {line}
            </div>
          ))
        ) : (
          <div className="logs-empty">No log entries yet. Run a scan to generate activity.</div>
        )}
      </div>

      <style>{`
        .logs-viewer { display: flex; flex-direction: column; }
        .logs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        .logs-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 13px;
          color: var(--text-primary);
        }
        .logs-count {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
          margin-left: 6px;
        }
        .logs-body {
          max-height: 480px;
          overflow-y: auto;
          padding: 12px 0;
          font-size: 12px;
          background: var(--bg-elevated);
        }
        .log-line {
          padding: 4px 20px;
          color: var(--text-secondary);
          white-space: pre-wrap;
          word-break: break-all;
        }
        .log-line.level-open { color: var(--accent); }
        .log-line.level-error { color: var(--danger); }
        .log-line:hover { background: var(--card-hover); }
        .logs-empty {
          padding: 40px 20px;
          text-align: center;
          color: var(--text-muted);
        }
        .spin { animation: spin 800ms linear infinite; }
      `}</style>
    </div>
  );
}

function getLevelClass(line) {
  if (/open/i.test(line)) return 'level-open';
  if (/error|invalid|failed/i.test(line)) return 'level-error';
  return '';
}
