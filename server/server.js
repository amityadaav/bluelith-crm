import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import leadRoutes from "./routes/leadRoutes.js"
import clientRoutes from "./routes/clientRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import analyticsRoutes from "./routes/analytics.js";
import notificationRoutes from "./routes/notifications.js";
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log("❌ MongoDB Error:",err))

// Routes
app.use("/api/auth",authRoutes)
app.use("/api/leads",leadRoutes)
app.use("/api/clients",clientRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/users",userRoutes)
app.use("/api/analytics",analyticsRoutes);
app.use("/api/notifications",notificationRoutes);

app.get("/",(req,res)=>{
res.json({message:"Bluelith CRM API running"})
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log(`🚀 Server running on port ${PORT}`)
})