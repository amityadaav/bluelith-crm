import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import api from "../services/api";

// ── Colour palette per status ──────────────────────────────────────────────────
const STATUS_COLORS = {
  new:         "#4f6ef7",
  contacted:   "#f59e0b",
  qualified:   "#10b981",
  proposal:    "#8b5cf6",
  negotiation: "#ec4899",
  won:         "#22c55e",
  lost:        "#ef4444",
};

const DEFAULT_COLOR = "#94a3b8";

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0].payload;
  const total = payload[0].payload.total || 1;
  const pct   = Math.round((value / total) * 100);

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e8ecf5",
      borderRadius: "12px",
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", textTransform: "capitalize", marginBottom: "4px" }}>
        {name}
      </p>
      <p style={{ fontSize: "13px", color: "#475569" }}>
        <span style={{ fontWeight: 700, color: "#4f6ef7", fontFamily: "'Syne', sans-serif" }}>{value}</span> leads
        <span style={{ color: "#94a3b8", marginLeft: 6 }}>({pct}%)</span>
      </p>
    </div>
  );
};

// ── Custom Legend ──────────────────────────────────────────────────────────────
const CustomLegend = ({ payload }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px 12px",
    padding: "12px 4px 0",
  }}>
    {payload.map((entry) => (
      <div key={entry.value} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{
          width: 10, height: 10,
          borderRadius: "3px",
          background: entry.color,
          flexShrink: 0,
          display: "inline-block",
        }} />
        <span style={{
          fontSize: "12px",
          fontFamily: "'DM Sans', sans-serif",
          color: "#475569",
          fontWeight: 500,
          textTransform: "capitalize",
          whiteSpace: "nowrap",
        }}>
          {entry.value}
          <span style={{ color: "#94a3b8", marginLeft: 4, fontWeight: 400 }}>
            ({entry.payload.value})
          </span>
        </span>
      </div>
    ))}
  </div>
);

// ── Custom label inside slice (only for large slices) ─────────────────────────
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null; // skip tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "11px", fontWeight: 700, fill: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function LeadPipelineChart() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setLoading(true);
        const res = await api.get("/analytics/leads-pipeline");
        const raw = res.data || [];

        // Filter zero-count statuses, attach total for tooltip %
        const filtered = raw.filter((d) => d.count > 0);
        const total    = filtered.reduce((s, d) => s + d.count, 0);

        const shaped = filtered.map((d) => ({
          name:  d.status,
          value: d.count,
          total,
          color: STATUS_COLORS[d.status] || DEFAULT_COLOR,
        }));

        setData(shaped.length > 0 ? shaped : getFallback());
      } catch (err) {
        console.error("LeadPipelineChart fetch error:", err.message);
        setData(getFallback());
      } finally {
        setLoading(false);
      }
    };
    fetchPipeline();
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 28, height: 28,
          border: "3px solid #e8ecf5",
          borderTopColor: "#4f6ef7",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius="65%"
            innerRadius="30%"
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            strokeWidth={2}
            stroke="#ffffff"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={80}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Fallback demo data ─────────────────────────────────────────────────────────
function getFallback() {
  const items = [
    { name: "new",         value: 8,  color: STATUS_COLORS.new },
    { name: "contacted",   value: 5,  color: STATUS_COLORS.contacted },
    { name: "qualified",   value: 6,  color: STATUS_COLORS.qualified },
    { name: "proposal",    value: 4,  color: STATUS_COLORS.proposal },
    { name: "negotiation", value: 3,  color: STATUS_COLORS.negotiation },
    { name: "won",         value: 7,  color: STATUS_COLORS.won },
    { name: "lost",        value: 2,  color: STATUS_COLORS.lost },
  ];
  const total = items.reduce((s, d) => s + d.value, 0);
  return items.map((d) => ({ ...d, total }));
}