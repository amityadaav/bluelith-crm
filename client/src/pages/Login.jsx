
import { useState, useContext } from "react";
import { useNavigate }          from "react-router-dom";
import { AuthContext }          from "../context/AuthContext";
import "./Login.css";

const ROLE_PATHS = {
  admin: "/dashboard", sales: "/sales/dashboard", manager: "/manager/dashboard",
  developer: "/developer/dashboard", hr: "/hr/dashboard",
};

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OTPInput({ otp, setOtp }) {
  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx]  = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };
  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };
  return (
    <div className="otp-inputs">
      {otp.map((d, i) => (
        <input
          key={i} id={`otp-${i}`} type="text" inputMode="numeric"
          maxLength={1} value={d} autoFocus={i === 0}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="otp-input"
        />
      ))}
    </div>
  );
}

// ─── BlueLith Logo SVG ────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="#e8f0fe" stroke="#c7d7fc" strokeWidth="1.2"/>
      <polygon points="18,6 28,14 24,28 12,28 8,14" fill="#1a3a8f"/>
      <polygon points="18,6 28,14 18,12" fill="#4a7de8"/>
      <polygon points="18,6 8,14 18,12" fill="#2255cc"/>
      <polygon points="8,14 12,28 18,12" fill="#3060d0"/>
      <polygon points="28,14 24,28 18,12" fill="#1a3a8f"/>
      <polygon points="12,28 24,28 18,12" fill="#2a50b8"/>
      <polygon points="18,8 22,13 18,11" fill="white" opacity="0.35"/>
    </svg>
  );
}

