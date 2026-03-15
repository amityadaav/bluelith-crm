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

// export default Sidebar;


import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import DashboardIcon  from "@mui/icons-material/Dashboard";
import PeopleIcon     from "@mui/icons-material/People";
import PersonIcon     from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon   from "@mui/icons-material/BarChart";
import SettingsIcon   from "@mui/icons-material/Settings";
import LogoutIcon     from "@mui/icons-material/Logout";
import ChevronLeftIcon  from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import api from "../services/api";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try localStorage first (instant, no flicker)
    const cached = localStorage.getItem("user");
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch (_) {}
    }

    // Then verify with backend using the correct /api/auth/me route
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
    fetchUser();
  }, []);

const toggleSidebar = () => {
  const newState = !collapsed;
  setCollapsed(newState);

  if (newState) {
    document.body.classList.add("sidebar-collapsed");
  } else {
    document.body.classList.remove("sidebar-collapsed");
  }
};

  const menu = [
    { name: "Dashboard", path: "/dashboard",  icon: <DashboardIcon /> },
    { name: "Leads",     path: "/leads",       icon: <PeopleIcon /> },
    { name: "Clients",   path: "/clients",     icon: <PersonIcon /> },
    { name: "Projects",  path: "/projects",    icon: <AssignmentIcon /> },
    { name: "Analytics", path: "/analytics",   icon: <BarChartIcon /> },
    { name: "Settings",  path: "/settings",    icon: <SettingsIcon /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        {!collapsed && <h2 className="logo">BlueLith</h2>}
<button className="collapse-btn" onClick={toggleSidebar}>
  {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
</button>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {menu.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* PROFILE */}
      <div className="sidebar-profile">
        <div className="profile-left">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          {!collapsed && (
            <div>
              <p className="name">{user?.name || "Loading..."}</p>
              <span className="role">{user?.role || ""}</span>
            </div>
          )}
        </div>
        <LogoutIcon className="logout-icon" onClick={handleLogout} />
      </div>

    </aside>
  );
}

export default Sidebar;