import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, UserPlus, UserCheck, Clock, Bell,
  ChevronRight, RefreshCw, Activity, Loader,
  Mail, Phone, Calendar, CheckCircle, AlertCircle,
} from "lucide-react";
import api from "../services/api";
import "./HRDashboard.css";

function HRDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  const [employees,     setEmployees]     = useState([]);
  const [stats,         setStats]         = useState({});
  const [notifications, setNotifications] = useState([]);
  const [myTasks,       setMyTasks]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [toast,         setToast]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [filterRole,    setFilterRole]    = useState("all");

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "HR";

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async (manual = false) => {
    try {
      if (manual) setRefreshing(true);
      const [usersRes, tasksRes, notifsRes] = await Promise.allSettled([
        api.get("/users"),
        api.get("/tasks/my"),
        api.get("/notifications"),
      ]);

      if (usersRes.status === "fulfilled") {
        const users = usersRes.value.data || [];
        setEmployees(users);
        // Compute stats
        const active    = users.filter(u => u.isActive).length;
        const inactive  = users.filter(u => !u.isActive).length;
        const thisMonth = users.filter(u => {
          const d = new Date(u.createdAt || u.joinDate);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        const byRole = users.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        }, {});
        setStats({ total: users.length, active, inactive, thisMonth, byRole });
      }

      if (tasksRes.status  === "fulfilled") setMyTasks((tasksRes.value.data.tasks || []).slice(0, 5));
      if (notifsRes.status === "fulfilled") setNotifications((notifsRes.value.data || []).slice(0, 5));

      if (manual) showToast("Dashboard refreshed!");
    } catch { showToast("Failed to load data.", true); }
    finally  { setLoading(false); setRefreshing(false); }
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTask = async (task) => {
    const next = task.status === "completed" ? "pending" : "completed";
    try {
      await api.put(`/tasks/${task._id}`, { status: next });
      setMyTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: next } : t));
    } catch { showToast("Failed to update task.", true); }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name?.toLowerCase().includes(search.toLowerCase()) ||
                        emp.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole === "all" || emp.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleColor = (role) => ({
    admin:     { bg:"#fee2e2", color:"#991b1b" },
    manager:   { bg:"#fef3c7", color:"#92400e" },
    sales:     { bg:"#dcfce7", color:"#166534" },
    developer: { bg:"#ede9fe", color:"#4c1d95" },
    hr:        { bg:"#fce7f3", color:"#9d174d" },
    employee:  { bg:"#dbeafe", color:"#1d4ed8" },
  }[role] || { bg:"#f1f5f9", color:"#475569" });

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month:"short", day:"numeric", year:"numeric" }) : "—";

  if (loading) return (
    <div className="hr-loading"><Loader size={24} className="hr-spin" /><p>Loading dashboard...</p></div>
  );

  return (
    <div className="hr-dash">

      {/* ── HEADER ── */}
      <div className="hr-header">
        <div className="hr-header-left">
          <h1><Users size={22} /> HR Dashboard</h1>
          <p><Calendar size={13} />
            {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </p>
        </div>
        <div className="hr-header-right">
          {toast && <span className={`hr-toast ${toast.isError ? "error" : ""}`}>{toast.msg}</span>}
          <button className={`hr-refresh ${refreshing ? "spinning" : ""}`} onClick={() => fetchAll(true)}>
            <RefreshCw size={16} />
          </button>
          <button className="hr-add-btn" onClick={() => navigate("/users")}>
            <UserPlus size={15} /> Add Employee
          </button>
          <div className="hr-avatar">{initials}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="hr-kpi-grid">
        <div className="hr-kpi hr-kpi-blue">
          <div className="hr-kpi-icon"><Users size={20} /></div>
          <div className="hr-kpi-body">
            <span className="hr-kpi-label">Total Employees</span>
            <span className="hr-kpi-value">{stats.total ?? 0}</span>
            <span className="hr-kpi-sub">all staff</span>
          </div>
        </div>
        <div className="hr-kpi hr-kpi-green">
          <div className="hr-kpi-icon"><UserCheck size={20} /></div>
          <div className="hr-kpi-body">
            <span className="hr-kpi-label">Active</span>
            <span className="hr-kpi-value">{stats.active ?? 0}</span>
            <span className="hr-kpi-sub">currently active</span>
          </div>
        </div>
        <div className="hr-kpi hr-kpi-amber">
          <div className="hr-kpi-icon"><UserPlus size={20} /></div>
          <div className="hr-kpi-body">
            <span className="hr-kpi-label">New This Month</span>
            <span className="hr-kpi-value">{stats.thisMonth ?? 0}</span>
            <span className="hr-kpi-sub">new joiners</span>
          </div>
        </div>
        <div className="hr-kpi hr-kpi-red">
          <div className="hr-kpi-icon"><AlertCircle size={20} /></div>
          <div className="hr-kpi-body">
            <span className="hr-kpi-label">Inactive</span>
            <span className="hr-kpi-value">{stats.inactive ?? 0}</span>
            <span className="hr-kpi-sub">deactivated</span>
          </div>
        </div>
      </div>

      {/* ── ROLE BREAKDOWN ── */}
      <div className="hr-card hr-role-card">
        <div className="hr-card-header">
          <h3><Activity size={16} /> Team Breakdown by Role</h3>
        </div>
        <div className="hr-role-grid">
          {Object.entries(stats.byRole || {}).map(([role, count]) => (
            <div key={role} className="hr-role-item">
              <span className="hr-role-badge" style={{ background: roleColor(role).bg, color: roleColor(role).color }}>
                {role}
              </span>
              <span className="hr-role-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="hr-main-grid">

        {/* Employee List */}
        <div className="hr-card">
          <div className="hr-card-header">
            <h3><Users size={16} /> Employee Directory</h3>
            <button className="hr-link" onClick={() => navigate("/users")}>
              Manage <ChevronRight size={12} />
            </button>
          </div>

          {/* Search + Filter */}
          <div className="hr-filters">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="hr-search"
            />
            <select className="hr-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
              <option value="developer">Developer</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div className="hr-emp-list">
            {filteredEmployees.length === 0
              ? <p className="hr-no-data">No employees found</p>
              : filteredEmployees.slice(0, 8).map(emp => (
                <div key={emp._id} className="hr-emp-item">
                  <div className="hr-emp-avatar" style={{ background: roleColor(emp.role).bg, color: roleColor(emp.role).color }}>
                    {emp.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hr-emp-info">
                    <div className="hr-emp-name">{emp.name}</div>
                    <div className="hr-emp-sub">{emp.department || "—"} · Joined {fmtDate(emp.joinDate || emp.createdAt)}</div>
                  </div>
                  <div className="hr-emp-right">
                    <span className="hr-role-badge sm" style={{ background: roleColor(emp.role).bg, color: roleColor(emp.role).color }}>
                      {emp.role}
                    </span>
                    <span className={`hr-status-dot ${emp.isActive ? "active" : "inactive"}`} title={emp.isActive ? "Active" : "Inactive"} />
                  </div>
                  <div className="hr-emp-actions">
                    <button onClick={() => window.open(`mailto:${emp.email}`)} title={emp.email}><Mail size={13} /></button>
                    {emp.phone && <button onClick={() => window.open(`tel:${emp.phone}`)} title={emp.phone}><Phone size={13} /></button>}
                  </div>
                </div>
              ))
            }
          </div>
          {filteredEmployees.length > 8 && (
            <button className="hr-view-more" onClick={() => navigate("/users")}>
              View all {filteredEmployees.length} employees <ChevronRight size={13} />
            </button>
          )}
        </div>

        {/* Right column */}
        <div className="hr-right-col">

          {/* My Tasks */}
          <div className="hr-card">
            <div className="hr-card-header">
              <h3><CheckCircle size={16} /> My Tasks</h3>
              <span className="hr-muted">{myTasks.filter(t => t.status !== "completed").length} pending</span>
            </div>
            <div className="hr-task-list">
              {myTasks.length === 0
                ? <p className="hr-no-data">No tasks assigned</p>
                : myTasks.map(task => (
                  <div key={task._id} className={`hr-task-item ${task.status === "completed" ? "done" : ""}`}>
                    <button
                      className={`hr-task-check ${task.status === "completed" ? "checked" : ""}`}
                      onClick={() => toggleTask(task)}
                    >
                      {task.status === "completed" && <CheckCircle size={12} />}
                    </button>
                    <div className="hr-task-info">
                      <span className="hr-task-title">{task.title}</span>
                      <span className="hr-task-due"><Clock size={10} /> {task.dueDate ? fmtDate(task.dueDate) : "No due date"}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Notifications */}
          <div className="hr-card">
            <div className="hr-card-header">
              <h3><Bell size={16} /> Notifications</h3>
              <button className="hr-link">Mark all read</button>
            </div>
            {notifications.length === 0
              ? <p className="hr-no-data">No notifications</p>
              : notifications.map((n, i) => (
                <div key={n._id || i} className="hr-notif-item">
                  <div className="hr-notif-dot" style={{ background: notifColor(n.type) }} />
                  <div>
                    <div className="hr-notif-text">{n.message || n.description}</div>
                    <div className="hr-notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            }
          </div>

        </div>
      </div>

    </div>
  );
}

export default HRDashboard;

function timeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function notifColor(type) {
  return { task_assign:"#378ADD", deadline:"#EF9F27", user_create:"#1D9E75", announcement:"#534AB7" }[type] || "#888780";
}