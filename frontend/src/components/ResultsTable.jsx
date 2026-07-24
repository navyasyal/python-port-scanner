import { CheckCircle2, XCircle, Terminal } from 'lucide-react';

export default function ResultsTable({ results = [] }) {
  if (!results.length) {
    return (
      <div className="results-empty card fade-in">
        <Terminal size={22} />
        <p>No results yet. Configure a target above and start a scan.</p>
        <style>{`
          .results-empty {
            padding: 48px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            color: var(--text-muted);
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="results-table-wrap card fade-in">
      <table className="results-table">
        <thead>
          <tr>
            <th>Port</th>
            <th>Status</th>
            <th>Service</th>
            <th>Category</th>
            <th>Banner</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr key={row.port}>
              <td className="mono port-cell">{row.port}</td>
              <td>
                <span className={`badge ${row.status === 'Open' ? 'badge-open' : 'badge-closed'}`}>
                  {row.status === 'Open' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {row.status}
                </span>
              </td>
              <td>{row.service}</td>
              <td className="category-cell">{row.category}</td>
              <td className="mono banner-cell" title={row.banner}>{row.banner}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .results-table-wrap {
          overflow-x: auto;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .results-table thead th {
          text-align: left;
          padding: 14px 18px;
          font-family: var(--font-display);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
        .results-table tbody td {
          padding: 12px 18px;
          border-bottom: 1px solid var(--border-soft);
          color: var(--text-primary);
        }
        .results-table tbody tr {
          transition: background var(--transition-fast);
        }
        .results-table tbody tr:hover {
          background: var(--card-hover);
        }
        .results-table tbody tr:last-child td { border-bottom: none; }
        .port-cell { font-weight: 700; color: var(--secondary); }
        .category-cell { color: var(--text-secondary); font-size: 12px; }
        .banner-cell {
          max-width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text-secondary);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
