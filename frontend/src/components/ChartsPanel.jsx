import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const COLORS = ['#00C853', '#38BDF8', '#FACC15', '#EF4444', '#A78BFA', '#F97316'];

function buildServiceData(results) {
  const counts = {};
  results.forEach((r) => {
    const key = r.service || 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

function buildCategoryData(results) {
  const counts = {};
  results.forEach((r) => {
    const key = r.category || 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

const tooltipStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: 'JetBrains Mono, monospace',
  color: 'var(--text-primary)',
};

export default function ChartsPanel({ openCount = 0, closedCount = 0, results = [] }) {
  const openClosedData = [
    { name: 'Open', value: openCount },
    { name: 'Closed/Filtered', value: closedCount },
  ];
  const serviceData = buildServiceData(results);
  const categoryData = buildCategoryData(results);

  const hasData = results.length > 0;

  return (
    <div className="charts-grid">
      <div className="chart-card card fade-in">
        <div className="chart-title">Open vs Closed Ports</div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={openClosedData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              <Cell fill="#00C853" />
              <Cell fill="#1E293B" stroke="#2A3A54" />
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card card fade-in">
        <div className="chart-title">Services Distribution</div>
        {hasData && serviceData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--card-hover)' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {serviceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmptyState />
        )}
      </div>

      <div className="chart-card card fade-in">
        <div className="chart-title">Port Categories</div>
        {hasData && categoryData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmptyState />
        )}
      </div>

      <style>{`
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .charts-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .charts-grid { grid-template-columns: 1fr; }
        }
        .chart-card { padding: 18px 20px 8px; }
        .chart-title {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}

function ChartEmptyState() {
  return (
    <div style={{
      height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)', fontSize: 12,
    }}>
      No open ports to visualize yet
    </div>
  );
}
