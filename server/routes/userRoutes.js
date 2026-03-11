import express from "express"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

const router = express.Router()

// Get users
router.get("/", async (req,res)=>{

 const users = await User.find().select("-password")

 res.json(users)

})

// Add user
router.post("/", async (req,res)=>{

 const {name,email,password,role} = req.body

 const hashedPassword = await bcrypt.hash(password,10)

 const user = new User({
  name,
  email,
  password:hashedPassword,
  role
 })

 await user.save()

 res.json(user)

})

// Delete user
router.delete("/:id", async (req,res)=>{

 await User.findByIdAndDelete(req.params.id)

 res.json({message:"User deleted"})

})

export default router