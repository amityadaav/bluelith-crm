import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Leads", path: "/leads", icon: <PeopleIcon /> },
    { name: "Clients", path: "/clients", icon: <PersonIcon /> },
    { name: "Projects", path: "/projects", icon: <AssignmentIcon /> },
    { name: "Analytics", path: "/analytics", icon: <BarChartIcon /> },
    { name: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        {!collapsed && <h2>BlueLith</h2>}
        <MenuIcon
          className="menu-btn"
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* PROFILE */}
{/* PROFILE + LOGOUT */}
<div className="sidebar-profile">

  <div className="profile-left">
    <div className="avatar">A</div>

    {!collapsed && (
      <div>
        <p className="name">Amit Yadav</p>
        <span className="role">Admin</span>
      </div>
    )}
  </div>

  {/* LOGOUT ICON */}
  <LogoutIcon className="logout-icon" />

</div>

    </aside>
  );
}

export default Sidebar;