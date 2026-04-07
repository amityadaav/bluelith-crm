// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // ✅ Load user from localStorage on refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // ✅ Login
//   const login = async (email, password) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (!res.ok) return { success: false, error: data.message || "Login failed" };

//       if (data.token && data.user) {
//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem("token", data.token);
//         return { success: true, user: data.user };
//       }
//       return { success: false, error: "Invalid response from server" };
//     } catch (error) {
//       console.error("Login error:", error);
//       return { success: false, error: "Server error" };
//     }
//   };

//   // ✅ Logout
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // ✅ Load user from localStorage on refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // ✅ Login
//   const login = async (email, password) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (!res.ok) return { success: false, error: data.message || "Login failed" };

//       if (data.token && data.user) {
//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem("token", data.token);
//         return { success: true, user: data.user };
//       }
//       return { success: false, error: "Invalid response from server" };
//     } catch (error) {
//       console.error("Login error:", error);
//       return { success: false, error: "Server error" };
//     }
//   };

//   // ✅ Verify Employee for Password Reset
//   const verifyEmployeeForReset = async ({ name, phone, email, employeeId }) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/verify-employee", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, phone, email, employeeId }),
//       });
      
//       const data = await res.json();

//       if (!res.ok) {
//         return { success: false, error: data.message || "Employee verification failed" };
//       }

//       return { success: true };
//     } catch (error) {
//       console.error("Verify employee error:", error);
//       return { success: false, error: "Server error. Please try again." };
//     }
//   };

//   // ✅ Reset Password
//   const resetPassword = async ({ employeeId, newPassword }) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ employeeId, newPassword }),
//       });
      
//       const data = await res.json();

//       if (!res.ok) {
//         return { success: false, error: data.message || "Password reset failed" };
//       }

//       return { success: true };
//     } catch (error) {
//       console.error("Reset password error:", error);
//       return { success: false, error: "Server error. Please try again." };
//     }
//   };

//   // ✅ Logout
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       login, 
//       logout,
//       verifyEmployeeForReset,
//       resetPassword
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// In your AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.message || "Login failed" };

      if (data.token && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Server error" };
    }
  };

  // This endpoint verifies employee AND sends OTP
  const verifyEmployeeForReset = async ({ name, phone, email, employeeId }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, employeeId }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "Employee verification failed" };
      }

      return { success: true, email: data.email };
    } catch (error) {
      console.error("Verify employee error:", error);
      return { success: false, error: "Server error. Please try again." };
    }
  };

  // Verify OTP endpoint
  const verifyOTP = async ({ email, employeeId, otp }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, employeeId, otp }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "OTP verification failed" };
      }

      return { success: true };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { success: false, error: "Server error. Please try again." };
    }
  };

  // Reset password endpoint
  const resetPassword = async ({ employeeId, newPassword, otp, email }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, newPassword, otp, email }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "Password reset failed" };
      }

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: "Server error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      verifyEmployeeForReset,
      verifyOTP,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};