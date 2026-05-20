
import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate }            from "react-router-dom";
import { AuthContext }                     from "../context/AuthContext";
import api                                 from "../services/api";
import { initials }                        from "../utils/helpers";
import "./Sidebar.css";

import DashboardRoundedIcon    from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon    from "@mui/icons-material/PeopleAltRounded";
import PersonRoundedIcon       from "@mui/icons-material/PersonRounded";
import BarChartRoundedIcon     from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon     from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon       from "@mui/icons-material/LogoutRounded";
import GroupsRoundedIcon       from "@mui/icons-material/GroupsRounded";
import TrendingUpRoundedIcon   from "@mui/icons-material/TrendingUpRounded";
import FolderRoundedIcon       from "@mui/icons-material/FolderRounded";
import TaskAltRoundedIcon      from "@mui/icons-material/TaskAltRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

// ─── Menu config per role ────────────────────────────────────────────────────
const MENUS = {
  admin: [
    { name: "Dashboard", path: "/dashboard",  icon: <DashboardRoundedIcon />,  section: "main" },
    { name: "Leads",     path: "/leads",       icon: <TrendingUpRoundedIcon />, section: "main" },
    { name: "Clients",   path: "/clients",     icon: <PersonRoundedIcon />,     section: "main" },
    { name: "Projects",  path: "/projects",    icon: <FolderRoundedIcon />,     section: "main" },
    { name: "Users",     path: "/users",       icon: <GroupsRoundedIcon />,     section: "manage" },
    { name: "Analytics", path: "/analytics",   icon: <BarChartRoundedIcon />,   section: "manage" },
    { name: "Settings",  path: "/settings",    icon: <SettingsRoundedIcon />,   section: "manage" },
  ],
  sales: [
    { name: "Dashboard",  path: "/sales/dashboard", icon: <DashboardRoundedIcon />,  section: "main" },
    { name: "My Leads",   path: "/leads",            icon: <TrendingUpRoundedIcon />, section: "main" },
    { name: "My Clients", path: "/clients",          icon: <PersonRoundedIcon />,     section: "main" },
    { name: "Projects",   path: "/projects",         icon: <FolderRoundedIcon />,     section: "main" },
    { name: "My Tasks",   path: "/tasks",            icon: <TaskAltRoundedIcon />,    section: "main" },
  ],
  developer: [
    { name: "Dashboard", path: "/developer/dashboard", icon: <DashboardRoundedIcon />, section: "main" },
    { name: "My Tasks",  path: "/tasks",                icon: <TaskAltRoundedIcon />,   section: "main" },
    { name: "Projects",  path: "/projects",             icon: <FolderRoundedIcon />,    section: "main" },
  ],
  hr: [
    { name: "Dashboard", path: "/hr/dashboard", icon: <DashboardRoundedIcon />,  section: "main" },
    { name: "Employees", path: "/users",         icon: <GroupsRoundedIcon />,     section: "main" },
    { name: "My Tasks",  path: "/tasks",         icon: <TaskAltRoundedIcon />,    section: "main" },
  ],
  manager: [
    { name: "Dashboard", path: "/manager/dashboard", icon: <DashboardRoundedIcon />,  section: "main" },
    { name: "Leads",     path: "/leads",              icon: <TrendingUpRoundedIcon />, section: "main" },
    { name: "Clients",   path: "/clients",            icon: <PersonRoundedIcon />,     section: "main" },
    { name: "Projects",  path: "/projects",           icon: <FolderRoundedIcon />,     section: "main" },
    { name: "Team",      path: "/users",              icon: <GroupsRoundedIcon />,     section: "manage" },
    { name: "Analytics", path: "/analytics",          icon: <BarChartRoundedIcon />,   section: "manage" },
  ],
  employee: [
    { name: "Dashboard", path: "/employee/dashboard", icon: <DashboardRoundedIcon />, section: "main" },
    { name: "My Tasks",  path: "/tasks",               icon: <TaskAltRoundedIcon />,   section: "main" },
    { name: "Projects",  path: "/projects",            icon: <FolderRoundedIcon />,    section: "main" },
  ],
};

