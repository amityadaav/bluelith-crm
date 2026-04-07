// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// import "./App.css";

// import { AuthProvider } from "./AuthContext";
// import PrivateRoute from "./PrivateRoute";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Leads from "./pages/Leads";
// import Clients from "./pages/Clients";
// import Projects from "./pages/Projects";
// import Settings from "./pages/Settings";
// import Users from "./pages/Users";
// import Analytics from "./pages/Analytics";
// import EmployeeDashboard from "./pages/EmployeeDashboard";

// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";

// function Layout({ sidebarOpen, setSidebarOpen, handleDrawerToggle }) {
//   return (
//     <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      
//       <Navbar handleDrawerToggle={handleDrawerToggle} />

//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <main className="main-content">
//         <Outlet />
//       </main>

//     </div>
//   );
// }

// function App() {

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (

//     <AuthProvider>

//       <Router>

//         <Routes>

//           {/* Login Route */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Layout */}
//           <Route
//             element={
//               <PrivateRoute>
//                 <Layout
//                   sidebarOpen={sidebarOpen}
//                   setSidebarOpen={setSidebarOpen}
//                   handleDrawerToggle={handleDrawerToggle}
//                 />
//               </PrivateRoute>
//             }
//           >
//             <Route path="/employee/dashboard" element={
//   <ProtectedRoute allowedRoles={["employee", "developer", "hr"]}>
//     <EmployeeDashboard />
//   </ProtectedRoute>
// } />

//             <Route path="/" element={<Navigate to="/dashboard" />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/leads" element={<Leads />} />
//             <Route path="/clients" element={<Clients />} />
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/settings" element={<Settings />} />

//           </Route>

//         </Routes>

//       </Router>

//     </AuthProvider>

//   );
// }

// export default App;

// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   Outlet,
// } from "react-router-dom";

// import "./App.css";

// import { AuthProvider } from "./AuthContext";
// import PrivateRoute from "./routes/PrivateRoute";
// import ProtectedRoute from "./routes/ProtectedRoute";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Leads from "./pages/Leads";
// import Clients from "./pages/Clients";
// import Projects from "./pages/Projects";
// import Settings from "./pages/Settings";
// import Users from "./pages/Users";
// import Analytics from "./pages/Analytics";
// import EmployeeDashboard from "./pages/EmployeeDashboard";

// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";

// function Layout({ sidebarOpen, setSidebarOpen, handleDrawerToggle }) {
//   return (
//     <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
//       <Navbar handleDrawerToggle={handleDrawerToggle} />

//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Route */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Layout */}
//           <Route
//             element={
//               <PrivateRoute>
//                 <Layout
//                   sidebarOpen={sidebarOpen}
//                   setSidebarOpen={setSidebarOpen}
//                   handleDrawerToggle={handleDrawerToggle}
//                 />
//               </PrivateRoute>
//             }
//           >
//             {/* Role-based Employee Dashboard */}
//             <Route
//               path="/employee/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["employee", "developer", "hr"]}>
//                   <EmployeeDashboard />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Default Redirect */}
//             <Route path="/" element={<Navigate to="/dashboard" />} />

//             {/* Normal Routes */}
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/leads" element={<Leads />} />
//             <Route path="/clients" element={<Clients />} />
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/settings" element={<Settings />} />
//           </Route>
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import "./App.css";
// import { AuthProvider, AuthContext } from "./AuthContext";
// import { useContext } from "react";
// import PrivateRoute    from "./routes/PrivateRoute";
// import ProtectedRoute  from "./routes/ProtectedRoute";
// import Login           from "./pages/Login";
// import Dashboard       from "./pages/Dashboard";
// import EmployeeDashboard from "./pages/EmployeeDashboard";
// import Leads           from "./pages/Leads";
// import Clients         from "./pages/Clients";
// import Projects        from "./pages/Projects";
// import Settings        from "./pages/Settings";
// import Users           from "./pages/Users";
// import Analytics       from "./pages/Analytics";
// import Navbar          from "./components/Navbar";
// import Sidebar         from "./components/Sidebar";
// import SalesDashboard from "./pages/SalesDashboard";
// import DeveloperDashboard from "./pages/DeveloperDashboard";
// import HRDashboard        from "./pages/HRDashboard";

// function Layout({ sidebarOpen, setSidebarOpen, handleDrawerToggle }) {
//   return (
//     <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
//       <Navbar handleDrawerToggle={handleDrawerToggle} />
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// // ✅ Smart default redirect based on role
// function RoleRedirect() {
//   const { user } = useContext(AuthContext);
//   if (!user) return <Navigate to="/login" />;
//   switch (user.role) {
//     case "admin":     return <Navigate to="/dashboard" />;
//     case "sales":     return <Navigate to="/sales/dashboard" />;
//     case "manager":   return <Navigate to="/manager/dashboard" />;
//     case "developer": return <Navigate to="/developer/dashboard" />;
//      case "hr":        return <Navigate to="/hr/dashboard" />;
//     case "employee":  return <Navigate to="/employee/dashboard" />;
//     default:          return <Navigate to="/employee/dashboard" />;
//   }
// }

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const handleDrawerToggle = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Layout */}
//           <Route
//             element={
//               <PrivateRoute>
//                 <Layout
//                   sidebarOpen={sidebarOpen}
//                   setSidebarOpen={setSidebarOpen}
//                   handleDrawerToggle={handleDrawerToggle}
//                 />
//               </PrivateRoute>
//             }
//           >
//             {/* ✅ Smart default redirect */}
//             <Route path="/" element={<RoleRedirect />} />

