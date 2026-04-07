import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, Clock, FolderOpen, Bell, User,
  Calendar, LogIn, LogOut, RefreshCw, Plus,
  ChevronRight, AlertCircle, Loader, Activity,
} from "lucide-react";
import api from "../services/api";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || "{}");

  const [taskStats,      setTaskStats]      = useState({ total:0, pending:0, inProgress:0, completed:0 });
  const [tasks,          setTasks]          = useState([]);
  const [projects,       setProjects]       = useState([]);
  const [notifications,  setNotifications]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [checkedIn,      setCheckedIn]      = useState(false);
  const [checkInTime,    setCheckInTime]    = useState(null);
  const [newTask,        setNewTask]        = useState("");
  const [addingTask,     setAddingTask]     = useState(false);
  const [refreshing,     setRefreshing]     = useState(false);
  const [toast,          setToast]          = useState(null);

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "ME";

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async (manual = false) => {
    try {
      if (manual) setRefreshing(true);
      const [taskStatsRes, tasksRes, projectsRes, notifsRes] = await Promise.allSettled([
        api.get("/tasks/my/stats"),
        api.get("/tasks/my"),
        api.get("/projects"),
        api.get("/notifications"),
      ]);

      if (taskStatsRes.status === "fulfilled") setTaskStats(taskStatsRes.value.data.stats || {});
      if (tasksRes.status    === "fulfilled") setTasks(tasksRes.value.data.tasks || []);
      if (projectsRes.status === "fulfilled") {
        const all = projectsRes.value.data || [];
        // show only projects this user is part of
        setProjects(all.filter(p =>
          p.teamMembers?.some(m => m._id === user._id || m === user._id)
        ).slice(0, 5));
      }
      if (notifsRes.status === "fulfilled") setNotifications((notifsRes.value.data || []).slice(0, 5));

      if (manual) showToast("Dashboard refreshed!");
    } catch (err) {
      showToast("Failed to load data.", true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: nextStatus } : t));
      setTaskStats(prev => ({
        ...prev,
        completed: nextStatus === "completed" ? prev.completed + 1 : prev.completed - 1,
        pending:   nextStatus === "pending"   ? prev.pending   + 1 : prev.pending   - 1,
      }));
    } catch { showToast("Failed to update task.", true); }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setAddingTask(true);
    try {
      // Self-assign task (employee adding their own quick task)
      const res = await api.post("/tasks", {
        title:      newTask.trim(),
        assignedTo: user._id,
        priority:   "medium",
      });
      setTasks(prev => [res.data.task, ...prev]);
      setTaskStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
      setNewTask("");
      showToast("Task added!");
    } catch { showToast("Failed to add task.", true); }
    finally  { setAddingTask(false); }
  };

  const handleCheckin = () => {
    if (!checkedIn) {
      setCheckedIn(true);
      setCheckInTime(new Date());
      showToast("Checked in successfully!");
    } else {
      setCheckedIn(false);
      showToast("Checked out. See you tomorrow!");
    }
  };

  const getProgressColor = (status) => ({
    "completed":   "#1D9E75",
    "in-progress": "#378ADD",
    "pending":     "#EF9F27",
    "on-hold":     "#888780",
  }[status] || "#888780");

  const getProgress = (project) => {
    if (project.status === "completed") return 100;
    if (project.progress !== undefined) return project.progress;
    return 40; // fallback
  };

  const priorityClass = (p) => ({ high: "badge-high", medium: "badge-medium", low: "badge-low" }[p] || "badge-low");
  const statusClass   = (s) => ({ completed: "badge-done", "in-progress": "badge-progress", pending: "badge-pending" }[s] || "badge-pending");

  const fmt = (d) => {
    if (!d) return "No due date";
    const date = new Date(d);
    const today = new Date();
    const diff  = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    if (diff === 0)  return "Today";
    if (diff === 1)  return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0)    return `${Math.abs(diff)}d overdue`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const isOverdue = (d) => d && new Date(d) < new Date() && true;

  if (loading) return (
    <div className="emp-loading">
      <Loader size={24} className="spin" />
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="emp-dash">

      {/* ── HEADER ── */}
      <div className="emp-header">
        <div className="emp-header-left">
          <h1><Activity size={22} /> Employee Dashboard</h1>
          <p>
            <Calendar size={14} />
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="emp-header-right">
          {toast && <span className={`emp-toast ${toast.isError ? "error" : ""}`}>{toast.msg}</span>}
          <button className={`emp-refresh ${refreshing ? "spinning" : ""}`} onClick={() => fetchAll(true)} title="Refresh">
            <RefreshCw size={16} />
          </button>
          <div className="emp-avatar">{initials}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="emp-kpi-grid">
        <div className="emp-kpi emp-kpi-blue">
          <div className="emp-kpi-icon"><CheckCircle size={20} /></div>
          <div className="emp-kpi-body">
            <span className="emp-kpi-label">My Tasks</span>
            <span className="emp-kpi-value">{taskStats.total ?? 0}</span>
            <span className="emp-kpi-sub">assigned to me</span>
          </div>
        </div>
        <div className="emp-kpi emp-kpi-amber">
          <div className="emp-kpi-icon"><Clock size={20} /></div>
          <div className="emp-kpi-body">
            <span className="emp-kpi-label">Pending</span>
            <span className="emp-kpi-value">{taskStats.pending ?? 0}</span>
            <span className="emp-kpi-sub">to complete</span>
          </div>
        </div>
        <div className="emp-kpi emp-kpi-purple">
          <div className="emp-kpi-icon"><AlertCircle size={20} /></div>
          <div className="emp-kpi-body">
            <span className="emp-kpi-label">In Progress</span>
            <span className="emp-kpi-value">{taskStats.inProgress ?? 0}</span>
            <span className="emp-kpi-sub">active now</span>
          </div>
        </div>
        <div className="emp-kpi emp-kpi-green">
          <div className="emp-kpi-icon"><CheckCircle size={20} /></div>
          <div className="emp-kpi-body">
            <span className="emp-kpi-label">Completed</span>
            <span className="emp-kpi-value">{taskStats.completed ?? 0}</span>
            <span className="emp-kpi-sub">this week</span>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="emp-main-grid">

        {/* Tasks */}
        <div className="emp-card emp-tasks-card">
          <div className="emp-card-header">
            <h3><CheckCircle size={16} /> My Tasks</h3>
            <span className="emp-muted">{taskStats.pending} pending</span>
          </div>

          <div className="emp-task-list">
            {tasks.length === 0
              ? <p className="emp-no-data">No tasks assigned yet</p>
              : tasks.map(task => (
                <div key={task._id} className={`emp-task-item ${task.status === "completed" ? "done" : ""}`}>
                  <button
                    className={`emp-task-check ${task.status === "completed" ? "checked" : ""}`}
                    onClick={() => toggleTaskStatus(task)}
                    title="Toggle complete"
                  >
                    {task.status === "completed" && <CheckCircle size={14} />}
                  </button>
                  <div className="emp-task-info">
                    <span className="emp-task-title">{task.title}</span>
                    <span className={`emp-task-due ${isOverdue(task.dueDate) && task.status !== "completed" ? "overdue" : ""}`}>
                      <Clock size={10} /> {fmt(task.dueDate)}
                    </span>
                  </div>
                  <span className={`emp-badge ${priorityClass(task.priority)}`}>{task.priority}</span>
                </div>
              ))
            }
          </div>

          <div className="emp-add-task">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddTask()}
            />
            <button onClick={handleAddTask} disabled={addingTask}>
              {addingTask ? <Loader size={14} className="spin" /> : <Plus size={14} />}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="emp-right-col">

          {/* Attendance */}
          <div className="emp-card">
            <div className="emp-card-header">
              <h3><Clock size={16} /> Attendance</h3>
              {checkInTime && <span className="emp-muted">In: {checkInTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
            </div>
            <div className="emp-attend-stats">
              <div className="emp-mini-stat"><span className="emp-mini-val">22</span><span className="emp-mini-label">Present</span></div>
              <div className="emp-mini-stat"><span className="emp-mini-val">2</span><span className="emp-mini-label">Absent</span></div>
              <div className="emp-mini-stat"><span className="emp-mini-val">1</span><span className="emp-mini-label">Leave</span></div>
            </div>
            <button className={`emp-checkin-btn ${checkedIn ? "out" : ""}`} onClick={handleCheckin}>
              {checkedIn ? <><LogOut size={14} /> Check Out</> : <><LogIn size={14} /> Check In</>}
            </button>
          </div>

          {/* Profile */}
          <div className="emp-card">
            <div className="emp-card-header">
              <h3><User size={16} /> My Profile</h3>
              <button className="emp-link" onClick={() => navigate("/profile")}>Edit <ChevronRight size={12} /></button>
            </div>
            <div className="emp-profile-rows">
              <div className="emp-profile-row"><span className="emp-profile-label">Name</span><span className="emp-profile-val">{user.name || "—"}</span></div>
              <div className="emp-profile-row"><span className="emp-profile-label">Role</span><span className={`emp-badge badge-progress`}>{user.role || "employee"}</span></div>
              <div className="emp-profile-row"><span className="emp-profile-label">Department</span><span className="emp-profile-val">{user.department || "—"}</span></div>
              <div className="emp-profile-row"><span className="emp-profile-label">Email</span><span className="emp-profile-val emp-email">{user.email || "—"}</span></div>
              <div className="emp-profile-row">
                <span className="emp-profile-label">Joined</span>
                <span className="emp-profile-val">
                  {user.joinDate ? new Date(user.joinDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── PROJECTS + NOTIFICATIONS ── */}
      <div className="emp-bottom-grid">

        {/* Projects */}
        <div className="emp-card">
          <div className="emp-card-header">
            <h3><FolderOpen size={16} /> My Projects</h3>
            <button className="emp-link" onClick={() => navigate("/projects")}>View All <ChevronRight size={12} /></button>
          </div>
          {projects.length === 0
            ? <p className="emp-no-data">No projects assigned yet</p>
            : projects.map(proj => (
              <div key={proj._id} className="emp-project-item" onClick={() => navigate(`/projects/${proj._id}`)}>
                <div className="emp-proj-icon"><FolderOpen size={15} /></div>
                <div className="emp-proj-info">
                  <div className="emp-proj-name">{proj.name}</div>
                  <div className="emp-proj-meta">
                    <span className={`emp-badge ${statusClass(proj.status)}`}>{proj.status}</span>
                  </div>
                  <div className="emp-prog-wrap">
                    <div className="emp-prog-bar" style={{ width: `${getProgress(proj)}%`, background: getProgressColor(proj.status) }} />
                  </div>
                </div>
                <span className="emp-proj-pct">{getProgress(proj)}%</span>
              </div>
            ))
          }
        </div>

        {/* Notifications */}
        <div className="emp-card">
          <div className="emp-card-header">
            <h3><Bell size={16} /> Notifications</h3>
            <button className="emp-link">Mark all read</button>
          </div>
          {notifications.length === 0
            ? <p className="emp-no-data">No notifications</p>
            : notifications.map((n, i) => (
              <div key={n._id || i} className="emp-notif-item">
                <div className="emp-notif-dot" style={{ background: notifColor(n.type) }} />
                <div>
                  <div className="emp-notif-text">{n.message || n.description}</div>
                  <div className="emp-notif-time">{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))
          }
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;

/* ── Helpers ── */
function timeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)     return "Just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function notifColor(type) {
  return {
    task_assign:   "#378ADD",
    deadline:      "#EF9F27",
    project_update:"#1D9E75",
    announcement:  "#534AB7",
    leave:         "#E24B4A",
  }[type] || "#888780";
}