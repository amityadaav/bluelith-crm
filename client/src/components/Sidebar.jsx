// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import PersonIcon from "@mui/icons-material/Person";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// function Sidebar() {

//   const [collapsed, setCollapsed] = useState(false);

//   const menu = [
//     { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
//     { name: "Leads", path: "/leads", icon: <PeopleIcon /> },
//     { name: "Clients", path: "/clients", icon: <PersonIcon /> },
//     { name: "Projects", path: "/projects", icon: <AssignmentIcon /> },
//     { name: "Analytics", path: "/analytics", icon: <BarChartIcon /> },
//     { name: "Settings", path: "/settings", icon: <SettingsIcon /> },
//   ];

//   return (
//     <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

//       {/* HEADER */}

//       <div className="sidebar-header">
//         {!collapsed && <h2 className="logo">BlueLith</h2>}
//         <button
//           className="collapse-btn"
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//         </button>
//       </div>
//       {/* MENU */}
//       <nav className="sidebar-menu">
//         {menu.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               isActive ? "menu-item active" : "menu-item"
//             }
//           >
//             {item.icon}
//             {!collapsed && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* PROFILE */}
// {/* PROFILE + LOGOUT */}
// <div className="sidebar-profile">

//   <div className="profile-left">
//     <div className="avatar">A</div>

//     {!collapsed && (
//       <div>
//         <p className="name">Amit Yadav</p>
//         <span className="role">Admin</span>
//       </div>
//     )}
//   </div>

//   {/* LOGOUT ICON */}
//   <LogoutIcon className="logout-icon" />

// </div>

//     </aside>
//   );
// }

// // export default Sidebar;
// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import PersonIcon from "@mui/icons-material/Person";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// function Sidebar() {

//   const [collapsed, setCollapsed] = useState(false);
//   const [user, setUser] = useState(null);

//   // Fetch user from backend
//   useEffect(() => {

//     const fetchUser = async () => {

//       try {

//         const res = await fetch("http://localhost:5000/api/users/profile", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         });

//         const data = await res.json();

//         setUser(data);

//       } catch (error) {

//         console.error("User fetch error:", error);

//       }

//     };

//     fetchUser();

//   }, []);

//   const menu = [
//     { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
//     { name: "Leads", path: "/leads", icon: <PeopleIcon /> },
//     { name: "Clients", path: "/clients", icon: <PersonIcon /> },
//     { name: "Projects", path: "/projects", icon: <AssignmentIcon /> },
//     { name: "Analytics", path: "/analytics", icon: <BarChartIcon /> },
//     { name: "Settings", path: "/settings", icon: <SettingsIcon /> },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

//       {/* HEADER */}
//       <div className="sidebar-header">
//         {!collapsed && <h2 className="logo">BlueLith</h2>}
//         <button
//           className="collapse-btn"
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//         </button>
//       </div>

//       {/* MENU */}
//       <nav className="sidebar-menu">
//         {menu.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               isActive ? "menu-item active" : "menu-item"
//             }
//           >
//             {item.icon}
//             {!collapsed && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* PROFILE */}
//       <div className="sidebar-profile">

//         <div className="profile-left">

//           <div className="avatar">
//             {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//           </div>

//           {!collapsed && (
//             <div>
//               <p className="name">{user?.name || "Loading..."}</p>
//               <span className="role">{user?.role || ""}</span>
//             </div>
//           )}

//         </div>

//         {/* LOGOUT */}
//         <LogoutIcon className="logout-icon" onClick={handleLogout} />

//       </div>

//     </aside>
//   );
// }

// export default Sidebar;


// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";
// import DashboardIcon  from "@mui/icons-material/Dashboard";
// import PeopleIcon     from "@mui/icons-material/People";
// import PersonIcon     from "@mui/icons-material/Person";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon   from "@mui/icons-material/BarChart";
// import SettingsIcon   from "@mui/icons-material/Settings";
// import LogoutIcon     from "@mui/icons-material/Logout";
// import ChevronLeftIcon  from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// import api from "../services/api";

// function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Try localStorage first (instant, no flicker)
//     const cached = localStorage.getItem("user");
//     if (cached) {
//       try { setUser(JSON.parse(cached)); } catch (_) {}
//     }

//     // Then verify with backend using the correct /api/auth/me route
//     const fetchUser = async () => {
//       try {
//         const res  = await api.get("/auth/me");
//         const data = res.data?.user || res.data;
//         setUser(data);
//         localStorage.setItem("user", JSON.stringify(data));
//       } catch (err) {
//         console.error("User fetch error:", err.message);
//       }
//     };
//     fetchUser();
//   }, []);

