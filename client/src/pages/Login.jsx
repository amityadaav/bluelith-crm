// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';
// import { AuthContext } from '../AuthContext';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setError("");

// //   console.log("Login clicked");

// //   const result = await login(email, password);

// //   console.log(result);

// //   if (!result.success) {
// //     setError("Invalid email or password");
// //     return;
// //   }

// //   // ✅ role yahan se lo
// // if (user.role === "admin") {
// //     navigate("/dashboard");
// //   } else {
// //     navigate("/dashboard"); // same dashboard (recommended)
// //   }
// // };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   const result = await login(email, password);

//   if (!result.success) {
//     setError("Invalid email or password");
//     return;
//   }

//   const user = result.user;

//   // 🔥 Role-based redirect
//   if (user.role === "admin") {
//     navigate("/dashboard");
//   } else {
//     navigate("/dashboard"); // same dashboard best
//   }
// };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h1 className="login-title">BlueLith CRM</h1>
//         <h2 className="login-subtitle">Sign In</h2>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
          
//           <button type="submit" className="login-button">
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';
// import { AuthContext } from '../AuthContext';

// function Login() {
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [error,    setError]    = useState('');
//   const [loading,  setLoading]  = useState(false);

//   const { login } = useContext(AuthContext);
//   const navigate  = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await login(email, password);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error || 'Invalid email or password');
//       return;
//     }

//     // ✅ Role-based redirect
//     const { role } = result.user;
//     switch (role) {
//       case 'admin':     navigate('/dashboard');           break;
//       case 'sales':     navigate('/sales/dashboard');     break;
//       case 'manager':   navigate('/manager/dashboard');   break;
//       case 'developer': navigate('/developer/dashboard');  break;
//       case 'hr':        navigate('/hr/dashboard');        break;
//       default:          navigate('/employee/dashboard');  break;
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h1 className="login-title">BlueLith CRM</h1>
//         <h2 className="login-subtitle">Sign In</h2>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="login-button" disabled={loading}>
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // export default Login;
// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";
// import { AuthContext } from "../AuthContext";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const result = await login(email, password);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error || "Invalid email or password");
//       return;
//     }

//     const { role } = result.user;
//     switch (role) {
//       case "admin": navigate("/dashboard"); break;
//       case "sales": navigate("/sales/dashboard"); break;
//       case "manager": navigate("/manager/dashboard"); break;
//       case "developer": navigate("/developer/dashboard"); break;
//       case "hr": navigate("/hr/dashboard"); break;
//       default: navigate("/employee/dashboard");
//     }
//   };

//   return (
//     <div className="main-container">
//       <div className="login-wrapper">

//         {/* LEFT SIDE - Login Form */}
//         <div className="left-section">

//           {/* Brand */}
//           <div className="brand">
//             <svg className="brand-logo" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <circle cx="18" cy="18" r="17" fill="#e8f0fe" stroke="#c7d7fc" strokeWidth="1.2"/>
//               <polygon points="18,6 28,14 24,28 12,28 8,14" fill="#1a3a8f"/>
//               <polygon points="18,6 28,14 18,12" fill="#4a7de8"/>
//               <polygon points="18,6 8,14 18,12" fill="#2255cc"/>
//               <polygon points="8,14 12,28 18,12" fill="#3060d0"/>
//               <polygon points="28,14 24,28 18,12" fill="#1a3a8f"/>
//               <polygon points="12,28 24,28 18,12" fill="#2a50b8"/>
//               <polygon points="18,8 22,13 18,11" fill="white" opacity="0.35"/>
//             </svg>
//             <span className="brand-name">BlueLith</span>
//           </div>

//           <p className="welcome">Welcome to</p>
//           <h2 className="title">BlueLith</h2>

