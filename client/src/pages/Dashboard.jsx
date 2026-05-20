
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Dashboard.css";
// import {
//   TrendingUp, TrendingDown, Users, UserPlus, FolderOpen,
//   Clock, Calendar, ChevronRight, Download, RefreshCw,
//   MoreVertical, Eye, Mail, Phone, Building,
//   CheckCircle, AlertCircle, BarChart3, PieChart,
//   Activity, Award, FileText, Loader
// } from "lucide-react";

// import DashboardCards      from "../components/DashboardCards";
// import RevenueChart        from "../components/RevenueChart";
// import LeadPipelineChart   from "../components/LeadPipelineChart";
// import EmployeePerformance from "../components/EmployeePerformance";
// import ActivityTimeline    from "../components/ActivityTimeline";
// import api                 from "../services/api";

// function Dashboard() {
//   const navigate = useNavigate();

//   const [stats,            setStats]            = useState({});
//   const [recentLeads,      setRecentLeads]      = useState([]);
//   const [recentProjects,   setRecentProjects]   = useState([]);
//   const [recentClients,    setRecentClients]    = useState([]);
//   const [employees,        setEmployees]        = useState([]);
//   const [activities,       setActivities]       = useState([]);
//   const [notifications,    setNotifications]    = useState([]);
//   const [loading,          setLoading]          = useState(true);
//   const [refreshing,       setRefreshing]       = useState(false);
//   const [error,            setError]            = useState(null);
//   const [selectedPeriod,   setSelectedPeriod]   = useState("week");
//   const [showQuickActions, setShowQuickActions] = useState(false);
//   const [exporting,        setExporting]        = useState(false);
//   const [toast,            setToast]            = useState(null);

//   const quickActionsRef = useRef(null);

//   useEffect(() => {
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 300000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const handler = (e) => {
//       if (quickActionsRef.current && !quickActionsRef.current.contains(e.target))
//         setShowQuickActions(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const fetchDashboardData = async (isManual = false) => {
//     try {
//       setError(null);
//       if (isManual) setRefreshing(true);
//       const res         = await api.get("/dashboard");
//       const data        = res.data;
//       const leads       = data.leads         || [];
//       const clients     = data.clients       || [];
//       const projects    = data.projects      || [];
//       const users       = data.users         || [];
//       const activityFeed= data.activities    || [];
//       const notifs      = data.notifications || [];
//       const s           = data.stats         || {};

//       setStats({
//         totalLeads:          s.totalLeads          ?? 0,
//         newLeads:            s.newLeads            ?? 0,
//         totalClients:        s.totalClients        ?? 0,
//         activeProjects:      s.activeProjects      ?? 0,
//         completedProjects:   s.completedProjects   ?? 0,
//         totalProjects:       s.totalProjects       ?? 0,
//         totalEmployees:      s.totalEmployees      ?? 0,
//         totalSales:          s.totalSales          ?? 0,
//         totalAdmins:         s.totalAdmins         ?? 0,
//         conversionRate:      s.conversionRate      ?? 0,
//         totalRevenue:        s.totalRevenue        ?? 0,
//         totalPaid:           s.totalPaid           ?? 0,
//         pendingPayments:     s.pendingPayments     ?? 0,
//         averageProjectValue: s.averageProjectValue ?? 0,
//       });

//       setRecentLeads(leads.slice(0, 5));
//       setRecentProjects(projects.slice(0, 5));
//       setRecentClients(clients.slice(0, 5));
//       setEmployees(users.filter(u => u.role === "employee" || u.role === "sales"));
//       setActivities(activityFeed.slice(0, 10));
//       setNotifications(notifs);
//       if (isManual) showToast("✅ Dashboard refreshed!");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const showToast = (msg, isError = false) => {
//     setToast({ msg, isError });
//     setTimeout(() => setToast(null), 3500);
//   };

//   const handleExportCSV = async () => {
//     try {
//       setExporting(true);
//       setShowQuickActions(false);
//       const [l, c, p] = await Promise.all([
//         api.get("/leads"), api.get("/clients"), api.get("/projects"),
//       ]);
//       const sections = [
//         buildCSV("LEADS",    l.data || [], ["name","email","phone","company","status","priority","source","estimatedValue","createdAt"]),
//         buildCSV("CLIENTS",  c.data || [], ["name","email","phone","company","status","createdAt"]),
//         buildCSV("PROJECTS", p.data || [], ["name","clientName","status","priority","totalBudget","paid","startDate","endDate"]),
//       ];
//       downloadFile(sections.join("\n\n"), `bluelith-report-${today()}.csv`, "text/csv");
//       showToast("✅ CSV exported successfully!");
//     } catch { showToast("❌ Export failed.", true); }
//     finally  { setExporting(false); }
//   };

//   const handleExportPDF = async () => {
//     try {
//       setExporting(true);
//       setShowQuickActions(false);
//       const [l, c, p] = await Promise.all([
//         api.get("/leads"), api.get("/clients"), api.get("/projects"),
//       ]);
//       const win = window.open("", "_blank");
//       win.document.write(buildPrintHTML({ stats, leads: l.data||[], clients: c.data||[], projects: p.data||[], period: selectedPeriod }));
//       win.document.close();
//       setTimeout(() => { win.print(); win.close(); }, 500);
//       showToast("✅ PDF ready to save!");
//     } catch { showToast("❌ PDF failed.", true); }
//     finally  { setExporting(false); }
//   };

//   const handleEmailReport = async () => {
//     try {
//       setShowQuickActions(false);
//       await api.post("/analytics/email-report", { period: selectedPeriod, stats });
//       showToast("✅ Report emailed!");
//     } catch {
//       window.open(`mailto:?subject=${encodeURIComponent(`BlueLith CRM Report — ${today()}`)}&body=${encodeURIComponent(buildEmailBody(stats, selectedPeriod))}`);
//       showToast("✅ Email client opened!");
//     }
//   };

//   const getStatusColor = (status) => ({
//     new:"#3b82f6", contacted:"#f59e0b", qualified:"#22c55e",
//     proposal:"#a855f7", negotiation:"#ec4899", won:"#22c55e",
//     lost:"#ef4444", active:"#22c55e", "in-progress":"#3b82f6",
//     completed:"#22c55e", pending:"#f59e0b",
//   }[status] || "#94a3b8");

//   const getPriorityIcon = (priority) => {
//     if (priority === "high")   return <AlertCircle size={14} color="#ef4444" />;
//     if (priority === "medium") return <Clock       size={14} color="#f59e0b" />;
//     if (priority === "low")    return <CheckCircle size={14} color="#22c55e" />;
//     return null;
//   };

//   const fmt = (amount = 0) =>
//     new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(amount);

//   if (loading) return (
//     <div className="loading-container">
//       <div className="spinner" /><p>Loading Dashboard...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="loading-container">
//       <p style={{ color:"#ef4444", fontWeight:600 }}>⚠️ {error}</p>
//       <button onClick={() => fetchDashboardData()} style={{ marginTop:12, padding:"8px 20px", borderRadius:8, cursor:"pointer" }}>
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="dashboard">

//       {/* ══ HEADER ══ */}
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1 className="page-title">
//             <Activity size={28} /> Admin Dashboard
//           </h1>
//           <p className="header-date">
//             <Calendar size={16} />
//             {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
//           </p>
//         </div>

//         <div className="header-actions">
//           {toast && <span className={`export-toast ${toast.isError ? "error" : ""}`}>{toast.msg}</span>}

//           <div className="period-selector">
//             {["day","week","month","year"].map(p => (
//               <button key={p} className={selectedPeriod === p ? "active" : ""} onClick={() => setSelectedPeriod(p)}>
//                 {p.charAt(0).toUpperCase() + p.slice(1)}
//               </button>
//             ))}
//           </div>

//           <button className={`refresh-btn ${refreshing ? "spinning" : ""}`} onClick={() => fetchDashboardData(true)} disabled={refreshing} title="Refresh">
//             <RefreshCw size={18} />
//           </button>

//           <button className="export-btn" onClick={handleExportCSV} disabled={exporting} title="Export CSV">
//             {exporting ? <Loader size={16} className="spin-icon" /> : <Download size={18} />}
//             Export
//           </button>

//           <div className="quick-actions" ref={quickActionsRef}>
//             <button onClick={() => setShowQuickActions(!showQuickActions)} title="More options">
//               <MoreVertical size={18} />
//             </button>
//             {showQuickActions && (
//               <div className="quick-actions-dropdown">
//                 <button onClick={() => { setShowQuickActions(false); navigate("/analytics"); }}>
//                   <Eye size={14} /> View Full Report
//                 </button>
//                 <button onClick={handleExportCSV} disabled={exporting}>
//                   <FileText size={14} /> {exporting ? "Exporting…" : "Export as CSV"}
//                 </button>
//                 <button onClick={handleExportPDF} disabled={exporting}>
//                   <Download size={14} /> {exporting ? "Generating…" : "Download as PDF"}
//                 </button>
//                 <button onClick={handleEmailReport}>
//                   <Mail size={14} /> Email Report
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ══ KPI CARDS — each card is clickable ══ */}
//       <div className="kpi-grid">

