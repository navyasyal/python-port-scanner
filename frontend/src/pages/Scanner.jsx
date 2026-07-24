import { useCallback, useEffect, useState } from 'react';
import ScanForm from '../components/ScanForm';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultsTable from '../components/ResultsTable';
import HistoryList from '../components/HistoryList';
import useScan from '../hooks/useScan';
import api from '../services/api';

export default function Scanner() {
  const { job, isScanning, formError, startScan, clearResults } = useScan();
  const [history, setHistory] = useState([]);
  const [viewedJob, setViewedJob] = useState(null);

  const refreshHistory = useCallback(() => {
    api.getHistory().then(setHistory).catch(() => {});
  }, []);

  useEffect(() => { refreshHistory(); }, [refreshHistory]);

  useEffect(() => {
    if (job?.status === 'completed') refreshHistory();
  }, [job?.status, refreshHistory]);

  useEffect(() => {
    if (job) setViewedJob(job);
  }, [job]);

  const handleSelectHistory = async (jobId) => {
    const data = await api.getScanStatus(jobId);
    setViewedJob(data);
  };

  const displayJob = viewedJob || job;
  const results = displayJob?.results || [];

  return (
    <div className="scanner-page">
      <div className="scanner-main">
        <ScanForm onStart={startScan} onClear={() => { clearResults(); setViewedJob(null); }} isScanning={isScanning} error={formError} />

        {isScanning && (
          <div className="scan-progress-block card fade-in">
            <LoadingSpinner label={`Scanning ${job?.target || ''}`} />
            <ProgressBar
              percent={job?.progress_percent ?? 0}
              label={`${job?.scanned_count ?? 0} / ${job?.total_ports ?? '—'} ports checked`}
            />
          </div>
        )}

        <div className="section-heading">
          {displayJob ? `Results for ${displayJob.target}` : 'Results'}
        </div>
        <ResultsTable results={results} />
      </div>

      <aside className="scanner-side">
        <div className="section-heading">Session History</div>
        <HistoryList history={history} onSelect={handleSelectHistory} selectedJobId={displayJob?.job_id} />
      </aside>

      <style>{`
        .scanner-page {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1000px) {
          .scanner-page { grid-template-columns: 1fr; }
        }
        .scanner-main {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .scanner-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: sticky;
          top: 84px;
        }
        .scan-progress-block {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
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
