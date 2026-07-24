import { ShieldAlert, Cpu, Layers } from 'lucide-react';

const STACK = [
  { group: 'Backend', items: ['Python 3', 'Flask', 'Flask-CORS', 'ThreadPoolExecutor'] },
  { group: 'Frontend', items: ['React 18', 'Vite', 'Recharts', 'Lucide Icons'] },
  { group: 'Techniques', items: ['TCP Connect Scanning', 'Banner Grabbing', 'Service Fingerprinting'] },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero card fade-in">
        <Layers size={22} />
        <h1>About This Project</h1>
        <p>
          NetRecon began as a command-line TCP port scanner and was rebuilt into a full-stack
          reconnaissance dashboard: the original scan engine now runs behind a Flask API,
          driving a live React dashboard with charts, history, and exportable reports.
        </p>
      </div>

      <div className="about-grid">
        {STACK.map((group) => (
          <div className="about-card card fade-in" key={group.group}>
            <div className="about-card-title">
              <Cpu size={15} />
              {group.group}
            </div>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="disclaimer card fade-in">
        <ShieldAlert size={18} />
        <div>
          <strong>Disclaimer:</strong> This tool is intended for educational use and for
          scanning systems you own or are explicitly authorized to test. Scanning networks
          without permission may be illegal in your jurisdiction.
        </div>
      </div>

      <style>{`
        .about-page { display: flex; flex-direction: column; gap: 20px; max-width: 900px; }
        .about-hero {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: var(--accent);
        }
        .about-hero h1 { color: var(--text-primary); font-size: 22px; }
        .about-hero p { color: var(--text-secondary); font-size: 13.5px; line-height: 1.6; max-width: 640px; }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 800px) { .about-grid { grid-template-columns: 1fr; } }

        .about-card { padding: 18px 20px; }
        .about-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 13px;
          color: var(--secondary);
          margin-bottom: 10px;
        }
        .about-card ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .about-card li {
          font-size: 12.5px;
          color: var(--text-secondary);
          padding-left: 14px;
          position: relative;
        }
        .about-card li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
        }

        .disclaimer {
          padding: 16px 20px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: var(--warning-dim);
          border-color: var(--warning);
          color: var(--text-secondary);
          font-size: 12.5px;
          line-height: 1.6;
        }
        .disclaimer svg { color: var(--warning); flex-shrink: 0; margin-top: 2px; }
      `}</style>
    </div>
  );
}
