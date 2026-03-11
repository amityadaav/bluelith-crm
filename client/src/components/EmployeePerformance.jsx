import React from "react";
import "./EmployeePerformance.css";

function EmployeePerformance({ employees }) {

  return (

    <div className="dashboard-card">

      <h2>Employee Performance</h2>

      <table className="employee-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Projects</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((emp) => (

            <tr key={emp._id}>

              <td>{emp.name}</td>

              <td>{emp.role}</td>

              <td>{emp.projects || 0}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default EmployeePerformance;