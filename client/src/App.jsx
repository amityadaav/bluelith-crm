import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";


import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function Layout({ sidebarOpen, setSidebarOpen, handleDrawerToggle }) {
  return (
    <div className="layout">
      
      <Navbar handleDrawerToggle={handleDrawerToggle} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout */}
          <Route
            element={
              <PrivateRoute>
                <Layout
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  handleDrawerToggle={handleDrawerToggle}
                />
              </PrivateRoute>
            }
          >

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/users" element={<Users />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />

          </Route>

        </Routes>

      </Router>

    </AuthProvider>

  );
}

export default App;