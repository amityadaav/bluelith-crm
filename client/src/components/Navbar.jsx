
import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon          from "@mui/icons-material/Menu";
import SearchIcon        from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon      from "@mui/icons-material/Settings";
import { AuthContext }   from "../context/AuthContext";
import api               from "../services/api";
import { timeAgo }       from "../utils/helpers";
import logo              from "../assets/images/BLT.webp";
import "./Navbar.css";

export default function Navbar({ handleDrawerToggle }) {
  const { user, logout } = useContext(AuthContext);
  const navigate          = useNavigate();

  const [search,          setSearch]          = useState("");
  const [notifOpen,       setNotifOpen]       = useState(false);
  const [userOpen,        setUserOpen]        = useState(false);
  const [notifications,   setNotifications]   = useState([]);
  const [unreadCount,     setUnreadCount]     = useState(0);

  const notifRef = useRef(null);
  const userRef  = useRef(null);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    api.get("/notifications?unread=false").then((res) => {
      const data = res.data?.notifications || res.data || [];
      setNotifications(data.slice(0, 20));
      setUnreadCount(data.filter((n) => !n.isRead).length);
    }).catch(() => {});
  }, [user]);

  // Close dropdowns on outside click / Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") { setNotifOpen(false); setUserOpen(false); }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown",   handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown",   handleEsc);
    };
  }, []);

  const markAllRead = async () => {
    await api.put("/notifications/read-all").catch(() => {});
    setNotifications((p) => p.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(() => {});
    setNotifications((p) => p.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/leads?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left */}
        <div className="navbar-left">
          <button className="menu-button" onClick={handleDrawerToggle} aria-label="Toggle sidebar">
            <MenuIcon />
          </button>
          <img
            src={logo}
            alt="BlueLith"
            className="navbar-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Search */}
        <div className="navbar-center">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search leads, clients, projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" className="search-button" aria-label="Search">
              <SearchIcon className="search-icon" />
            </button>
          </form>
        </div>

        {/* Right */}
        <div className="navbar-right">
          {/* Notifications */}
          <div className="notifications-wrapper" ref={notifRef}>
            <button
              className="icon-button"
              onClick={() => { setNotifOpen((p) => !p); setUserOpen(false); }}
              aria-label="Notifications"
            >
              <NotificationsIcon />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}>Mark all read</button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="notification-item">
                      <p style={{ color: "#94a3b8", textAlign: "center" }}>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`notification-item ${!n.isRead ? "unread" : ""}`}
                        onClick={() => markRead(n._id)}
                      >
                        <p>{n.message || n.title}</p>
                        <small>{timeAgo(n.createdAt)}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings shortcut */}
          <button
            className="icon-button"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>

          {/* User menu */}
          <div className="user-wrapper" ref={userRef}>
            <button
              className="user-button"
              onClick={() => { setUserOpen((p) => !p); setNotifOpen(false); }}
              aria-label="User menu"
            >
              <div className="user-avatar">{avatarInitials}</div>
              <span className="user-name">{user?.name}</span>
            </button>

            {userOpen && (
              <div className="dropdown-menu">
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>
                <button onClick={() => { navigate("/"); setUserOpen(false); }}>Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}