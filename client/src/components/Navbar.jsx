/* This code snippet is a React functional component called `Navbar`. It represents a navigation bar
component for a web application. Here's a breakdown of what the code is doing: */
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../AuthContext';

function Navbar({ handleDrawerToggle }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-button" onClick={handleDrawerToggle}>
          <MenuIcon />
        </button>
        
        <h1 className="navbar-title">BlueLith CRM</h1>
        
        <div className="navbar-user">
          <button 
            className="user-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="user-name">{user?.name}</span>
          </button>
          
          {menuOpen && (
            <div className="user-menu">
              <div className="user-menu-header">
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>
              </div>
              <button onClick={handleLogout} className="menu-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;