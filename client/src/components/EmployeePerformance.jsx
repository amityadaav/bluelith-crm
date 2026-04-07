import React from "react";
import { TrendingUp, Award, FolderOpen, Users } from "lucide-react";

export default function EmployeePerformance({ employees = [], onEmployeeClick }) {
  if (!employees.length) {
    return <div style={{ padding:"32px", textAlign:"center", color:"#94a3b8", fontSize:"14px" }}>No employee data available</div>;
  }

  const maxLeads = Math.max(...employees.map(e => e.totalLeads || 0), 1);

  return (
    <div className="emp-table-wrap">
      <table className="emp-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Leads</th>
            <th>Won</th>
            <th>Conversion</th>
            <th>Projects</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => {
            const conversion = emp.totalLeads > 0
              ? Math.round((emp.wonLeads / emp.totalLeads) * 100)
              : 0;
            const barWidth = Math.round(((emp.totalLeads || 0) / maxLeads) * 100);

            return (
              <tr
                key={emp._id}
                className="emp-row"
                onClick={() => onEmployeeClick && onEmployeeClick(emp._id)}
                style={{ cursor: onEmployeeClick ? "pointer" : "default" }}
              >
                {/* Name + rank */}
                <td>
                  <div className="emp-name-cell">
                    <div className="emp-rank" style={{ background: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7c2f" : "#e8ecf5", color: i < 3 ? "#fff" : "#475569" }}>
                      {i < 3 ? <Award size={12} /> : i + 1}
                    </div>
                    <div className="emp-avatar">
                      {emp.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="emp-name">{emp.name}</p>
                      <span className="emp-role">{emp.role}</span>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td><span className="emp-dept">{emp.department || "—"}</span></td>

                {/* Leads with progress bar */}
                <td>
                  <div className="emp-leads-cell">
                    <span className="emp-stat-num">{emp.totalLeads || 0}</span>
                    <div className="emp-bar-track">
                      <div className="emp-bar-fill" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                </td>

                {/* Won */}
                <td>
                  <span className="emp-won">{emp.wonLeads || 0}</span>
                </td>

                {/* Conversion */}
                <td>
                  <span className={`emp-conversion ${conversion >= 50 ? "high" : conversion >= 25 ? "mid" : "low"}`}>
                    {conversion}%
                  </span>
                </td>

                {/* Projects */}
                <td>
                  <div className="emp-projects-cell">
                    <FolderOpen size={13} color="#94a3b8" />
                    <span>{emp.activeProjects || 0} active</span>
                  </div>
                </td>

                {/* Revenue */}
                <td>
                  <span className="emp-revenue">
                    ₹{((emp.revenue || 0) / 1000).toFixed(0)}K
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}