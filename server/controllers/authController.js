import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req,res)=>{

 try{

  const {name,email,password,role} = req.body

  const hashedPassword = await bcrypt.hash(password,10)

  const user = new User({
    name,
    email,
    password:hashedPassword,
    role
  })

  await user.save()

  res.json({
    success:true,
    message:"User registered successfully",
    user
  })

 }catch(error){

  res.status(500).json({
    success:false,
    error:error.message
  })

 }

}

export const login = async (req,res)=>{

 try{

  const {email,password} = req.body

  const user = await User.findOne({email})

  if(!user){
    return res.status(400).json({
      success:false,
      error:"User not found"
    })
  }

  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch){
    return res.status(400).json({
      success:false,
      error:"Invalid password"
    })
  }

  const token = jwt.sign(
    {id:user._id},
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
  )

  res.json({
    success:true,
    token,
    user
  })

 }catch(error){

  res.status(500).json({
    success:false,
    error:error.message
  })

 }

}