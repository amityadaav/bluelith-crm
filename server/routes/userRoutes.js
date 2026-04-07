// import express from "express"
// import User from "../models/User.js"
// import bcrypt from "bcryptjs"

// const router = express.Router()

// // Get users
// router.get("/", async (req,res)=>{

//  const users = await User.find().select("-password")

//  res.json(users)

// })

// // Add user
// router.post("/", async (req,res)=>{

//  const {name,email,password,role} = req.body

//  const hashedPassword = await bcrypt.hash(password,10)

//  const user = new User({
//   name,
//   email,
//   password:hashedPassword,
//   role
//  })

//  await user.save()

//  res.json(user)

// })

// // Delete user
// router.delete("/:id", async (req,res)=>{

//  await User.findByIdAndDelete(req.params.id)

//  res.json({message:"User deleted"})

// })

// export default router

// import { Router }                                        from "express";
// import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
// import { protect, authorize }                            from "../middleware/authMiddleware.js";

// const router = Router();
// router.use(protect);

// router.get("/",    authorize("admin", "sales"), getUsers);
// router.get("/:id", authorize("admin"),          getUserById);
// router.put("/:id", authorize("admin"),          updateUser);
// router.delete("/:id", authorize("admin"),       deleteUser);

// export default router;

import { Router }                                                    from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, authorize }                                        from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/",       authorize("admin", "sales"), getUsers);
router.post("/",      authorize("admin"),           createUser);  // ✅ ADDED
router.get("/:id",    authorize("admin"),           getUserById);
router.put("/:id",    authorize("admin"),           updateUser);
router.delete("/:id", authorize("admin"),           deleteUser);

export default router;