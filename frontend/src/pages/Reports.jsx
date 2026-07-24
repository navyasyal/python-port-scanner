import { useEffect, useState } from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import HistoryList from '../components/HistoryList';
import ResultsTable from '../components/ResultsTable';
import ChartsPanel from '../components/ChartsPanel';
import api from '../services/api';

export default function Reports() {
  const [history, setHistory] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getHistory().then((data) => {
      setHistory(data);
      const firstCompleted = data.find((j) => j.status === 'completed');
      if (firstCompleted) handleSelect(firstCompleted.job_id);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async (jobId) => {
    setLoading(true);
    try {
      const data = await api.getScanStatus(jobId);
      setSelectedJob(data);
    } finally {
      setLoading(false);
    }
  };

  const results = selectedJob?.results || [];
  const openCount = selectedJob?.open_count ?? 0;
  const closedCount = Math.max((selectedJob?.scanned_count ?? 0) - openCount, 0);
  const canDownload = selectedJob?.status === 'completed';

  return (
    <div className="reports-page">
      <div className="section-heading">Reports</div>

      <div className="reports-layout">
        <aside className="reports-side">
          <HistoryList history={history} onSelect={handleSelect} selectedJobId={selectedJob?.job_id} />
        </aside>

        <div className="reports-main">
          {selectedJob ? (
            <>
              <div className="report-header card fade-in">
                <div>
                  <div className="report-target mono">{selectedJob.target}</div>
                  <div className="report-meta">
                    {selectedJob.start_port}-{selectedJob.end_port} · {selectedJob.threads} threads ·{' '}
                    {selectedJob.open_count} open of {selectedJob.total_ports} scanned ·{' '}
                    {selectedJob.elapsed_seconds}s
                  </div>
                </div>
                <div className="report-downloads">
                  <a
                    className={`btn btn-ghost ${!canDownload ? 'disabled-link' : ''}`}
                    href={canDownload ? api.downloadCsvUrl(selectedJob.job_id) : undefined}
                  >
                    <FileSpreadsheet size={15} />
                    CSV
                  </a>
                  <a
                    className={`btn btn-ghost ${!canDownload ? 'disabled-link' : ''}`}
                    href={canDownload ? api.downloadJsonUrl(selectedJob.job_id) : undefined}
                  >
                    <FileJson size={15} />
                    JSON
                  </a>
                </div>
              </div>

              <ChartsPanel openCount={openCount} closedCount={closedCount} results={results} />
              <ResultsTable results={results} />
            </>
          ) : (
            <div className="reports-empty card fade-in">
              <Download size={20} />
              <p>Run a scan from the Scanner page, then come back here to view and export the report.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .reports-page { display: flex; flex-direction: column; gap: 16px; }
        .section-heading {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }
        .reports-layout {
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1000px) {
          .reports-layout { grid-template-columns: 1fr; }
        }
        .reports-main { display: flex; flex-direction: column; gap: 18px; }
        .report-header {
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .report-target { font-size: 16px; font-weight: 700; }
        .report-meta { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        .report-downloads { display: flex; gap: 8px; }
        .disabled-link { pointer-events: none; opacity: 0.4; }
        .reports-empty {
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