//           {error && <div className="error">{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <label className="field-label">Username</label>
//             <div className="input-group">
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               {email && (
//                 <span className="check-icon">
//                   <svg viewBox="0 0 12 12" fill="none">
//                     <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </span>
//               )}
//             </div>

//             <label className="field-label">Password</label>
//             <div className="input-group">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="options">
//               <label><input type="radio" name="remember" /> Remember me</label>
//               <span className="forgot">Forgot Password?</span>
//             </div>

//             <button type="submit" disabled={loading}>
//               {loading ? "Signing in..." : "LOGIN"}
//             </button>

//             <div className="signup-link">
//               Contact admin to get access
//             </div>
//           </form>

//           <div className="footer-links-left">
//             <span>FAQ</span><span className="sep">|</span>
//             <span>Features</span><span className="sep">|</span>
//             <span>Support</span>
//           </div>
//         </div>

//         {/* CURVED DIVIDER */}
//         <div className="curve">
//           <svg viewBox="0 0 120 600" preserveAspectRatio="none">
//             <path d="M0,0 C80,60 30,200 90,290 C130,350 50,490 100,600 L0,600 Z" />
//           </svg>
//         </div>

//         {/* RIGHT SIDE - About BlueLith */}
//         <div className="right-section">
//           <div className="right-content">
//             <h2>About BlueLith</h2>
//             <p>
//               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
//             </p>

//             <div className="features-heading">Features</div>
//             <ul className="features-list">
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard industry.</span></li>
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
//             </ul>

//             <div className="footer-links">
//               <span>FAQ</span>
//               <span>Features</span>
//               <span>Support</span>
//             </div>
//           </div>

//           {/* Crystal Scene */}
//           <div className="crystal-scene">
//             <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
//               <ellipse cx="300" cy="200" rx="340" ry="75" fill="#0d2a7a" opacity="0.5"/>
//               <rect x="0" y="148" width="600" height="32" fill="#0d2a7a" opacity="0.45"/>
//               <ellipse cx="150" cy="175" rx="180" ry="55" fill="#1230a0" opacity="0.4"/>
//               <ellipse cx="460" cy="180" rx="200" ry="50" fill="#1230a0" opacity="0.35"/>
//               <rect x="0" y="148" width="600" height="2" fill="#7eb8ff" opacity="0.3"/>
//               <circle cx="340" cy="50" r="2" fill="#7eb8ff" opacity="0.5"/>
//               <circle cx="380" cy="30" r="1.5" fill="#aed6ff" opacity="0.4"/>
//               <circle cx="420" cy="60" r="2" fill="#7eb8ff" opacity="0.45"/>
//               <circle cx="490" cy="40" r="1.5" fill="#aed6ff" opacity="0.4"/>
//               <circle cx="530" cy="55" r="2.5" fill="#7eb8ff" opacity="0.35"/>
//               <circle cx="560" cy="25" r="1.5" fill="#aed6ff" opacity="0.3"/>
//               <polygon points="300,148 315,90 330,148" fill="#2255cc" opacity="0.9"/>
//               <polygon points="315,90 330,148 315,148" fill="#1a3a8f" opacity="0.8"/>
//               <polygon points="300,148 315,90 315,148" fill="#4a7de8" opacity="0.85"/>
//               <polygon points="318,148 330,96 344,148" fill="#1a3a8f" opacity="0.9"/>
//               <polygon points="330,96 344,148 330,148" fill="#0d2a7a" opacity="0.8"/>
//               <polygon points="318,148 330,96 330,148" fill="#3060d0" opacity="0.85"/>
//               <polygon points="288,148 302,100 316,148" fill="#2255cc" opacity="0.85"/>
//               <polygon points="308,148 318,65 328,148" fill="#1a3a8f" opacity="0.95"/>
//               <polygon points="318,65 328,148 318,148" fill="#0d2270" opacity="0.9"/>
//               <polygon points="308,148 318,65 318,148" fill="#3a6ae0" opacity="0.9"/>
//               <polygon points="318,65 322,90 318,80" fill="white" opacity="0.25"/>
//               <polygon points="120,148 132,105 144,148" fill="#2255cc" opacity="0.8"/>
//               <polygon points="132,105 144,148 132,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="120,148 132,105 132,148" fill="#4a7de8" opacity="0.8"/>
//               <polygon points="108,148 120,112 132,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="128,148 136,88 146,148" fill="#1230a0" opacity="0.9"/>
//               <polygon points="136,88 146,148 136,148" fill="#0d2a7a" opacity="0.85"/>
//               <polygon points="128,148 136,88 136,148" fill="#2e5fe0" opacity="0.85"/>
//               <polygon points="136,88 140,108 136,98" fill="white" opacity="0.22"/>
//               <polygon points="450,148 462,108 474,148" fill="#2255cc" opacity="0.8"/>
//               <polygon points="462,108 474,148 462,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="450,148 462,108 462,148" fill="#4a7de8" opacity="0.8"/>
//               <polygon points="468,148 478,92 490,148" fill="#1a3a8f" opacity="0.9"/>
//               <polygon points="478,92 490,148 478,148" fill="#0d2270" opacity="0.85"/>
//               <polygon points="468,148 478,92 478,148" fill="#3a6ae0" opacity="0.88"/>
//               <polygon points="478,92 482,112 478,102" fill="white" opacity="0.2"/>
//               <polygon points="486,148 496,115 506,148" fill="#2255cc" opacity="0.75"/>
//               <polygon points="200,148 205,138 210,148" fill="#4a7de8" opacity="0.7"/>
//               <polygon points="370,148 374,140 378,148" fill="#3060d0" opacity="0.65"/>
//               <polygon points="540,148 545,139 550,148" fill="#4a7de8" opacity="0.6"/>
//               <polygon points="80,148 85,141 90,148" fill="#2255cc" opacity="0.6"/>
//               <ellipse cx="318" cy="149" rx="30" ry="5" fill="#7eb8ff" opacity="0.2"/>
//               <ellipse cx="136" cy="149" rx="22" ry="4" fill="#7eb8ff" opacity="0.18"/>
//               <ellipse cx="478" cy="149" rx="22" ry="4" fill="#7eb8ff" opacity="0.18"/>
//               <circle cx="355" cy="20" r="1.2" fill="white" opacity="0.6"/>
//               <circle cx="400" cy="10" r="1" fill="white" opacity="0.5"/>
//               <circle cx="445" cy="35" r="1.3" fill="white" opacity="0.55"/>
//               <circle cx="510" cy="15" r="1" fill="white" opacity="0.45"/>
//               <circle cx="555" cy="42" r="1.2" fill="white" opacity="0.5"/>
//             </svg>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";
// import { AuthContext } from "../AuthContext";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Forgot password states
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotStep, setForgotStep] = useState("verify"); // "verify" | "reset" | "success"
//   const [forgotError, setForgotError] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);

//   const [forgotForm, setForgotForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     employeeId: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const { login, verifyEmployeeForReset, resetPassword } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // ── Login submit ──────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const result = await login(email, password);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error || "Invalid email or password");
//       return;
//     }

//     const { role } = result.user;
//     switch (role) {
//       case "admin":     navigate("/dashboard");           break;
//       case "sales":     navigate("/sales/dashboard");     break;
//       case "manager":   navigate("/manager/dashboard");   break;
//       case "developer": navigate("/developer/dashboard"); break;
//       case "hr":        navigate("/hr/dashboard");        break;
//       default:          navigate("/employee/dashboard");
//     }
//   };

//   // ── Forgot form field change ──────────────────────────────────
//   const handleForgotChange = (e) => {
//     setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
//     setForgotError("");
//   };

//   // ── Step 1: Verify employee identity ─────────────────────────
//   const handleVerifyEmployee = async (e) => {
//     e.preventDefault();
//     setForgotError("");

//     const { name, phone, email, employeeId } = forgotForm;

//     if (!name.trim() || !phone.trim() || !email.trim() || !employeeId.trim()) {
//       setForgotError("All fields are required.");
//       return;
//     }

//     setForgotLoading(true);

//     try {
//       // verifyEmployeeForReset should check if employee exists in DB
//       // and match name, phone, gmail against the employeeId record.
//       // Expected to return: { success: true } or { success: false, error: "..." }
//       const result = await verifyEmployeeForReset({ name, phone, email, employeeId });
//       setForgotLoading(false);

//       if (!result.success) {
//         setForgotError(result.error || "Employee ID not found or details do not match.");
//         return;
//       }

//       setForgotStep("reset");
//     } catch {
//       setForgotLoading(false);
//       setForgotError("Something went wrong. Please try again.");
//     }
//   };

//   // ── Step 2: Reset password ────────────────────────────────────
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setForgotError("");

//     const { newPassword, confirmPassword, employeeId } = forgotForm;

//     if (!newPassword || !confirmPassword) {
//       setForgotError("Both password fields are required.");
//       return;
//     }
//     if (newPassword.length < 6) {
//       setForgotError("Password must be at least 6 characters.");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setForgotError("Passwords do not match.");
//       return;
//     }

//     setForgotLoading(true);

//     try {
//       // resetPassword should update the password for the verified employeeId
//       // Expected to return: { success: true } or { success: false, error: "..." }
//       const result = await resetPassword({ employeeId, newPassword });
//       setForgotLoading(false);

//       if (!result.success) {
//         setForgotError(result.error || "Failed to reset password. Try again.");
//         return;
//       }

//       setForgotStep("success");
//     } catch {
//       setForgotLoading(false);
//       setForgotError("Something went wrong. Please try again.");
//     }
//   };

//   // ── Back to login ─────────────────────────────────────────────
//   const handleBackToLogin = () => {
//     setShowForgot(false);
//     setForgotStep("verify");
//     setForgotError("");
//     setForgotForm({ name: "", phone: "", email: "", employeeId: "", newPassword: "", confirmPassword: "" });
//   };

//   return (
//     <div className="main-container">
//       <div className="login-wrapper">

//         {/* LEFT SIDE */}
//         <div className="left-section">

//           {/* Brand */}
//           <div className="brand">
//             <svg className="brand-logo" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <circle cx="18" cy="18" r="17" fill="#e8f0fe" stroke="#c7d7fc" strokeWidth="1.2"/>
//               <polygon points="18,6 28,14 24,28 12,28 8,14" fill="#1a3a8f"/>
//               <polygon points="18,6 28,14 18,12" fill="#4a7de8"/>
//               <polygon points="18,6 8,14 18,12" fill="#2255cc"/>
//               <polygon points="8,14 12,28 18,12" fill="#3060d0"/>
//               <polygon points="28,14 24,28 18,12" fill="#1a3a8f"/>
//               <polygon points="12,28 24,28 18,12" fill="#2a50b8"/>
//               <polygon points="18,8 22,13 18,11" fill="white" opacity="0.35"/>
//             </svg>
//             <span className="brand-name">BlueLith</span>
//           </div>

//           {/* ── LOGIN FORM ── */}
//           {!showForgot && (
//             <>
//               <p className="welcome">Welcome to</p>
//               <h2 className="title">BlueLith</h2>

//               {error && <div className="error">{error}</div>}

//               <form onSubmit={handleSubmit}>
//                 <label className="field-label">Username</label>
//                 <div className="input-group">
//                   <input
//                     type="email"
//                     placeholder="Email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                   {email && (
//                     <span className="check-icon">
//                       <svg viewBox="0 0 12 12" fill="none">
//                         <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </span>
//                   )}
//                 </div>

//                 <label className="field-label">Password</label>
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="options">
//                   <label><input type="radio" name="remember" /> Remember me</label>
//                   <span className="forgot" onClick={() => setShowForgot(true)}>Forgot Password?</span>
//                 </div>

//                 <button type="submit" disabled={loading}>
//                   {loading ? "Signing in..." : "LOGIN"}
//                 </button>

//                 <div className="signup-link">Contact admin to get access</div>
//               </form>
//             </>
//           )}

//           {/* ── FORGOT PASSWORD: STEP 1 — VERIFY IDENTITY ── */}
//           {showForgot && forgotStep === "verify" && (
//             <>
//               <p className="welcome">Reset your</p>
//               <h2 className="title forgot-title">Password</h2>
//               <p className="forgot-subtitle">Verify your identity to continue.</p>

//               {forgotError && <div className="error">{forgotError}</div>}

//               <form onSubmit={handleVerifyEmployee} className="forgot-form">
//                 <div className="forgot-grid">
//                   <div>
//                     <label className="field-label">Full Name</label>
//                     <div className="input-group">
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Your full name"
//                         value={forgotForm.name}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="field-label">Phone Number</label>
//                     <div className="input-group">
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="Your phone number"
//                         value={forgotForm.phone}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="field-label">Gmail</label>
//                     <div className="input-group">
//                       <input
//                         type="email"
//                         name="gmail"
//                         placeholder="Your Gmail address"
//                         value={forgotForm.gmail}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="field-label">Employee ID</label>
//                     <div className="input-group">
//                       <input
//                         type="text"
//                         name="employeeId"
//                         placeholder="Your employee ID"
//                         value={forgotForm.employeeId}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <button type="submit" disabled={forgotLoading}>
//                   {forgotLoading ? "Verifying..." : "VERIFY IDENTITY"}
//                 </button>

//                 <div className="back-link" onClick={handleBackToLogin}>
//                   ← Back to Login
//                 </div>
//               </form>
//             </>
//           )}

//           {/* ── FORGOT PASSWORD: STEP 2 — SET NEW PASSWORD ── */}
//           {showForgot && forgotStep === "reset" && (
//             <>
//               <p className="welcome">Almost there!</p>
//               <h2 className="title forgot-title">New Password</h2>
//               <p className="forgot-subtitle">Create a strong new password for your account.</p>

//               {forgotError && <div className="error">{forgotError}</div>}

//               <form onSubmit={handleResetPassword} className="forgot-form">
//                 <label className="field-label">Create Password</label>
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     name="newPassword"
//                     placeholder="New password (min 6 characters)"
//                     value={forgotForm.newPassword}
//                     onChange={handleForgotChange}
//                     required
//                   />
//                 </div>

//                 <label className="field-label">Confirm Password</label>
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     placeholder="Confirm new password"
//                     value={forgotForm.confirmPassword}
//                     onChange={handleForgotChange}
//                     required
//                   />
//                 </div>

//                 {forgotForm.newPassword && forgotForm.confirmPassword && (
//                   <div className={`match-indicator ${forgotForm.newPassword === forgotForm.confirmPassword ? "match" : "no-match"}`}>
//                     {forgotForm.newPassword === forgotForm.confirmPassword
//                       ? "✓ Passwords match"
//                       : "✗ Passwords do not match"}
//                   </div>
//                 )}

//                 <button type="submit" disabled={forgotLoading} style={{ marginTop: "16px" }}>
//                   {forgotLoading ? "Resetting..." : "RESET PASSWORD"}
//                 </button>

//                 <div className="back-link" onClick={handleBackToLogin}>
//                   ← Back to Login
//                 </div>
//               </form>
//             </>
//           )}

//           {/* ── FORGOT PASSWORD: SUCCESS ── */}
//           {showForgot && forgotStep === "success" && (
//             <div className="success-box">
//               <div className="success-icon">
//                 <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="24" cy="24" r="22" fill="#e8f0fe" stroke="#1a3a8f" strokeWidth="2"/>
//                   <path d="M14 24l8 8 12-14" stroke="#1a3a8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <h3 className="success-title">Password Reset!</h3>
//               <p className="success-msg">Your password has been updated successfully. You can now log in with your new password.</p>
//               <button onClick={handleBackToLogin}>BACK TO LOGIN</button>
//             </div>
//           )}

//           <div className="footer-links-left">
//             <span>FAQ</span><span className="sep">|</span>
//             <span>Features</span><span className="sep">|</span>
//             <span>Support</span>
//           </div>
//         </div>

//         {/* CURVED DIVIDER */}
//         <div className="curve">
//           <svg viewBox="0 0 120 600" preserveAspectRatio="none">
//             <path d="M0,0 C80,60 30,200 90,290 C130,350 50,490 100,600 L0,600 Z" />
//           </svg>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="right-section">
//           <div className="right-content">
//             <h2>About BlueLith</h2>
//             <p>
//               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
//             </p>

//             <div className="features-heading">Features</div>
//             <ul className="features-list">
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard industry.</span></li>
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
//             </ul>

//             <div className="footer-links">
//               <span>FAQ</span>
//               <span>Features</span>
//               <span>Support</span>
//             </div>
//           </div>

//           {/* Crystal Scene */}
//           <div className="crystal-scene">
//             <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
//               <ellipse cx="300" cy="200" rx="340" ry="75" fill="#0d2a7a" opacity="0.5"/>
//               <rect x="0" y="148" width="600" height="32" fill="#0d2a7a" opacity="0.45"/>
//               <ellipse cx="150" cy="175" rx="180" ry="55" fill="#1230a0" opacity="0.4"/>
//               <ellipse cx="460" cy="180" rx="200" ry="50" fill="#1230a0" opacity="0.35"/>
//               <rect x="0" y="148" width="600" height="2" fill="#7eb8ff" opacity="0.3"/>
//               <circle cx="340" cy="50" r="2" fill="#7eb8ff" opacity="0.5"/>
//               <circle cx="380" cy="30" r="1.5" fill="#aed6ff" opacity="0.4"/>
//               <circle cx="420" cy="60" r="2" fill="#7eb8ff" opacity="0.45"/>
//               <circle cx="490" cy="40" r="1.5" fill="#aed6ff" opacity="0.4"/>
//               <circle cx="530" cy="55" r="2.5" fill="#7eb8ff" opacity="0.35"/>
//               <circle cx="560" cy="25" r="1.5" fill="#aed6ff" opacity="0.3"/>
//               <polygon points="300,148 315,90 330,148" fill="#2255cc" opacity="0.9"/>
//               <polygon points="315,90 330,148 315,148" fill="#1a3a8f" opacity="0.8"/>
//               <polygon points="300,148 315,90 315,148" fill="#4a7de8" opacity="0.85"/>
//               <polygon points="318,148 330,96 344,148" fill="#1a3a8f" opacity="0.9"/>
//               <polygon points="330,96 344,148 330,148" fill="#0d2a7a" opacity="0.8"/>
//               <polygon points="318,148 330,96 330,148" fill="#3060d0" opacity="0.85"/>
//               <polygon points="288,148 302,100 316,148" fill="#2255cc" opacity="0.85"/>
//               <polygon points="308,148 318,65 328,148" fill="#1a3a8f" opacity="0.95"/>
//               <polygon points="318,65 328,148 318,148" fill="#0d2270" opacity="0.9"/>
//               <polygon points="308,148 318,65 318,148" fill="#3a6ae0" opacity="0.9"/>
//               <polygon points="318,65 322,90 318,80" fill="white" opacity="0.25"/>
//               <polygon points="120,148 132,105 144,148" fill="#2255cc" opacity="0.8"/>
//               <polygon points="132,105 144,148 132,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="120,148 132,105 132,148" fill="#4a7de8" opacity="0.8"/>
//               <polygon points="108,148 120,112 132,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="128,148 136,88 146,148" fill="#1230a0" opacity="0.9"/>
//               <polygon points="136,88 146,148 136,148" fill="#0d2a7a" opacity="0.85"/>
//               <polygon points="128,148 136,88 136,148" fill="#2e5fe0" opacity="0.85"/>
//               <polygon points="136,88 140,108 136,98" fill="white" opacity="0.22"/>
//               <polygon points="450,148 462,108 474,148" fill="#2255cc" opacity="0.8"/>
//               <polygon points="462,108 474,148 462,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="450,148 462,108 462,148" fill="#4a7de8" opacity="0.8"/>
//               <polygon points="468,148 478,92 490,148" fill="#1a3a8f" opacity="0.9"/>
//               <polygon points="478,92 490,148 478,148" fill="#0d2270" opacity="0.85"/>
//               <polygon points="468,148 478,92 478,148" fill="#3a6ae0" opacity="0.88"/>
//               <polygon points="478,92 482,112 478,102" fill="white" opacity="0.2"/>
//               <polygon points="486,148 496,115 506,148" fill="#2255cc" opacity="0.75"/>
//               <polygon points="200,148 205,138 210,148" fill="#4a7de8" opacity="0.7"/>
//               <polygon points="370,148 374,140 378,148" fill="#3060d0" opacity="0.65"/>
//               <polygon points="540,148 545,139 550,148" fill="#4a7de8" opacity="0.6"/>
//               <polygon points="80,148 85,141 90,148" fill="#2255cc" opacity="0.6"/>
//               <ellipse cx="318" cy="149" rx="30" ry="5" fill="#7eb8ff" opacity="0.2"/>
//               <ellipse cx="136" cy="149" rx="22" ry="4" fill="#7eb8ff" opacity="0.18"/>
//               <ellipse cx="478" cy="149" rx="22" ry="4" fill="#7eb8ff" opacity="0.18"/>
//               <circle cx="355" cy="20" r="1.2" fill="white" opacity="0.6"/>
//               <circle cx="400" cy="10" r="1" fill="white" opacity="0.5"/>
//               <circle cx="445" cy="35" r="1.3" fill="white" opacity="0.55"/>
//               <circle cx="510" cy="15" r="1" fill="white" opacity="0.45"/>
//               <circle cx="555" cy="42" r="1.2" fill="white" opacity="0.5"/>
//             </svg>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";
// import { AuthContext } from "../AuthContext";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Forgot password states
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotStep, setForgotStep] = useState("verify"); // "verify" | "reset" | "success"
//   const [forgotError, setForgotError] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);

