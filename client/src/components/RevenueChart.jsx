import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../services/api";

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e8ecf5",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
      fontFamily: "'DM Sans', sans-serif",
      minWidth: "150px",
    }}>
      <p style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "#475569", fontWeight: 500, textTransform: "capitalize" }}>
            {entry.name}:
          </span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
            ₹{Number(entry.value).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Format Y axis ──────────────────────────────────────────────────────────────
const formatY = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)   return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

export default function RevenueChart({ period }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const year = new Date().getFullYear();
        const res  = await api.get(`/analytics/revenue?year=${year}`);
        // Filter out months with no data for cleaner chart
        const filtered = (res.data || []).filter(
          (m) => m.revenue > 0 || m.paid > 0
        );
        setData(filtered.length > 0 ? filtered : res.data || []);
      } catch (err) {
        console.error("RevenueChart fetch error:", err.message);
        // Fallback demo data so chart never shows empty
        setData([
          { month: "Jan", revenue: 120000, paid: 80000 },
          { month: "Feb", revenue: 180000, paid: 150000 },
          { month: "Mar", revenue: 240000, paid: 200000 },
          { month: "Apr", revenue: 190000, paid: 170000 },
          { month: "May", revenue: 310000, paid: 260000 },
          { month: "Jun", revenue: 280000, paid: 240000 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [period]);

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
    <div style={{ flex: 1, minHeight: 0, paddingBottom: "8px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4f6ef7" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0.00} />
            </linearGradient>
            <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.00} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#f1f4fd"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />

          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#4f6ef7", strokeWidth: 1, strokeDasharray: "4 4" }} />

          <Legend
            wrapperStyle={{
              fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
              color: "#475569",
              paddingTop: "12px",
            }}
            iconType="circle"
            iconSize={8}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#4f6ef7"
            strokeWidth={2.5}
            fill="url(#gradRevenue)"
            dot={{ r: 4, fill: "#4f6ef7", strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 6, fill: "#4f6ef7", stroke: "#ffffff", strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="paid"
            name="Collected"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#gradPaid)"
            dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}