//   const menu = [
//     { name: "Dashboard", path: "/dashboard",  icon: <DashboardIcon /> },
//     { name: "Leads",     path: "/leads",       icon: <PeopleIcon /> },
//     { name: "Clients",   path: "/clients",     icon: <PersonIcon /> },
//     { name: "Projects",  path: "/projects",    icon: <AssignmentIcon /> },
//     { name: "Analytics", path: "/analytics",   icon: <BarChartIcon /> },
//     { name: "Settings",  path: "/settings",    icon: <SettingsIcon /> },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   return (
//     <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

//       {/* HEADER */}
//       <div className="sidebar-header">
//         {!collapsed && <h2 className="logo">BlueLith</h2>}
// <button className="collapse-btn" onClick={handleDrawerToggle}>
//   {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
// </button>
//       </div>

//       {/* MENU */}
//       <nav className="sidebar-menu">
//         {menu.map(item => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
//           >
//             {item.icon}
//             {!collapsed && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* PROFILE */}
//       <div className="sidebar-profile">
//         <div className="profile-left">
//           <div className="avatar">
//             {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//           </div>
//           {!collapsed && (
//             <div>
//               <p className="name">{user?.name || "Loading..."}</p>
//               <span className="role">{user?.role || ""}</span>
//             </div>
//           )}
//         </div>
//         <LogoutIcon className="logout-icon" onClick={handleLogout} />
//       </div>

//     </aside>
//   );
// }

// // export default Sidebar;
// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import PersonIcon from "@mui/icons-material/Person";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";


// import api from "../services/api";

// function Sidebar({ isOpen }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const cached = localStorage.getItem("user");
//     if (cached) {
//       try {
//         setUser(JSON.parse(cached));
//       } catch (_) {}
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await api.get("/auth/me");
//         const data = res.data?.user || res.data;
//         setUser(data);
//         localStorage.setItem("user", JSON.stringify(data));
//       } catch (err) {
//         console.error("User fetch error:", err.message);
//       }
//     };

//     fetchUser();
//   }, []);

// const menu = [
//   { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
//   { name: "Leads", path: "/leads", icon: <PeopleIcon /> },
//   { name: "Clients", path: "/clients", icon: <PersonIcon /> },
//   { name: "Projects", path: "/projects", icon: <AssignmentIcon /> },
//   { name: "Analytics", path: "/analytics", icon: <BarChartIcon /> },
//   { name: "Reports", path: "/reports", icon: <BarChartIcon /> },
//   { name: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },

//   // ✅ Only Admin can see Users
//   ...(user?.role === "admin"
//     ? [{ name: "Users", path: "/users", icon: <PeopleIcon /> }]
//     : []),

//   { name: "Settings", path: "/settings", icon: <SettingsIcon /> },
// ];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   return (
//     <aside className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
      
//       {/* HEADER */}
//       <div className="sidebar-header">
//         {isOpen && <h2 className="logo">BlueLith</h2>}
//       </div>

//       {/* MENU */}
//       <nav className="sidebar-menu">
//         {menu.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               isActive ? "menu-item active" : "menu-item"
//             }
//           >
//             {item.icon}
//             {isOpen && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* PROFILE */}
//       <div className="sidebar-profile">
//         <div className="profile-left">
//           <div className="avatar">
//             {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//           </div>

//           {isOpen && (
//             <div>
//               <p className="name">{user?.name || "Loading..."}</p>
//               <span className="role">{user?.role || ""}</span>
//             </div>
//           )}
//         </div>

//         <LogoutIcon className="logout-icon" onClick={handleLogout} />
//       </div>

//     </aside>
//   );
// }

// export default Sidebar;

// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";
// import DashboardIcon  from "@mui/icons-material/Dashboard";
// import PeopleIcon     from "@mui/icons-material/People";
// import PersonIcon     from "@mui/icons-material/Person";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import BarChartIcon   from "@mui/icons-material/BarChart";
// import SettingsIcon   from "@mui/icons-material/Settings";
// import LogoutIcon     from "@mui/icons-material/Logout";
// import CodeIcon       from "@mui/icons-material/Code";
// import GroupsIcon     from "@mui/icons-material/Groups";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import api from "../services/api";

// // ✅ Menu per role
// const getMenu = (role) => {
//   switch (role) {