//   const [forgotForm, setForgotForm] = useState({
//     name: "",
//     phone: "",
//     email: "",        // Changed from gmail to email to match state
//     employeeId: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const { login, verifyEmployeeForReset, resetPassword } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // ── Login submit ──────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const result = await login(email, password);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error || "Invalid email or password");
//       return;
//     }

//     const { role } = result.user;
//     switch (role) {
//       case "admin":     navigate("/dashboard");           break;
//       case "sales":     navigate("/sales/dashboard");     break;
//       case "manager":   navigate("/manager/dashboard");   break;
//       case "developer": navigate("/developer/dashboard"); break;
//       case "hr":        navigate("/hr/dashboard");        break;
//       default:          navigate("/employee/dashboard");
//     }
//   };

//   // ── Forgot form field change ──────────────────────────────────
//   const handleForgotChange = (e) => {
//     setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
//     setForgotError("");
//   };

//   // ── Step 1: Verify employee identity ─────────────────────────
//   const handleVerifyEmployee = async (e) => {
//     e.preventDefault();
//     setForgotError("");

//     const { name, phone, email, employeeId } = forgotForm;

//     if (!name.trim() || !phone.trim() || !email.trim() || !employeeId.trim()) {
//       setForgotError("All fields are required.");
//       return;
//     }

