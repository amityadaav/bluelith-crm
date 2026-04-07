import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Users, UserPlus, Target,
  CheckCircle, Clock, Bell, ChevronRight, RefreshCw,
  Mail, Phone, Activity, Loader, DollarSign, Award,
} from "lucide-react";
import api from "../services/api";
import "./SalesDashboard.css";

function SalesDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats,         setStats]         = useState({});
  const [myLeads,       setMyLeads]       = useState([]);
  const [myClients,     setMyClients]     = useState([]);
  const [myTasks,       setMyTasks]       = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [toast,         setToast]         = useState(null);
  const [activeTab,     setActiveTab]     = useState("leads");

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "SA";

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async (manual = false) => {
    try {
      if (manual) setRefreshing(true);
      const [leadsRes, clientsRes, tasksRes, notifsRes] = await Promise.allSettled([
        api.get("/leads"),
        api.get("/clients"),
        api.get("/tasks/my"),
        api.get("/notifications"),
      ]);

      if (leadsRes.status === "fulfilled") {
        const leads = leadsRes.value.data || [];
        // Filter leads assigned to this sales person
        const mine = leads.filter(l =>
          l.assignedTo?._id === user._id || l.assignedTo === user._id
        );
        setMyLeads(mine);
        // Compute stats
        const won       = mine.filter(l => l.status === "won").length;
        const lost      = mine.filter(l => l.status === "lost").length;
        const active    = mine.filter(l => !["won","lost"].includes(l.status)).length;
        const revenue   = mine.filter(l => l.status === "won").reduce((s, l) => s + (l.estimatedValue || 0), 0);
        const convRate  = mine.length ? Math.round((won / mine.length) * 100) : 0;
        setStats({ total: mine.length, won, lost, active, revenue, convRate });
      }

      if (clientsRes.status === "fulfilled") {
        const clients = clientsRes.value.data || [];
        setMyClients(clients.filter(c =>
          c.assignedTo?._id === user._id || c.assignedTo === user._id
        ).slice(0, 5));
      }

      if (tasksRes.status === "fulfilled") setMyTasks((tasksRes.value.data.tasks || []).slice(0, 6));
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

  const fmt = (n = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const statusColor = (s) => ({
    new:         { bg: "#dbeafe", color: "#1d4ed8" },
    contacted:   { bg: "#fef3c7", color: "#92400e" },
    qualified:   { bg: "#ede9fe", color: "#4c1d95" },
    proposal:    { bg: "#fce7f3", color: "#9d174d" },
    negotiation: { bg: "#ffedd5", color: "#9a3412" },
    won:         { bg: "#dcfce7", color: "#166534" },
    lost:        { bg: "#fee2e2", color: "#991b1b" },
    active:      { bg: "#dcfce7", color: "#166534" },
    inactive:    { bg: "#f1f5f9", color: "#475569" },
  }[s] || { bg: "#f1f5f9", color: "#475569" });

  const priorityClass = (p) => ({ high: "s-badge-high", medium: "s-badge-medium", low: "s-badge-low" }[p] || "s-badge-low");

  // Pipeline stages
  const pipeline = ["new","contacted","qualified","proposal","negotiation","won","lost"];
  const pipelineCount = (stage) => myLeads.filter(l => l.status === stage).length;

  if (loading) return (
    <div className="s-loading">
      <Loader size={24} className="s-spin" />
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="s-dash">

      {/* ── HEADER ── */}
      <div className="s-header">
        <div className="s-header-left">
          <h1><Activity size={22} /> Sales Dashboard</h1>
          <p>
            <Clock size={13} />
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="s-header-right">
          {toast && <span className={`s-toast ${toast.isError ? "error" : ""}`}>{toast.msg}</span>}
          <button className={`s-refresh ${refreshing ? "spinning" : ""}`} onClick={() => fetchAll(true)}>
            <RefreshCw size={16} />
          </button>
          <button className="s-new-lead" onClick={() => navigate("/leads")}>
            <UserPlus size={15} /> New Lead
          </button>
          <div className="s-avatar">{initials}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="s-kpi-grid">
        <div className="s-kpi s-kpi-blue">
          <div className="s-kpi-icon"><UserPlus size={20} /></div>
          <div className="s-kpi-body">
            <span className="s-kpi-label">My Leads</span>
            <span className="s-kpi-value">{stats.total ?? 0}</span>
            <span className="s-kpi-sub">{stats.active ?? 0} active</span>
          </div>
        </div>
        <div className="s-kpi s-kpi-green">
          <div className="s-kpi-icon"><Award size={20} /></div>
          <div className="s-kpi-body">
            <span className="s-kpi-label">Won</span>
            <span className="s-kpi-value">{stats.won ?? 0}</span>
            <span className="s-kpi-sub">closed deals</span>
          </div>
        </div>
        <div className="s-kpi s-kpi-purple">
          <div className="s-kpi-icon"><TrendingUp size={20} /></div>
          <div className="s-kpi-body">
            <span className="s-kpi-label">Conversion</span>
            <span className="s-kpi-value">{stats.convRate ?? 0}%</span>
            <span className="s-kpi-sub">win rate</span>
          </div>
        </div>
        <div className="s-kpi s-kpi-amber">
          <div className="s-kpi-icon"><DollarSign size={20} /></div>
          <div className="s-kpi-body">
            <span className="s-kpi-label">Revenue Won</span>
            <span className="s-kpi-value s-kpi-value-sm">{fmt(stats.revenue)}</span>
            <span className="s-kpi-sub">from closed deals</span>
          </div>
        </div>
      </div>

      {/* ── PIPELINE ── */}
      <div className="s-card s-pipeline-card">
        <div className="s-card-header">
          <h3><Target size={16} /> Lead Pipeline</h3>
          <button className="s-link" onClick={() => navigate("/leads")}>
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="s-pipeline">
          {pipeline.map((stage, i) => (
            <div key={stage} className="s-pipe-stage">
              <div className={`s-pipe-bar ${stage === "won" ? "won" : stage === "lost" ? "lost" : ""}`}>
                <span className="s-pipe-count">{pipelineCount(stage)}</span>
              </div>
              <span className="s-pipe-label">{stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="s-main-grid">

        {/* Leads + Clients Tabs */}
        <div className="s-card">
          <div className="s-tabs">
            <button className={`s-tab ${activeTab === "leads" ? "active" : ""}`} onClick={() => setActiveTab("leads")}>
              <UserPlus size={14} /> My Leads
            </button>
            <button className={`s-tab ${activeTab === "clients" ? "active" : ""}`} onClick={() => setActiveTab("clients")}>
              <Users size={14} /> My Clients
            </button>
          </div>

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <div className="s-list">
              {myLeads.length === 0
                ? <p className="s-no-data">No leads assigned yet</p>
                : myLeads.slice(0, 6).map(lead => (
                  <div key={lead._id} className="s-list-item" onClick={() => navigate(`/leads/${lead._id}`)}>
                    <div className="s-item-avatar">{lead.name?.charAt(0).toUpperCase()}</div>
                    <div className="s-item-info">
                      <div className="s-item-name">{lead.name}</div>
                      <div className="s-item-sub">
                        <Mail size={11} /> {lead.email}
                      </div>
                    </div>
                    <div className="s-item-right">
                      <span className="s-status-badge" style={{ background: statusColor(lead.status).bg, color: statusColor(lead.status).color }}>
                        {lead.status}
                      </span>
                      <span className="s-item-value">{lead.estimatedValue ? fmt(lead.estimatedValue) : "—"}</span>
                    </div>
                  </div>
                ))
              }
              <button className="s-view-more" onClick={() => navigate("/leads")}>
                View all {myLeads.length} leads <ChevronRight size={13} />
              </button>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <div className="s-list">
              {myClients.length === 0
                ? <p className="s-no-data">No clients assigned yet</p>
                : myClients.map(client => (
                  <div key={client._id} className="s-list-item" onClick={() => navigate(`/clients/${client._id}`)}>
                    <div className="s-item-avatar client">{client.name?.charAt(0).toUpperCase()}</div>
                    <div className="s-item-info">
                      <div className="s-item-name">{client.name}</div>
                      <div className="s-item-sub">{client.company}</div>
                    </div>
                    <div className="s-item-right">
                      <span className="s-status-badge" style={{ background: statusColor(client.status).bg, color: statusColor(client.status).color }}>
                        {client.status}
                      </span>
                      <div className="s-contact-btns">
                        <button onClick={e => { e.stopPropagation(); window.open(`mailto:${client.email}`); }}><Mail size={12} /></button>
                        <button onClick={e => { e.stopPropagation(); window.open(`tel:${client.phone}`); }}><Phone size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))
              }
              <button className="s-view-more" onClick={() => navigate("/clients")}>
                View all clients <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="s-right-col">

          {/* Tasks */}
          <div className="s-card">
            <div className="s-card-header">
              <h3><CheckCircle size={16} /> My Tasks</h3>
              <span className="s-muted">{myTasks.filter(t => t.status !== "completed").length} pending</span>
            </div>
            <div className="s-task-list">
              {myTasks.length === 0
                ? <p className="s-no-data">No tasks assigned</p>
                : myTasks.map(task => (
                  <div key={task._id} className={`s-task-item ${task.status === "completed" ? "done" : ""}`}>
                    <button
                      className={`s-task-check ${task.status === "completed" ? "checked" : ""}`}
                      onClick={() => toggleTask(task)}
                    >
                      {task.status === "completed" && <CheckCircle size={12} />}
                    </button>
                    <div className="s-task-info">
                      <span className="s-task-title">{task.title}</span>
                      <span className="s-task-due">
                        {task.dueDate ? fmtDate(task.dueDate) : "No due date"}
                      </span>
                    </div>
                    <span className={`s-badge ${priorityClass(task.priority)}`}>{task.priority}</span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Notifications */}
          <div className="s-card">
            <div className="s-card-header">
              <h3><Bell size={16} /> Notifications</h3>
              <button className="s-link">Mark all read</button>
            </div>
            {notifications.length === 0
              ? <p className="s-no-data">No notifications</p>
              : notifications.map((n, i) => (
                <div key={n._id || i} className="s-notif-item">
                  <div className="s-notif-dot" style={{ background: notifColor(n.type) }} />
                  <div>
                    <div className="s-notif-text">{n.message || n.description}</div>
                    <div className="s-notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            }
          </div>

        </div>
      </div>

      {/* ── FOOTER STATS ── */}
      <div className="s-footer-stats">
        <div className="s-footer-stat">
          <span className="s-footer-label">Total Leads</span>
          <span className="s-footer-value">{stats.total ?? 0}</span>
        </div>
        <div className="s-footer-stat">
          <span className="s-footer-label">Won</span>
          <span className="s-footer-value s-green">{stats.won ?? 0}</span>
        </div>
        <div className="s-footer-stat">
          <span className="s-footer-label">Lost</span>
          <span className="s-footer-value s-red">{stats.lost ?? 0}</span>
        </div>
        <div className="s-footer-stat">
          <span className="s-footer-label">Active</span>
          <span className="s-footer-value s-blue">{stats.active ?? 0}</span>
        </div>
        <div className="s-footer-stat">
          <span className="s-footer-label">Revenue Won</span>
          <span className="s-footer-value">{fmt(stats.revenue)}</span>
        </div>
        <div className="s-footer-stat">
          <span className="s-footer-label">Win Rate</span>
          <span className="s-footer-value s-purple">{stats.convRate ?? 0}%</span>
        </div>
      </div>

    </div>
  );
}

export default SalesDashboard;

/* ── Helpers ── */
function timeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function notifColor(type) {
  return {
    task_assign:    "#378ADD",
    deadline:       "#EF9F27",
    lead_update:    "#1D9E75",
    announcement:   "#534AB7",
    lead_won:       "#22c55e",
    lead_lost:      "#ef4444",
  }[type] || "#888780";
}