//         <div className="kpi-card kpi-blue" onClick={() => navigate("/leads")} title="View all leads">
//           <div className="kpi-icon"><UserPlus size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Total Leads</span>
//             <span className="kpi-value">{stats.totalLeads}</span>
//             <span className="kpi-sub">+{stats.newLeads} this month</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-green" onClick={() => navigate("/clients")} title="View all clients">
//           <div className="kpi-icon"><Users size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Total Clients</span>
//             <span className="kpi-value">{stats.totalClients}</span>
//             <span className="kpi-sub">Active accounts</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-amber" onClick={() => navigate("/projects")} title="View active projects">
//           <div className="kpi-icon"><FolderOpen size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Active Projects</span>
//             <span className="kpi-value">{stats.activeProjects}</span>
//             <span className="kpi-sub">{stats.completedProjects} completed</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-purple" onClick={() => navigate("/analytics")} title="View analytics">
//           <div className="kpi-icon"><Activity size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Conversion Rate</span>
//             <span className="kpi-value">{stats.conversionRate}%</span>
//             <span className="kpi-sub">{stats.totalLeads} total leads</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-indigo" onClick={() => navigate("/analytics?tab=revenue")} title="View revenue">
//           <div className="kpi-icon"><TrendingUp size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Total Revenue</span>
//             <span className="kpi-value">{fmt(stats.totalRevenue)}</span>
//             <span className="kpi-sub">{fmt(stats.totalPaid)} collected</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-red" onClick={() => navigate("/projects?tab=payments")} title="View pending payments">
//           <div className="kpi-icon"><TrendingDown size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Pending Payments</span>
//             <span className="kpi-value">{fmt(stats.pendingPayments)}</span>
//             <span className="kpi-sub">Awaiting collection</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-teal" onClick={() => navigate("/projects")} title="View all projects">
//           <div className="kpi-icon"><BarChart3 size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Avg Project Value</span>
//             <span className="kpi-value">{fmt(stats.averageProjectValue)}</span>
//             <span className="kpi-sub">{stats.totalProjects} total projects</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//         <div className="kpi-card kpi-slate" onClick={() => navigate("/settings?tab=team")} title="View team">
//           <div className="kpi-icon"><Users size={22} /></div>
//           <div className="kpi-body">
//             <span className="kpi-label">Team Size</span>
//             <span className="kpi-value">{(stats.totalEmployees||0) + (stats.totalSales||0)}</span>
//             <span className="kpi-sub">{stats.totalEmployees} emp · {stats.totalSales} sales · {stats.totalAdmins} admin</span>
//           </div>
//           <ChevronRight size={16} className="kpi-arrow" />
//         </div>

//       </div>

