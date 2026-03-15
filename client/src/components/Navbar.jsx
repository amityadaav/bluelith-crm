// import React, { useContext, useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Navbar.css";

// import MenuIcon from "@mui/icons-material/Menu";
// import SearchIcon from "@mui/icons-material/Search";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import SettingsIcon from "@mui/icons-material/Settings";
// import HelpIcon from "@mui/icons-material/Help";

// import { AuthContext } from "../AuthContext";

// function Navbar({ handleDrawerToggle, isDarkMode }) {

//   const { user, logout } = useContext(AuthContext);

//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [settingsOpen, setSettingsOpen] = useState(false);

//   const [notifications, setNotifications] = useState([]);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);

//   const menuRef = useRef(null);
//   const notificationsRef = useRef(null);
//   const settingsRef = useRef(null);

//   const token = localStorage.getItem("token");

//   // Fetch Notifications
//   useEffect(() => {

//     fetch("http://localhost:5000/api/notifications", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => setNotifications(data))
//       .catch(err => console.log(err));

//   }, []);

//   // Close dropdown when click outside
//   useEffect(() => {

//     const handleClickOutside = (event) => {

//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }

//       if (
//         notificationsRef.current &&
//         !notificationsRef.current.contains(event.target)
//       ) {
//         setNotificationsOpen(false);
//       }

//       if (settingsRef.current && !settingsRef.current.contains(event.target)) {
//         setSettingsOpen(false);
//       }

//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);

//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleSearch = (e) => {

//     e.preventDefault();

//     if (searchQuery.trim()) {

//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);

//       setSearchQuery("");
//       setSearchOpen(false);

//     }

//   };

//   // Mark notification read
//   const handleNotificationClick = async (id) => {

//     await fetch(`http://localhost:5000/api/notifications/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     setNotifications(notifications.map(n =>
//       n._id === id ? { ...n, read: true } : n
//     ));

//   };

//   // Mark all read
//   const markAllAsRead = async () => {

//     await fetch(`http://localhost:5000/api/notifications/mark-all/read`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     setNotifications(notifications.map(n => ({ ...n, read: true })));

//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
//       <div className="navbar-container">

//         {/* LEFT */}
//         <div className="navbar-left">

//           <button className="menu-button desktop-only" onClick={handleDrawerToggle}>
//             <MenuIcon />
//           </button>

//           <img
//             src="/images/logos-1.webp"
//             alt="BlueLith Logo"
//             className="navbar-logo"
//           />

//         </div>

//         {/* SEARCH */}
//         <div className="navbar-center">

//           <form className="search-form" onSubmit={handleSearch}>

//             <input
//               type="text"
//               placeholder="Search leads, tasks, contacts..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />

//             <button type="submit" className="search-button">
//               <SearchIcon />
//             </button>

//           </form>

//         </div>

//         {/* RIGHT */}
//         <div className="navbar-right">

//           {/* Notifications */}
//           <div className="notifications-wrapper" ref={notificationsRef}>

//             <button
//               className="icon-button"
//               onClick={() => setNotificationsOpen(!notificationsOpen)}
//             >
//               <NotificationsIcon />

//               {unreadCount > 0 && (
//                 <span className="notification-badge">{unreadCount}</span>
//               )}

//             </button>

//             {notificationsOpen && (

//               <div className="dropdown-menu">

//                 <div className="dropdown-header">

//                   <h3>Notifications</h3>

//                   {unreadCount > 0 && (
//                     <button onClick={markAllAsRead}>
//                       Mark all as read
//                     </button>
//                   )}

//                 </div>

//                 <div className="notifications-list">

//                   {notifications.map(n => (

//                     <div
//                       key={n._id}
//                       className={`notification-item ${!n.read ? "unread" : ""}`}
//                       onClick={() => handleNotificationClick(n._id)}
//                     >

//                       <p>{n.text}</p>
//                       <small>{new Date(n.createdAt).toLocaleString()}</small>

//                     </div>

//                   ))}

//                 </div>

//               </div>

//             )}

//           </div>

//           {/* Settings */}
//           <div className="settings-wrapper" ref={settingsRef}>

//             <button
//               className="icon-button"
//               onClick={() => setSettingsOpen(!settingsOpen)}
//             >
//               <SettingsIcon />
//             </button>

//             {settingsOpen && (

//               <div className="dropdown-menu">

//                 <button onClick={() => navigate("/profile")}>
//                   Profile Settings
//                 </button>

//                 <button onClick={() => navigate("/account")}>
//                   Account Settings
//                 </button>

//                 <button onClick={() => navigate("/security")}>
//                   Security
//                 </button>

//                 <button onClick={() => navigate("/help")}>
//                   <HelpIcon /> Help
//                 </button>

//               </div>

//             )}

//           </div>

//           {/* USER */}
//           <div className="user-wrapper" ref={menuRef}>

//             <button
//               className="user-button"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >

//               <div className="user-avatar">
//                 {user?.name?.charAt(0) || "U"}
//               </div>

//               <span className="user-name">{user?.name}</span>

//             </button>

//             {menuOpen && (

//               <div className="dropdown-menu">

//                 <strong>{user?.name}</strong>
//                 <small>{user?.email}</small>

//                 <button onClick={() => navigate("/profile")}>
//                   Your Profile
//                 </button>

//                 <button onClick={() => navigate("/dashboard")}>
//                   Dashboard
//                 </button>

//                 <button onClick={() => navigate("/activity")}>
//                   Activity Log
//                 </button>

//                 <button onClick={handleLogout}>
//                   Logout
//                 </button>

//               </div>

//             )}

//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";

import { AuthContext } from "../AuthContext";

function Navbar({ isDarkMode }) {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);

  const token = localStorage.getItem("token");

  // Fetch Notifications
  useEffect(() => {
    fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.log(err));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }

      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="navbar-container">

        {/* LEFT */}
        <div className="navbar-left">
          <img
            src="/images/logos-1.webp"
            alt="BlueLith Logo"
            className="navbar-logo"
          />
        </div>

        {/* SEARCH */}
        <div className="navbar-center">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search leads, tasks, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <SearchIcon />
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="navbar-right">

          {/* Notifications */}
          <div className="notifications-wrapper" ref={notificationsRef}>
            <button
              className="icon-button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <NotificationsIcon />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
          </div>

          {/* Settings */}
          <div className="settings-wrapper" ref={settingsRef}>
            <button
              className="icon-button"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <SettingsIcon />
            </button>
          </div>

          {/* USER */}
          <div className="user-wrapper" ref={menuRef}>
            <button
              className="user-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="user-name">{user?.name}</span>
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>

                <button onClick={() => navigate("/profile")}>
                  Your Profile
                </button>

                <button onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;