//     case "admin":
//       return [
//         { name: "Dashboard",  path: "/dashboard",  icon: <DashboardIcon /> },
//         { name: "Leads",      path: "/leads",       icon: <PeopleIcon /> },
//         { name: "Clients",    path: "/clients",     icon: <PersonIcon /> },
//         { name: "Projects",   path: "/projects",    icon: <AssignmentIcon /> },
//         { name: "Users",      path: "/users",       icon: <GroupsIcon /> },
//         { name: "Analytics",  path: "/analytics",   icon: <BarChartIcon /> },
//         { name: "Settings",   path: "/settings",    icon: <SettingsIcon /> },
//       ];

//     case "sales":
//       return [
//         { name: "Dashboard",  path: "/sales/dashboard", icon: <DashboardIcon /> },
//         { name: "My Leads",   path: "/leads",           icon: <TrendingUpIcon /> },
//         { name: "My Clients", path: "/clients",         icon: <PersonIcon /> },
//         { name: "Projects",   path: "/projects",        icon: <AssignmentIcon /> },
//         { name: "Tasks",      path: "/tasks",           icon: <AssignmentIcon /> },
//       ];

//     case "developer":
//       return [
//         { name: "Dashboard",  path: "/developer/dashboard", icon: <DashboardIcon /> },
//         { name: "My Tasks",   path: "/tasks",               icon: <AssignmentIcon /> },
//         { name: "Projects",   path: "/projects",            icon: <AssignmentIcon /> },
//       ];

//     case "hr":
//       return [
//         { name: "Dashboard",  path: "/hr/dashboard", icon: <DashboardIcon /> },
//         { name: "Employees",  path: "/users",         icon: <GroupsIcon /> },
//         { name: "Tasks",      path: "/tasks",         icon: <AssignmentIcon /> },
//       ];

//     case "manager":
//       return [
//         { name: "Dashboard",  path: "/manager/dashboard", icon: <DashboardIcon /> },
//         { name: "Leads",      path: "/leads",             icon: <PeopleIcon /> },
//         { name: "Clients",    path: "/clients",           icon: <PersonIcon /> },
//         { name: "Projects",   path: "/projects",          icon: <AssignmentIcon /> },
//         { name: "Team",       path: "/users",             icon: <GroupsIcon /> },
//         { name: "Analytics",  path: "/analytics",         icon: <BarChartIcon /> },
//       ];

//     case "employee":
//     default:
//       return [
//         { name: "Dashboard",  path: "/employee/dashboard", icon: <DashboardIcon /> },
//         { name: "My Tasks",   path: "/tasks",              icon: <AssignmentIcon /> },
//         { name: "Projects",   path: "/projects",           icon: <AssignmentIcon /> },
//       ];
//   }
// };

// function Sidebar({ isOpen }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const cached = localStorage.getItem("user");
//     if (cached) {
//       try { setUser(JSON.parse(cached)); } catch (_) {}
//     }
//     const fetchUser = async () => {
//       try {
//         const res  = await api.get("/auth/me");
//         const data = res.data?.user || res.data;
//         setUser(data);
//         localStorage.setItem("user", JSON.stringify(data));
//       } catch (err) {
//         console.error("User fetch error:", err.message);
//       }
//     };
//     fetchUser();
//   }, []);

//   const menu = getMenu(user?.role);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   return (
//     <aside className={`sidebar ${!isOpen ? "collapsed" : ""}`}>

//       {/* HEADER */}
//       <div className="sidebar-header">
//         {isOpen && <h2 className="logo">BlueLith</h2>}
//       </div>

//       {/* ROLE BADGE */}
//       {isOpen && user?.role && (
//         <div className="sidebar-role-badge">
//           <span className={`role-pill role-${user.role}`}>
//             {user.role.toUpperCase()}
//           </span>
//         </div>
//       )}

//       {/* MENU */}
//       <nav className="sidebar-menu">
//         {menu.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
//           >
//             {item.icon}
//             {isOpen && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* PROFILE */}
//       <div className="sidebar-profile">
//         <div className="profile-left">
//           <div className="avatar">
//             {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//           </div>
//           {isOpen && (
//             <div>
//               <p className="name">{user?.name || "Loading..."}</p>
//               <span className="role">{user?.role || ""}</span>
//             </div>
//           )}
//         </div>
//         <LogoutIcon className="logout-icon" onClick={handleLogout} />
//       </div>

//     </aside>
//   );
// }

// export default Sidebar;

import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { AuthContext } from "../AuthContext";
import api from "../services/api";

