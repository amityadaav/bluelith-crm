
import { TrendingUp, Award, FolderOpen } from "lucide-react";
import "./EmployeePerformance.css";

export default function EmployeePerformance({ employees = [], onEmployeeClick }) {
  if (!employees.length) {
    return <div className="perf-empty">No employee data available</div>;
  }

  const maxLeads = Math.max(...employees.map((e) => e.totalLeads || 0), 1);

  return (
    <div className="perf-table-wrap">
      <table className="perf-table">
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
              ? Math.round((emp.wonLeads / emp.totalLeads) * 100) : 0;
            const barWidth = Math.round(((emp.totalLeads || 0) / maxLeads) * 100);
            return (
              <tr
                key={emp._id}
                className="perf-row"
                onClick={() => onEmployeeClick?.(emp._id)}
                style={{ cursor: onEmployeeClick ? "pointer" : "default" }}
              >
                <td>
                  <div className="perf-name-cell">
                    <div className="perf-rank" style={{
                      background: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7c2f" : "#e8ecf5",
                      color: i < 3 ? "#fff" : "#475569",
                    }}>
                      {i < 3 ? <Award size={12} /> : i + 1}
                    </div>
                    <div className="perf-avatar">{emp.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="perf-name">{emp.name}</p>
                      <span className="perf-role">{emp.role}</span>
                    </div>
                  </div>
                </td>
                <td><span className="perf-dept">{emp.department || "—"}</span></td>
                <td>
                  <div className="perf-leads-cell">
                    <span className="perf-stat-num">{emp.totalLeads || 0}</span>
                    <div className="perf-bar-track">
                      <div className="perf-bar-fill" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                </td>
                <td><span className="perf-won">{emp.wonLeads || 0}</span></td>
                <td>
                  <span className={`perf-conversion ${conversion >= 50 ? "high" : conversion >= 25 ? "mid" : "low"}`}>
                    {conversion}%
                  </span>
                </td>
                <td>
                  <div className="perf-projects-cell">
                    <FolderOpen size={13} color="#94a3b8" />
                    <span>{emp.activeProjects || 0} active</span>
                  </div>
                </td>
                <td>
                  <span className="perf-revenue">
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