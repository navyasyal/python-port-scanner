export default function ProgressBar({ percent = 0, label }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="progress-wrap">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
      <div className="progress-percent">{clamped.toFixed(1)}%</div>

      <style>{`
        .progress-wrap { width: 100%; }
        .progress-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }
        .progress-track {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--secondary), var(--accent));
          border-radius: 999px;
          transition: width 300ms var(--ease);
          box-shadow: 0 0 12px -2px var(--accent);
        }
        .progress-percent {
          margin-top: 6px;
          font-family: var(--font-display);
          font-size: 12px;
          color: var(--text-muted);
          text-align: right;
        }
      `}</style>
    </div>
  );
}
