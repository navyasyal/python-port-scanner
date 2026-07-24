export default function LoadingSpinner({ label = 'Scanning' }) {
  return (
    <div className="radar-loader">
      <div className="radar-core">
        <span className="ring ring-1" />
        <span className="ring ring-2" />
        <span className="ring ring-3" />
        <span className="dot" />
      </div>
      <span className="radar-label">
        {label}
        <span className="scanning-dot" style={{ marginLeft: 8 }} />
      </span>

      <style>{`
        .radar-loader {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 4px 0;
        }
        .radar-core {
          position: relative;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }
        .radar-core .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid var(--accent);
          animation: pulseRing 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite;
        }
        .ring-2 { animation-delay: 0.5s; }
        .ring-3 { animation-delay: 1s; }
        .radar-core .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px 2px var(--accent);
        }
        .radar-label {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
