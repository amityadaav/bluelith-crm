// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../AuthContext";

// const PrivateRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}