// ── MUI Icons ──
import DashboardRoundedIcon    from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon    from "@mui/icons-material/PeopleAltRounded";
import PersonRoundedIcon       from "@mui/icons-material/PersonRounded";
import AssignmentRoundedIcon   from "@mui/icons-material/AssignmentRounded";
import BarChartRoundedIcon     from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon     from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon       from "@mui/icons-material/LogoutRounded";
import GroupsRoundedIcon       from "@mui/icons-material/GroupsRounded";
import TrendingUpRoundedIcon   from "@mui/icons-material/TrendingUpRounded";
import FolderRoundedIcon       from "@mui/icons-material/FolderRounded";
import TaskAltRoundedIcon      from "@mui/icons-material/TaskAltRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import MenuOpenRoundedIcon     from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon         from "@mui/icons-material/MenuRounded";

// ── Role menu config ──
const getMenu = (role) => {
  const menus = {
    admin: [
      { name: "Dashboard",  path: "/dashboard",  icon: <DashboardRoundedIcon />,  section: "main" },
      { name: "Leads",      path: "/leads",       icon: <TrendingUpRoundedIcon />, section: "main" },
      { name: "Clients",    path: "/clients",     icon: <PersonRoundedIcon />,     section: "main" },
      { name: "Projects",   path: "/projects",    icon: <FolderRoundedIcon />,     section: "main" },
      { name: "Users",      path: "/users",       icon: <GroupsRoundedIcon />,     section: "manage" },
      { name: "Analytics",  path: "/analytics",   icon: <BarChartRoundedIcon />,   section: "manage" },
      { name: "Settings",   path: "/settings",    icon: <SettingsRoundedIcon />,   section: "manage" },
    ],
    sales: [
      { name: "Dashboard",  path: "/sales/dashboard", icon: <DashboardRoundedIcon />,  section: "main" },
      { name: "My Leads",   path: "/leads",            icon: <TrendingUpRoundedIcon />, section: "main" },
      { name: "My Clients", path: "/clients",          icon: <PersonRoundedIcon />,     section: "main" },
      { name: "Projects",   path: "/projects",         icon: <FolderRoundedIcon />,     section: "main" },
      { name: "My Tasks",   path: "/tasks",            icon: <TaskAltRoundedIcon />,    section: "main" },
    ],
    developer: [
      { name: "Dashboard",  path: "/developer/dashboard", icon: <DashboardRoundedIcon />, section: "main" },
      { name: "My Tasks",   path: "/tasks",                icon: <TaskAltRoundedIcon />,   section: "main" },
      { name: "Projects",   path: "/projects",             icon: <FolderRoundedIcon />,    section: "main" },
    ],
    hr: [
      { name: "Dashboard",  path: "/hr/dashboard", icon: <DashboardRoundedIcon />,  section: "main" },
      { name: "Employees",  path: "/users",         icon: <GroupsRoundedIcon />,     section: "main" },
      { name: "My Tasks",   path: "/tasks",         icon: <TaskAltRoundedIcon />,    section: "main" },
    ],
    manager: [
      { name: "Dashboard",  path: "/manager/dashboard", icon: <DashboardRoundedIcon />,  section: "main" },
      { name: "Leads",      path: "/leads",              icon: <TrendingUpRoundedIcon />, section: "main" },
      { name: "Clients",    path: "/clients",            icon: <PersonRoundedIcon />,     section: "main" },
      { name: "Projects",   path: "/projects",           icon: <FolderRoundedIcon />,     section: "main" },
      { name: "Team",       path: "/users",              icon: <GroupsRoundedIcon />,     section: "manage" },
      { name: "Analytics",  path: "/analytics",          icon: <BarChartRoundedIcon />,   section: "manage" },
    ],
    employee: [
      { name: "Dashboard",  path: "/employee/dashboard", icon: <DashboardRoundedIcon />, section: "main" },
      { name: "My Tasks",   path: "/tasks",               icon: <TaskAltRoundedIcon />,   section: "main" },
      { name: "Projects",   path: "/projects",            icon: <FolderRoundedIcon />,    section: "main" },
    ],
  };
  return menus[role] || menus.employee;
};

// ── Role config ──
const roleConfig = {
  admin:     { label: "Admin",     color: "#ef4444", bg: "#fef2f2", accent: "#dc2626" },
  sales:     { label: "Sales",     color: "#16a34a", bg: "#f0fdf4", accent: "#15803d" },
  developer: { label: "Developer", color: "#4f46e5", bg: "#eef2ff", accent: "#4338ca" },
  hr:        { label: "HR",        color: "#db2777", bg: "#fdf2f8", accent: "#be185d" },
  manager:   { label: "Manager",   color: "#d97706", bg: "#fffbeb", accent: "#b45309" },
  employee:  { label: "Employee",  color: "#0284c7", bg: "#f0f9ff", accent: "#0369a1" },
};

