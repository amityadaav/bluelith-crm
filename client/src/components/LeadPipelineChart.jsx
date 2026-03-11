import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "New", value: 25 },
  { name: "Contacted", value: 20 },
  { name: "Proposal Sent", value: 15 },
  { name: "Converted", value: 10 },
  { name: "Lost", value: 5 },
];

const COLORS = ["#2196f3", "#ffc107", "#ff9800", "#4caf50", "#f44336"];

function LeadPipelineChart() {

  return (
    <div className="chart-card">

      <h2>Lead Pipeline</h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          >

            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default LeadPipelineChart;