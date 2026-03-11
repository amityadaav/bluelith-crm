import express from "express"
import Lead from "../models/Lead.js"
import Client from "../models/Client.js"
import Project from "../models/Project.js"
import User from "../models/User.js"

const router = express.Router()

router.get("/stats", async (req,res)=>{

 try{

   const totalLeads = await Lead.countDocuments()
   const totalClients = await Client.countDocuments()

   const activeProjects = await Project.countDocuments({
     status:"active"
   })

   const employees = await User.countDocuments({
     role:"employee"
   })

   const recentLeads = await Lead
      .find()
      .sort({createdAt:-1})
      .limit(5)

   const recentProjects = await Project
      .find()
      .sort({createdAt:-1})
      .limit(5)

   res.json({
     totalLeads,
     totalClients,
     activeProjects,
     employees,
     recentLeads,
     recentProjects
   })

 }catch(error){

   res.status(500).json({
     error:error.message
   })

 }

})

export default router