//     setForgotLoading(true);

//     try {
//       // verifyEmployeeForReset should check if employee exists in DB
//       // and match name, phone, gmail against the employeeId record.
//       // Expected to return: { success: true } or { success: false, error: "..." }
//       const result = await verifyEmployeeForReset({ name, phone, email, employeeId });
//       setForgotLoading(false);

//       if (!result.success) {
//         setForgotError(result.error || "Employee ID not found or details do not match.");
//         return;
//       }

//       setForgotStep("reset");
//     } catch {
//       setForgotLoading(false);
//       setForgotError("Something went wrong. Please try again.");
//     }
//   };

//   // ── Step 2: Reset password ────────────────────────────────────
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setForgotError("");

//     const { newPassword, confirmPassword, employeeId } = forgotForm;

//     if (!newPassword || !confirmPassword) {
//       setForgotError("Both password fields are required.");
//       return;
//     }
//     if (newPassword.length < 6) {
//       setForgotError("Password must be at least 6 characters.");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setForgotError("Passwords do not match.");
//       return;
//     }

//     setForgotLoading(true);

//     try {
//       // resetPassword should update the password for the verified employeeId
//       // Expected to return: { success: true } or { success: false, error: "..." }
//       const result = await resetPassword({ employeeId, newPassword });
//       setForgotLoading(false);