export default function Login() {
  const { login, verifyEmployeeForReset, verifyOTP, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login state
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // Forgot password state
  const [showForgot,    setShowForgot]    = useState(false);
  const [forgotStep,    setForgotStep]    = useState("verify"); // verify | otp | reset | success
  const [forgotError,   setForgotError]   = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otp,           setOtp]           = useState(["","","","","",""]);
  const [employeeData,  setEmployeeData]  = useState(null);
  const [forgotForm,    setForgotForm]    = useState({ name:"", phone:"", email:"", employeeId:"", newPassword:"", confirmPassword:"" });

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) { setError(result.error || "Invalid email or password"); return; }
    navigate(ROLE_PATHS[result.user.role] || "/employee/dashboard", { replace: true });
  };

  // ── Forgot helpers ─────────────────────────────────────────────────────────
  const onForgotChange = (e) => {
    setForgotForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setForgotError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const { name, phone, email: em, employeeId } = forgotForm;
    if (!name || !phone || !em || !employeeId) { setForgotError("All fields are required."); return; }
    setForgotLoading(true);
    const res = await verifyEmployeeForReset({ name, phone, email: em, employeeId });
    setForgotLoading(false);
    if (!res.success) { setForgotError(res.error || "Details do not match."); return; }
    setEmployeeData({ employeeId, email: em });
    // Dev mode: show OTP in console / response
    if (res._devOtp) console.log(`🔐 Dev OTP: ${res._devOtp}`);
    setForgotStep("otp");
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpVal = otp.join("");
    if (otpVal.length < 6) { setForgotError("Enter the complete 6-digit OTP."); return; }
    setForgotLoading(true);
    const res = await verifyOTP({ email: employeeData.email, employeeId: employeeData.employeeId, otp: otpVal });
    setForgotLoading(false);
    if (!res.success) { setForgotError(res.error || "Invalid OTP."); return; }
    setForgotStep("reset");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = forgotForm;
    if (newPassword.length < 6) { setForgotError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setForgotError("Passwords do not match."); return; }
    setForgotLoading(true);
    const res = await resetPassword({ employeeId: employeeData.employeeId, email: employeeData.email, otp: otp.join(""), newPassword });
    setForgotLoading(false);
    if (!res.success) { setForgotError(res.error || "Reset failed. Try again."); return; }
    setForgotStep("success");
  };

  const handleResendOTP = async () => {
    setForgotLoading(true);
    const { name, phone } = forgotForm;
    const res = await verifyEmployeeForReset({ name, phone, email: employeeData.email, employeeId: employeeData.employeeId });
    setForgotLoading(false);
    if (!res.success) { setForgotError(res.error); return; }
    setOtp(["","","","","",""]);
    setForgotError("OTP resent!");
    setTimeout(() => setForgotError(""), 3000);
  };

  const backToLogin = () => {
    setShowForgot(false); setForgotStep("verify"); setForgotError("");
    setOtp(["","","","","",""]); setEmployeeData(null);
    setForgotForm({ name:"", phone:"", email:"", employeeId:"", newPassword:"", confirmPassword:"" });
  };

  return (
    <div className="main-container">
      <div className="login-wrapper">
        {/* LEFT */}
        <div className="left-section">
          <div className="brand">
            <Logo />
            <span className="brand-name">BlueLith Technology</span>
          </div>

          {/* ── LOGIN ── */}
          {!showForgot && (
            <>
              <p className="welcome">Welcome to the</p>
              <h2 className="title">BlueLith Team</h2>
              {error && <div className="error">{error}</div>}
              <form onSubmit={handleLogin}>
                <label className="field-label">Email</label>
                <div className="input-group">
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  {email && <span className="check-icon"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                </div>
                <label className="field-label">Password</label>
                <div className="input-group">
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="options">
                  <label><input type="checkbox" /> Remember me</label>
                  <span className="forgot" onClick={() => setShowForgot(true)}>Forgot Password?</span>
                </div>
                <button type="submit" disabled={loading}>{loading ? "Signing in…" : "LOGIN"}</button>
                <p className="signup-link">Contact admin to get access</p>
              </form>
            </>
          )}

          {/* ── VERIFY IDENTITY ── */}
          {showForgot && forgotStep === "verify" && (
            <>
              <p className="welcome">Reset your</p>
              <h2 className="title forgot-title">Password</h2>
              <p className="forgot-subtitle">Verify your identity to continue.</p>
              {forgotError && <div className="error">{forgotError}</div>}
              <form onSubmit={handleVerify} className="forgot-form">
                <div className="forgot-grid">
                  {[["name","Full Name","text","Your full name"],["phone","Phone","tel","Phone number"],["email","Email","email","Email address"],["employeeId","Employee ID","text","Employee ID"]].map(([n,l,t,p]) => (
                    <div key={n}>
                      <label className="field-label">{l}</label>
                      <div className="input-group">
                        <input type={t} name={n} placeholder={p} value={forgotForm[n]} onChange={onForgotChange} required />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={forgotLoading}>{forgotLoading ? "Verifying…" : "VERIFY IDENTITY"}</button>
                <div className="back-link" onClick={backToLogin}>← Back to Login</div>
              </form>
            </>
          )}

          {/* ── OTP ── */}
          {showForgot && forgotStep === "otp" && (
            <>
              <p className="welcome">Verification</p>
              <h2 className="title forgot-title">Enter OTP</h2>
              <p className="forgot-subtitle">6-digit code sent to <strong>{employeeData?.email}</strong></p>
              {forgotError && <div className={forgotError === "OTP resent!" ? "error" : "error"} style={forgotError === "OTP resent!" ? { background:"#dcfce7", color:"#166534", borderColor:"#bbf7d0" } : {}}>{forgotError}</div>}
              <form onSubmit={handleVerifyOTP} className="forgot-form">
                <label className="field-label">OTP Code</label>
                <OTPInput otp={otp} setOtp={setOtp} />
                <button type="submit" disabled={forgotLoading} style={{ marginTop:20 }}>{forgotLoading ? "Verifying…" : "VERIFY OTP"}</button>
                <div className="resend-otp" onClick={!forgotLoading ? handleResendOTP : undefined}>
                  Didn't receive it? <span className="resend-link">Resend OTP</span>
                </div>
                <div className="back-link" onClick={backToLogin}>← Back to Login</div>
              </form>
            </>
          )}

          {/* ── RESET PASSWORD ── */}
          {showForgot && forgotStep === "reset" && (
            <>
              <p className="welcome">Almost there!</p>
              <h2 className="title forgot-title">New Password</h2>
              {forgotError && <div className="error">{forgotError}</div>}
              <form onSubmit={handleReset} className="forgot-form">
                <label className="field-label">New Password</label>
                <div className="input-group">
                  <input type="password" name="newPassword" placeholder="Min 6 characters" value={forgotForm.newPassword} onChange={onForgotChange} required />
                </div>
                <label className="field-label">Confirm Password</label>
                <div className="input-group">
                  <input type="password" name="confirmPassword" placeholder="Confirm password" value={forgotForm.confirmPassword} onChange={onForgotChange} required />
                </div>
                {forgotForm.newPassword && forgotForm.confirmPassword && (
                  <div className={`match-indicator ${forgotForm.newPassword === forgotForm.confirmPassword ? "match" : "no-match"}`}>
                    {forgotForm.newPassword === forgotForm.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </div>
                )}
                <button type="submit" disabled={forgotLoading} style={{ marginTop:16 }}>{forgotLoading ? "Resetting…" : "RESET PASSWORD"}</button>
                <div className="back-link" onClick={backToLogin}>← Back to Login</div>
              </form>
            </>
          )}

          {/* ── SUCCESS ── */}
          {showForgot && forgotStep === "success" && (
            <div className="success-box">
              <div className="success-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#e8f0fe" stroke="#1a3a8f" strokeWidth="2"/>
                  <path d="M14 24l8 8 12-14" stroke="#1a3a8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="success-title">Password Reset!</h3>
              <p className="success-msg">Your password has been updated. You can now log in.</p>
              <button onClick={backToLogin}>BACK TO LOGIN</button>
            </div>
          )}

          <div className="footer-links-left">
            <span>FAQ</span><span className="sep">|</span>
            <span>Features</span><span className="sep">|</span>
            <span>Support</span>
          </div>
        </div>

        {/* Divider */}
        <div className="curve">
          <svg viewBox="0 0 120 600" preserveAspectRatio="none">
            <path d="M0,0 C80,60 30,200 90,290 C130,350 50,490 100,600 L0,600 Z" />
          </svg>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="right-content">
            <h2>About BlueLith</h2>
            <p>
              BlueLith Technology is a modern software development company focused on delivering innovative, scalable, and reliable digital solutions. We specialize in building high-quality web and mobile applications.
            </p>
            <div className="features-heading">Features</div>
            <ul className="features-list">
              <li><span className="dot"/><span>Custom software development tailored to business needs.</span></li>
              <li><span className="dot"/><span>Expertise in React, Node.js, and cloud-based solutions.</span></li>
              <li><span className="dot"/><span>Secure, scalable, high-performance applications with user-friendly design.</span></li>
            </ul>
            <div className="footer-links">
              <span>FAQ</span><span>Features</span><span>Support</span>
            </div>
          </div>
          <div className="crystal-scene">
            <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="300" cy="200" rx="340" ry="75" fill="#0d2a7a" opacity="0.5"/>
              <rect x="0" y="148" width="600" height="32" fill="#0d2a7a" opacity="0.45"/>
              <polygon points="308,148 318,65 328,148" fill="#1a3a8f" opacity="0.95"/>
              <polygon points="318,65 328,148 318,148" fill="#0d2270" opacity="0.9"/>
              <polygon points="308,148 318,65 318,148" fill="#3a6ae0" opacity="0.9"/>
              <polygon points="120,148 132,105 144,148" fill="#2255cc" opacity="0.8"/>
              <polygon points="132,105 144,148 132,148" fill="#1a3a8f" opacity="0.75"/>
              <polygon points="450,148 462,108 474,148" fill="#2255cc" opacity="0.8"/>
              <polygon points="468,148 478,92 490,148" fill="#1a3a8f" opacity="0.9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}