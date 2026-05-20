
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../services/api";

const STATUS_COLORS = {
  new:"#4f6ef7", contacted:"#f59e0b", qualified:"#10b981",
  proposal:"#8b5cf6", negotiation:"#ec4899", won:"#22c55e", lost:"#ef4444",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, total } = payload[0].payload;
  const pct = Math.round((value / (total || 1)) * 100);
  return (
    <div style={{ background:"#fff", border:"1px solid #e8ecf5", borderRadius:12, padding:"10px 14px", boxShadow:"0 8px 24px rgba(15,23,42,0.12)", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:13, fontWeight:700, color:"#0f172a", textTransform:"capitalize", marginBottom:4 }}>{name}</p>
      <p style={{ fontSize:13, color:"#475569" }}>
        <span style={{ fontWeight:700, color:"#4f6ef7" }}>{value}</span> leads
        <span style={{ color:"#94a3b8", marginLeft:6 }}>({pct}%)</span>
      </p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 12px", padding:"12px 4px 0" }}>
    {payload.map((e) => (
      <div key={e.value} style={{ display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ width:10, height:10, borderRadius:3, background:e.color, flexShrink:0, display:"inline-block" }} />
        <span style={{ fontSize:12, fontFamily:"'DM Sans',sans-serif", color:"#475569", fontWeight:500, textTransform:"capitalize", whiteSpace:"nowrap" }}>
          {e.value} <span style={{ color:"#94a3b8", fontWeight:400 }}>({e.payload.value})</span>
        </span>
      </div>
    ))}
  </div>
);

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{ fontSize:11, fontWeight:700, fill:"#fff" }}>{`${(percent*100).toFixed(0)}%`}</text>;
};

const FALLBACK = () => {
  const items = [
    { name:"new",8:undefined }, { name:"contacted",5:undefined }, { name:"qualified",6:undefined },
    { name:"proposal",4:undefined }, { name:"negotiation",3:undefined }, { name:"won",7:undefined }, { name:"lost",2:undefined },
  ].map((_,i,a) => {
    const vals = [8,5,6,4,3,7,2];
    const s = ["new","contacted","qualified","proposal","negotiation","won","lost"][i];
    return { name:s, value:vals[i], color:STATUS_COLORS[s] };
  });
  const total = items.reduce((s,d) => s+d.value, 0);
  return items.map((d) => ({ ...d, total }));
};

export default function LeadPipelineChart() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/leads-pipeline").then((res) => {
      const raw      = res.data || [];
      const filtered = raw.filter((d) => d.count > 0);
      const total    = filtered.reduce((s,d) => s+d.count, 0);
      const shaped   = filtered.map((d) => ({ name:d.status, value:d.count, total, color:STATUS_COLORS[d.status]||"#94a3b8" }));
      setData(shaped.length > 0 ? shaped : FALLBACK());
    }).catch(() => setData(FALLBACK())).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:28, height:28, border:"3px solid #e8ecf5", borderTopColor:"#4f6ef7", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ flex:1, minHeight:0, display:"flex", flexDirection:"column" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top:0, right:0, bottom:0, left:0 }}>
          <Pie data={data} cx="50%" cy="45%" outerRadius="65%" innerRadius="30%" dataKey="value" labelLine={false} label={renderLabel} strokeWidth={2} stroke="#fff">
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} verticalAlign="bottom" height={80} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}