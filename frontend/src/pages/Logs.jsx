import { useCallback, useEffect, useState } from 'react';
import LogsViewer from '../components/LogsViewer';
import api from '../services/api';

export default function Logs() {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getLogs();
      setLog(data.log || '');
    } catch {
      setLog('Could not reach the backend API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="logs-page">
      <div className="section-heading">Activity Logs</div>
      <LogsViewer log={log} onRefresh={fetchLogs} isLoading={loading} />

      <style>{`
        .logs-page { display: flex; flex-direction: column; gap: 16px; }
        .section-heading {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
