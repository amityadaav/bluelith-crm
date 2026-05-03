import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code, GitBranch, FolderOpen, CheckCircle, Clock,
  Bell, ChevronRight, RefreshCw, Activity, Loader,
  AlertCircle, Terminal, Layers, Tag,
} from "lucide-react";
import api from "../services/api";
import "./Developerdashboard.css";

function DeveloperDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  const [taskStats,      setTaskStats]      = useState({ total:0, pending:0, inProgress:0, completed:0 });
  const [tasks,          setTasks]          = useState([]);
  const [projects,       setProjects]       = useState([]);
  const [notifications,  setNotifications]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [toast,          setToast]          = useState(null);
  const [activeTab,      setActiveTab]      = useState("pending");

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "DE";

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async (manual = false) => {
    try {
      if (manual) setRefreshing(true);
      const [statsRes, tasksRes, projectsRes, notifsRes] = await Promise.allSettled([
        api.get("/tasks/my/stats"),
        api.get("/tasks/my"),
        api.get("/projects"),
        api.get("/notifications"),
      ]);

      if (statsRes.status    === "fulfilled") setTaskStats(statsRes.value.data.stats || {});
      if (tasksRes.status    === "fulfilled") setTasks(tasksRes.value.data.tasks || []);
      if (projectsRes.status === "fulfilled") {
        const all = projectsRes.value.data || [];
        setProjects(all.filter(p =>
          p.teamMembers?.some(m => m._id === user._id || m === user._id)
        ).slice(0, 4));
      }
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
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: next } : t));
      setTaskStats(prev => ({
        ...prev,
        completed: next === "completed" ? prev.completed + 1 : prev.completed - 1,
        pending:   next === "pending"   ? prev.pending   + 1 : prev.pending   - 1,
      }));
    } catch { showToast("Failed to update task.", true); }
  };

  const filteredTasks = tasks.filter(t =>
    activeTab === "pending"    ? t.status !== "completed" :
    activeTab === "completed"  ? t.status === "completed" : true
  );

  const getProgress = (p) => p.status === "completed" ? 100 : p.progress ?? 40;
  const progressColor = (s) => ({
    "completed":   "#16a34a",
    "in-progress": "#2563eb",
    "pending":     "#d97706",
    "on-hold":     "#64748b",
  }[s] || "#64748b");

  const priorityClass = (p) => ({ high: "d-badge-high", medium: "d-badge-medium", low: "d-badge-low" }[p] || "d-badge-low");
  const statusClass   = (s) => ({ completed: "d-badge-done", "in-progress": "d-badge-progress", pending: "d-badge-pending" }[s] || "d-badge-pending");

  const fmtDue = (d) => {
    if (!d) return "No deadline";
    const diff = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff === 0)  return "Due Today";
    if (diff === 1)  return "Due Tomorrow";
    if (diff < 0)    return `${Math.abs(diff)}d overdue`;
    return `${diff}d left`;
  };

  const isOverdue = (d) => d && new Date(d) < new Date();

  // Tech stack tags (static — can be made dynamic from user profile)
  const techStack = ["React", "Node.js", "MongoDB", "Express", "Git", "REST API"];

  if (loading) return (
    <div className="d-loading"><Loader size={24} className="d-spin" /><p>Loading dashboard...</p></div>
  );

  return (
    <div className="d-dash">

      {/* ── HEADER ── */}
      <div className="d-header">
        <div className="d-header-left">
          <h1><Terminal size={22} /> Developer Dashboard</h1>
          <p><Clock size={13} />
            {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </p>
        </div>
        <div className="d-header-right">
          {toast && <span className={`d-toast ${toast.isError ? "error" : ""}`}>{toast.msg}</span>}
          <button className={`d-refresh ${refreshing ? "spinning" : ""}`} onClick={() => fetchAll(true)}>
            <RefreshCw size={16} />
          </button>
          <div className="d-avatar">{initials}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="d-kpi-grid">
        <div className="d-kpi d-kpi-blue">
          <div className="d-kpi-icon"><Code size={20} /></div>
          <div className="d-kpi-body">
            <span className="d-kpi-label">Total Tasks</span>
            <span className="d-kpi-value">{taskStats.total ?? 0}</span>
            <span className="d-kpi-sub">assigned to me</span>
          </div>
        </div>
        <div className="d-kpi d-kpi-amber">
          <div className="d-kpi-icon"><AlertCircle size={20} /></div>
          <div className="d-kpi-body">
            <span className="d-kpi-label">Pending</span>
            <span className="d-kpi-value">{taskStats.pending ?? 0}</span>
            <span className="d-kpi-sub">to complete</span>
          </div>
        </div>
        <div className="d-kpi d-kpi-purple">
          <div className="d-kpi-icon"><GitBranch size={20} /></div>
          <div className="d-kpi-body">
            <span className="d-kpi-label">In Progress</span>
            <span className="d-kpi-value">{taskStats.inProgress ?? 0}</span>
            <span className="d-kpi-sub">active now</span>
          </div>
        </div>
        <div className="d-kpi d-kpi-green">
          <div className="d-kpi-icon"><CheckCircle size={20} /></div>
          <div className="d-kpi-body">
            <span className="d-kpi-label">Completed</span>
            <span className="d-kpi-value">{taskStats.completed ?? 0}</span>
            <span className="d-kpi-sub">this week</span>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="d-main-grid">

        {/* Tasks */}
        <div className="d-card">
          <div className="d-card-header">
            <h3><Code size={16} /> My Tasks</h3>
            <div className="d-tab-group">
              {["pending","completed","all"].map(tab => (
                <button key={tab} className={`d-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="d-task-list">
            {filteredTasks.length === 0
              ? <p className="d-no-data">No tasks here</p>
              : filteredTasks.map(task => (
                <div key={task._id} className={`d-task-item ${task.status === "completed" ? "done" : ""}`}>
                  <button
                    className={`d-task-check ${task.status === "completed" ? "checked" : ""}`}
                    onClick={() => toggleTask(task)}
                  >
                    {task.status === "completed" && <CheckCircle size={12} />}
                  </button>
                  <div className="d-task-info">
                    <span className="d-task-title">{task.title}</span>
                    <div className="d-task-meta">
                      <span className={`d-task-due ${isOverdue(task.dueDate) && task.status !== "completed" ? "overdue" : ""}`}>
                        <Clock size={10} /> {fmtDue(task.dueDate)}
                      </span>
                      {task.project?.name && (
                        <span className="d-task-project"><Layers size={10} /> {task.project.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="d-task-badges">
                    <span className={`d-badge ${priorityClass(task.priority)}`}>{task.priority}</span>
                    <span className={`d-badge ${statusClass(task.status)}`}>{task.status}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right column */}
        <div className="d-right-col">

          {/* Tech Stack */}
          <div className="d-card">
            <div className="d-card-header">
              <h3><Tag size={16} /> My Tech Stack</h3>
            </div>
            <div className="d-tech-tags">
              {techStack.map(tech => (
                <span key={tech} className="d-tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="d-card">
            <div className="d-card-header">
              <h3><Bell size={16} /> Notifications</h3>
              <button className="d-link">Mark all read</button>
            </div>
            {notifications.length === 0
              ? <p className="d-no-data">No notifications</p>
              : notifications.map((n, i) => (
                <div key={n._id || i} className="d-notif-item">
                  <div className="d-notif-dot" style={{ background: notifColor(n.type) }} />
                  <div>
                    <div className="d-notif-text">{n.message || n.description}</div>
                    <div className="d-notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <div className="d-card">
        <div className="d-card-header">
          <h3><FolderOpen size={16} /> My Projects</h3>
          <button className="d-link" onClick={() => navigate("/projects")}>
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="d-projects-grid">
          {projects.length === 0
            ? <p className="d-no-data">No projects assigned yet</p>
            : projects.map(proj => (
              <div key={proj._id} className="d-project-card" onClick={() => navigate(`/projects/${proj._id}`)}>
                <div className="d-proj-top">
                  <div className="d-proj-icon"><FolderOpen size={16} /></div>
                  <span className={`d-badge ${statusClass(proj.status)}`}>{proj.status}</span>
                </div>
                <div className="d-proj-name">{proj.name}</div>
                <div className="d-proj-client">{proj.client?.name || proj.clientName || "—"}</div>
                <div className="d-prog-wrap">
                  <div className="d-prog-bar" style={{ width:`${getProgress(proj)}%`, background: progressColor(proj.status) }} />
                </div>
                <div className="d-proj-pct">{getProgress(proj)}%</div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  );
}

export default DeveloperDashboard;

function timeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function notifColor(type) {
  return { task_assign:"#378ADD", deadline:"#EF9F27", project_update:"#1D9E75", announcement:"#534AB7" }[type] || "#888780";
}