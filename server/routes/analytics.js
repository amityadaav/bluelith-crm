import express from "express";
import Client from "../models/Client.js";
import Project from "../models/Project.js";

const router = express.Router();

/* Summary API */

router.get("/summary", async (req,res)=>{

const clients = await Client.countDocuments();
const projects = await Project.countDocuments();

const revenue = await Project.aggregate([
{
$group:{
_id:null,
total:{ $sum:"$paid" }
}
}
]);

const pending = await Project.aggregate([
{
$group:{
_id:null,
total:{ $sum:{ $subtract:["$totalBudget","$paid"] } }
}
}
]);

res.json({
clients,
projects,
revenue:revenue[0]?.total || 0,
pending:pending[0]?.total || 0
});

});


/* Revenue Chart API */

router.get("/revenue", async (req,res)=>{

const {period} = req.query;

let groupFormat;

if(period==="yearly"){
groupFormat = { $year:"$createdAt" };
}
else{
groupFormat = { $month:"$createdAt" };
}

const revenue = await Project.aggregate([
{
$group:{
_id:groupFormat,
revenue:{ $sum:"$paid" }
}
}
]);

const formatted = revenue.map(item=>({
name:item._id,
revenue:item.revenue
}));

res.json(formatted);

});


/* Project Status API */

router.get("/project-status", async (req,res)=>{

const completed = await Project.countDocuments({status:"Completed"});
const progress = await Project.countDocuments({status:"In Progress"});
const pending = await Project.countDocuments({status:"Pending"});

res.json([
{ name:"Completed", value:completed },
{ name:"In Progress", value:progress },
{ name:"Pending", value:pending }
]);

});

export default router;