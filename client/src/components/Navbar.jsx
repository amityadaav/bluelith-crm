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

// // export default Navbar;
// import React, { useContext, useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Navbar.css";

// import SearchIcon from "@mui/icons-material/Search";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import SettingsIcon from "@mui/icons-material/Settings";
// import HelpIcon from "@mui/icons-material/Help";
// import MenuIcon from "@mui/icons-material/Menu";
// import { AuthContext } from "../AuthContext";

// function Navbar({ isDarkMode,handleDrawerToggle }) {

//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const menuRef = useRef(null);
//   const notificationsRef = useRef(null);
//   const settingsRef = useRef(null);

//   const token = localStorage.getItem("token");

//   // Fetch Notifications
//   useEffect(() => {
//     fetch("http://localhost:5000/api/notifications", {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => setNotifications(data))
//       .catch(err => console.log(err));
//   }, []);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {

//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }

//       if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
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
//     }
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
//       <div className="navbar-container">
//        <button className="menu-btn" onClick={handleDrawerToggle}>
//           <MenuIcon />
//         </button>

//         {/* LEFT */}
//         <div className="navbar-left">
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
//           </div>

//           {/* Settings */}
//           <div className="settings-wrapper" ref={settingsRef}>
//             <button
//               className="icon-button"
//               onClick={() => setSettingsOpen(!settingsOpen)}
//             >
//               <SettingsIcon />
//             </button>
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
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../AuthContext";

function Navbar({ isDarkMode, handleDrawerToggle }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const searchInputRef = useRef(null);

  const token = localStorage.getItem("token");

  // Fetch Notifications
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notif => ({ ...notif, read: true }))
        );
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

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

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setNotificationsOpen(false);
        setSettingsOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navigate to the notification's link if provided
    if (notification.link) {
      navigate(notification.link);
      setNotificationsOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="navbar-container">
        <button 
          className="menu-btn" 
          onClick={handleDrawerToggle}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>

        {/* LEFT */}
        <div className="navbar-left">
          <img
            src="/images/logos-1.webp"
            alt="BlueLith Logo"
            className="navbar-logo"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* SEARCH */}
        <div className="navbar-center">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search leads, tasks, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search"
            />
            <button type="submit" className="search-button" aria-label="Submit search">
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
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setSettingsOpen(false);
                setMenuOpen(false);
              }}
              aria-label="Notifications"
            >
              <NotificationsIcon />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="dropdown-menu notifications-dropdown">
                <div className="dropdown-header">
                  <strong>Notifications</strong>
                  {unreadCount > 0 && (
                    <button 
                      className="mark-all-read-btn"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {loading ? (
                    <div className="notification-item">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-item">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? "unread" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-content">
                          <div className="notification-title">
                            {notification.title}
                          </div>
                          <div className="notification-message">
                            {notification.message}
                          </div>
                          <div className="notification-time">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                        {!notification.read && <div className="notification-dot" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="settings-wrapper" ref={settingsRef}>
            <button
              className="icon-button"
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setNotificationsOpen(false);
                setMenuOpen(false);
              }}
              aria-label="Settings"
            >
              <SettingsIcon />
            </button>

            {settingsOpen && (
              <div className="dropdown-menu settings-dropdown">
                <div className="dropdown-header">
                  <strong>Settings</strong>
                </div>
                <button onClick={() => {
                  navigate("/settings/profile");
                  setSettingsOpen(false);
                }}>
                  Profile Settings
                </button>
                <button onClick={() => {
                  navigate("/settings/account");
                  setSettingsOpen(false);
                }}>
                  Account Settings
                </button>
                <button onClick={() => {
                  navigate("/settings/notifications");
                  setSettingsOpen(false);
                }}>
                  Notification Preferences
                </button>
                <button onClick={() => {
                  navigate("/settings/privacy");
                  setSettingsOpen(false);
                }}>
                  Privacy & Security
                </button>
                <hr />
                <button onClick={() => {
                  navigate("/settings/help");
                  setSettingsOpen(false);
                }}>
                  <HelpIcon fontSize="small" /> Help & Support
                </button>
              </div>
            )}
          </div>

          {/* USER */}
          <div className="user-wrapper" ref={menuRef}>
            <button
              className="user-button"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setNotificationsOpen(false);
                setSettingsOpen(false);
              }}
              aria-label="User menu"
            >
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="user-name">{user?.name}</span>
            </button>

            {menuOpen && (
              <div className="dropdown-menu user-dropdown">
                <div className="dropdown-header">
                  <strong>{user?.name}</strong>
                  <small>{user?.email}</small>
                </div>
                <hr />
                <button onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}>
                  Your Profile
                </button>
                <button onClick={() => {
                  navigate("/dashboard");
                  setMenuOpen(false);
                }}>
                  Dashboard
                </button>
                <button onClick={() => {
                  navigate("/my-tasks");
                  setMenuOpen(false);
                }}>
                  My Tasks
                </button>
                <hr />
                <button onClick={handleLogout} className="logout-btn">
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