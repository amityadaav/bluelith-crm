// // import { useContext } from "react";
// // import { Navigate } from "react-router-dom";
// // //import { AuthContext } from "./AuthContext.jsx";
// // import { AuthContext } from "../AuthContext";

// // const ProtectedRoute = ({ children, allowedRoles }) => {
// //   const { user } = useContext(AuthContext);

// //   // Not logged in
// //   if (!user) {
// //     return <Navigate to="/login" />;
// //   }

// //   // Role not allowed
// //   if (!allowedRoles.includes(user.role)) {
// //     return <Navigate to="/dashboard" />;
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;

// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user } = useContext(AuthContext);

//   // Not logged in
//   if (!user) return <Navigate to="/login" />;

//   // Role is allowed ✅
//   if (allowedRoles.includes(user.role)) return children;

//   // ✅ Role not allowed — redirect to their own dashboard
//   switch (user.role) {
//     case "admin":     return <Navigate to="/dashboard" />;
//     case "sales":     return <Navigate to="/sales/dashboard" />;
//     case "manager":   return <Navigate to="/manager/dashboard" />;
// case "developer": return <Navigate to="/developer/dashboard" />;
// case "hr":        return <Navigate to="/hr/dashboard" />;
//     case "employee":  return <Navigate to="/employee/dashboard" />;
//     default:          return <Navigate to="/login" />;
//   }
// };

// export default ProtectedRoute;


import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard instead of a blank page
    const dashboardMap = {
      admin:     "/dashboard",
      sales:     "/sales/dashboard",
      manager:   "/manager/dashboard",
      developer: "/developer/dashboard",
      hr:        "/hr/dashboard",
      employee:  "/employee/dashboard",
    };
    return <Navigate to={dashboardMap[user.role] || "/employee/dashboard"} replace />;
  }

  return children;
}