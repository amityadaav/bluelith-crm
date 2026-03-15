// import express from "express";
// import Client from "../models/Client.js";
// import Project from "../models/Project.js";

// const router = express.Router();

// /* Summary API */

// router.get("/summary", async (req,res)=>{

// const clients = await Client.countDocuments();
// const projects = await Project.countDocuments();

// const revenue = await Project.aggregate([
// {
// $group:{
// _id:null,
// total:{ $sum:"$paid" }
// }
// }
// ]);

// const pending = await Project.aggregate([
// {
// $group:{
// _id:null,
// total:{ $sum:{ $subtract:["$totalBudget","$paid"] } }
// }
// }
// ]);

// res.json({
// clients,
// projects,
// revenue:revenue[0]?.total || 0,
// pending:pending[0]?.total || 0
// });

// });


// /* Revenue Chart API */

// router.get("/revenue", async (req,res)=>{

// const {period} = req.query;

// let groupFormat;

// if(period==="yearly"){
// groupFormat = { $year:"$createdAt" };
// }
// else{
// groupFormat = { $month:"$createdAt" };
// }

// const revenue = await Project.aggregate([
// {
// $group:{
// _id:groupFormat,
// revenue:{ $sum:"$paid" }
// }
// }
// ]);

// const formatted = revenue.map(item=>({
// name:item._id,
// revenue:item.revenue
// }));

// res.json(formatted);

// });


// /* Project Status API */

// router.get("/project-status", async (req,res)=>{

// const completed = await Project.countDocuments({status:"Completed"});
// const progress = await Project.countDocuments({status:"In Progress"});
// const pending = await Project.countDocuments({status:"Pending"});

// res.json([
// { name:"Completed", value:completed },
// { name:"In Progress", value:progress },
// { name:"Pending", value:pending }
// ]);

// });

// export default router;

import { Router }       from "express";
import Lead            from "../models/Lead.js";
import Client          from "../models/Client.js";
import Project         from "../models/Project.js";
import User            from "../models/User.js";
import { Activity }    from "../models/Notification.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect, authorize("admin", "sales"));

// GET /api/analytics/overview
router.get("/overview", async (req, res, next) => {
  try {
    const [leads, clients, projects, users] = await Promise.all([
      Lead.find(), Client.find(), Project.find(), User.find(),
    ]);

    const now            = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const newLeads       = leads.filter((l) => new Date(l.createdAt) >= startOfMonth).length;
    const convertedLeads = leads.filter((l) => l.status === "won").length;
    const activeProjects = projects.filter((p) => ["active", "in-progress"].includes(p.status)).length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const totalRevenue   = projects.reduce((s, p) => s + (p.totalBudget || 0), 0);
    const totalPaid      = projects.reduce((s, p) => s + (p.paid || 0), 0);

    res.json({
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
    });
  } catch (error) { next(error); }
});

// GET /api/analytics/revenue?year=2025
router.get("/revenue", async (req, res, next) => {
  try {
    const year     = parseInt(req.query.year) || new Date().getFullYear();
    const projects = await Project.find({
      createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
    });

    const months = Array.from({ length: 12 }, (_, i) => ({
      month:   new Date(year, i).toLocaleString("en-IN", { month: "short" }),
      revenue: 0,
      paid:    0,
    }));

    projects.forEach((p) => {
      const m = new Date(p.createdAt).getMonth();
      months[m].revenue += p.totalBudget || 0;
      months[m].paid    += p.paid        || 0;
    });

    res.json(months);
  } catch (error) { next(error); }
});

// GET /api/analytics/leads-pipeline
router.get("/leads-pipeline", async (req, res, next) => {
  try {
    const statuses = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
    const leads    = await Lead.find();
    const pipeline = statuses.map((status) => ({
      status,
      count: leads.filter((l) => l.status === status).length,
    }));
    res.json(pipeline);
  } catch (error) { next(error); }
});

// GET /api/analytics/employee-performance
router.get("/employee-performance", async (req, res, next) => {
  try {
    const employees = await User.find({ role: { $in: ["employee", "sales"] } });
    const [leads, projects] = await Promise.all([Lead.find(), Project.find()]);

    const performance = employees.map((emp) => {
      const empId       = String(emp._id);
      const empLeads    = leads.filter((l) => String(l.assignedTo) === empId);
      const empProjects = projects.filter((p) => p.assignedTo.some((a) => String(a) === empId));
      const wonLeads    = empLeads.filter((l) => l.status === "won").length;

      return {
        _id:            emp._id,
        name:           emp.name,
        role:           emp.role,
        department:     emp.department,
        totalLeads:     empLeads.length,
        wonLeads,
        conversionRate: empLeads.length ? Math.round((wonLeads / empLeads.length) * 100) : 0,
        activeProjects: empProjects.filter((p) => ["active", "in-progress"].includes(p.status)).length,
        totalProjects:  empProjects.length,
        revenue:        empProjects.reduce((s, p) => s + (p.totalBudget || 0), 0),
      };
    });

    res.json(performance);
  } catch (error) { next(error); }
});

// GET /api/analytics/activities?limit=10
router.get("/activities", async (req, res, next) => {
  try {
    const limit      = parseInt(req.query.limit) || 10;
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
    res.json(activities);
  } catch (error) { next(error); }
});

export default router;