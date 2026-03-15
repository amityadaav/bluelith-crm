// import express from "express"
// import Lead from "../models/Lead.js"
// import Client from "../models/Client.js"
// import Project from "../models/Project.js"
// import User from "../models/User.js"

// const router = express.Router()

// router.get("/stats", async (req,res)=>{

//  try{

//    const totalLeads = await Lead.countDocuments()
//    const totalClients = await Client.countDocuments()

//    const activeProjects = await Project.countDocuments({
//      status:"active"
//    })

//    const employees = await User.countDocuments({
//      role:"employee"
//    })

//    const recentLeads = await Lead
//       .find()
//       .sort({createdAt:-1})
//       .limit(5)

//    const recentProjects = await Project
//       .find()
//       .sort({createdAt:-1})
//       .limit(5)

//    res.json({
//      totalLeads,
//      totalClients,
//      activeProjects,
//      employees,
//      recentLeads,
//      recentProjects
//    })

//  }catch(error){

//    res.status(500).json({
//      error:error.message
//    })

//  }

// })

// export default router

import { Router }                  from "express";
import Lead                       from "../models/Lead.js";
import Client                     from "../models/Client.js";
import Project                    from "../models/Project.js";
import User                       from "../models/User.js";
import { Activity, Notification } from "../models/Notification.js";
import { protect, authorize }     from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

// GET /api/dashboard
// Single endpoint — replaces the 6 parallel api.get() calls in Dashboard.js
router.get("/", authorize("admin", "sales"), async (req, res, next) => {
  try {
    const [leads, clients, projects, users, activities, notifications] = await Promise.all([
      Lead.find().populate("assignedTo", "name email").sort({ createdAt: -1 }),
      Client.find().populate("assignedTo", "name email").sort({ createdAt: -1 }),
      Project.find().populate("client", "name company").sort({ createdAt: -1 }),
      User.find(),
      Activity.find().sort({ createdAt: -1 }).limit(10),
      Notification.find({ recipient: req.user._id, isRead: false }).sort({ createdAt: -1 }).limit(20),
    ]);

    const now            = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const convertedLeads = leads.filter((l) => l.status === "won").length;
    const newLeads       = leads.filter((l) => new Date(l.createdAt) >= startOfMonth).length;
    const activeProjects = projects.filter((p) => ["active", "in-progress"].includes(p.status)).length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const totalRevenue   = projects.reduce((s, p) => s + (p.totalBudget || 0), 0);
    const totalPaid      = projects.reduce((s, p) => s + (p.paid || 0), 0);

    res.json({
      leads,
      clients,
      projects,
      users,
      activities,
      notifications,
      stats: {
        totalLeads:          leads.length,
        newLeads,
        totalClients:        clients.length,
        activeProjects,
        completedProjects,
        totalProjects:       projects.length,
        totalEmployees:      users.filter((u) => u.role === "employee").length,
        totalSales:          users.filter((u) => u.role === "sales").length,
        totalAdmins:         users.filter((u) => u.role === "admin").length,
        conversionRate:      leads.length ? Math.round((convertedLeads / leads.length) * 100) : 0,
        totalRevenue,
        totalPaid,
        pendingPayments:     totalRevenue - totalPaid,
        averageProjectValue: projects.length ? Math.round(totalRevenue / projects.length) : 0,
      },
    });
  } catch (error) { next(error); }
});

export default router;