//       if (!result.success) {
//         setForgotError(result.error || "Failed to reset password. Try again.");
//         return;
//       }

//       setForgotStep("success");
//     } catch {
//       setForgotLoading(false);
//       setForgotError("Something went wrong. Please try again.");
//     }
//   };

//   // ── Back to login ─────────────────────────────────────────────
//   const handleBackToLogin = () => {
//     setShowForgot(false);
//     setForgotStep("verify");
//     setForgotError("");
//     setForgotForm({ name: "", phone: "", email: "", employeeId: "", newPassword: "", confirmPassword: "" });
//   };

//   return (
//     <div className="main-container">
//       <div className="login-wrapper">

//         {/* LEFT SIDE */}
//         <div className="left-section">

//           {/* Brand */}
//           <div className="brand">
//             <svg className="brand-logo" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <circle cx="18" cy="18" r="17" fill="#e8f0fe" stroke="#c7d7fc" strokeWidth="1.2"/>
//               <polygon points="18,6 28,14 24,28 12,28 8,14" fill="#1a3a8f"/>
//               <polygon points="18,6 28,14 18,12" fill="#4a7de8"/>
//               <polygon points="18,6 8,14 18,12" fill="#2255cc"/>
//               <polygon points="8,14 12,28 18,12" fill="#3060d0"/>
//               <polygon points="28,14 24,28 18,12" fill="#1a3a8f"/>
//               <polygon points="12,28 24,28 18,12" fill="#2a50b8"/>
//               <polygon points="18,8 22,13 18,11" fill="white" opacity="0.35"/>
//             </svg>
//             <span className="brand-name">BlueLith</span>
//           </div>

//           {/* ── LOGIN FORM ── */}
//           {!showForgot && (
//             <>
//               <p className="welcome">Welcome to</p>
//               <h2 className="title">BlueLith</h2>

//               {error && <div className="error">{error}</div>}

//               <form onSubmit={handleSubmit}>
//                 <label className="field-label">Username</label>
//                 <div className="input-group">
//                   <input
//                     type="email"
//                     placeholder="Email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                   {email && (
//                     <span className="check-icon">
//                       <svg viewBox="0 0 12 12" fill="none">
//                         <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </span>
//                   )}
//                 </div>

//                 <label className="field-label">Password</label>
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="options">
//                   <label><input type="radio" name="remember" /> Remember me</label>
//                   <span className="forgot" onClick={() => setShowForgot(true)}>Forgot Password?</span>
//                 </div>

//                 <button type="submit" disabled={loading}>
//                   {loading ? "Signing in..." : "LOGIN"}
//                 </button>

//                 <div className="signup-link">Contact admin to get access</div>
//               </form>
//             </>
//           )}

//           {/* ── FORGOT PASSWORD: STEP 1 — VERIFY IDENTITY ── */}
//           {showForgot && forgotStep === "verify" && (
//             <>
//               <p className="welcome">Reset your</p>
//               <h2 className="title forgot-title">Password</h2>
//               <p className="forgot-subtitle">Verify your identity to continue.</p>

//               {forgotError && <div className="error">{forgotError}</div>}

//               <form onSubmit={handleVerifyEmployee} className="forgot-form">
//                 <div className="forgot-grid">
//                   <div>
//                     <label className="field-label">Full Name</label>
//                     <div className="input-group">
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Your full name"
//                         value={forgotForm.name}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="field-label">Phone Number</label>
//                     <div className="input-group">
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="Your phone number"
//                         value={forgotForm.phone}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="field-label">Gmail</label>
//                     <div className="input-group">
//                       <input
//                         type="email"
//                         name="email"  // Changed from "gmail" to "email"
//                         placeholder="Your Gmail address"
//                         value={forgotForm.email}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="field-label">Employee ID</label>
//                     <div className="input-group">
//                       <input
//                         type="text"
//                         name="employeeId"
//                         placeholder="Your employee ID"
//                         value={forgotForm.employeeId}
//                         onChange={handleForgotChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <button type="submit" disabled={forgotLoading}>
//                   {forgotLoading ? "Verifying..." : "VERIFY IDENTITY"}
//                 </button>

//                 <div className="back-link" onClick={handleBackToLogin}>
//                   ← Back to Login
//                 </div>
//               </form>
//             </>
//           )}