//       {/* ══ CHARTS ══ */}
//       <div className="dashboard-charts">
//         <div className="chart-card">
//           <div className="chart-header">
//             <h3><BarChart3 size={20} /> Revenue Overview</h3>
//             <div style={{ display:"flex", gap:8, alignItems:"center" }}>
//               <select className="chart-select" onChange={e => {
//                 if (e.target.value === "This Year")     setSelectedPeriod("year");
//                 if (e.target.value === "Last 6 Months") setSelectedPeriod("month");
//               }}>
//                 <option>This Year</option>
//                 <option>Last 6 Months</option>
//               </select>
//               <button className="chart-link" onClick={() => navigate("/analytics?tab=revenue")}>
//                 Full Report <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//           <RevenueChart period={selectedPeriod} />
//         </div>

//         <div className="chart-card">
//           <div className="chart-header">
//             <h3><PieChart size={20} /> Lead Pipeline</h3>
//             <button className="chart-link" onClick={() => navigate("/leads")}>
//               View Leads <ChevronRight size={14} />
//             </button>
//           </div>
//           <LeadPipelineChart />
//         </div>
//       </div>

//       {/* ══ RECENT DATA GRID ══ */}
//       <div className="dashboard-grid">

//         {/* Recent Leads */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2><UserPlus size={18} /> Recent Leads</h2>
//             <button className="view-all" onClick={() => navigate("/leads")}>
//               View All <ChevronRight size={16} />
//             </button>
//           </div>
//           <div className="recent-list">
//             {recentLeads.length === 0
//               ? <p className="no-data">No recent leads</p>
//               : recentLeads.map(lead => (
//                 <div key={lead._id} className="recent-item clickable" onClick={() => navigate(`/leads/${lead._id}`)}>
//                   <div className="item-avatar">{lead.name?.charAt(0).toUpperCase()}</div>
//                   <div className="item-info">
//                     <div className="item-title">
//                       <strong>{lead.name}</strong>
//                       {getPriorityIcon(lead.priority)}
//                     </div>
//                     <div className="item-subtitle"><Mail size={12} /> {lead.email}</div>
//                   </div>
//                   <span className="status-badge" style={{ backgroundColor:`${getStatusColor(lead.status)}20`, color:getStatusColor(lead.status) }}>
//                     {lead.status}
//                   </span>
//                 </div>
//               ))
//             }
//           </div>
//           {recentLeads.length > 0 && (
//             <div className="card-footer">
//               <span className="footer-link" onClick={() => navigate("/leads")}>Total: {stats.totalLeads} leads</span>
//               <span className="conversion-rate">Conversion: {stats.conversionRate}%</span>
//             </div>
//           )}
//         </div>

//         {/* Recent Projects */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2><FolderOpen size={18} /> Recent Projects</h2>
//             <button className="view-all" onClick={() => navigate("/projects")}>
//               View All <ChevronRight size={16} />
//             </button>
//           </div>
//           <div className="recent-list">
//             {recentProjects.length === 0
//               ? <p className="no-data">No recent projects</p>
//               : recentProjects.map(project => (
//                 <div key={project._id} className="recent-item clickable" onClick={() => navigate(`/projects/${project._id}`)}>
//                   <div className="item-avatar project"><FolderOpen size={16} /></div>
//                   <div className="item-info">
//                     <div className="item-title"><strong>{project.name}</strong></div>
//                     <div className="item-subtitle">
//                       <Building size={12} /> {project.client?.name || project.clientName || "—"}
//                     </div>
//                   </div>
//                   <div className="item-metrics">
//                     <span className="project-value">{fmt(project.totalBudget)}</span>
//                     <span className="status-badge small" style={{ backgroundColor:`${getStatusColor(project.status)}20`, color:getStatusColor(project.status) }}>
//                       {project.status}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             }
//           </div>
//           {recentProjects.length > 0 && (
//             <div className="card-footer">
//               <span className="footer-link" onClick={() => navigate("/projects?status=active")}>Active: {stats.activeProjects}</span>
//               <span className="footer-link" onClick={() => navigate("/projects?status=completed")}>Completed: {stats.completedProjects}</span>
//             </div>
//           )}
//         </div>

//         {/* Recent Clients */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2><Users size={18} /> New Clients</h2>
//             <button className="view-all" onClick={() => navigate("/clients")}>
//               View All <ChevronRight size={16} />
//             </button>
//           </div>
//           <div className="recent-list">
//             {recentClients.length === 0
//               ? <p className="no-data">No recent clients</p>
//               : recentClients.map(client => (
//                 <div key={client._id} className="recent-item clickable" onClick={() => navigate(`/clients/${client._id}`)}>
//                   <div className="item-avatar client">{client.name?.charAt(0).toUpperCase()}</div>
//                   <div className="item-info">
//                     <div className="item-title"><strong>{client.name}</strong></div>
//                     <div className="item-subtitle"><Building size={12} /> {client.company}</div>
//                   </div>
//                   <div className="item-contact">
//                     <button className="contact-btn" onClick={e => { e.stopPropagation(); window.open(`mailto:${client.email}`); }} title={client.email}>
//                       <Mail size={13} />
//                     </button>
//                     <button className="contact-btn" onClick={e => { e.stopPropagation(); window.open(`tel:${client.phone}`); }} title={client.phone}>
//                       <Phone size={13} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             }
//           </div>
//           <div className="card-footer">
//             <span className="footer-link" onClick={() => navigate("/clients")}>Total: {stats.totalClients}</span>
//             <span>This Month: +{recentClients.length}</span>
//           </div>
//         </div>
//       </div>

//       {/* ══ EMPLOYEE PERFORMANCE ══ */}
//       <div className="dashboard-section">
//         <div className="section-header">
//           <h2><Award size={20} /> Employee Performance</h2>
//           <div className="section-actions">
//             <select className="performance-select">
//               <option>This Month</option>
//               <option>Last Month</option>
//               <option>This Quarter</option>
//             </select>
//             <button className="view-all" onClick={() => navigate("/analytics?tab=performance")}>
//               View All <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//         <EmployeePerformance employees={employees} onEmployeeClick={(id) => navigate(`/settings/users/${id}`)} />
//       </div>

