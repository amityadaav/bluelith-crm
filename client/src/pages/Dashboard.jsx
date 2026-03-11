import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  FolderOpen,
  DollarSign,
  Target,
  Clock,
  Calendar,
  ChevronRight,
  Download,
  RefreshCw,
  Bell,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Award,
  Briefcase,
  UserCheck
} from "lucide-react";

import DashboardCards from "../components/DashboardCards";
import RevenueChart from "../components/RevenueChart";
import LeadPipelineChart from "../components/LeadPipelineChart";
import EmployeePerformance from "../components/EmployeePerformance";
import ActivityTimeline from "../components/ActivityTimeline";

import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        leadsRes,
        clientsRes,
        projectsRes,
        usersRes,
        activityRes,
        notificationsRes
      ] = await Promise.all([
        api.get("/leads"),
        api.get("/clients"),
        api.get("/projects"),
        api.get("/users"),
        api.get("/activities"),
        api.get("/notifications?unread=true")
      ]);

      const leads = leadsRes.data;
      const clients = clientsRes.data;
      const projects = projectsRes.data;
      const users = usersRes.data;

      // Calculate stats
      const activeProjects = projects.filter(p => 
        p.status === "active" || p.status === "in-progress"
      ).length;
      
      const completedProjects = projects.filter(p => 
        p.status === "completed"
      ).length;
      
      const totalRevenue = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
      const totalPaid = projects.reduce((sum, p) => sum + (p.paid || 0), 0);
      
      const newLeadsThisMonth = leads.filter(l => {
        const leadDate = new Date(l.createdAt);
        const now = new Date();
        return leadDate.getMonth() === now.getMonth() && 
               leadDate.getFullYear() === now.getFullYear();
      }).length;

      const convertedLeads = leads.filter(l => l.status === "won").length;
      
      setStats({
        totalLeads: leads.length,
        newLeads: newLeadsThisMonth,
        totalClients: clients.length,
        activeProjects,
        completedProjects,
        totalProjects: projects.length,
        totalEmployees: users.filter(u => u.role === "employee").length,
        totalSales: users.filter(u => u.role === "sales").length,
        totalAdmins: users.filter(u => u.role === "admin").length,
        conversionRate: leads.length > 0
          ? Math.round((convertedLeads / leads.length) * 100)
          : 0,
        totalRevenue,
        totalPaid,
        pendingPayments: totalRevenue - totalPaid,
        averageProjectValue: projects.length > 0
          ? Math.round(totalRevenue / projects.length)
          : 0
      });

      setRecentLeads(leads.slice(0, 5));
      setRecentProjects(projects.slice(0, 5));
      setRecentClients(clients.slice(0, 5));
      setEmployees(users.filter(u => u.role === "employee" || u.role === "sales"));
      setActivities(activityRes.data.slice(0, 10));
      setNotifications(notificationsRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#3b82f6",
      contacted: "#f59e0b",
      qualified: "#22c55e",
      proposal: "#a855f7",
      negotiation: "#ec4899",
      won: "#22c55e",
      lost: "#ef4444",
      active: "#22c55e",
      "in-progress": "#3b82f6",
      completed: "#22c55e",
      pending: "#f59e0b"
    };
    return colors[status] || "#94a3b8";
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case "high": return <AlertCircle size={14} color="#ef4444" />;
      case "medium": return <Clock size={14} color="#f59e0b" />;
      case "low": return <CheckCircle size={14} color="#22c55e" />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const value = Math.floor(seconds / secondsInUnit);
      if (value >= 1) {
        return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="page-title">
            <Activity size={28} />
            Admin Dashboard
          </h1>
          <p className="header-date">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="header-actions">
          <div className="period-selector">
            <button 
              className={selectedPeriod === 'day' ? 'active' : ''}
              onClick={() => setSelectedPeriod('day')}
            >
              Day
            </button>
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'year' ? 'active' : ''}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>

          <div className="notification-badge" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="badge">{notifications.length}</span>
            )}
          </div>

          <button className="refresh-btn" onClick={fetchDashboardData}>
            <RefreshCw size={18} />
          </button>

          <button className="export-btn">
            <Download size={18} />
            Export
          </button>

          <div className="quick-actions">
            <button onClick={() => setShowQuickActions(!showQuickActions)}>
              <MoreVertical size={18} />
            </button>
            {showQuickActions && (
              <div className="quick-actions-dropdown">
                <button><Eye size={14} /> View Full Report</button>
                <button><Edit size={14} /> Customize Dashboard</button>
                <button><Mail size={14} /> Email Report</button>
                <button><Download size={14} /> Download as PDF</button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Notifications</h3>
              <span>{notifications.length} new</span>
            </div>
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <p className="no-notifications">No new notifications</p>
              ) : (
                notifications.map(notification => (
                  <div key={notification._id} className="notification-item">
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span>{timeAgo(notification.createdAt)}</span>
                    </div>
                    <button onClick={() => markNotificationAsRead(notification._id)}>
                      <CheckCircle size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <DashboardCards stats={stats} />

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <BarChart3 size={20} />
              Revenue Overview
            </h3>
            <select className="chart-select">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <RevenueChart period={selectedPeriod} />
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <PieChart size={20} />
              Lead Pipeline
            </h3>
            <select className="chart-select">
              <option>All Sources</option>
              <option>Website</option>
              <option>Referral</option>
              <option>LinkedIn</option>
            </select>
          </div>
          <LeadPipelineChart />
        </div>
      </div>

      {/* Recent Data Grid */}
      <div className="dashboard-grid">
        {/* Recent Leads */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <UserPlus size={18} />
              Recent Leads
            </h2>
            <a href="/leads" className="view-all">
              View All <ChevronRight size={16} />
            </a>
          </div>

          <div className="recent-list">
            {recentLeads.length === 0 ? (
              <p className="no-data">No recent leads</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead._id} className="recent-item">
                  <div className="item-avatar">
                    {lead.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      <strong>{lead.name}</strong>
                      {getPriorityIcon(lead.priority)}
                    </div>
                    <div className="item-subtitle">
                      <Mail size={12} />
                      {lead.email}
                    </div>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(lead.status)}20`,
                      color: getStatusColor(lead.status)
                    }}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {recentLeads.length > 0 && (
            <div className="card-footer">
              <span>Total: {stats.totalLeads} leads</span>
              <span className="conversion-rate">
                Conversion: {stats.conversionRate}%
              </span>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <FolderOpen size={18} />
              Recent Projects
            </h2>
            <a href="/projects" className="view-all">
              View All <ChevronRight size={16} />
            </a>
          </div>

          <div className="recent-list">
            {recentProjects.length === 0 ? (
              <p className="no-data">No recent projects</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project._id} className="recent-item">
                  <div className="item-avatar project">
                    <FolderOpen size={16} />
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      <strong>{project.name}</strong>
                    </div>
                    <div className="item-subtitle">
                      <Building size={12} />
                      {project.client}
                    </div>
                  </div>
                  <div className="item-metrics">
                    <span className="project-value">
                      {formatCurrency(project.totalBudget)}
                    </span>
                    <span 
                      className="status-badge small"
                      style={{ 
                        backgroundColor: `${getStatusColor(project.status)}20`,
                        color: getStatusColor(project.status)
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {recentProjects.length > 0 && (
            <div className="card-footer">
              <span>Active: {stats.activeProjects}</span>
              <span>Completed: {stats.completedProjects}</span>
            </div>
          )}
        </div>

        {/* Recent Clients */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <Users size={18} />
              New Clients
            </h2>
            <a href="/clients" className="view-all">
              View All <ChevronRight size={16} />
            </a>
          </div>

          <div className="recent-list">
            {recentClients.length === 0 ? (
              <p className="no-data">No recent clients</p>
            ) : (
              recentClients.map((client) => (
                <div key={client._id} className="recent-item">
                  <div className="item-avatar client">
                    {client.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      <strong>{client.name}</strong>
                    </div>
                    <div className="item-subtitle">
                      <Building size={12} />
                      {client.company}
                    </div>
                  </div>
                  <div className="item-contact">
                    <Mail size={12} />
                    <Phone size={12} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card-footer">
            <span>Total Clients: {stats.totalClients}</span>
            <span>This Month: +{recentClients.length}</span>
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            <Award size={20} />
            Employee Performance
          </h2>
          <div className="section-actions">
            <select className="performance-select">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
            <button className="view-all">
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <EmployeePerformance employees={employees} />
      </div>

      {/* Activity Timeline */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            <Clock size={20} />
            Recent Activity
          </h2>
          <button className="view-all">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <ActivityTimeline activities={activities} />
      </div>

      {/* Quick Stats Footer */}
      <div className="dashboard-footer">
        <div className="footer-stat">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">{formatCurrency(stats.totalRevenue || 0)}</span>
          <span className="stat-trend positive">
            <TrendingUp size={14} /> +12.5%
          </span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Pending Payments</span>
          <span className="stat-value">{formatCurrency(stats.pendingPayments || 0)}</span>
          <span className="stat-trend negative">
            <TrendingDown size={14} /> -3.2%
          </span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Avg Project Value</span>
          <span className="stat-value">{formatCurrency(stats.averageProjectValue || 0)}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Team Size</span>
          <span className="stat-value">{stats.totalEmployees + stats.totalSales || 0}</span>
          <div className="team-breakdown">
            <span title="Employees">{stats.totalEmployees}</span>
            <span title="Sales">{stats.totalSales}</span>
            <span title="Admins">{stats.totalAdmins}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;