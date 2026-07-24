import { useEffect, useState } from 'react';
import { ShieldCheck, Network, Timer, Target, Loader2 } from 'lucide-react';
import ScanForm from '../components/ScanForm';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import ResultsTable from '../components/ResultsTable';
import ChartsPanel from '../components/ChartsPanel';
import useScan from '../hooks/useScan';
import api from '../services/api';

export default function Dashboard() {
  const { job, isScanning, formError, startScan, clearResults } = useScan();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (job?.status === 'completed') {
      api.getHistory().then(setHistory).catch(() => {});
    }
  }, [job?.status]);

  const results = job?.results || [];
  const openCount = job?.open_count ?? 0;
  const scannedCount = job?.scanned_count ?? 0;
  const closedCount = Math.max(scannedCount - openCount, 0);

  return (
    <div className="dashboard-page">
      <section className="hero fade-in">
        <div className="hero-text">
          <h1>Network Reconnaissance Dashboard</h1>
          <p>
            A real-time TCP port scanner and reconnaissance console. Configure a target,
            launch a multithreaded scan, and watch open ports, services, and banners
            resolve live — then export the findings as CSV or JSON.
          </p>
        </div>
        <div className="hero-badge">
          <ShieldCheck size={16} />
          Authorized testing only
        </div>
      </section>

      <ScanForm onStart={startScan} onClear={clearResults} isScanning={isScanning} error={formError} />

      {isScanning && (
        <div className="scan-progress-block card fade-in">
          <LoadingSpinner label={`Scanning ${job?.target || ''}`} />
          <ProgressBar
            percent={job?.progress_percent ?? 0}
            label={`${job?.scanned_count ?? 0} / ${job?.total_ports ?? '—'} ports checked`}
          />
        </div>
      )}

      <div className="stat-row">
        <StatCard icon={Network} label="Open Ports" value={openCount} tone="accent" />
        <StatCard icon={Loader2} label="Ports Scanned" value={scannedCount} tone="default" />
        <StatCard
          icon={Timer}
          label="Scan Time"
          value={job?.elapsed_seconds != null ? `${job.elapsed_seconds}s` : '—'}
          tone="warning"
        />
        <StatCard
          icon={Target}
          label="Target"
          value={job?.target || '—'}
          sublabel={job?.resolved_ip && job.resolved_ip !== job.target ? job.resolved_ip : undefined}
          tone="default"
        />
      </div>

      <ChartsPanel openCount={openCount} closedCount={closedCount} results={results} />

      <div className="section-heading">Scan Results</div>
      <ResultsTable results={results} />

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-text h1 {
          font-size: 26px;
          margin-bottom: 8px;
        }
        .hero-text p {
          max-width: 640px;
          color: var(--text-secondary);
          font-size: 13.5px;
          line-height: 1.6;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: var(--warning-dim);
          color: var(--warning);
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-display);
          white-space: nowrap;
        }
        .scan-progress-block {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stat-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .stat-row { grid-template-columns: 1fr 1fr; }
        }
        .section-heading {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