function Sidebar({ isOpen, onClose }) {
  const { logout } = useContext(AuthContext);
  const navigate   = useNavigate();
  const location   = useLocation();

  const [user,          setUser]          = useState(null);
  const [notifCount,    setNotifCount]    = useState(0);
  const [showLogoutConf, setShowLogoutConf] = useState(false);
  const [hoveredItem,   setHoveredItem]   = useState(null);

  useEffect(() => {
    // Load from cache immediately
    const cached = localStorage.getItem("user");
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch (_) {}
    }
    // Fetch fresh data
    const fetchUser = async () => {
      try {
        const res  = await api.get("/auth/me");
        const data = res.data?.user || res.data;
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("User fetch error:", err.message);
      }
    };
    // Fetch notifications count
    const fetchNotifs = async () => {
      try {
        const res  = await api.get("/notifications");
        const data = res.data || [];
        setNotifCount(data.filter(n => !n.read).length);
      } catch (_) {}
    };
    fetchUser();
    fetchNotifs();
  }, []);

  const menu   = getMenu(user?.role);
  const role   = roleConfig[user?.role] || roleConfig.employee;
  const mainMenu   = menu.filter(i => i.section === "main");
  const manageMenu = menu.filter(i => i.section === "manage");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>

        {/* ── LOGO ── */}
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

        {/* ── ROLE BADGE ── */}
        {isOpen && user?.role && (
          <div className="sidebar-role-wrap">
            <div className="sidebar-role" style={{ background: role.bg, borderColor: role.color + "30" }}>
              <span className="role-dot" style={{ background: role.color }} />
              <span className="role-label" style={{ color: role.color }}>{role.label}</span>
            </div>
          </div>
        )}

        {/* ── MAIN MENU ── */}
        <nav className="sidebar-nav">
          {isOpen && mainMenu.length > 0 && (
            <span className="nav-section-label">Main</span>
          )}
          {mainMenu.map((item, i) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              title={!isOpen ? item.name : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-label">{item.name}</span>}
              {isOpen && <ChevronRightRoundedIcon className="nav-arrow" />}
              {/* Tooltip when collapsed */}
              {!isOpen && hoveredItem === item.name && (
                <div className="nav-tooltip">{item.name}</div>
              )}
            </NavLink>
          ))}

          {/* Manage section */}
          {manageMenu.length > 0 && (
            <>
              {isOpen && <span className="nav-section-label" style={{ marginTop: "16px" }}>Manage</span>}
              {!isOpen && <div className="nav-divider" />}
              {manageMenu.map((item, i) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={!isOpen ? item.name : ""}
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

        {/* ── BOTTOM ACTIONS ── */}
        <div className="sidebar-bottom">

          {/* Notifications */}
          <button
            className="nav-item nav-action"
            onClick={() => navigate("/notifications")}
            onMouseEnter={() => setHoveredItem("notifications")}
            onMouseLeave={() => setHoveredItem(null)}
            title={!isOpen ? "Notifications" : ""}
          >
            <span className="nav-icon notif-icon">
              <NotificationsRoundedIcon />
              {notifCount > 0 && <span className="notif-badge">{notifCount > 9 ? "9+" : notifCount}</span>}
            </span>
            {isOpen && <span className="nav-label">Notifications</span>}
            {isOpen && notifCount > 0 && <span className="notif-pill">{notifCount}</span>}
            {!isOpen && hoveredItem === "notifications" && (
              <div className="nav-tooltip">Notifications {notifCount > 0 ? `(${notifCount})` : ""}</div>
            )}
          </button>

          {/* ── PROFILE ── */}
          <div className="sidebar-profile">
            <div className="profile-avatar" style={{ background: `linear-gradient(135deg, ${role.color}, ${role.accent})` }}>
              {initials}
            </div>
            {isOpen && (
              <div className="profile-info">
                <p className="profile-name">{user?.name || "Loading..."}</p>
                <p className="profile-email">{user?.email || ""}</p>
              </div>
            )}
            {isOpen && (
              <button
                className="logout-btn"
                onClick={() => setShowLogoutConf(true)}
                title="Logout"
              >
                <LogoutRoundedIcon style={{ fontSize: 18 }} />
              </button>
            )}
            {!isOpen && (
              <button
                className="logout-btn-collapsed"
                onClick={() => setShowLogoutConf(true)}
                title="Logout"
              >
                <LogoutRoundedIcon style={{ fontSize: 16 }} />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* ── LOGOUT CONFIRMATION ── */}
      {showLogoutConf && (
        <div className="logout-overlay" onClick={() => setShowLogoutConf(false)}>
          <div className="logout-dialog" onClick={e => e.stopPropagation()}>
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

export default Sidebar;