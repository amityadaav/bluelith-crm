
// import express from "express"
// import {register,login} from "../controllers/authController.js"

// const router = express.Router()

// router.post("/register",register)
// router.post("/login",login)

// export default router

// import { Router }                                              from "express";
// import { register, login, getMe, updateMe, changePassword }   from "../controllers/authController.js";
// import { protect, authorize }                                  from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/login",          login);
// router.post("/register",       protect, authorize("admin"), register);

// router.get("/me",              protect, getMe);
// router.put("/me",              protect, updateMe);
// router.put("/change-password", protect, changePassword);

// export default router;
// import { Router }                                              from "express";
// import { register, login, getMe, updateMe, changePassword }   from "../controllers/authController.js";
// import { protect, authorize }                                  from "../middleware/authMiddleware.js";

// const router = Router();


// router.post("/login",          login);
// //router.post("/register",       register);  // ✅ NO protect, NO authorize
// router.post("/register", protect, authorize("admin"), register); // 🔒 locked
// router.get("/me",              protect, getMe);
// router.put("/me",              protect, updateMe);
// router.put("/change-password", protect, changePassword);

// export default router;

import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,

  // ✅ NEW (OTP FLOW)
  verifyEmployeeForReset,
  verifyOtp,
  resetPasswordWithOtp

} from "../controllers/authController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// 🔐 Auth
router.post("/login", login);

// 🔒 Admin creates users only
router.post("/register", protect, authorize("admin"), register);

// 👤 User profile
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);


// ================================
// 🔥 FORGOT PASSWORD (OTP FLOW)
// ================================

// Step 1 → Verify employee + send OTP
router.post("/verify-employee", verifyEmployeeForReset);

// Step 2 → Verify OTP
router.post("/verify-otp", verifyOtp);

// Step 3 → Reset password
router.post("/reset-password", resetPasswordWithOtp);


export default router;