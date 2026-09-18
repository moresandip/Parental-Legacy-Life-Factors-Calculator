import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useApp } from "../context/AppContext";

// Custom Tooltip for bar chart
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="ct-row">
          <div className="ct-dot" style={{ background: p.fill }} />
          <span style={{ color: p.fill, fontWeight: 600 }}>{p.name}:</span>
          <span style={{ color: "var(--text-primary)" }}>{Number(p.value).toFixed(3)}</span>
        </div>
      ))}
    </div>
  );
}

// Custom Tooltip for pie chart
function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="ct-row">
        <div className="ct-dot" style={{ background: p.payload.fill }} />
        <span style={{ color: p.payload.fill, fontWeight: 700 }}>{p.name}</span>
      </div>
      <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "15px", marginTop: "4px" }}>
        {Number(p.value).toFixed(3)}
      </div>
    </div>
  );
}

export default function Charts({ result }) {
  const { theme } = useApp();
  const { factors, motherTotal, fatherTotal } = result;

  const MOTHER_COLOR = "#ec4899";
  const FATHER_COLOR = "#3b82f6";
  const GRID_COLOR = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const TICK_COLOR = theme === "dark" ? "#5a6090" : "#7c7aaa";

  // Short labels for bar chart X axis
  const barData = factors.map((f) => ({
    name: f.label.split(" ")[0], // First word as short label
    fullName: f.label,
    Mother: f.mother,
    Father: f.father,
  }));

  // Pie chart: totals comparison
  const pieData = [
    { name: "Mother Total", value: motherTotal, fill: MOTHER_COLOR },
    { name: "Father Total", value: fatherTotal, fill: FATHER_COLOR },
  ];

  // Radial-style pie: per-factor mother vs father
  const radarData = factors.map((f) => ({
    name: f.label,
    Mother: f.mother,
    Father: f.father,
    fill: MOTHER_COLOR,
  }));

  return (
    <div className="charts-grid">
      {/* Grouped Bar Chart */}
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: "16px" }}>
          <div className="icon">📈</div>
          Factor Comparison (Bar)
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={barData}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            barGap={4}
            barCategoryGap="28%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: TICK_COLOR, fontSize: 11, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: TICK_COLOR, fontSize: 10, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="Mother" fill={MOTHER_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="Father" fill={FATHER_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>

        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot mother" /> Mother
          </div>
          <div className="legend-item">
            <div className="legend-dot father" /> Father
          </div>
        </div>
      </div>

      {/* Pie Chart — Overall Distribution */}
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: "16px" }}>
          <div className="icon">🥧</div>
          Overall Legacy Distribution
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text via absolute positioning trick */}
        <div style={{ textAlign: "center", marginTop: "-16px", fontSize: "12px", color: "var(--text-muted)" }}>
          Total = 100
        </div>
      </div>
    </div>
  );
}