//       {/* ══ ACTIVITY TIMELINE ══ */}
//       <div className="dashboard-section">
//         <div className="section-header">
//           <h2><Clock size={20} /> Recent Activity</h2>
//           <button className="view-all" onClick={() => navigate("/activity")}>
//             View All <ChevronRight size={16} />
//           </button>
//         </div>
//         <ActivityTimeline activities={activities} onActivityClick={(activity) => {
//           if (activity.relatedTo?.model === "Lead")    navigate(`/leads/${activity.relatedTo.id}`);
//           if (activity.relatedTo?.model === "Client")  navigate(`/clients/${activity.relatedTo.id}`);
//           if (activity.relatedTo?.model === "Project") navigate(`/projects/${activity.relatedTo.id}`);
//         }} />
//       </div>

//       {/* ══ FOOTER STATS — all clickable ══ */}
//       <div className="dashboard-footer">
//         <div className="footer-stat clickable" onClick={() => navigate("/analytics?tab=revenue")}>
//           <span className="stat-label">Total Revenue</span>
//           <span className="stat-value">{fmt(stats.totalRevenue)}</span>
//           <span className="stat-trend positive"><TrendingUp size={14} /> +12.5%</span>
//         </div>
//         <div className="footer-stat clickable" onClick={() => navigate("/projects?tab=payments")}>
//           <span className="stat-label">Pending Payments</span>
//           <span className="stat-value">{fmt(stats.pendingPayments)}</span>
//           <span className="stat-trend negative"><TrendingDown size={14} /> -3.2%</span>
//         </div>
//         <div className="footer-stat clickable" onClick={() => navigate("/projects")}>
//           <span className="stat-label">Avg Project Value</span>
//           <span className="stat-value">{fmt(stats.averageProjectValue)}</span>
//           <span className="stat-sub-info">{stats.totalProjects} total projects</span>
//         </div>
//         <div className="footer-stat clickable" onClick={() => navigate("/settings?tab=team")}>
//           <span className="stat-label">Team Size</span>
//           <span className="stat-value">{(stats.totalEmployees||0)+(stats.totalSales||0)}</span>
//           <div className="team-breakdown">
//             <span title="Employees">{stats.totalEmployees||0} emp</span>
//             <span title="Sales">{stats.totalSales||0} sales</span>
//             <span title="Admins">{stats.totalAdmins||0} admin</span>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }

// export default Dashboard;

// /* ════════ UTILS ════════ */
// function today() { return new Date().toISOString().split("T")[0]; }

// function buildCSV(title, rows, fields) {
//   if (!rows.length) return `${title}\nNo data\n`;
//   const lines = rows.map(row => fields.map(f => {
//     const val = String(row[f] ?? "").replace(/"/g,'""');
//     return val.includes(",") || val.includes("\n") ? `"${val}"` : val;
//   }).join(","));
//   return `${title}\n${fields.join(",")}\n${lines.join("\n")}`;
// }

// function downloadFile(content, filename, mimeType) {
//   const blob = new Blob([content], { type: mimeType });
//   const url  = URL.createObjectURL(blob);
//   const a    = document.createElement("a");
//   a.href = url; a.download = filename; a.click();
//   URL.revokeObjectURL(url);
// }

// function buildPrintHTML({ stats, leads, clients, projects, period }) {
//   const fmt = n => new Intl.NumberFormat("en-IN",{ style:"currency", currency:"INR", maximumFractionDigits:0 }).format(n||0);
//   return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>BlueLith CRM Report</title>
//   <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;color:#0f172a;padding:40px}
//   h1{font-size:24px;font-weight:700;margin-bottom:4px}.sub{font-size:13px;color:#94a3b8;margin-bottom:32px}
//   .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
//   .card{background:#f8faff;border:1px solid #e8ecf5;border-radius:12px;padding:16px}
//   .card-label{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
//   .card-value{font-size:22px;font-weight:700;margin-top:4px}
//   h2{font-size:16px;font-weight:700;margin:24px 0 12px;border-bottom:1px solid #e8ecf5;padding-bottom:8px}
//   table{width:100%;border-collapse:collapse;font-size:12px}
//   th{background:#f4f6fb;padding:8px 10px;text-align:left;font-weight:600;color:#475569}
//   td{padding:8px 10px;border-bottom:1px solid #f1f4fd}@media print{body{padding:20px}}</style></head><body>
//   <h1>BlueLith CRM Report</h1><p class="sub">Period: ${period} | ${new Date().toLocaleString()}</p>
//   <div class="grid">
//     <div class="card"><div class="card-label">Total Leads</div><div class="card-value">${stats.totalLeads||0}</div></div>
//     <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${stats.totalClients||0}</div></div>
//     <div class="card"><div class="card-label">Active Projects</div><div class="card-value">${stats.activeProjects||0}</div></div>
//     <div class="card"><div class="card-label">Total Revenue</div><div class="card-value">${fmt(stats.totalRevenue)}</div></div>
//     <div class="card"><div class="card-label">Conversion Rate</div><div class="card-value">${stats.conversionRate||0}%</div></div>
//     <div class="card"><div class="card-label">Pending Payments</div><div class="card-value">${fmt(stats.pendingPayments)}</div></div>
//     <div class="card"><div class="card-label">Completed</div><div class="card-value">${stats.completedProjects||0}</div></div>
//     <div class="card"><div class="card-label">Team Size</div><div class="card-value">${(stats.totalEmployees||0)+(stats.totalSales||0)}</div></div>
//   </div>
//   <h2>Leads (${leads.length})</h2><table><tr><th>Name</th><th>Company</th><th>Status</th><th>Priority</th><th>Value</th></tr>
//   ${leads.slice(0,50).map(l=>`<tr><td>${l.name||""}</td><td>${l.company||""}</td><td>${l.status||""}</td><td>${l.priority||""}</td><td>${fmt(l.estimatedValue)}</td></tr>`).join("")}</table>
//   <h2>Clients (${clients.length})</h2><table><tr><th>Name</th><th>Company</th><th>Email</th><th>Status</th></tr>
//   ${clients.slice(0,50).map(c=>`<tr><td>${c.name||""}</td><td>${c.company||""}</td><td>${c.email||""}</td><td>${c.status||""}</td></tr>`).join("")}</table>
//   <h2>Projects (${projects.length})</h2><table><tr><th>Name</th><th>Client</th><th>Status</th><th>Budget</th><th>Paid</th></tr>
//   ${projects.slice(0,50).map(p=>`<tr><td>${p.name||""}</td><td>${p.clientName||p.client?.name||""}</td><td>${p.status||""}</td><td>${fmt(p.totalBudget)}</td><td>${fmt(p.paid)}</td></tr>`).join("")}</table>
//   </body></html>`;
// }