//           {/* ── FORGOT PASSWORD: STEP 2 — SET NEW PASSWORD ── */}
//           {showForgot && forgotStep === "reset" && (
//             <>
//               <p className="welcome">Almost there!</p>
//               <h2 className="title forgot-title">New Password</h2>
//               <p className="forgot-subtitle">Create a strong new password for your account.</p>

//               {forgotError && <div className="error">{forgotError}</div>}

//               <form onSubmit={handleResetPassword} className="forgot-form">
//                 <label className="field-label">Create Password</label>
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     name="newPassword"
//                     placeholder="New password (min 6 characters)"
//                     value={forgotForm.newPassword}
//                     onChange={handleForgotChange}
//                     required
//                   />
//                 </div>

//                 <label className="field-label">Confirm Password</label>
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     placeholder="Confirm new password"
//                     value={forgotForm.confirmPassword}
//                     onChange={handleForgotChange}
//                     required
//                   />
//                 </div>

//                 {forgotForm.newPassword && forgotForm.confirmPassword && (
//                   <div className={`match-indicator ${forgotForm.newPassword === forgotForm.confirmPassword ? "match" : "no-match"}`}>
//                     {forgotForm.newPassword === forgotForm.confirmPassword
//                       ? "✓ Passwords match"
//                       : "✗ Passwords do not match"}
//                   </div>
//                 )}

//                 <button type="submit" disabled={forgotLoading} style={{ marginTop: "16px" }}>
//                   {forgotLoading ? "Resetting..." : "RESET PASSWORD"}
//                 </button>

//                 <div className="back-link" onClick={handleBackToLogin}>
//                   ← Back to Login
//                 </div>
//               </form>
//             </>
//           )}

//           {/* ── FORGOT PASSWORD: SUCCESS ── */}
//           {showForgot && forgotStep === "success" && (
//             <div className="success-box">
//               <div className="success-icon">
//                 <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="24" cy="24" r="22" fill="#e8f0fe" stroke="#1a3a8f" strokeWidth="2"/>
//                   <path d="M14 24l8 8 12-14" stroke="#1a3a8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <h3 className="success-title">Password Reset!</h3>
//               <p className="success-msg">Your password has been updated successfully. You can now log in with your new password.</p>
//               <button onClick={handleBackToLogin}>BACK TO LOGIN</button>
//             </div>
//           )}

//           <div className="footer-links-left">
//             <span>FAQ</span><span className="sep">|</span>
//             <span>Features</span><span className="sep">|</span>
//             <span>Support</span>
//           </div>
//         </div>

//         {/* CURVED DIVIDER */}
//         <div className="curve">
//           <svg viewBox="0 0 120 600" preserveAspectRatio="none">
//             <path d="M0,0 C80,60 30,200 90,290 C130,350 50,490 100,600 L0,600 Z" />
//           </svg>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="right-section">
//           <div className="right-content">
//             <h2>About BlueLith</h2>
//             <p>
//               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
//             </p>

//             <div className="features-heading">Features</div>
//             <ul className="features-list">
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard industry.</span></li>
//               <li><span className="dot"></span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
//             </ul>

//             <div className="footer-links">
//               <span>FAQ</span>
//               <span>Features</span>
//               <span>Support</span>
//             </div>
//           </div>

