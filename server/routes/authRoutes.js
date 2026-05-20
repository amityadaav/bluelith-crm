
// import { Router } from "express";
// import {
//   register,
//   login,
//   getMe,
//   updateMe,
//   changePassword,

//   // ✅ NEW (OTP FLOW)
//   verifyEmployeeForReset,
//   verifyOtp,
//   resetPasswordWithOtp

// } from "../controllers/authController.js";

// import { protect, authorize } from "../middleware/authMiddleware.js";

// const router = Router();

// // 🔐 Auth
// router.post("/login", login);

// // 🔒 Admin creates users only
// router.post("/register", protect, authorize("admin"), register);

// // 👤 User profile
// router.get("/me", protect, getMe);
// router.put("/me", protect, updateMe);
// router.put("/change-password", protect, changePassword);


// // ================================
// // 🔥 FORGOT PASSWORD (OTP FLOW)
// // ================================

// // Step 1 → Verify employee + send OTP
// router.post("/verify-employee", verifyEmployeeForReset);

// // Step 2 → Verify OTP
// router.post("/verify-otp", verifyOtp);

// // Step 3 → Reset password
// router.post("/reset-password", resetPasswordWithOtp);


// export default router;

import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  verifyEmployeeForReset,
  verifyOtp,
  resetPasswordWithOtp,
} from "../controllers/authController.js";
import { protect, authorize }          from "../middleware/authMiddleware.js";
import { authLimiter, otpLimiter }     from "../middleware/rateLimiter.js";

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post("/login", authLimiter, login);

// ─── Forgot password — OTP flow (public but rate-limited) ─────────────────────
router.post("/verify-employee",  otpLimiter, verifyEmployeeForReset);
router.post("/verify-otp",       otpLimiter, verifyOtp);
router.post("/reset-password",   otpLimiter, resetPasswordWithOtp);

// ─── Protected — logged-in users ──────────────────────────────────────────────
router.get("/me",              protect, getMe);
router.put("/me",              protect, updateMe);
router.put("/change-password", protect, changePassword);

// ─── Admin only — create new users ────────────────────────────────────────────
router.post("/register", protect, authorize("admin"), register);

export default router;
