import { useState } from 'react';
import { Play, Trash2, Crosshair } from 'lucide-react';

const PRESETS = [
  { label: 'Common (20-1024)', value: '20-1024' },
  { label: 'Quick (20-100)', value: '20-100' },
  { label: 'Extended (1-5000)', value: '1-5000' },
];

export default function ScanForm({ onStart, onClear, isScanning, error }) {
  const [target, setTarget] = useState('scanme.nmap.org');
  const [ports, setPorts] = useState('20-1024');
  const [threads, setThreads] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isScanning) return;
    onStart({ target: target.trim(), ports: ports.trim(), threads: Number(threads) });
  };

  return (
    <form className="scan-form card fade-in" onSubmit={handleSubmit}>
      <div className="form-header">
        <Crosshair size={16} />
        <span>Scan Configuration</span>
      </div>

      <div className="form-grid">
        <div className="field field-target">
          <label className="label" htmlFor="target">Target</label>
          <input
            id="target"
            className="input"
            placeholder="IP address or hostname"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={isScanning}
            required
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="ports">Port Range</label>
          <input
            id="ports"
            className="input"
            placeholder="e.g. 20-1024"
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            disabled={isScanning}
            required
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="threads">Threads</label>
          <input
            id="threads"
            type="number"
            min={1}
            max={200}
            className="input"
            value={threads}
            onChange={(e) => setThreads(e.target.value)}
            disabled={isScanning}
          />
        </div>
      </div>

      <div className="presets">
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p.value}
            className="preset-chip"
            onClick={() => setPorts(p.value)}
            disabled={isScanning}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isScanning}>
          <Play size={15} />
          {isScanning ? 'Scanning…' : 'Start Scan'}
        </button>
        <button type="button" className="btn btn-danger" onClick={onClear} disabled={isScanning}>
          <Trash2 size={15} />
          Clear Results
        </button>
      </div>

      <style>{`
        .scan-form { padding: 22px 24px; }
        .form-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .form-header svg { color: var(--accent); }

        .form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 0.7fr;
          gap: 14px;
        }
        @media (max-width: 700px) {
          .form-grid { grid-template-columns: 1fr; }
        }

        .presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }
        .preset-chip {
          font-family: var(--font-display);
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .preset-chip:hover {
          color: var(--secondary);
          border-color: var(--secondary);
        }
        .preset-chip:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-error {
          margin-top: 14px;
          padding: 10px 14px;
          background: var(--danger-dim);
          border: 1px solid var(--danger);
          color: var(--danger);
          border-radius: var(--radius-sm);
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
      `}</style>
    </form>
  );
}