const ROLE_CONFIG = {
  admin:     { label: "Admin",     color: "#ef4444", accent: "#dc2626", bg: "#fef2f2" },
  sales:     { label: "Sales",     color: "#16a34a", accent: "#15803d", bg: "#f0fdf4" },
  developer: { label: "Developer", color: "#4f46e5", accent: "#4338ca", bg: "#eef2ff" },
  hr:        { label: "HR",        color: "#db2777", accent: "#be185d", bg: "#fdf2f8" },
  manager:   { label: "Manager",   color: "#d97706", accent: "#b45309", bg: "#fffbeb" },
  employee:  { label: "Employee",  color: "#0284c7", accent: "#0369a1", bg: "#f0f9ff" },
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate          = useNavigate();

  const [notifCount,     setNotifCount]     = useState(0);
  const [showLogoutConf, setShowLogoutConf] = useState(false);
  const [hoveredItem,    setHoveredItem]    = useState(null);

  useEffect(() => {
    api.get("/notifications?unread=true").then((res) => {
      const data = res.data?.notifications || res.data || [];
      setNotifCount(data.filter((n) => !n.isRead).length);
    }).catch(() => {});
  }, []);

  const menu        = MENUS[user?.role] || MENUS.employee;
  const role        = ROLE_CONFIG[user?.role] || ROLE_CONFIG.employee;
  const mainMenu    = menu.filter((i) => i.section === "main");
  const manageMenu  = menu.filter((i) => i.section === "manage");
  const userInitials = initials(user?.name);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeOpacity="0.7" fill="none"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeOpacity="0.85" fill="none"/>
            </svg>
          </div>
          {isOpen && <span className="logo-text">BlueLith</span>}
        </div>

        {/* Role badge */}
        {isOpen && user?.role && (
          <div className="sidebar-role-wrap">
            <div className="sidebar-role" style={{ background: role.bg, borderColor: role.color + "30" }}>
              <span className="role-dot" style={{ background: role.color }} />
              <span className="role-label" style={{ color: role.color }}>{role.label}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sidebar-nav">
          {isOpen && mainMenu.length > 0 && <span className="nav-section-label">Main</span>}
          {mainMenu.map((item, i) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-label">{item.name}</span>}
              {isOpen && <ChevronRightRoundedIcon className="nav-arrow" />}
              {!isOpen && hoveredItem === item.name && (
                <div className="nav-tooltip">{item.name}</div>
              )}
            </NavLink>
          ))}

          {manageMenu.length > 0 && (
            <>
              {isOpen && <span className="nav-section-label" style={{ marginTop: 16 }}>Manage</span>}
              {!isOpen && <div className="nav-divider" />}
              {manageMenu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isOpen && <span className="nav-label">{item.name}</span>}
                  {isOpen && <ChevronRightRoundedIcon className="nav-arrow" />}
                  {!isOpen && hoveredItem === item.name && (
                    <div className="nav-tooltip">{item.name}</div>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          {/* Notifications */}
          <button
            className="nav-item nav-action"
            onClick={() => navigate("/notifications")}
            onMouseEnter={() => setHoveredItem("notifications")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="nav-icon notif-icon">
              <NotificationsRoundedIcon />
              {notifCount > 0 && (
                <span className="notif-badge">{notifCount > 9 ? "9+" : notifCount}</span>
              )}
            </span>
            {isOpen && <span className="nav-label">Notifications</span>}
            {isOpen && notifCount > 0 && <span className="notif-pill">{notifCount}</span>}
            {!isOpen && hoveredItem === "notifications" && (
              <div className="nav-tooltip">Notifications {notifCount > 0 ? `(${notifCount})` : ""}</div>
            )}
          </button>

          {/* Profile */}
          <div className="sidebar-profile">
            <div
              className="profile-avatar"
              style={{ background: `linear-gradient(135deg, ${role.color}, ${role.accent})` }}
            >
              {userInitials}
            </div>
            {isOpen && (
              <div className="profile-info">
                <p className="profile-name">{user?.name || "Loading..."}</p>
                <p className="profile-email">{user?.email || ""}</p>
              </div>
            )}
            {isOpen ? (
              <button className="logout-btn" onClick={() => setShowLogoutConf(true)} title="Logout">
                <LogoutRoundedIcon style={{ fontSize: 18 }} />
              </button>
            ) : (
              <button className="logout-btn-collapsed" onClick={() => setShowLogoutConf(true)} title="Logout">
                <LogoutRoundedIcon style={{ fontSize: 16 }} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Logout confirmation */}
      {showLogoutConf && (
        <div className="logout-overlay" onClick={() => setShowLogoutConf(false)}>
          <div className="logout-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="logout-icon-wrap">
              <LogoutRoundedIcon style={{ fontSize: 28, color: "#ef4444" }} />
            </div>
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="logout-actions">
              <button className="logout-cancel" onClick={() => setShowLogoutConf(false)}>Cancel</button>
              <button className="logout-confirm" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}