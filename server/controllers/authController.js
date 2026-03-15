// import User from "../models/User.js"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

// export const register = async (req,res)=>{

//  try{

//   const {name,email,password,role} = req.body

//   const hashedPassword = await bcrypt.hash(password,10)

//   const user = new User({
//     name,
//     email,
//     password:hashedPassword,
//     role
//   })

//   await user.save()

//   res.json({
//     success:true,
//     message:"User registered successfully",
//     user
//   })

//  }catch(error){

//   res.status(500).json({
//     success:false,
//     error:error.message
//   })

//  }

// }

// export const login = async (req,res)=>{

//  try{

//   const {email,password} = req.body

//   const user = await User.findOne({email})

//   if(!user){
//     return res.status(400).json({
//       success:false,
//       error:"User not found"
//     })
//   }

//   const isMatch = await bcrypt.compare(password,user.password)

//   if(!isMatch){
//     return res.status(400).json({
//       success:false,
//       error:"Invalid password"
//     })
//   }

//   const token = jwt.sign(
//     {id:user._id},
//     process.env.JWT_SECRET,
//     {expiresIn:"7d"}
//   )

//   res.json({
//     success:true,
//     token,
//     user
//   })

//  }catch(error){

//   res.status(500).json({
//     success:false,
//     error:error.message
//   })

//  }

// }

import jwt            from "jsonwebtoken";
import User           from "../models/User.js";
import { Activity }   from "../models/Notification.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered." });

    const user = await User.create({ name, email, password, role, phone, department });
    await Activity.create({ type: "user_login", description: `New user "${name}" (${role}) created by ${req.user.name}`, user: req.user._id, userName: req.user.name, relatedTo: { model: "User", id: user._id } });

    res.status(201).json({ success: true, message: "User created successfully.", user });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password." });
    if (!user.isActive)
      return res.status(403).json({ message: "Account is deactivated. Contact admin." });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, token: generateToken(user._id), user: user.toJSON() });
  } catch (error) { next(error); }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateMe = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "department", "avatar"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords are required." });

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ message: "Current password is incorrect." });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) { next(error); }
};