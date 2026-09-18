import { useState, useEffect } from "react";
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

// ─── Custom Tooltip — Bar Chart ───────────────────────────────
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

// ─── Custom Tooltip — Pie Chart ───────────────────────────────
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

// ─── Responsive chart height hook ─────────────────────────────
function useChartHeight() {
  const [height, setHeight] = useState(260);
  useEffect(() => {
    function update() {
      if (window.innerWidth <= 360) setHeight(180);
      else if (window.innerWidth <= 480) setHeight(200);
      else if (window.innerWidth <= 600) setHeight(220);
      else setHeight(260);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return height;
}

// ─── Main Charts Component ────────────────────────────────────
export default function Charts({ result }) {
  const { theme } = useApp();
  const chartHeight = useChartHeight();
  const { factors, motherTotal, fatherTotal } = result;

  const MOTHER_COLOR = "#ec4899";
  const FATHER_COLOR = "#3b82f6";
  const GRID_COLOR   = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const TICK_COLOR   = theme === "dark" ? "#5a6090" : "#7c7aaa";

  // Shortened labels for X axis
  const barData = factors.map((f) => ({
    name: f.label.split(" ")[0],
    fullName: f.label,
    Mother: f.mother,
    Father: f.father,
  }));

  // Donut pie data
  const pieData = [
    { name: "Mother Total", value: motherTotal, fill: MOTHER_COLOR },
    { name: "Father Total", value: fatherTotal, fill: FATHER_COLOR },
  ];

  return (
    <div className="charts-grid">

      {/* ─── Grouped Bar Chart ─── */}
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: "16px" }}>
          <div className="icon">📈</div>
          Factor Comparison
        </div>

        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={barData}
            margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
            barGap={2}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: TICK_COLOR, fontSize: 10, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: TICK_COLOR, fontSize: 9, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              content={<CustomBarTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="Mother" fill={MOTHER_COLOR} radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="Father" fill={FATHER_COLOR} radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>

        <div className="chart-legend">
          <div className="legend-item"><div className="legend-dot mother" /> Mother</div>
          <div className="legend-item"><div className="legend-dot father" /> Father</div>
        </div>
      </div>

      {/* ─── Donut Pie Chart ─── */}
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: "16px" }}>
          <div className="icon">🥧</div>
          Legacy Distribution
        </div>

        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="62%"
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
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
          Grand Total = 100
        </div>
      </div>

    </div>
  );
}