// function buildEmailBody(stats, period) {
//   return `BlueLith CRM Report — ${today()}\nPeriod: ${period}\n\nKEY METRICS\n-----------\nTotal Leads: ${stats.totalLeads||0}\nTotal Clients: ${stats.totalClients||0}\nActive Projects: ${stats.activeProjects||0}\nConversion Rate: ${stats.conversionRate||0}%\nTotal Revenue: ₹${(stats.totalRevenue||0).toLocaleString("en-IN")}\nPending Payments: ₹${(stats.pendingPayments||0).toLocaleString("en-IN")}\nTeam Size: ${(stats.totalEmployees||0)+(stats.totalSales||0)}\n\nGenerated by BlueLith CRM`;
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  TrendingUp, TrendingDown, Users, UserPlus, FolderOpen,
  Clock, Calendar, ChevronRight, Download, RefreshCw,
  MoreVertical, Eye, Mail, Phone, Building,
  CheckCircle, AlertCircle, BarChart3, PieChart,
  Activity, Award, FileText, Loader
} from "lucide-react";

import DashboardCards      from "../components/DashboardCards";
import RevenueChart        from "../components/RevenueChart";
import LeadPipelineChart   from "../components/LeadPipelineChart";
import EmployeePerformance from "../components/EmployeePerformance";
import ActivityTimeline    from "../components/ActivityTimeline";
import api                 from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats,            setStats]            = useState({
    totalLeads: 0, newLeads: 0, totalClients: 0, activeProjects: 0,
    completedProjects: 0, totalProjects: 0, totalEmployees: 0,
    totalSales: 0, totalAdmins: 0, conversionRate: 0,
    totalRevenue: 0, totalPaid: 0, pendingPayments: 0, averageProjectValue: 0
  });
  const [recentLeads,      setRecentLeads]      = useState([]);
  const [recentProjects,   setRecentProjects]   = useState([]);
  const [recentClients,    setRecentClients]    = useState([]);
  const [employees,        setEmployees]        = useState([]);
  const [activities,       setActivities]       = useState([]);
  const [notifications,    setNotifications]    = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [refreshing,       setRefreshing]       = useState(false);
  const [error,            setError]            = useState(null);
  const [selectedPeriod,   setSelectedPeriod]   = useState("week");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [exporting,        setExporting]        = useState(false);
  const [toast,            setToast]            = useState(null);

  const quickActionsRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(), 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target))
        setShowQuickActions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchDashboardData = async (isManual = false) => {
    try {
      setError(null);
      if (isManual) setRefreshing(true);
      
      const res = await api.get("/dashboard");
      const data = res.data || {};
      
      // Safely extract data with fallbacks
      const leads = Array.isArray(data.leads) ? data.leads : [];
      const clients = Array.isArray(data.clients) ? data.clients : [];
      const projects = Array.isArray(data.projects) ? data.projects : [];
      const users = Array.isArray(data.users) ? data.users : [];
      const activityFeed = Array.isArray(data.activities) ? data.activities : [];
      const notifs = Array.isArray(data.notifications) ? data.notifications : [];
      const s = data.stats || {};

      setStats({
        totalLeads:          s.totalLeads ?? 0,
        newLeads:            s.newLeads ?? 0,
        totalClients:        s.totalClients ?? 0,
        activeProjects:      s.activeProjects ?? 0,
        completedProjects:   s.completedProjects ?? 0,
        totalProjects:       s.totalProjects ?? 0,
        totalEmployees:      s.totalEmployees ?? 0,
        totalSales:          s.totalSales ?? 0,
        totalAdmins:         s.totalAdmins ?? 0,
        conversionRate:      s.conversionRate ?? 0,
        totalRevenue:        s.totalRevenue ?? 0,
        totalPaid:           s.totalPaid ?? 0,
        pendingPayments:     s.pendingPayments ?? 0,
        averageProjectValue: s.averageProjectValue ?? 0,
      });

      setRecentLeads(leads.slice(0, 5));
      setRecentProjects(projects.slice(0, 5));
      setRecentClients(clients.slice(0, 5));
      setEmployees(users.filter(u => u && (u.role === "employee" || u.role === "sales")));
      setActivities(activityFeed.slice(0, 10));
      setNotifications(notifs);
      
      if (isManual) showToast("✅ Dashboard refreshed!");
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
      showToast("❌ Failed to load dashboard data", true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setShowQuickActions(false);
      
      const [l, c, p] = await Promise.all([
        api.get("/leads").catch(() => ({ data: [] })),
        api.get("/clients").catch(() => ({ data: [] })),
        api.get("/projects").catch(() => ({ data: [] })),
      ]);
      
      const leads = Array.isArray(l.data) ? l.data : [];
      const clients = Array.isArray(c.data) ? c.data : [];
      const projects = Array.isArray(p.data) ? p.data : [];
      
      const sections = [
        buildCSV("LEADS", leads, ["name","email","phone","company","status","priority","source","estimatedValue","createdAt"]),
        buildCSV("CLIENTS", clients, ["name","email","phone","company","status","createdAt"]),
        buildCSV("PROJECTS", projects, ["name","clientName","status","priority","totalBudget","paid","startDate","endDate"]),
      ];
      
      downloadFile(sections.filter(s => s).join("\n\n"), `bluelith-report-${today()}.csv`, "text/csv");
      showToast("✅ CSV exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      showToast("❌ Export failed.", true);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      setShowQuickActions(false);
      
      const [l, c, p] = await Promise.all([
        api.get("/leads").catch(() => ({ data: [] })),
        api.get("/clients").catch(() => ({ data: [] })),
        api.get("/projects").catch(() => ({ data: [] })),
      ]);
      
      const leads = Array.isArray(l.data) ? l.data : [];
      const clients = Array.isArray(c.data) ? c.data : [];
      const projects = Array.isArray(p.data) ? p.data : [];
      
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(buildPrintHTML({ stats, leads, clients, projects, period: selectedPeriod }));
        win.document.close();
        setTimeout(() => { win.print(); win.close(); }, 500);
      }
      showToast("✅ PDF ready to save!");
    } catch (err) {
      console.error("PDF error:", err);
      showToast("❌ PDF failed.", true);
    } finally {
      setExporting(false);
    }
  };

  const handleEmailReport = async () => {
    try {
      setShowQuickActions(false);
      await api.post("/analytics/email-report", { period: selectedPeriod, stats });
      showToast("✅ Report emailed!");
    } catch (err) {
      console.error("Email error:", err);
      window.open(`mailto:?subject=${encodeURIComponent(`BlueLith CRM Report — ${today()}`)}&body=${encodeURIComponent(buildEmailBody(stats, selectedPeriod))}`);
      showToast("✅ Email client opened!");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#3b82f6", contacted: "#f59e0b", qualified: "#22c55e",
      proposal: "#a855f7", negotiation: "#ec4899", won: "#22c55e",
      lost: "#ef4444", active: "#22c55e", "in-progress": "#3b82f6",
      completed: "#22c55e", pending: "#f59e0b",
    };
    return colors[status] || "#94a3b8";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "high")   return <AlertCircle size={14} color="#ef4444" />;
    if (priority === "medium") return <Clock size={14} color="#f59e0b" />;
    if (priority === "low")    return <CheckCircle size={14} color="#22c55e" />;
    return null;
  };

  const fmt = (amount = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p style={{ color: "#ef4444", fontWeight: 600 }}>⚠️ {error}</p>
        <button onClick={() => fetchDashboardData(true)} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="page-title">
            <Activity size={28} /> Admin Dashboard
          </h1>
          <p className="header-date">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="header-actions">
          {toast && (
            <span className={`export-toast ${toast.isError ? "error" : ""}`}>
              {toast.msg}
            </span>
          )}

          <div className="period-selector">
            {["day", "week", "month", "year"].map(p => (
              <button 
                key={p} 
                className={selectedPeriod === p ? "active" : ""} 
                onClick={() => setSelectedPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <button 
            className={`refresh-btn ${refreshing ? "spinning" : ""}`} 
            onClick={() => fetchDashboardData(true)} 
            disabled={refreshing} 
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>

          <button className="export-btn" onClick={handleExportCSV} disabled={exporting} title="Export CSV">
            {exporting ? <Loader size={16} className="spin-icon" /> : <Download size={18} />}
            Export
          </button>

          <div className="quick-actions" ref={quickActionsRef}>
            <button onClick={() => setShowQuickActions(!showQuickActions)} title="More options">
              <MoreVertical size={18} />
            </button>
            {showQuickActions && (
              <div className="quick-actions-dropdown">
                <button onClick={() => { setShowQuickActions(false); navigate("/analytics"); }}>
                  <Eye size={14} /> View Full Report
                </button>
                <button onClick={handleExportCSV} disabled={exporting}>
                  <FileText size={14} /> {exporting ? "Exporting…" : "Export as CSV"}
                </button>
                <button onClick={handleExportPDF} disabled={exporting}>
                  <Download size={14} /> {exporting ? "Generating…" : "Download as PDF"}
                </button>
                <button onClick={handleEmailReport}>
                  <Mail size={14} /> Email Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-blue" onClick={() => navigate("/leads")} title="View all leads">
          <div className="kpi-icon"><UserPlus size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Total Leads</span>
            <span className="kpi-value">{stats.totalLeads || 0}</span>
            <span className="kpi-sub">+{stats.newLeads || 0} this month</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-green" onClick={() => navigate("/clients")} title="View all clients">
          <div className="kpi-icon"><Users size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Total Clients</span>
            <span className="kpi-value">{stats.totalClients || 0}</span>
            <span className="kpi-sub">Active accounts</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-amber" onClick={() => navigate("/projects")} title="View active projects">
          <div className="kpi-icon"><FolderOpen size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Active Projects</span>
            <span className="kpi-value">{stats.activeProjects || 0}</span>
            <span className="kpi-sub">{stats.completedProjects || 0} completed</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-purple" onClick={() => navigate("/analytics")} title="View analytics">
          <div className="kpi-icon"><Activity size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Conversion Rate</span>
            <span className="kpi-value">{stats.conversionRate || 0}%</span>
            <span className="kpi-sub">{stats.totalLeads || 0} total leads</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-indigo" onClick={() => navigate("/analytics?tab=revenue")} title="View revenue">
          <div className="kpi-icon"><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Total Revenue</span>
            <span className="kpi-value">{fmt(stats.totalRevenue)}</span>
            <span className="kpi-sub">{fmt(stats.totalPaid)} collected</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-red" onClick={() => navigate("/projects?tab=payments")} title="View pending payments">
          <div className="kpi-icon"><TrendingDown size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Pending Payments</span>
            <span className="kpi-value">{fmt(stats.pendingPayments)}</span>
            <span className="kpi-sub">Awaiting collection</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-teal" onClick={() => navigate("/projects")} title="View all projects">
          <div className="kpi-icon"><BarChart3 size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Avg Project Value</span>
            <span className="kpi-value">{fmt(stats.averageProjectValue)}</span>
            <span className="kpi-sub">{stats.totalProjects || 0} total projects</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>

        <div className="kpi-card kpi-slate" onClick={() => navigate("/settings?tab=team")} title="View team">
          <div className="kpi-icon"><Users size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-label">Team Size</span>
            <span className="kpi-value">{(stats.totalEmployees || 0) + (stats.totalSales || 0)}</span>
            <span className="kpi-sub">{stats.totalEmployees || 0} emp · {stats.totalSales || 0} sales · {stats.totalAdmins || 0} admin</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" />
        </div>
      </div>

      {/* CHARTS */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3><BarChart3 size={20} /> Revenue Overview</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select className="chart-select" onChange={e => {
                if (e.target.value === "This Year") setSelectedPeriod("year");
                if (e.target.value === "Last 6 Months") setSelectedPeriod("month");
              }}>
                <option>This Year</option>
                <option>Last 6 Months</option>
              </select>
              <button className="chart-link" onClick={() => navigate("/analytics?tab=revenue")}>
                Full Report <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <RevenueChart period={selectedPeriod} />
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3><PieChart size={20} /> Lead Pipeline</h3>
            <button className="chart-link" onClick={() => navigate("/leads")}>
              View Leads <ChevronRight size={14} />
            </button>
          </div>
          <LeadPipelineChart />
        </div>
      </div>

      {/* RECENT DATA GRID */}
      <div className="dashboard-grid">
        {/* Recent Leads */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2><UserPlus size={18} /> Recent Leads</h2>
            <button className="view-all" onClick={() => navigate("/leads")}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="recent-list">
            {recentLeads.length === 0 ? (
              <p className="no-data">No recent leads</p>
            ) : (
              recentLeads.map(lead => (
                <div key={lead._id} className="recent-item clickable" onClick={() => navigate(`/leads/${lead._id}`)}>
                  <div className="item-avatar">{lead.name?.charAt(0).toUpperCase() || "?"}</div>
                  <div className="item-info">
                    <div className="item-title">
                      <strong>{lead.name || "Unknown"}</strong>
                      {getPriorityIcon(lead.priority)}
                    </div>
                    <div className="item-subtitle"><Mail size={12} /> {lead.email || "No email"}</div>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}>
                    {lead.status || "new"}
                  </span>
                </div>
              ))
            )}
          </div>
          {recentLeads.length > 0 && (
            <div className="card-footer">
              <span className="footer-link" onClick={() => navigate("/leads")}>Total: {stats.totalLeads} leads</span>
              <span className="conversion-rate">Conversion: {stats.conversionRate}%</span>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2><FolderOpen size={18} /> Recent Projects</h2>
            <button className="view-all" onClick={() => navigate("/projects")}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="recent-list">
            {recentProjects.length === 0 ? (
              <p className="no-data">No recent projects</p>
            ) : (
              recentProjects.map(project => (
                <div key={project._id} className="recent-item clickable" onClick={() => navigate(`/projects/${project._id}`)}>
                  <div className="item-avatar project"><FolderOpen size={16} /></div>
                  <div className="item-info">
                    <div className="item-title"><strong>{project.name || "Untitled"}</strong></div>
                    <div className="item-subtitle">
                      <Building size={12} /> {project.client?.name || project.clientName || "—"}
                    </div>
                  </div>
                  <div className="item-metrics">
                    <span className="project-value">{fmt(project.totalBudget)}</span>
                    <span className="status-badge small" style={{ backgroundColor: `${getStatusColor(project.status)}20`, color: getStatusColor(project.status) }}>
                      {project.status || "pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {recentProjects.length > 0 && (
            <div className="card-footer">
              <span className="footer-link" onClick={() => navigate("/projects?status=active")}>Active: {stats.activeProjects}</span>
              <span className="footer-link" onClick={() => navigate("/projects?status=completed")}>Completed: {stats.completedProjects}</span>
            </div>
          )}
        </div>

        {/* Recent Clients */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2><Users size={18} /> New Clients</h2>
            <button className="view-all" onClick={() => navigate("/clients")}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="recent-list">
            {recentClients.length === 0 ? (
              <p className="no-data">No recent clients</p>
            ) : (
              recentClients.map(client => (
                <div key={client._id} className="recent-item clickable" onClick={() => navigate(`/clients/${client._id}`)}>
                  <div className="item-avatar client">{client.name?.charAt(0).toUpperCase() || "?"}</div>
                  <div className="item-info">
                    <div className="item-title"><strong>{client.name || "Unknown"}</strong></div>
                    <div className="item-subtitle"><Building size={12} /> {client.company || "No company"}</div>
                  </div>
                  <div className="item-contact">
                    <button className="contact-btn" onClick={e => { e.stopPropagation(); window.open(`mailto:${client.email}`); }} title={client.email}>
                      <Mail size={13} />
                    </button>
                    <button className="contact-btn" onClick={e => { e.stopPropagation(); window.open(`tel:${client.phone}`); }} title={client.phone}>
                      <Phone size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="card-footer">
            <span className="footer-link" onClick={() => navigate("/clients")}>Total: {stats.totalClients}</span>
            <span>This Month: +{recentClients.length}</span>
          </div>
        </div>
      </div>

      {/* EMPLOYEE PERFORMANCE */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2><Award size={20} /> Employee Performance</h2>
          <div className="section-actions">
            <select className="performance-select">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
            <button className="view-all" onClick={() => navigate("/analytics?tab=performance")}>
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <EmployeePerformance 
          employees={employees} 
          onEmployeeClick={(id) => navigate(`/settings/users/${id}`)} 
        />
      </div>

      {/* ACTIVITY TIMELINE */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2><Clock size={20} /> Recent Activity</h2>
          <button className="view-all" onClick={() => navigate("/activity")}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        <ActivityTimeline 
          activities={activities} 
          onActivityClick={(activity) => {
            if (activity?.relatedTo?.model === "Lead") navigate(`/leads/${activity.relatedTo.id}`);
            if (activity?.relatedTo?.model === "Client") navigate(`/clients/${activity.relatedTo.id}`);
            if (activity?.relatedTo?.model === "Project") navigate(`/projects/${activity.relatedTo.id}`);
          }} 
        />
      </div>

      {/* FOOTER STATS */}
      <div className="dashboard-footer">
        <div className="footer-stat clickable" onClick={() => navigate("/analytics?tab=revenue")}>
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">{fmt(stats.totalRevenue)}</span>
          <span className="stat-trend positive"><TrendingUp size={14} /> +12.5%</span>
        </div>
        <div className="footer-stat clickable" onClick={() => navigate("/projects?tab=payments")}>
          <span className="stat-label">Pending Payments</span>
          <span className="stat-value">{fmt(stats.pendingPayments)}</span>
          <span className="stat-trend negative"><TrendingDown size={14} /> -3.2%</span>
        </div>
        <div className="footer-stat clickable" onClick={() => navigate("/projects")}>
          <span className="stat-label">Avg Project Value</span>
          <span className="stat-value">{fmt(stats.averageProjectValue)}</span>
          <span className="stat-sub-info">{stats.totalProjects} total projects</span>
        </div>
        <div className="footer-stat clickable" onClick={() => navigate("/settings?tab=team")}>
          <span className="stat-label">Team Size</span>
          <span className="stat-value">{(stats.totalEmployees || 0) + (stats.totalSales || 0)}</span>
          <div className="team-breakdown">
            <span title="Employees">{stats.totalEmployees || 0} emp</span>
            <span title="Sales">{stats.totalSales || 0} sales</span>
            <span title="Admins">{stats.totalAdmins || 0} admin</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;

/* UTILITIES */
function today() { 
  return new Date().toISOString().split("T")[0]; 
}

function buildCSV(title, rows, fields) {
  if (!rows || rows.length === 0) return `${title}\nNo data\n`;
  
  const headers = fields.join(",");
  const lines = rows.map(row => 
    fields.map(f => {
      let val = row[f] ?? "";
      val = String(val).replace(/"/g, '""');
      return val.includes(",") || val.includes("\n") ? `"${val}"` : val;
    }).join(",")
  );
  
  return `${title}\n${headers}\n${lines.join("\n")}`;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildPrintHTML({ stats, leads, clients, projects, period }) {
  const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
  
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>BlueLith CRM Report</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',sans-serif;color:#0f172a;padding:40px}
        h1{font-size:24px;font-weight:700;margin-bottom:4px}
        .sub{font-size:13px;color:#94a3b8;margin-bottom:32px}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
        .card{background:#f8faff;border:1px solid #e8ecf5;border-radius:12px;padding:16px}
        .card-label{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
        .card-value{font-size:22px;font-weight:700;margin-top:4px}
        h2{font-size:16px;font-weight:700;margin:24px 0 12px;border-bottom:1px solid #e8ecf5;padding-bottom:8px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th{background:#f4f6fb;padding:8px 10px;text-align:left;font-weight:600;color:#475569}
        td{padding:8px 10px;border-bottom:1px solid #f1f4fd}
        @media print{body{padding:20px}}
      </style>
    </head>
    <body>
      <h1>BlueLith CRM Report</h1>
      <p class="sub">Period: ${period} | ${new Date().toLocaleString()}</p>
      
      <div class="grid">
        <div class="card"><div class="card-label">Total Leads</div><div class="card-value">${stats.totalLeads || 0}</div></div>
        <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${stats.totalClients || 0}</div></div>
        <div class="card"><div class="card-label">Active Projects</div><div class="card-value">${stats.activeProjects || 0}</div></div>
        <div class="card"><div class="card-label">Total Revenue</div><div class="card-value">${fmt(stats.totalRevenue)}</div></div>
        <div class="card"><div class="card-label">Conversion Rate</div><div class="card-value">${stats.conversionRate || 0}%</div></div>
        <div class="card"><div class="card-label">Pending Payments</div><div class="card-value">${fmt(stats.pendingPayments)}</div></div>
        <div class="card"><div class="card-label">Completed</div><div class="card-value">${stats.completedProjects || 0}</div></div>
        <div class="card"><div class="card-label">Team Size</div><div class="card-value">${(stats.totalEmployees || 0) + (stats.totalSales || 0)}</div></div>
      </div>
      
      <h2>Leads (${leads.length})</h2>
      <table>
        <thead><tr><th>Name</th><th>Company</th><th>Status</th><th>Priority</th><th>Value</th></tr></thead>
        <tbody>
          ${leads.slice(0, 50).map(l => `
            <tr>
              <td>${l.name || ""}</td>
              <td>${l.company || ""}</td>
              <td>${l.status || ""}</td>
              <td>${l.priority || ""}</td>
              <td>${fmt(l.estimatedValue)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      
      <h2>Clients (${clients.length})</h2>
      <table>
        <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Status</th></tr></thead>
        <tbody>
          ${clients.slice(0, 50).map(c => `
            <tr>
              <td>${c.name || ""}</td>
              <td>${c.company || ""}</td>
              <td>${c.email || ""}</td>
              <td>${c.status || ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      
      <h2>Projects (${projects.length})</h2>
      <table>
        <thead><tr><th>Name</th><th>Client</th><th>Status</th><th>Budget</th><th>Paid</th></tr></thead>
        <tbody>
          ${projects.slice(0, 50).map(p => `
            <tr>
              <td>${p.name || ""}</td>
              <td>${p.clientName || p.client?.name || ""}</td>
              <td>${p.status || ""}</td>
              <td>${fmt(p.totalBudget)}</td>
              <td>${fmt(p.paid)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
  </html>`;
}

function buildEmailBody(stats, period) {
  return `BlueLith CRM Report — ${today()}
Period: ${period}

KEY METRICS
-----------
Total Leads: ${stats.totalLeads || 0}
Total Clients: ${stats.totalClients || 0}
Active Projects: ${stats.activeProjects || 0}
Conversion Rate: ${stats.conversionRate || 0}%
Total Revenue: ₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}
Pending Payments: ₹${(stats.pendingPayments || 0).toLocaleString("en-IN")}
Team Size: ${(stats.totalEmployees || 0) + (stats.totalSales || 0)}

Generated by BlueLith CRM`;
}