//           {/* Crystal Scene */}
//           <div className="crystal-scene">
//             <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
//               <ellipse cx="300" cy="200" rx="340" ry="75" fill="#0d2a7a" opacity="0.5"/>
//               <rect x="0" y="148" width="600" height="32" fill="#0d2a7a" opacity="0.45"/>
//               <ellipse cx="150" cy="175" rx="180" ry="55" fill="#1230a0" opacity="0.4"/>
//               <ellipse cx="460" cy="180" rx="200" ry="50" fill="#1230a0" opacity="0.35"/>
//               <rect x="0" y="148" width="600" height="2" fill="#7eb8ff" opacity="0.3"/>
//               <circle cx="340" cy="50" r="2" fill="#7eb8ff" opacity="0.5"/>
//               <circle cx="380" cy="30" r="1.5" fill="#aed6ff" opacity="0.4"/>
//               <circle cx="420" cy="60" r="2" fill="#7eb8ff" opacity="0.45"/>
//               <circle cx="490" cy="40" r="1.5" fill="#aed6ff" opacity="0.4"/>
//               <circle cx="530" cy="55" r="2.5" fill="#7eb8ff" opacity="0.35"/>
//               <circle cx="560" cy="25" r="1.5" fill="#aed6ff" opacity="0.3"/>
//               <polygon points="300,148 315,90 330,148" fill="#2255cc" opacity="0.9"/>
//               <polygon points="315,90 330,148 315,148" fill="#1a3a8f" opacity="0.8"/>
//               <polygon points="300,148 315,90 315,148" fill="#4a7de8" opacity="0.85"/>
//               <polygon points="318,148 330,96 344,148" fill="#1a3a8f" opacity="0.9"/>
//               <polygon points="330,96 344,148 330,148" fill="#0d2a7a" opacity="0.8"/>
//               <polygon points="318,148 330,96 330,148" fill="#3060d0" opacity="0.85"/>
//               <polygon points="288,148 302,100 316,148" fill="#2255cc" opacity="0.85"/>
//               <polygon points="308,148 318,65 328,148" fill="#1a3a8f" opacity="0.95"/>
//               <polygon points="318,65 328,148 318,148" fill="#0d2270" opacity="0.9"/>
//               <polygon points="308,148 318,65 318,148" fill="#3a6ae0" opacity="0.9"/>
//               <polygon points="318,65 322,90 318,80" fill="white" opacity="0.25"/>
//               <polygon points="120,148 132,105 144,148" fill="#2255cc" opacity="0.8"/>
//               <polygon points="132,105 144,148 132,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="120,148 132,105 132,148" fill="#4a7de8" opacity="0.8"/>
//               <polygon points="108,148 120,112 132,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="128,148 136,88 146,148" fill="#1230a0" opacity="0.9"/>
//               <polygon points="136,88 146,148 136,148" fill="#0d2a7a" opacity="0.85"/>
//               <polygon points="128,148 136,88 136,148" fill="#2e5fe0" opacity="0.85"/>
//               <polygon points="136,88 140,108 136,98" fill="white" opacity="0.22"/>
//               <polygon points="450,148 462,108 474,148" fill="#2255cc" opacity="0.8"/>
//               <polygon points="462,108 474,148 462,148" fill="#1a3a8f" opacity="0.75"/>
//               <polygon points="450,148 462,108 462,148" fill="#4a7de8" opacity="0.8"/>
//               <polygon points="468,148 478,92 490,148" fill="#1a3a8f" opacity="0.9"/>
//               <polygon points="478,92 490,148 478,148" fill="#0d2270" opacity="0.85"/>
//               <polygon points="468,148 478,92 478,148" fill="#3a6ae0" opacity="0.88"/>
//               <polygon points="478,92 482,112 478,102" fill="white" opacity="0.2"/>
//               <polygon points="486,148 496,115 506,148" fill="#2255cc" opacity="0.75"/>
//               <polygon points="200,148 205,138 210,148" fill="#4a7de8" opacity="0.7"/>
//               <polygon points="370,148 374,140 378,148" fill="#3060d0" opacity="0.65"/>
//               <polygon points="540,148 545,139 550,148" fill="#4a7de8" opacity="0.6"/>
//               <polygon points="80,148 85,141 90,148" fill="#2255cc" opacity="0.6"/>
//               <ellipse cx="318" cy="149" rx="30" ry="5" fill="#7eb8ff" opacity="0.2"/>
//               <ellipse cx="136" cy="149" rx="22" ry="4" fill="#7eb8ff" opacity="0.18"/>
//               <ellipse cx="478" cy="149" rx="22" ry="4" fill="#7eb8ff" opacity="0.18"/>
//               <circle cx="355" cy="20" r="1.2" fill="white" opacity="0.6"/>
//               <circle cx="400" cy="10" r="1" fill="white" opacity="0.5"/>
//               <circle cx="445" cy="35" r="1.3" fill="white" opacity="0.55"/>
//               <circle cx="510" cy="15" r="1" fill="white" opacity="0.45"/>
//               <circle cx="555" cy="42" r="1.2" fill="white" opacity="0.5"/>
//             </svg>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState("verify"); // "verify" | "otp" | "reset" | "success"
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [employeeData, setEmployeeData] = useState(null); // Store verified employee data

  const [forgotForm, setForgotForm] = useState({
    name: "",
    phone: "",
    email: "",
    employeeId: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { login, verifyEmployeeForReset, verifyOTP, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  // ── Login submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid email or password");
      return;
    }

    const { role } = result.user;
    switch (role) {
      case "admin":     navigate("/dashboard");           break;
      case "sales":     navigate("/sales/dashboard");     break;
      case "manager":   navigate("/manager/dashboard");   break;
      case "developer": navigate("/developer/dashboard"); break;
      case "hr":        navigate("/hr/dashboard");        break;
      default:          navigate("/employee/dashboard");
    }
  };

  // ── Forgot form field change ──────────────────────────────────
  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
    setForgotError("");
  };

  // ── Handle OTP input change ───────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // ── Step 1: Verify employee identity (This sends OTP) ─────────
  const handleVerifyEmployee = async (e) => {
    e.preventDefault();
    setForgotError("");

    const { name, phone, email, employeeId } = forgotForm;

    if (!name.trim() || !phone.trim() || !email.trim() || !employeeId.trim()) {
      setForgotError("All fields are required.");
      return;
    }

    setForgotLoading(true);

    try {
      // This endpoint verifies employee AND sends OTP in one call
      const result = await verifyEmployeeForReset({ name, phone, email, employeeId });
      setForgotLoading(false);

      if (!result.success) {
        setForgotError(result.error || "Employee ID not found or details do not match.");
        return;
      }

      // Store employee data for later use
      setEmployeeData({ employeeId, email: forgotForm.email });
      
      // Move to OTP verification step
      setForgotStep("otp");
    } catch (error) {
      console.error("Verification error:", error);
      setForgotLoading(false);
      setForgotError("Something went wrong. Please try again.");
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setForgotError("");

    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setForgotError("Please enter the complete 6-digit OTP.");
      return;
    }

    setForgotLoading(true);

    try {
      const result = await verifyOTP({ 
        email: employeeData.email, 
        employeeId: employeeData.employeeId, 
        otp: otpValue 
      });
      
      setForgotLoading(false);

      if (!result.success) {
        setForgotError(result.error || "Invalid OTP. Please try again.");
        return;
      }

      setForgotStep("reset");
    } catch (error) {
      console.error("OTP verification error:", error);
      setForgotLoading(false);
      setForgotError("Something went wrong. Please try again.");
    }
  };

  // ── Resend OTP (Call verify endpoint again) ───────────────────
  const handleResendOTP = async () => {
    setForgotError("");
    setForgotLoading(true);

    try {
      // Resend OTP by calling verify endpoint again with stored data
      const result = await verifyEmployeeForReset({ 
        name: forgotForm.name,
        phone: forgotForm.phone,
        email: employeeData.email, 
        employeeId: employeeData.employeeId 
      });
      
      setForgotLoading(false);

      if (!result.success) {
        setForgotError(result.error || "Failed to resend OTP. Please try again.");
        return;
      }

      setForgotError("OTP resent successfully! Check your email/console.");
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      
      // Clear success message after 3 seconds
      setTimeout(() => setForgotError(""), 3000);
    } catch (error) {
      console.error("Resend OTP error:", error);
      setForgotLoading(false);
      setForgotError("Something went wrong. Please try again.");
    }
  };

  // ── Step 3: Reset password ────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");

    const { newPassword, confirmPassword } = forgotForm;

    if (!newPassword || !confirmPassword) {
      setForgotError("Both password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);

    try {
      const result = await resetPassword({ 
        employeeId: employeeData.employeeId, 
        newPassword: newPassword,
        otp: otp.join(""),
        email: employeeData.email
      });
      
      setForgotLoading(false);

      if (!result.success) {
        setForgotError(result.error || "Failed to reset password. Try again.");
        return;
      }

      setForgotStep("success");
    } catch (error) {
      console.error("Reset password error:", error);
      setForgotLoading(false);
      setForgotError("Something went wrong. Please try again.");
    }
  };

  // ── Back to login ─────────────────────────────────────────────
  const handleBackToLogin = () => {
    setShowForgot(false);
    setForgotStep("verify");
    setForgotError("");
    setOtp(["", "", "", "", "", ""]);
    setEmployeeData(null);
    setForgotForm({ name: "", phone: "", email: "", employeeId: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="main-container">
      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="left-section">

          {/* Brand */}
          <div className="brand">
            <svg className="brand-logo" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" fill="#e8f0fe" stroke="#c7d7fc" strokeWidth="1.2"/>
              <polygon points="18,6 28,14 24,28 12,28 8,14" fill="#1a3a8f"/>
              <polygon points="18,6 28,14 18,12" fill="#4a7de8"/>
              <polygon points="18,6 8,14 18,12" fill="#2255cc"/>
              <polygon points="8,14 12,28 18,12" fill="#3060d0"/>
              <polygon points="28,14 24,28 18,12" fill="#1a3a8f"/>
              <polygon points="12,28 24,28 18,12" fill="#2a50b8"/>
              <polygon points="18,8 22,13 18,11" fill="white" opacity="0.35"/>
            </svg>
            <span className="brand-name">BlueLith Technology</span>
          </div>

          {/* ── LOGIN FORM ── */}
          {!showForgot && (
            <>
              <p className="welcome">Welcome to the</p>
              <h2 className="title">BlueLith Team</h2>

              {error && <div className="error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <label className="field-label">Username</label>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {email && (
                    <span className="check-icon">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>

                <label className="field-label">Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="options">
                  <label><input type="radio" name="remember" /> Remember me</label>
                  <span className="forgot" onClick={() => setShowForgot(true)}>Forgot Password?</span>
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "LOGIN"}
                </button>

                <div className="signup-link">Contact admin to get access</div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD: STEP 1 — VERIFY IDENTITY ── */}
          {showForgot && forgotStep === "verify" && (
            <>
              <p className="welcome">Reset your</p>
              <h2 className="title forgot-title">Password</h2>
              <p className="forgot-subtitle">Verify your identity to continue.</p>

              {forgotError && <div className="error">{forgotError}</div>}

              <form onSubmit={handleVerifyEmployee} className="forgot-form">
                <div className="forgot-grid">
                  <div>
                    <label className="field-label">Full Name</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={forgotForm.name}
                        onChange={handleForgotChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Phone Number</label>
                    <div className="input-group">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your phone number"
                        value={forgotForm.phone}
                        onChange={handleForgotChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Gmail</label>
                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Gmail address"
                        value={forgotForm.email}
                        onChange={handleForgotChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Employee ID</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="employeeId"
                        placeholder="Your employee ID"
                        value={forgotForm.employeeId}
                        onChange={handleForgotChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Verifying..." : "VERIFY IDENTITY"}
                </button>

                <div className="back-link" onClick={handleBackToLogin}>
                  ← Back to Login
                </div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD: STEP 2 — OTP VERIFICATION ── */}
          {showForgot && forgotStep === "otp" && (
            <>
              <p className="welcome">Verification</p>
              <h2 className="title forgot-title">Enter OTP</h2>
              <p className="forgot-subtitle">
                We've sent a 6-digit verification code to<br />
                <strong>{employeeData?.email}</strong>
              </p>

              {forgotError && <div className="error">{forgotError}</div>}

              <form onSubmit={handleVerifyOTP} className="forgot-form">
                <div className="otp-container">
                  <label className="field-label">OTP Code</label>
                  <div className="otp-inputs">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="otp-input"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Verifying..." : "VERIFY OTP"}
                </button>

                <div className="resend-otp" onClick={!forgotLoading ? handleResendOTP : undefined}>
                  Didn't receive the code? <span className="resend-link">Resend OTP</span>
                </div>

                <div className="back-link" onClick={handleBackToLogin}>
                  ← Back to Login
                </div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD: STEP 3 — SET NEW PASSWORD ── */}
          {showForgot && forgotStep === "reset" && (
            <>
              <p className="welcome">Almost there!</p>
              <h2 className="title forgot-title">New Password</h2>
              <p className="forgot-subtitle">Create a strong new password for your account.</p>

              {forgotError && <div className="error">{forgotError}</div>}

              <form onSubmit={handleResetPassword} className="forgot-form">
                <label className="field-label">Create Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password (min 6 characters)"
                    value={forgotForm.newPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <label className="field-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={forgotForm.confirmPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                {forgotForm.newPassword && forgotForm.confirmPassword && (
                  <div className={`match-indicator ${forgotForm.newPassword === forgotForm.confirmPassword ? "match" : "no-match"}`}>
                    {forgotForm.newPassword === forgotForm.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </div>
                )}

                <button type="submit" disabled={forgotLoading} style={{ marginTop: "16px" }}>
                  {forgotLoading ? "Resetting..." : "RESET PASSWORD"}
                </button>

                <div className="back-link" onClick={handleBackToLogin}>
                  ← Back to Login
                </div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD: SUCCESS ── */}
          {showForgot && forgotStep === "success" && (
            <div className="success-box">
              <div className="success-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="22" fill="#e8f0fe" stroke="#1a3a8f" strokeWidth="2"/>
                  <path d="M14 24l8 8 12-14" stroke="#1a3a8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="success-title">Password Reset!</h3>
              <p className="success-msg">Your password has been updated successfully. You can now log in with your new password.</p>
              <button onClick={handleBackToLogin}>BACK TO LOGIN</button>
            </div>
          )}

          <div className="footer-links-left">
            <span>FAQ</span><span className="sep">|</span>
            <span>Features</span><span className="sep">|</span>
            <span>Support</span>
          </div>
        </div>

        {/* CURVED DIVIDER */}
        <div className="curve">
          <svg viewBox="0 0 120 600" preserveAspectRatio="none">
            <path d="M0,0 C80,60 30,200 90,290 C130,350 50,490 100,600 L0,600 Z" />
          </svg>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <div className="right-content">
           <h2>About BlueLith</h2>
<p>
  BlueLith Technology is a modern software development company focused on delivering innovative, scalable, and reliable digital solutions. We specialize in building high-quality web and mobile applications, helping businesses streamline operations, enhance user experiences, and accelerate growth. With a strong focus on cutting-edge technologies and customer-centric design, BlueLith empowers organizations to stay ahead in the digital era.
</p>

<div className="features-heading">Features</div>
<ul className="features-list">
  <li>
    <span className="dot"></span>
    <span>Custom software development tailored to business needs.</span>
  </li>
  <li>
    <span className="dot"></span>
    <span>Expertise in modern technologies like React, Node.js, and cloud-based solutions.</span>
  </li>
  <li>
    <span className="dot"></span>
    <span>Secure, scalable, and high-performance applications with user-friendly design.</span>
  </li>
</ul>

            <div className="footer-links">
              <span>FAQ</span>
              <span>Features</span>
              <span>Support</span>
            </div>
          </div>

          {/* Crystal Scene */}
          <div className="crystal-scene">
            <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
              {/* SVG content */}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;