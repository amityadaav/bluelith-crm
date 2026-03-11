// import { useState, useEffect } from "react";
// import API from "../services/api";
// import "./Analytics.css";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";

// function Analytics() {

//   const [summary, setSummary] = useState({
//     clients: 0,
//     projects: 0,
//     revenue: 0,
//     pending: 0
//   });

//   const [revenueData, setRevenueData] = useState([]);
//   const [projectStatus, setProjectStatus] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [period, setPeriod] = useState("monthly");

//   useEffect(() => {
//     fetchAnalytics();
//   }, [period]);

//   const fetchAnalytics = async () => {
//     try {

//       const summaryRes = await API.get("/analytics/summary");
//       setSummary(summaryRes.data);

//       const revenueRes = await API.get(`/analytics/revenue?period=${period}`);
//       setRevenueData(revenueRes.data);

//       const projectRes = await API.get("/analytics/project-status");
//       setProjectStatus(projectRes.data);

//       const notifyRes = await API.get("/notifications");
//       setNotifications(notifyRes.data);

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const COLORS = ["#22c55e", "#facc15", "#ef4444"];

//   return (
//     <div className="analytics-container">

//       <div className="analytics-header">

//         <h2>Analytics Dashboard</h2>

//         <div className="analytics-actions">

//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//           >
//             <option value="monthly">Monthly</option>
//             <option value="yearly">Yearly</option>
//           </select>

//           <button
//             onClick={() =>
//               window.open("http://localhost:5000/api/analytics/export/csv")
//             }
//           >
//             Export CSV
//           </button>

//         </div>

//       </div>

//       {/* Summary Cards */}

//       <div className="analytics-cards">

//         <div className="card">
//           <h3>Total Clients</h3>
//           <p>{summary.clients}</p>
//         </div>

//         <div className="card">
//           <h3>Total Projects</h3>
//           <p>{summary.projects}</p>
//         </div>

//         <div className="card">
//           <h3>Total Revenue</h3>
//           <p>₹{summary.revenue}</p>
//         </div>

//         <div className="card">
//           <h3>Pending Payments</h3>
//           <p>₹{summary.pending}</p>
//         </div>

//       </div>

//       {/* Charts */}

//       <div className="analytics-charts">

//         <div className="chart-box">

//           <h3>Revenue Analytics</h3>

//           <ResponsiveContainer width="100%" height={300}>

//             <BarChart data={revenueData}>

//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />

//               <Bar
//                 dataKey="revenue"
//                 fill="#6366f1"
//               />

//             </BarChart>

//           </ResponsiveContainer>

//         </div>

//         <div className="chart-box">

//           <h3>Project Status</h3>

//           <ResponsiveContainer width="100%" height={300}>

//             <PieChart>

//               <Pie
//                 data={projectStatus}
//                 dataKey="value"
//                 nameKey="name"
//                 outerRadius={100}
//               >

//                 {projectStatus.map((entry, index) => (

//                   <Cell
//                     key={index}
//                     fill={COLORS[index % COLORS.length]}
//                   />

//                 ))}

//               </Pie>

//               <Tooltip />

//             </PieChart>

//           </ResponsiveContainer>

//         </div>

//       </div>

//       {/* Notifications */}

//       <div className="analytics-notifications">

//         <h3>Recent Notifications</h3>

//         {notifications.length === 0 ? (
//           <p>No notifications</p>
//         ) : (
//           notifications.map((n) => (

//             <div
//               key={n._id}
//               className="notification"
//             >
//               {n.message}
//             </div>

//           ))
//         )}

//       </div>

//     </div>
//   );
// }

// export default Analytics;
import { useState, useEffect } from "react";
import API from "../services/api";
import "./Analytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  Download, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  DollarSign, 
  Clock,
  Bell,
  Filter,
  Eye,
  Printer,
  Mail,
  FileText
} from "lucide-react";