//             {/* ✅ Admin only */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             {/* ✅ Sales Dashboard */}  
//             <Route
//               path="/sales/dashboard"
//               element={
//               <ProtectedRoute allowedRoles={["sales"]}>
//                 <SalesDashboard />
//               </ProtectedRoute>
//               }
//             />
//             {/* ✅ Manager Dashboard */}
//             <Route
//               path="/manager/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["manager"]}>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             {/* ✅ Developer Dashboard */}
//             <Route
//               path="/developer/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["developer"]}>
//                   <DeveloperDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             {/* ✅ HR Dashboard */}
//             <Route
//               path="/hr/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["hr"]}>
//                   <HRDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             {/* ✅ Employee / Developer / HR */}
//             <Route
//               path="/employee/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["employee", "developer", "hr"]}>
//                   <EmployeeDashboard />
//                 </ProtectedRoute>
//               }
//             />

//             {/* ✅ Shared routes — accessible by all logged-in roles */}
//             <Route path="/leads"     element={<Leads />} />
//             <Route path="/clients"   element={<Clients />} />
//             <Route path="/projects"  element={<Projects />} />
//             <Route path="/analytics" element={<Analytics />} />

//             {/* ✅ Admin only routes */}
//             <Route
//               path="/users"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Users />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/settings"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Settings />
//                 </ProtectedRoute>
//               }
//             />
//           </Route>

//           {/* 404 fallback */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router, Routes, Route, Navigate, Outlet,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, AuthContext } from "./AuthContext";
import PrivateRoute       from "./routes/PrivateRoute";
import ProtectedRoute     from "./routes/ProtectedRoute";
import Login              from "./pages/Login";
import Dashboard          from "./pages/Dashboard";
import EmployeeDashboard  from "./pages/EmployeeDashboard";
import SalesDashboard     from "./pages/SalesDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import HRDashboard        from "./pages/HRDashboard";
import Leads              from "./pages/Leads";
import Clients            from "./pages/Clients";
import Projects           from "./pages/Projects";
import Settings           from "./pages/Settings";
import Users              from "./pages/Users";
import Analytics          from "./pages/Analytics";
import Navbar             from "./components/Navbar";
import Sidebar            from "./components/Sidebar";

// ── Smart redirect based on role ──
function RoleRedirect() {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case "admin":     return <Navigate to="/dashboard" />;
    case "sales":     return <Navigate to="/sales/dashboard" />;
    case "manager":   return <Navigate to="/manager/dashboard" />;
    case "developer": return <Navigate to="/developer/dashboard" />;
    case "hr":        return <Navigate to="/hr/dashboard" />;
    default:          return <Navigate to="/employee/dashboard" />;
  }
}

// ── Layout wrapper ──
function Layout({ sidebarOpen, setSidebarOpen, handleDrawerToggle }) {
  return (
    <div className={`app-layout ${sidebarOpen ? "sidebar-open-layout" : ""}`}>
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleDrawerToggle = () => setSidebarOpen(prev => !prev);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
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
            {/* Smart redirect */}
            <Route path="/" element={<RoleRedirect />} />

            {/* Admin */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Sales */}
            <Route path="/sales/dashboard" element={
              <ProtectedRoute allowedRoles={["sales"]}>
                <SalesDashboard />
              </ProtectedRoute>
            } />

            {/* Developer */}
            <Route path="/developer/dashboard" element={
              <ProtectedRoute allowedRoles={["developer"]}>
                <DeveloperDashboard />
              </ProtectedRoute>
            } />

            {/* HR */}
            <Route path="/hr/dashboard" element={
              <ProtectedRoute allowedRoles={["hr"]}>
                <HRDashboard />
              </ProtectedRoute>
            } />

            {/* Employee */}
            <Route path="/employee/dashboard" element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />

            {/* Shared routes */}
            <Route path="/leads"     element={<Leads />} />
            <Route path="/clients"   element={<Clients />} />
            <Route path="/projects"  element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Admin only */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={["admin", "hr", "manager"]}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;