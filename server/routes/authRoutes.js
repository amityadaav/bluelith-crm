
// import express from "express"
// import {register,login} from "../controllers/authController.js"

// const router = express.Router()

// router.post("/register",register)
// router.post("/login",login)

// export default router

import { Router }                                              from "express";
import { register, login, getMe, updateMe, changePassword }   from "../controllers/authController.js";
import { protect, authorize }                                  from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login",          login);
router.post("/register",       protect, authorize("admin"), register);
router.get("/me",              protect, getMe);
router.put("/me",              protect, updateMe);
router.put("/change-password", protect, changePassword);

export default router;