function Analytics() {
  const [summary, setSummary] = useState({
    clients: 0,
    projects: 0,
    revenue: 0,
    pending: 0,
    completedProjects: 0,
    activeProjects: 0,
    overduePayments: 0,
    averageProjectValue: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [comparisonData, setComparisonData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [trendData, setTrendData] = useState([]);
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchTrendData();
    fetchTopProjects();
  }, [period, selectedYear]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, revenueRes, projectRes, notifyRes] = await Promise.all([
        API.get("/analytics/summary"),
        API.get(`/analytics/revenue?period=${period}&year=${selectedYear}`),
        API.get("/analytics/project-status"),
        API.get("/notifications?limit=5")
      ]);

      setSummary(summaryRes.data);
      setRevenueData(revenueRes.data);
      setProjectStatus(projectRes.data);
      setNotifications(notifyRes.data);

      // Generate comparison data
      if (revenueRes.data.length > 0) {
        generateComparisonData(revenueRes.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendData = async () => {
    try {
      const response = await API.get("/analytics/trends");
      setTrendData(response.data);
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
  };

  const fetchTopProjects = async () => {
    try {
      const response = await API.get("/analytics/top-projects");
      setTopProjects(response.data);
    } catch (error) {
      console.error("Error fetching top projects:", error);
    }
  };

  const generateComparisonData = (currentData) => {
    const comparison = currentData.map((item, index) => ({
      name: item.name,
      current: item.revenue,
      previous: Math.floor(item.revenue * 0.85) // Simulated previous period data
    }));
    setComparisonData(comparison);
  };

  const handleExport = (format) => {
    window.open(`http://localhost:5000/api/analytics/export/${format}?period=${period}&year=${selectedYear}`);
  };

  const handleRefresh = () => {
    fetchAnalytics();
    fetchTrendData();
    fetchTopProjects();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReport = () => {
    // Implement email report functionality
    console.log("Emailing report...");
  };

  const COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6", "#a855f7", "#ec4899"];
  const STATUS_COLORS = {
    completed: "#22c55e",
    active: "#3b82f6",
    pending: "#facc15",
    overdue: "#ef4444"
  };

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const revenueGrowth = calculateGrowth(summary.revenue, summary.previousRevenue);
  const clientGrowth = calculateGrowth(summary.clients, summary.previousClients);

  return (
    <div className="analytics-container">
      {/* Header Section */}
      <div className="analytics-header">
        <div className="header-left">
          <h1>
            <TrendingUp size={28} />
            Analytics Dashboard
          </h1>
          <p className="header-subtitle">Comprehensive insights and metrics for your business</p>
        </div>

        <div className="header-actions">
          <div className="filter-group">
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
            
            {showFilters && (
              <div className="filter-dropdown">
                <div className="filter-item">
                  <label>Date Range</label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                  <span>to</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
                <div className="filter-actions">
                  <button className="apply-filter" onClick={fetchAnalytics}>Apply</button>
                  <button className="clear-filter" onClick={() => setDateRange({start: "", end: ""})}>Clear</button>
                </div>
              </div>
            )}
          </div>

          <select
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          <select
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2023, 2022, 2021, 2020].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>

          <div className="export-dropdown">
            <button className="export-btn">
              <Download size={18} />
              Export
            </button>
            <div className="export-options">
              <button onClick={() => handleExport('csv')}>
                <FileText size={16} /> CSV
              </button>
              <button onClick={() => handleExport('pdf')}>
                <FileText size={16} /> PDF
              </button>
              <button onClick={() => handleExport('excel')}>
                <FileText size={16} /> Excel
              </button>
            </div>
          </div>

          <button className="print-btn" onClick={handlePrint}>
            <Printer size={18} />
          </button>

          <button className="email-btn" onClick={handleEmailReport}>
            <Mail size={18} />
          </button>
        </div>
      </div>

      {/* KPI Cards with Trends */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon clients">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Clients</h3>
            <div className="kpi-value">{summary.clients}</div>
            <div className="kpi-trend positive">
              <TrendingUp size={16} />
              <span>{clientGrowth}% vs last period</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon projects">
            <FolderOpen size={24} />
          </div>
          <div className="kpi-content">
            <h3>Active Projects</h3>
            <div className="kpi-value">{summary.activeProjects}</div>
            <div className="kpi-subtext">
              <span className="completed">{summary.completedProjects} completed</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Revenue</h3>
            <div className="kpi-value">₹{summary.revenue.toLocaleString()}</div>
            <div className="kpi-trend positive">
              <TrendingUp size={16} />
              <span>{revenueGrowth}% growth</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon pending">
            <Clock size={24} />
          </div>
          <div className="kpi-content">
            <h3>Pending Payments</h3>
            <div className="kpi-value">₹{summary.pending.toLocaleString()}</div>
            <div className="kpi-subtext warning">
              {summary.overduePayments} overdue
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <DollarSign size={20} />
              Revenue Analytics
            </h3>
            <div className="chart-legend">
              <span className="legend-item current">Current Period</span>
              <span className="legend-item previous">Previous Period</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="current" name="Current Period" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previous" name="Previous Period" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <FolderOpen size={20} />
              Project Status Distribution
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {projectStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="status-legend">
            {projectStatus.map((status, index) => (
              <div key={index} className="status-item">
                <span className="status-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="status-name">{status.name}</span>
                <span className="status-value">{status.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <TrendingUp size={20} />
              Performance Trends
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Projects */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <Eye size={20} />
              Top Performing Projects
            </h3>
          </div>
          
          <div className="top-projects-list">
            {topProjects.map((project, index) => (
              <div key={project._id} className="project-item">
                <div className="project-rank">{index + 1}</div>
                <div className="project-info">
                  <h4>{project.name}</h4>
                  <p>Client: {project.client}</p>
                </div>
                <div className="project-metrics">
                  <span className="project-value">₹{project.value.toLocaleString()}</span>
                  <span className={`project-status ${project.status}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <div className="section-header">
          <h3>
            <Bell size={20} />
            Recent Notifications
          </h3>
          <button className="view-all">View All</button>
        </div>

        <div className="notifications-grid">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <Bell size={48} opacity={0.3} />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className={`notification-item ${notification.type}`}>
                <div className="notification-icon">
                  {notification.type === 'payment' && <DollarSign size={20} />}
                  {notification.type === 'project' && <FolderOpen size={20} />}
                  {notification.type === 'client' && <Users size={20} />}
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`notification-badge ${notification.priority}`}>
                  {notification.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;